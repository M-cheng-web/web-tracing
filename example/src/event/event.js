import Vue from 'vue';
const trace = require('../../../src/index');

import App from './app.vue';

trace.init({
  requestUrl: 'http://172.15.224.10:33199/trackweb/tra',
  appName: 'chengxh',
  event: true,
  performance: true,
  pv: true,
  error: true,
})


new Vue({
  render: (h) => h(App),
}).$mount('#app');
