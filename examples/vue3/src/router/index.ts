import {
  createRouter,
  createWebHashHistory
  // createWebHistory
} from 'vue-router'
import { dynamicRouterMap } from './router.dynamic'

const router = createRouter({
  history: createWebHashHistory(),
  routes: dynamicRouterMap,
  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export { router as default, dynamicRouterMap }
