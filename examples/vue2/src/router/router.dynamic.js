export const dynamicRouterMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/err',
    name: 'Err',
    component: () => import('@/views/err/index.vue'),
    meta: {
      title: '监控 - 错误',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/event',
    name: 'Event',
    component: () => import('@/views/event/index.vue'),
    meta: {
      title: '监控 - 事件',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/http',
    name: 'Http',
    component: () => import('@/views/http/index.vue'),
    meta: {
      title: '监控 - 请求',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('@/views/performance/index.vue'),
    meta: {
      title: '监控 - 资源',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/pv',
    name: 'Pv',
    component: () => import('@/views/pv/index.vue'),
    meta: {
      title: '监控 - 页面跳转',
      icon: 'el-icon-setting'
    }
  }
]
