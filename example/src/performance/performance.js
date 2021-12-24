import Vue from 'vue';
import VueRouter from 'vue-router';
import http from '../../../src/http-request';
import performance from '../../../src/performance';
import App from './app.vue';

Vue.use(VueRouter);

http.init();
performance.init({
  performance: { resource: true },
});

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
