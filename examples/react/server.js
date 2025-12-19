import express from 'express'
import path from 'path'
import fs from 'fs'
import pkg from 'body-parser'
import coBody from 'co-body'

const app = express()
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

// 获取js.map源码文件
app.get('/getSourceMap', (req, res) => {
  const { fileName, env } = req.query
  console.log('fileName', fileName)
  console.log('env', env)
  if (env === 'development') {
    // const mapFile = path.join(__filename, '..', fileName)
    // console.log('mapFile', mapFile)
    fs.readFile(fileName, (err, data) => {
      if (err) {
        console.error('server-getmap', err)
        return
      }
      res.send(data)
    })
  } else {
    // req.query 获取接口参数
    const mapFile = path.join(__filename, '..', 'dist/assets')
    // 拿到dist目录下对应map文件的路径
    const mapPath = path.join(mapFile, `${fileName}.map`)
    fs.readFile(mapPath, (err, data) => {
      if (err) {
        console.error('server-getmap', err)
        return
      }
      res.send(data)
    })
  }
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
      // 数据量大时不会用 sendbeacon，会用xhr的形式，这里是接收xhr的数据格式
      allTracingList.push(...req.body.eventInfo)
      baseInfo = req.body.baseInfo
    } else {
      // 兼容 sendbeacon 的传输数据格式
      const data = await coBody.json(req)
      if (!data) return
      allTracingList.push(...data.eventInfo)
      baseInfo = data.baseInfo
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

app.listen(3354, () => {
  console.log('Server is running at http://localhost:3354')
})
