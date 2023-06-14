import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import WebTracing from '@web-tracing/vue2'
import './assets/global.scss'
import { setupComponent } from './components/index'
import axios from 'axios'

setupComponent()

// Vue.use(ElementUI)
Vue.use(ElementUI, { size: 'small' })

Vue.use(WebTracing, {
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

  scopeError: true,

  // tracesSampleRate: 0.5,

  // ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
  ignoreRequest: [/getAllTracingList/, /cleanTracingList/],

  beforePushEventList(data) {
    // if (Array.isArray(data)) {
    //   const _data = data.filter(item => {
    //     return !(
    //       item.eventId === 'server' && item.requestUrl.includes('trackweb')
    //     )
    //   })
    //   return _data
    // } else {
    //   if (data.eventId === 'server' && data.requestUrl.includes('trackweb')) {
    //     return false
    //   }
    //   return data
    // }
    return data
  },
  beforeSendData(data) {
    // 返回false代表sdk不再发送
    // axios.post('/trackweb', data)
    // return false
    return data
  },
  afterSendData() {
    // console.log('afterSendData-data', data)
  }
})

Vue.config.productionTip = false

Vue.prototype.formatDate = formatDate

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hour = padZero(date.getHours())
  const minute = padZero(date.getMinutes())
  const second = padZero(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function padZero(num) {
  return num.toString().padStart(2, '0')
}

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
