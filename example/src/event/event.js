import Vue from 'vue';
import webTracing from '@web-tracing/vue';

// 如果只有 main 那么会执行main指定的打包后的代码
// 如果同时也有module 那么会执行module指定的代码


import App from './app.vue';

console.log('webTracing', webTracing);

// webTracing()

// const trace = require('../../../src/index.js');
// Vue.use(webTracing, {
//   requestUrl: 'http://8.129.19.55:8081/sys-file/test-receive',
//   appName: 'chengxh',
//   event: true,
// })

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
