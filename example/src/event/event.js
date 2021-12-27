import Vue from 'vue';
const trace = require('../../../src/index');

import App from './app.vue';

trace.init({
  appName: 'chengxh',
  event: true,
  performance: true,
  pv: true,
  error: true,
})


new Vue({
  render: (h) => h(App),
}).$mount('#app');
