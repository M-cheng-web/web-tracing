import Vue from 'vue';
import App from './app.vue';
import err from '../../../src/err';

Vue.productionTip = false;

err.init({
  errorCore: true,
});

// 创建和挂载根实例。
new Vue({
  render: (h) => h(App),
}).$mount('#app');
