import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import WebTracing from '@web-tracing/vue3'

const app = createApp(App)

app.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  error: true,
  beforePushEventList(data) {
    return data
  },
  beforeSendData(data) {
    return data
  }
})

// window.onerror = () => {
//   console.log(11)
// }

setTimeout(() => {
  throw new Error('手动抛出错误')
}, 1000)

app.use(ElementPlus)
app.mount('#app')
