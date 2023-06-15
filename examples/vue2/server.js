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

let allTracingList = []
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
app.post('/cleanTracingList', (req, res) => {
  allTracingList = []
  res.send({
    code: 200,
    meaage: '清除成功！'
  })
})
app.get('/getAllTracingList', (req, res) => {
  const eventType = req.query.eventType
  if (eventType) {
    const data = JSON.parse(JSON.stringify(allTracingList)).reverse()
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
    let length = Object.keys(req.body).length
    if (length) {
      allTracingList.push(...req.body.eventInfo)
    } else {
      const data = await coBody.json(req)
      if (!data) return
      allTracingList.push(...data.eventInfo)
      baseInfo = data.baseInfo
    }
    // 这里要实验其他的发送方式
    // 1. sendBeacon
    // 2. img
    // 3. 自拦截的方式

    // 后面对所有的数据格式再回测一下

    // 错误录屏

    // sendBeacon 有64kb限制
    // img 有2kb限制
    // 在错误模块可能有很多错误的场景，怎么处理呢

    // 后面对vue3的兼容做一些，提炼一些hook方便实用
    // 后面再做vue3的测试框架

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

// 图片上传的方式
app.get('/trackweb', async (req, res) => {
  try {
    let data = req.query.v
    if (!data) return
    data = JSON.parse(data)
    allTracingList.push(...data.eventInfo)
    baseInfo = data.baseInfo
    res.send({
      code: 200,
      data: '上报成功'
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
