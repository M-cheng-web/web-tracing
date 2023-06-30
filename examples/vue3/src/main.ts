import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import WebTracing from '@web-tracing/vue3'
import router from './router'
import './assets/global.scss'
import initComponents from './components/index'
import { ElNotification } from 'element-plus'

const app = createApp(App)

const sendEventType: any = {
  pv: '路由',
  error: '错误',
  performance: '资源',
  click: '点击',
  dwell: '页面卸载',
  intersection: '曝光采集'
}

app.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  // pv: {
  //   core: true,
  //   hashtag: true
  // },
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,

  // 查询埋点信息、清除埋点信息、获取埋点基础信息 不需要进行捕获
  ignoreRequest: [/getAllTracingList/, /cleanTracingList/, /getBaseInfo/],

  // 发送埋点数据后，拉起弹窗提示用户已发送
  afterSendData(data) {
    const { sendType, success, params } = data
    const message = `
      <div class='event-pop'>
        <div class='warning-text'>打开控制台可查看更多详细信息</div>
        <div>发送是否成功: ${success}</div>
        <div>发送方式: ${sendType}</div>
        <div>发送内容(只概括 eventType、eventId)
          ${params.eventInfo.reduce(
            (pre: string, item: any, index: number) => {
              pre += `
              <div class='pop-line'>
                <span>${index + 1}</span>
                <div>${item.eventType}(${sendEventType[item.eventType]})</div>
                <div>${item.eventId}</div>
              </div>`
              return pre
            },
            `<div class='pop-line'>
              <div>eventType</div>
              <div>eventId</div>
            </div>`
          )}
        </div>
      </div>
    `
    ElNotification({
      title: '发送一批数据到服务端',
      message,
      position: 'top-right',
      dangerouslyUseHTMLString: true
    })
    // @ts-ignore
    if (window.getAllTracingList) {
      // @ts-ignore
      window.getAllTracingList()
    }
  }
})

app.use(router)
app.use(initComponents)
app.use(ElementPlus)
app.mount('#app')
