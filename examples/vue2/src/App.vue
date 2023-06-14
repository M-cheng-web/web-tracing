<template>
  <div id="app">
    <div class="left-menu">
      <menu-list :items="items" />
    </div>
    <div class="right-body">
      <router-view></router-view>
    </div>
    <el-button class="clean" type="primary" @click="cleanTracingList">
      清除所有事件信息
    </el-button>
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
      items: []
    }
  },
  created() {
    this.items = dynamicRouterMap.filter(item => item.path !== '/')
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
  .clean {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 220px;
    height: 40px;
  }
}
</style>
