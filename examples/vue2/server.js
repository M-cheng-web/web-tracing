import express from 'express'
const app = express()
// import { join } from 'path'
// import { readFile } from 'fs'
import pkg from 'body-parser'
import coBody from 'co-body'

const { json, urlencoded } = pkg

app.use(json({ limit: '100mb' }))
app.use(
  urlencoded({
    limit: '100mb',
    extended: true,
    parameterLimit: 50000
  })
)

app.all('*', function (res, req, next) {
  req.header('Access-Control-Allow-Origin', '*')
  req.header('Access-Control-Allow-Headers', 'Content-Type')
  req.header('Access-Control-Allow-Methods', '*')
  req.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.get('/getList', (req, res) => {
  res.send({
    code: 200,
    data: [1, 2, 3]
  })
})
app.post('/setList', (req, res) => {
  res.send({
    code: 200,
    meaage: '设置成功'
  })
})

const allTracingList = []
let baseInfo = {}

// 所有的 eventType
// export enum SEDNEVENTTYPES {
//   PV = 'pv', // 路由
//   ERROR = 'error', // 错误
//   PERFORMANCE = 'performance', // 资源
//   CLICK = 'click', // 点击
//   DWELL = 'dwell', // 页面卸载
//   CUSTOM = 'custom', // 手动触发事件
//   INTERSECTION = 'intersection' // 曝光采集
// }

app.get('/getBaseInfo', (req, res) => {
  res.send({
    code: 200,
    data: baseInfo
  })
})
app.get('/getAllTracingList', (req, res) => {
  const eventType = req.query.eventType
  if (eventType) {
    const data = allTracingList.reverse()
    res.send({
      code: 200,
      data: data.filter(item => item.eventType === eventType)
    })
  } else {
    res.send({
      code: 200,
      data: allTracingList
    })
  }
})
app.post('/trackweb', async (req, res) => {
  try {
    const data = await coBody.json(req)
    if (!data) return
    allTracingList.push(...data.eventInfo)
    baseInfo = data.baseInfo

    let length = Object.keys(req.body).length
    // tracingList.push(req)
    if (length) {
      // tracingList.push(req.body);
    } else {
      // 使用 web beacon 上报数据
      // let data = await coBody.json(req);
      // if (!data) return;
      // if (data.type == 'performance') {
      //   performanceList.push(data);
      // } else if (data.type == 'recordScreen') {
      //   recordScreenList.push(data);
      // } else if (data.type == 'whiteScreen') {
      //   whiteScreenList.push(data);
      // } else {
      //   errorList.push(data);
      // }
    }
    res.send({
      code: 200,
      meaage: '上报成功！'
    })
  } catch (err) {
    res.send({
      code: 203,
      meaage: '上报失败！',
      err
    })
  }
})

app.listen(3351, () => {
  console.log('Server is running at http://localhost:3351')
})
