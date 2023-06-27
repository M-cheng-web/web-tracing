<template>
  <div id="app">
    <div class="left-menu">
      <menu-list :items="items" />
    </div>
    <div class="right-body">
      <router-view ref="myComponent"></router-view>
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

  <!-- <el-alert title="warning alert" type="warning" /> -->
</template>

<script setup lang="ts">
import { provide, ref, onMounted } from 'vue'
import { dynamicRouterMap } from './router/router.dynamic'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const items = ref<any>([])
const baseInfo = ref<any>({})

onMounted(() => {
  items.value = dynamicRouterMap.filter(item => item.path !== '/')
})

function getBaseInfo() {
  return axios.get('/getBaseInfo').then(res => {
    baseInfo.value = res.data.data
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
      console.log('displayInfo', displayInfo)
      // ElAlert(displayInfo, '核心基础信息', {
      //   dangerouslyUseHTMLString: true,
      //   showConfirmButton: false,
      //   closeOnClickModal: true,
      //   callback: () => {
      //     // action
      //   }
      // })
    }
  })
}
function cleanTracingList() {
  axios.post('/cleanTracingList').then(() => {
    ElMessage({
      message: '清除成功',
      type: 'success',
      duration: 1000
    })
    // if (window.vm.$children[0].getMyComponent().getAllTracingList) {
    //   window.vm.$children[0].getMyComponent().getAllTracingList()
    // }
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
