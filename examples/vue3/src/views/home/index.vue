<template>
  <div class="home">
    <div class="mb">
      所有的事件类型:
      <div v-for="(value, key) in sendEventType">{{ `${key}: ${value}` }}</div>
    </div>
    <div>
      所有的事件ID(还有一些id是随机字符串的):
      <div v-for="(value, key) in sendEventId">{{ `${key}: ${value}` }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sendEventType: {
        pv: '路由',
        error: '错误',
        performance: '资源',
        click: '点击',
        dwell: '页面卸载',
        intersection: '曝光采集'
      },
      sendEventId: {
        page: '页面',
        resource: '资源',
        server: '请求',
        code: '错误id - code',
        reject: '错误id - reject',
        'console.error': '错误id - console.error'
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
