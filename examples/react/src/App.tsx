import { useState } from 'react'
import { HashRouter, useRoutes, Navigate, Outlet } from 'react-router-dom'
import MenuList from './components/MenuList'
import { Button, Modal, message } from 'antd'
import axios from 'axios'
import { routes } from './router'

// Layout component to match App.vue structure
const Layout = () => {
  const [baseInfo, setBaseInfo] = useState<any>({})

  // Transform routes to match MenuList expectation if needed
  const menuItems = routes.filter(
    item => item.path !== '/' && item.path !== '*'
  )

  const getBaseInfo = () => {
    return axios.get('/getBaseInfo').then(res => {
      setBaseInfo(res.data.data)
      return res.data.data
    })
  }

  const showBaseInfo = () => {
    getBaseInfo().finally(() => {
      if (baseInfo) {
        const displayInfo = Object.keys(baseInfo).reduce((pre, key) => {
          const value = JSON.stringify(baseInfo[key])
          pre += `<div className='pop-line'><div>${key}: </div><span>${value}</span></div>`
          return pre
        }, '')

        Modal.info({
          title: '核心基础信息',
          content: <div dangerouslySetInnerHTML={{ __html: displayInfo }} />,
          width: 600,
          okText: '确定',
          closable: true,
          maskClosable: true
        })
      }
    })
  }

  const cleanTracingList = () => {
    axios.post('/cleanTracingList').then(() => {
      message.success({
        content: '清除成功',
        duration: 1
      })
      // @ts-ignore
      if (window.getAllTracingList) {
        // @ts-ignore
        window.getAllTracingList()
      }
    })
  }

  return (
    <div id="app" style={{ display: 'flex' }}>
      <div className="left-menu">
        <MenuList items={menuItems} />
      </div>
      <div className="right-body">
        <Outlet />
      </div>
      <Button className="clean-1" type="primary" onClick={showBaseInfo}>
        查看核心基础信息
      </Button>
      <div>
        <Button className="clean-2" type="primary" danger onClick={cleanTracingList}>
          清除所有事件信息
        </Button>
      </div>
    </div>
  )
}

// Router component to handle route definitions
const AppRouter = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        ...routes.map(route => {
          if (route.redirect) {
            return {
              path: route.path,
              element: <Navigate to={route.redirect} replace />
            }
          }
          return {
            path: route.path,
            element: route.element
          }
        })
      ]
    }
  ])
  return element
}

function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default App
