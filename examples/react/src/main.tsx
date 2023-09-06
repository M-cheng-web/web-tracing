import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WebTracing } from '@web-tracing/react'
import type { InitOptions } from '@web-tracing/react'

const options: InitOptions = {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  recordScreen: false,

  // 查询埋点信息、清除埋点信息、获取埋点基础信息 不需要进行捕获
  ignoreRequest: [
    /getAllTracingList/,
    /cleanTracingList/,
    /getBaseInfo/,
    /getSourceMap/
  ]
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebTracing {...options}>
      <App />
    </WebTracing>
  </React.StrictMode>
)
