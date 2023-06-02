import Vue from 'vue'
import App from './App.vue'

import { init } from '@web-tracing/core'

console.log('init', init)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})
