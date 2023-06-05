<template>
  <div class="menu-list">
    <el-menu
      default-active=""
      @open="handleOpen"
      @close="handleClose"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 遍历菜单 -->
      <template v-for="item in items">
        <!-- 含有子菜单 -->
        <template v-if="item.children">
          <!-- 第一层 含有子菜单菜单 -->
          <el-submenu :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <menu-list :items="item.children" />
          </el-submenu>
        </template>

        <!-- 第一层 不含子菜单  -->
        <template v-else>
          <el-menu-item
            :index="item.path"
            :key="item.path"
            style="width: 260px"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'MenuList',
  props: {
    items: Array
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

<style lang="scss" scoped>
.menu-list {
  height: 100vh;
  background-color: #545c64;
}
</style>
