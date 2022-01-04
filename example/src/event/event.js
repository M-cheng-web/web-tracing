import Vue from 'vue';

// 如果只有 main 那么会执行main指定的打包后的代码
// 如果同时也有module 那么会执行module指定的代码


// const trace = require('../../../lib/trace.js');
// require('../../../lib/trace.js')
import App from './app.vue';
const trace = require('web-tracing');
import trace2 from 'web-tracing';


console.log('window._trace', window._trace);
console.log('trace', trace);
console.log('trace2', trace2);

// trace.init({
//   requestUrl: 'http://172.15.224.10:33199/trackweb/tra',
//   appName: 'chengxh',
//   event: true,
//   performance: true,
//   pv: true,
//   error: true,
// })


new Vue({
  render: (h) => h(App),
}).$mount('#app');
