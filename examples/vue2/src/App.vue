<template>
  <div id="app">
    <div class="left-menu">
      <menu-list :items="items" />
    </div>
    <div class="right-body">
      <router-view></router-view>
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

<script>
import { dynamicRouterMap } from './router/router.dynamic'
import axios from 'axios'

// 视频资源地址
// https://blog.csdn.net/qq_17497931/article/details/80824328

export default {
  data() {
    return {
      items: [],
      baseInfo: {}
    }
  },
  created() {
    this.items = dynamicRouterMap.filter(item => item.path !== '/')
    this.getBaseInfo()
  },
  methods: {
    cleanTracingList() {
      axios.post('/cleanTracingList').then(() => {
        this.$message.success('清除成功')
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    getBaseInfo() {
      axios.get('/getBaseInfo').then(res => {
        this.baseInfo = res.data.data
      })
    },
    showBaseInfo() {
      if (this.baseInfo) {
        const displayInfo = Object.keys(this.baseInfo).reduce((pre, key) => {
          const value = JSON.stringify(this.baseInfo[key])
          pre += `<div class='pop-line'><div>${key}: </div><span>${value}</span></div>`
          return pre
        }, '')
        this.$alert(displayInfo, '核心基础信息', {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          closeOnClickModal: true,
          callback: () => {
            // action
          }
        })
      }
    }
  }
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
