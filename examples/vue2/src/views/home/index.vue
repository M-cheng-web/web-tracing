<template>
  <div class="home">
    <div>
      所有的事件类型:
      <div v-for="(value, key) in sendEventType">{{ `${key}: ${value}` }}</div>
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
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.pop-line {
  display: flex;
  align-items: center;
  & > div {
    width: 100px;
  }
  & > span {
    flex: 1;
  }
}
</style>
