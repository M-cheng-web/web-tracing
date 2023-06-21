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
  console.log('req.query', req.query)
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
    // const data = JSON.parse(JSON.stringify(allTracingList)).reverse()
    const data = JSON.parse(JSON.stringify(allTracingList))
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
    // 后面对所有的数据格式再回测一下

    // 后面得在首页说明一下调试方法

    // 添加个事情前置事件通知，要不然点击没反馈不太好

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
