export const dynamicRouterMap = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/err',
    name: 'Err',
    meta: {
      title: '监控 - 错误',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/event',
    name: 'Event',
    meta: {
      title: '监控 - 点击事件',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/http',
    name: 'Http',
    meta: {
      title: '监控 - 请求',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/performance',
    name: 'Performance',
    meta: {
      title: '监控 - 资源',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/pv',
    name: 'Pv',
    meta: {
      title: '监控 - 页面跳转',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/intersection',
    name: 'intersection',
    meta: {
      title: '监控 - 曝光采集',
      icon: 'el-icon-setting'
    }
  }
]
