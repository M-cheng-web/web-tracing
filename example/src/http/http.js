import Vue from 'vue';
import App from './app.vue';


const trace = require('../../../src/index.js');

trace.init({
  requestUrl: 'http://8.129.19.55:8081/sys-file/test-receive',
  appName: 'chengxh',
  // event: true,
  performance: { server: true },
  error: true,
  // pv: true,
})

new Vue({
  render: (h) => h(App),
}).$mount('#app');
