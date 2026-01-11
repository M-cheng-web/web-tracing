import { useEffect, useState } from 'react'
import { Button, Alert } from 'antd'
import axios from 'axios'
import CTable from '../../components/CTable'
import { formatDate } from '../../utils/tools'

const Pv = () => {
  const [tracingInfo, setTracingInfo] = useState<any>({
    data: [],
    table: {
      config: [
        { label: '序号', prop: 'index', width: 50, isTemplate: true },
        { label: '事件ID', prop: 'eventId' },
        { label: '事件类型', prop: 'eventType' },
        { label: '当前页面URL', prop: 'triggerPageUrl', width: 200 },
        { label: '上级页面URL', prop: 'referer', width: 200 },
        { label: '页面标题', prop: 'title' },
        { label: '发送时间', prop: 'sendTime', width: 200, isTemplate: true },
        {
          label: '事件触发时间',
          prop: 'triggerTime',
          width: 200,
          isTemplate: true
        },
        { label: '页面加载来源', prop: 'action', width: 100 }
      ]
    }
  })

  useEffect(() => {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
    getAllTracingList()
  }, [])

  const getAllTracingList = () => {
    axios
      .get('/getAllTracingList', { params: { eventType: 'pv' } })
      .then(res => {
        const successList = res.data.data
        setTracingInfo((prev: any) => ({
          ...prev,
          data: successList
        }))
        // message.success('成功查询最新数据 - 页面跳转事件');
      })
  }

  return (
    <div className="pv">
      <Alert
        message="action 字段解释"
        description={
          <div>
            <div>
              navigate - 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
            </div>
            <div>
              reload - 网页通过“重新加载”按钮或者location.reload()方法加载
            </div>
            <div>back_forward - 网页通过“前进”或“后退”按钮加载</div>
            <div>reserved - 任何其他来源的加载</div>
          </div>
        }
        type="warning"
        showIcon={false}
        className="mb"
      />

      <Button
        type="primary"
        onClick={getAllTracingList}
        className="mb"
      >
        获取最新采集数据
      </Button>

      <CTable
        data={tracingInfo.data}
        tableHeight={400}
        config={tracingInfo.table.config}
        renderers={{
          index: (_record: any, index: number) => index + 1,
          sendTime: (record: any) => formatDate(record.sendTime),
          triggerTime: (record: any) => formatDate(record.triggerTime)
        }}
      />
    </div>
  )
}

export default Pv
