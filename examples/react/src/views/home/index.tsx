import React from 'react'

const sendEventType = {
  pv: '路由',
  error: '错误',
  performance: '资源',
  click: '点击',
  dwell: '页面卸载',
  intersection: '曝光采集'
}

const sendEventId = {
  page: '页面',
  resource: '资源',
  server: '请求',
  code: '错误id - code',
  reject: '错误id - reject',
  'console.error': '错误id - console.error'
}

const Home: React.FC = () => {
  return (
    <div className="home" style={{ padding: 20 }}>
      <div className="mb" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>
          所有的事件类型:
        </div>
        {Object.entries(sendEventType).map(([key, value]) => (
          <div key={key}>{`${key}: ${value}`}</div>
        ))}
      </div>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 10 }}>
          所有的事件ID(还有一些id是随机字符串的):
        </div>
        {Object.entries(sendEventId).map(([key, value]) => (
          <div key={key}>{`${key}: ${value}`}</div>
        ))}
      </div>
    </div>
  )
}

export default Home
