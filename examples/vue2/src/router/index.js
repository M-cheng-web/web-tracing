import Vue from 'vue'
import Router from 'vue-router'
import { dynamicRouterMap } from './router.dynamic.js'

Vue.use(Router)

export const constantRoutes = [...dynamicRouterMap]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export default router
