const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const coBody = require('co-body')

const app = express()

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 存储埋点数据的数组
let tracingData = []

// 埋点数据接收接口
app.post('/trackweb', async (req, res) => {
  try {
    let data = req.body
    if (!data || (typeof data === 'object' && !Object.keys(data).length)) {
      data = await coBody.json(req)
    }
    console.log('收到埋点数据:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: data
    })

    // 存储数据
    tracingData.push({
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
      ip: req.ip
    })

    // 返回成功响应
    res.json({
      success: true,
      message: '数据接收成功',
      data: data
    })
  } catch (error) {
    console.error('处理埋点数据时出错:', error)
    res.status(500).json({
      success: false,
      message: '数据处理失败',
      error: error.message
    })
  }
})

// 查询埋点数据接口
app.get('/getAllTracingList', (req, res) => {
  console.log('查询埋点列表，当前数据量:', tracingData.length)
  res.json({
    success: true,
    data: tracingData,
    total: tracingData.length
  })
})

// 清除埋点数据接口
app.post('/cleanTracingList', (req, res) => {
  console.log('清除埋点数据')
  tracingData = []
  res.json({
    success: true,
    message: '数据已清除'
  })
})

// 获取基础信息接口
app.get('/getBaseInfo', (req, res) => {
  const info = {
    serverTime: new Date().toISOString(),
    dataCount: tracingData.length,
    lastDataTime:
      tracingData.length > 0
        ? tracingData[tracingData.length - 1].timestamp
        : null,
    environment: 'development',
    version: '2.1.0'
  }

  console.log('获取基础信息:', info)
  res.json({
    success: true,
    data: info
  })
})

// 模拟API接口
app.get('/api/test', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      message: 'API测试成功',
      timestamp: new Date().toISOString()
    })
  }, 100)
})

app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id

  // 模拟网络延迟
  setTimeout(() => {
    if (Math.random() > 0.8) {
      // 20% 概率返回错误
      res.status(500).json({
        success: false,
        message: '用户数据获取失败'
      })
    } else {
      res.json({
        success: true,
        data: {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`,
          avatar: `https://picsum.photos/seed/user${userId}/50/50.jpg`,
          status: 'active',
          createdAt: new Date().toISOString()
        }
      })
    }
  }, 200 + Math.random() * 300)
})

// 获取Source Map接口
app.get('/getSourceMap', (req, res) => {
  res.json({
    success: true,
    data: {
      sourceMapEnabled: true,
      sourceMapUrl: '/static/js/*.map'
    }
  })
})

// 错误处理中间件
app.use((error, req, res) => {
  console.error('服务器错误:', error)
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.path
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`
🚀 Web-Tracing 示例服务启动成功!
📍 服务地址: http://localhost:${PORT}
📊 埋点接口: http://localhost:${PORT}/trackweb
📋 数据查询: http://localhost:${PORT}/getAllTracingList
🗑️  数据清除: http://localhost:${PORT}/cleanTracingList
ℹ️  基础信息: http://localhost:${PORT}/getBaseInfo
  `)
})
