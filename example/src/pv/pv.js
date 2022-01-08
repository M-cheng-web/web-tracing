import Vue from 'vue';
import VueRouter from 'vue-router';
import pv from '../../../src/pv';
import App from './app.vue';
import Foo from './foo.vue';
import Bar from './bar.vue';

pv.init({ hashtag: true });

Vue.use(VueRouter);

// 2. 定义路由
const routes = [
  { path: '/pv-foo', component: Foo },
  { path: '/pv-bar', component: Bar },
];

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  mode: 'hash',
  routes,
});

// 4. 创建和挂载根实例。
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
