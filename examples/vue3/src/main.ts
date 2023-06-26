import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import WebTracing from '@web-tracing/vue3'
import router from './router'

const app = createApp(App)

app.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  error: true
})

app.use(router)

app.use(ElementPlus)
app.mount('#app')
