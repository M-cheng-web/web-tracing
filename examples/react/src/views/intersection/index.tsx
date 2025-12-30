import { useEffect, useState } from 'react'
import { Button, Alert, message } from 'antd'
import axios from 'axios'
import {
  intersectionObserver,
  intersectionUnobserve,
  intersectionDisconnect
} from '@web-tracing/react'
import CTable from '../../components/CTable'
import { formatDate } from '../../utils/tools'

const Intersection = () => {
  const [tracingInfo, setTracingInfo] = useState<any>({
    data: [],
    table: {
      config: [
        { label: '序号', prop: 'index', width: 50, isTemplate: true },
        { label: '事件类型', prop: 'eventType' },
        { label: '当前页面URL', prop: 'triggerPageUrl', width: 200 },
        { label: '监听阈值', prop: 'threshold' },
        {
          label: '开始监视时间',
          prop: 'observeTime',
          isTemplate: true,
          width: 140
        },
        {
          label: '开始暴露时间',
          prop: 'showTime',
          isTemplate: true,
          width: 140
        },
        {
          label: '结束暴露时间',
          prop: 'showEndTime',
          isTemplate: true,
          width: 140
        },
        {
          label: '事件发送时间',
          prop: 'sendTime',
          isTemplate: true,
          width: 140
        },
        { label: '参数', prop: 'params', width: 300 }
      ]
    }
  })

  useEffect(() => {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
    getAllTracingList()
    return () => {
      // Cleanup if needed
    }
  }, [])

  const handleIntersectionObserver = (str: string) => {
    message.success('成功采集，请滑动页面测试')
    const target = document.querySelector(`#${str}`)!
    intersectionObserver({
      target,
      threshold: 0.5,
      params: { name: 1111, targetName: str }
    })
  }

  const handleIntersectionUnobserve = (str: string) => {
    message.success('取消了采集，请滑动页面测试')
    const target = document.querySelector(`#${str}`)!
    intersectionUnobserve(target)
  }

  const handleIntersectionDisconnect = () => {
    message.success('取消了采集，请滑动页面测试')
    intersectionDisconnect()
  }

  const getAllTracingList = () => {
    axios
      .get('/getAllTracingList', { params: { eventType: 'intersection' } })
      .then(res => {
        const successList = res.data.data
        setTracingInfo((prev: any) => ({
          ...prev,
          data: successList
        }))
        // message.success('成功查询最新数据 - 曝光采集事件');
      })
  }

  return (
    <div className="intersection">
      <Alert
        message="注意"
        description={
          <div>
            <div>
              监听阈值(threshold)解释：阀值默认为0.5，当为0.5时代表滚动超过图片达到一半时即为曝光结束
            </div>
            <div>同理当为0.5时，代表滚动视图能看到图片一半时即为曝光开始</div>
          </div>
        }
        type="warning"
        showIcon={false}
        className="mb"
      />

      <div className="mb">
        <Button
          type="primary"
          danger
          ghost
          onClick={handleIntersectionDisconnect}
        >
          取消所有采集曝光
        </Button>
      </div>

      <div className="mb">
        <Button
          type="primary"
          ghost
          onClick={() => handleIntersectionObserver('target')}
          style={{ marginRight: 10 }}
        >
          采集此图片的曝光
        </Button>
        <Button
          danger
          ghost
          onClick={() => handleIntersectionUnobserve('target')}
        >
          取消此图片的曝光采集
        </Button>
      </div>

      <div id="target" className="mb" style={{ marginBottom: 20 }}>
        <img
          src="https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
          alt="target"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <div className="mb" style={{ marginBottom: 20 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i}>----------- 分割线 -----------</div>
        ))}
      </div>

      <div className="mb">
        <Button
          type="primary"
          ghost
          onClick={() => handleIntersectionObserver('target2')}
          style={{ marginRight: 10 }}
        >
          采集此图片的曝光
        </Button>
        <Button
          danger
          ghost
          onClick={() => handleIntersectionUnobserve('target2')}
        >
          取消此图片的曝光采集
        </Button>
      </div>

      <div id="target2" className="mb" style={{ marginBottom: 20 }}>
        <img
          src="https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
          alt="target2"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <Button
        type="primary"
        onClick={getAllTracingList}
        style={{ marginBottom: 20 }}
      >
        获取最新采集数据
      </Button>

      <CTable
        data={tracingInfo.data}
        tableHeight={400}
        config={tracingInfo.table.config}
        renderers={{
          index: (_record: any, index: number) => index + 1,
          observeTime: (record: any) => formatDate(record.observeTime),
          showTime: (record: any) => formatDate(record.showTime),
          showEndTime: (record: any) => formatDate(record.showEndTime),
          sendTime: (record: any) => formatDate(record.sendTime),
          params: (record: any) => JSON.stringify(record.params)
        }}
      />
    </div>
  )
}

export default Intersection
