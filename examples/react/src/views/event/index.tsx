import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import axios from 'axios'
import CTable from '../../components/CTable'
import { formatDate } from '../../utils/tools'

const Event: React.FC = () => {
  const [data, setData] = useState([])

  const config = [
    { label: '序号', prop: 'index', width: '50', isTemplate: true },
    { label: '事件ID', prop: 'eventId' },
    { label: '事件名', prop: 'title' },
    { label: '事件类型', prop: 'eventType' },
    { label: '事件参数', prop: 'params', width: '200' },
    { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
    {
      label: '事件发送时间',
      prop: 'sendTime',
      isTemplate: true,
      width: '140'
    },
    {
      label: '事件发生时间',
      prop: 'triggerTime',
      isTemplate: true,
      width: '140'
    },
    { label: '被点击元素的层级', prop: 'elementPath' },
    { label: '被点击元素与屏幕左边距离', prop: 'x', width: '100' },
    { label: '被点击元素与屏幕上边距离', prop: 'y', width: '100' }
  ]

  const getAllTracingList = () => {
    // @ts-ignore
    if (window.getAllTracingList) {
      // Using the window function if available (mocked/injected)
      // But in React example we need to implement it or call API directly
    }
    axios
      .get('/getAllTracingList', { params: { eventType: 'click' } })
      .then(res => {
        setData(res.data.data)
      })
  }

  useEffect(() => {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
    getAllTracingList()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <div
        className="box-a mb"
        data-warden-title="xxx"
        data-warden-bigTitle="bigTitle"
        style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10 }}
      >
        <div
          className="box-b"
          data-warden-test="test-1"
          data-warden-title="titletitle-1"
          data-warden-bing="bing-1"
          data-warden-event-id="ddd-1"
          style={{ marginBottom: 10 }}
        >
          <div className="box-c">我是最里面的内容 - 1</div>
        </div>
        <div
          className="box-b-btn"
          data-warden-id="我是ID"
          data-warden-test="test-btn"
          style={{ marginBottom: 10 }}
        >
          <Button type="primary" style={{ marginRight: 10 }}>
            点我一个试试
          </Button>
          <Button type="primary">再点我一个试试</Button>
        </div>
        <div
          className="box-b"
          data-warden-test="test-2"
          data-warden-title="titletitle-2"
          data-warden-bing="bing-2"
          data-warden-event-id="ddd-2"
        >
          <div className="box-c">我是最里面的内容 - 2</div>
        </div>
      </div>

      <Button
        type="primary"
        onClick={getAllTracingList}
        style={{ marginBottom: 10 }}
      >
        获取最新采集数据
      </Button>

      <CTable
        data={data}
        tableHeight={400}
        config={config}
        renderers={{
          index: (_record: any, index: number) => index + 1,
          sendTime: record => formatDate(record.sendTime),
          triggerTime: record => formatDate(record.triggerTime),
          params: record => JSON.stringify(record.params) // Ensure params are stringified if object
        }}
      />
    </div>
  )
}

export default Event
