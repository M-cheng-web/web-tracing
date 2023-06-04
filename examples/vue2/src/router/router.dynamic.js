export const dynamicRouterMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/err',
    name: 'Err',
    component: () => import('@/views/err/index.vue')
  },
  {
    path: '/event',
    name: 'Event',
    component: () => import('@/views/event/index.vue')
  },
  {
    path: '/http',
    name: 'Http',
    component: () => import('@/views/http/index.vue')
  },
  {
    path: '/performance',
    name: 'Performance',
    component: () => import('@/views/performance/index.vue')
  },
  {
    path: '/pv',
    name: 'Pv',
    component: () => import('@/views/pv/index.vue')
  }
]
