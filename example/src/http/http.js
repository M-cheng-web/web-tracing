import Vue from 'vue';
import http from '../../../src/http-request';
import App from './app.vue';

http.init();

new Vue({
  render: (h) => h(App),
}).$mount('#app');
