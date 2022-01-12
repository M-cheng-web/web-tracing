import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';

Vue.use(VueRouter);

const trace = require('../../../src/index.js');

trace.init({
  requestUrl: 'http://8.129.19.55:8081/sys-file/test-receive',
  appName: 'chengxh',
  // event: true,
  performance: true,
  // pv: true,
  // error: true,
})

// 2. 定义路由
const routes = [

];

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes,
});

// 4. 创建和挂载根实例。
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
