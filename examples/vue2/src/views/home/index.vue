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

    <div>
      <button @click="_destroyTracing">点击触发 destroyTracing</button>
      <button @click="_reinitTracing" style="margin-left: 10px">
        重新初始化 WebTracing
      </button>
    </div>
  </div>
</template>

<script>
import { destroyTracing, init } from '@web-tracing/vue2'
import { webTracingConfig } from '../../main.js'

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
  methods: {
    _destroyTracing() {
      destroyTracing()
      this.sendMessage('destroyTracing 成功')
    },
    _reinitTracing() {
      init(webTracingConfig)
      this.sendMessage('WebTracing 重新初始化成功')
    }
  }
}
</script>

<style lang="scss"></style>
