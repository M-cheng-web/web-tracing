import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Icons from '@ant-design/icons'

interface Props {
  items: any[]
}

const MenuList: React.FC<Props> = ({ items }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location.pathname])

  const getIcon = (_iconName: string) => {
    // Mapping Element Plus icons to Ant Design icons roughly
    // Vue example uses 'el-icon-setting' for all.
    return <Icons.SettingOutlined />
  }

  const mapItemsToMenu = (menuItems: any[]): any[] => {
    return menuItems.map(item => {
      if (item.children) {
        return {
          key: item.path,
          icon: getIcon(item.meta?.icon),
          label: item.meta?.title,
          children: mapItemsToMenu(item.children)
        }
      }
      return {
        key: item.path,
        icon: getIcon(item.meta?.icon),
        label: item.meta?.title,
        onClick: () => navigate(item.path)
      }
    })
  }

  const menuItems = mapItemsToMenu(items)

  return (
    <div className="menu-list">
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        style={{
          height: '100%',
          borderRight: 0,
          backgroundColor: '#545c64'
        }}
      />
    </div>
  )
}

export default MenuList
