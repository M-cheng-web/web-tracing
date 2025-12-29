<template>
  <div id="app">
    <div class="left-menu">
      <MenuList :items="items" />
    </div>
    <div class="right-body">
      <NuxtPage />
    </div>
    <el-button class="clean-1" type="primary" @click="showBaseInfo">
      查看核心基础信息
    </el-button>
    <div>
      <el-button class="clean-2" type="danger" @click="cleanTracingList">
        清除所有事件信息
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { dynamicRouterMap } from './router/dynamic'
import { afterSendData } from '@web-tracing/core'

const items = ref<any[]>(dynamicRouterMap.filter(item => item.path !== '/'))
const baseInfo = ref<any>({})

onMounted(() => {
  if ((import.meta as any).client) {
    const hookKey = '__webTracingAfterSendNotification__'
    const globalAny = globalThis as any
    if (!globalAny[hookKey]) {
      globalAny[hookKey] = true

      const sendEventType: Record<string, string> = {
        pv: '路由',
        error: '错误',
        performance: '资源',
        click: '点击',
        dwell: '页面卸载',
        intersection: '曝光采集'
      }

      afterSendData((data: any) => {
        const { sendType, success, params } = data || {}
        const eventInfo = params?.eventInfo || []

        const message = `
          <div class='event-pop'>
            <div class='warning-text'>打开控制台可查看更多详细信息</div>
            <div>发送是否成功: ${success}</div>
            <div>发送方式: ${sendType}</div>
            <div>发送内容(只概括 eventType、eventId)
              ${eventInfo.reduce(
                (pre: string, item: any, index: number) => {
                  pre += `
                  <div class='pop-line'>
                    <span>${index + 1}</span>
                    <div>${item.eventType}(${sendEventType[item.eventType] || item.eventType})</div>
                    <div>${item.eventId}</div>
                  </div>`
                  return pre
                },
                `<div class='pop-line'>
                  <div>eventType</div>
                  <div>eventId</div>
                </div>`
              )}
            </div>
          </div>
        `

        ElNotification({
          title: '发送一批数据到服务端',
          message,
          position: 'top-right',
          dangerouslyUseHTMLString: true
        })

        // @ts-ignore
        if (window.getAllTracingList) {
          // @ts-ignore
          window.getAllTracingList()
        }
      })
    }
  }
})

function getBaseInfo() {
  return $fetch('/getBaseInfo').then((res: any) => {
    baseInfo.value = (res as any).data
  })
}
function showBaseInfo() {
  getBaseInfo().finally(() => {
    if (baseInfo.value) {
      const displayInfo = Object.keys(baseInfo.value).reduce((pre, key) => {
        const value = JSON.stringify(baseInfo.value[key])
        pre += `<div class='pop-line'><div>${key}: </div><span>${value}</span></div>`
        return pre
      }, '')
      ElMessageBox.alert(displayInfo, '核心基础信息', {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        closeOnClickModal: true,
        callback: () => {
          // action
        }
      })
    }
  })
}
function cleanTracingList() {
  $fetch('/cleanTracingList', { method: 'POST' }).then(() => {
    ElMessage({
      message: '清除成功',
      type: 'success',
      duration: 1000
    })
    // 只在客户端环境下访问 window
    if ((import.meta as any).client) {
      // @ts-ignore
      if (window.getAllTracingList) {
        // @ts-ignore
        window.getAllTracingList()
      }
    }
  })
}

provide('formatDate', formatDate)
function formatDate(timestamp: number) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hour = padZero(date.getHours())
  const minute = padZero(date.getMinutes())
  const second = padZero(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
function padZero(num: any) {
  return num.toString().padStart(2, '0')
}

provide('sendMessage', sendMessage)
function sendMessage(message = '成功触发事件，会有一些延迟，请稍等') {
  ElMessage({
    message,
    type: 'success'
  })
}

provide('emitMessage', emitMessage)
function emitMessage(text = '成功收集') {
  ElMessage(text)
}

provide('selfMessage', selfMessage)
function selfMessage() {
  // console.log(11);
}
</script>

<style scoped lang="scss">
#app {
  display: flex;
  .left-menu {
    width: 260px;
  }
  .right-body {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    padding: 20px;
  }
  .clean-1 {
    position: fixed;
    bottom: 80px;
    left: 20px;
    width: 220px;
    height: 40px;
  }
  .clean-2 {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 220px;
    height: 40px;
  }
}
</style>

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
