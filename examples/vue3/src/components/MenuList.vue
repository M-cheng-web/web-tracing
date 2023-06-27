<template>
  <div class="menu-list">
    <el-menu
      :default-active="defaultActive"
      @open="handleOpen"
      @close="handleClose"
      router
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- 遍历菜单 -->
      <template v-for="item in props.items">
        <!-- 含有子菜单 -->
        <template v-if="item.children">
          <!-- 第一层 含有子菜单菜单 -->
          <el-sub-menu :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <menu-list :items="item.children" />
          </el-sub-menu>
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

<script lang="ts">
export default {
  name: 'MenuList'
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  items: any[]
}
const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

const defaultActive = ref('/home')

const router = useRouter()

watch(
  () => router,
  (to: any) => {
    defaultActive.value = to.path
  },
  { immediate: true }
)

function handleOpen(key, keyPath) {
  // console.log(key, keyPath)
}
function handleClose(key, keyPath) {
  // console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.menu-list {
  height: 100vh;
  background-color: #545c64;
}
</style>
