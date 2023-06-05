<template>
  <div id="app">
    <div class="left-menu">
      <menu-list :items="items" />
    </div>
    <div class="right-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { dynamicRouterMap } from './router/router.dynamic'

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
  }
}
</style>
