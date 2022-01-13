import Vue from 'vue';

// 如果只有 main 那么会执行main指定的打包后的代码
// 如果同时也有module 那么会执行module指定的代码


const trace = require('../../../src/index.js');
// require('../../../lib/trace.js')
import App from './app.vue';
// const trace = require('web-tracing');
// import trace2 from 'web-tracing';

Vue.use(trace, {
  requestUrl: 'http://8.129.19.55:8081/sys-file/test-receive',
  appName: 'chengxh',
  event: true,
})

console.log('trace', trace);

// trace.init({
//   requestUrl: 'http://8.129.19.55:8081/sys-file/test-receive',
//   appName: 'chengxh',
//   event: true,
//   // performance: true,
//   // pv: true,
//   // error: true,
// })

new Vue({
  render: (h) => h(App),
}).$mount('#app');
