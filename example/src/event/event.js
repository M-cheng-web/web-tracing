import Vue from 'vue';
import Event from '../../../src/event';
import App from './app.vue';

Event.init();

new Vue({
  render: (h) => h(App),
}).$mount('#app');
