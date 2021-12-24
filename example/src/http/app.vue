<template>
  <div>
    <button @click="sendXHR">发送XHR</button>
    <button @click="sendFetch">发送Fetch</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'app.vue',
  methods: {
    getRandom() {
      return Math.random() * 100;
    },
    sendXHR() {
      // const random = this.getRandom();
      // if (random > 50) {
      //   return axios.post('/api/order', { body: { id: 11 } });
      // }

      return axios.post('/api/order', { body: { id: 11 } });

      // return axios.get('/index.html', { params: { t: Date.now() } });
    },
    sendFetch() {
      const random = this.getRandom();
      if (random > 50) {
        fetch('/api/order', { method: 'post', body: JSON.stringify({ id: 123 }) });
      } else {
        fetch(`/index.html?t=${Date.now()}`);
      }
    },
  },
};
</script>

<style>

</style>
