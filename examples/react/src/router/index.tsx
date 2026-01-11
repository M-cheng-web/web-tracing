import Home from '../views/home'
import Err from '../views/err'
import Event from '../views/event'
import Http from '../views/http'
import Performance from '../views/performance'
import Pv from '../views/pv'
import Intersection from '../views/intersection'

export const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    element: <Home />,
    meta: {
      title: '首页',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/err',
    element: <Err />,
    meta: {
      title: '监控 - 错误',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/event',
    element: <Event />,
    meta: {
      title: '监控 - 点击事件',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/http',
    element: <Http />,
    meta: {
      title: '监控 - 请求',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/performance',
    element: <Performance />,
    meta: {
      title: '监控 - 资源',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/pv',
    element: <Pv />,
    meta: {
      title: '监控 - 页面跳转',
      icon: 'el-icon-setting'
    }
  },
  {
    path: '/intersection',
    element: <Intersection />,
    meta: {
      title: '监控 - 曝光采集',
      icon: 'el-icon-setting'
    }
  }
]
