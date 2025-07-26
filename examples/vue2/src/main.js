import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import WebTracing from '@web-tracing/vue2'
import './assets/global.scss'
import { setupComponent } from './components/index'
// import axios from 'axios'

setupComponent()

Vue.use(ElementUI, { size: 'small' })

const sendEventType = {
  pv: '路由',
  error: '错误',
  performance: '资源',
  click: '点击',
  dwell: '页面卸载',
  intersection: '曝光采集'
}

// 提取WebTracing初始化配置
export const webTracingConfig = {
  dsn: '/trackweb',
  // dsn: 'http://localhost:3351/trackweb',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  // localization: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  userUuid: 'init_userUuid',
  sendTypeByXmlBody: true,
  recordScreen: false,

  scopeError: true,

  // tracesSampleRate: 0.5,

  // ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
  ignoreRequest: [/getAllTracingList/, /cleanTracingList/],

  beforePushEventList(data) {
    // data 是一个数组，格式：[{}]
    const newData = data.map(item => {
      if (item.eventType === 'click' && item.params) {
        console.log('item', item)
        item.newParams = {
          dbname: item.params.dbname,
          fieldname: item.params.fieldname,
          tblname: item.params.tblname
        }
        delete item.params.dbname
        delete item.params.fieldname
        delete item.params.tblname
      }
      return item
    })

    const arr = ['intersection', 'click']
    data.forEach(item => {
      if (arr.includes(item.eventType)) {
        window.vm.sendMessage()
      }
    })

    return newData
  },
  beforeSendData(data) {
    // 返回false代表sdk不再发送
    // axios.post('/trackweb', data)
    // return false
    return data
  },
  afterSendData(data) {
    const { sendType, success, params } = data
    const message = `
      <div class='event-pop'>
        <div class='warning-text'>打开控制台可查看更多详细信息</div>
        <div>发送是否成功: ${success}</div>
        <div>发送方式: ${sendType}</div>
        <div>发送内容(只概括 eventType、eventId)
          ${params.eventInfo.reduce(
            (pre, item, index) => {
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
    if (window.vm) {
      window.vm.$notify({
        title: '发送一批数据到服务端',
        message,
        position: 'top-right',
        dangerouslyUseHTMLString: true,
        duration: 1500
      })
      if (window.vm.$children[0].getMyComponent().getAllTracingList) {
        window.vm.$children[0].getMyComponent().getAllTracingList()
      }
    }
  }
}

Vue.use(WebTracing, webTracingConfig)

Vue.config.productionTip = false

Vue.prototype.selfMessage = function () {
  // window.vm.$message({
  //   message,
  //   type: 'success',
  //   duration: 1000
  // })
}
Vue.prototype.sendMessage = function (
  message = '成功触发事件，会有一些延迟，请稍等'
) {
  window.vm.$message({
    message,
    type: 'success'
  })
}

Vue.prototype.formatDate = formatDate
function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hour = padZero(date.getHours())
  const minute = padZero(date.getMinutes())
  const second = padZero(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

Vue.prototype.emitMessage = emitMessage
function emitMessage(text = '成功收集') {
  this.$message(text)
}

function padZero(num) {
  return num.toString().padStart(2, '0')
}

window.vm = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
