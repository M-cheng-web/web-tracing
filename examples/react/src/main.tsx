import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/global.scss'
import { WebTracingProvider } from '@web-tracing/react'
import { notification } from 'antd'

const sendEventType: any = {
  pv: '路由',
  error: '错误',
  performance: '资源',
  click: '点击',
  dwell: '页面卸载',
  intersection: '曝光采集'
}

const options = {
  dsn: 'http://localhost:3354/trackweb',
  appName: 'react-example',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  // 查询埋点信息、清除埋点信息、获取埋点基础信息 不需要进行捕获
  ignoreRequest: [
    /getAllTracingList/,
    /cleanTracingList/,
    /getBaseInfo/,
    /getSourceMap/
  ],
  // 发送埋点数据后，拉起弹窗提示用户已发送
  afterSendData(data: any) {
    const { sendType, success, params } = data
    const message = (
      <div className="event-pop">
        <div className="warning-text">打开控制台可查看更多详细信息</div>
        <div>发送是否成功: {String(success)}</div>
        <div>发送方式: {sendType}</div>
        <div>
          发送内容(只概括 eventType、eventId)
          {params.eventInfo.length > 0 ? (
            params.eventInfo.map((item: any, index: number) => (
              <div className="pop-line" key={index}>
                <span>{index + 1}</span>
                <div>
                  {item.eventType}({sendEventType[item.eventType]})
                </div>
                <div>{item.eventId}</div>
              </div>
            ))
          ) : (
            <div className="pop-line">
              <div>eventType</div>
              <div>eventId</div>
            </div>
          )}
        </div>
      </div>
    )

    notification.open({
      message: '发送一批数据到服务端',
      description: message,
      placement: 'topRight',
      duration: 4.5
    })

    // @ts-ignore
    if (window.getAllTracingList) {
      // @ts-ignore
      window.getAllTracingList()
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebTracingProvider options={options}>
      <App />
    </WebTracingProvider>
  </React.StrictMode>
)
