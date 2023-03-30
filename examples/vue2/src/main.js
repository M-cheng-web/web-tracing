import Vue from 'vue'
import App from './App.vue'

import { add } from '@web-tracing/core/index'
import { pad } from '@web-tracing/utils'

console.log('add', add)
console.log('pad', pad)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})
