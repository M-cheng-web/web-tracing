import Vue from 'vue';
// const trace = require('../../../lib/trace.js');
import App from './app.vue';
// import trace from 'web-tracing';
const trace = require('web-tracing');


console.log('trace', window._trace);

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
