import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { init } from '@web-tracing/core'
import './assets/global.scss'
import { setupComponent } from './components/index'

setupComponent()

Vue.use(ElementUI)

init({
  // dsn: 'https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/blog/Annapurna-Ranges-2560x1440.5r9m9t5vg1g0.webp',
  dsn: 'http://1.15.224.10:22/trackweb/tra',
  appName: 'cxh',
  debug: true,
  pv: false,
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
  // ignoreRequest: ['111', /normal/],

  beforePushEventList(data) {
    // console.log('beforePushEventList-data', data)
    return data
  },
  beforeSendData(data) {
    // console.log('beforeSendData-data', data)
    // return { xx: 2123 }
    // 返回false代表sdk不再发送
    // return false
    return data
  },
  afterSendData() {
    // console.log('afterSendData-data', data)
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
