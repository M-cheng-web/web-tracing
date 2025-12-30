import React, { useState, useEffect, useRef } from 'react'
import { Button, Tabs, Alert, message, Modal } from 'antd'
import type { TabsProps } from 'antd'
import axios from 'axios'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import { traceError, options, unzipRecordscreen } from '@web-tracing/react'
import CTable from '../../components/CTable'
import { formatDate } from '../../utils/tools'

const Err: React.FC = () => {
  const [showImgTrue, setShowImgTrue] = useState(false)
  const [showImgFalse, setShowImgFalse] = useState(false)
  const [showAudioTrue, setShowAudioTrue] = useState(false)
  const [showAudioFalse, setShowAudioFalse] = useState(false)
  const [showVideoTrue, setShowVideoTrue] = useState(false)
  const [showVideoFalse, setShowVideoFalse] = useState(false)
  const [errDialogVisible, setErrDialogVisible] = useState(false)
  const [data, setData] = useState([])
  const recordScreenRef = useRef<HTMLDivElement>(null)

  const codeError = () => {
    message.success('触发代码错误')
    const a = {}
    // @ts-ignore
    a.split('/')
  }

  const promiseError = () => {
    message.success('触发Promise错误')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const promiseWrap = () =>
      new Promise((_resolve, reject) => {
        reject('promise reject')
      })
    promiseWrap().then(res => {
      console.log('res', res)
    })
  }

  const consoleErr = () => {
    message.success('触发console.error')
    console.error('consoleErr', '111', '222')
  }

  const sendBizErr = () => {
    message.success('触发自定义错误')
    traceError({
      eventId: '自定义错误ID',
      errMessage: '自定义错误message',
      src: '/interface/order',
      params: {
        id: '12121'
      }
    })
  }

  const openX = () => {
    if (options.value.recordScreen) {
      message.warning('已经打开错误录屏了，不用重复打开')
    } else {
      options.value.recordScreen = true
      message.success('成功打开错误录屏')
    }
  }

  const closeX = () => {
    if (options.value.recordScreen) {
      options.value.recordScreen = false
      message.success('关闭成功')
    } else {
      message.warning('已经关闭错误录屏了，不用重复关闭')
    }
  }

  // ------- 批量错误 -------
  const batchErrorA_Safe = (num: number) => {
    for (let x = 1; x <= num; x++) {
      document.getElementById('codeErr')?.click()
    }
  }

  const batchErrorAT = (num: number) => {
    for (let x = 1; x <= num; x++) {
      setTimeout(() => {
        triggerCodeError()
      }, x * 300)
    }
  }

  const batchErrorB = (num: number) => {
    for (let x = 1; x <= num; x++) {
      triggerCodeError()
      consoleErr()
      promiseError()
    }
  }

  const batchErrorC = (num: number) => {
    for (let x = 1; x <= num; x++) {
      setTimeout(() => {
        batchErrorB(1)
      }, x * 300)
    }
  }

  const batchErrorD = () => {
    setInterval(() => {
      triggerCodeError()
    }, 200)
  }

  const lookRecordscreen = (row: any) => {
    setErrDialogVisible(true)
    // Wait for modal to render
    setTimeout(() => {
      if (recordScreenRef.current) {
        recordScreenRef.current.innerHTML = '' // Clear previous
        const events = unzipRecordscreen(row.recordscreen) as unknown as any[]
        new rrwebPlayer({
          target: recordScreenRef.current,
          props: {
            events,
            UNSAFE_replayCanvas: true
          }
        })
      }
    }, 100)
  }

  const getAllTracingList = () => {
    axios
      .get('/getAllTracingList', { params: { eventType: 'error' } })
      .then(res => {
        setData(res.data.data)
        message.success('成功查询最新数据 - 错误事件')
      })
  }

  useEffect(() => {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
    getAllTracingList()
  }, [])

  const config = [
    { label: '序号', prop: 'index', width: '50', isTemplate: true },
    { label: '事件ID', prop: 'eventId' },
    { label: '事件类型', prop: 'eventType', width: '100' },
    { label: '当前页面URL', prop: 'triggerPageUrl', width: '160' },
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
    { label: '错误信息', prop: 'errMessage' },
    { label: '完整错误信息', prop: 'errStack', width: '140' },
    { label: '错误行', prop: 'line' },
    { label: '错误列', prop: 'col' },
    { label: '是否为批量错误', prop: 'batchError' },
    {
      label: '批量错误最后发生时间',
      prop: 'batchErrorLastHappenTime',
      width: '140',
      isTemplate: true
    },
    { label: '批量错误-错误个数', prop: 'batchErrorLength' },
    { label: '资源请求链接', prop: 'requestUrl', width: '100' },
    { label: '参数', prop: 'params' },
    {
      label: '操作',
      prop: 'operate',
      width: '150',
      isTemplate: true
    }
  ]

  const renderers = {
    index: (_record: any, index: number) => index + 1,
    sendTime: (record: any) => formatDate(record.sendTime),
    triggerTime: (record: any) => formatDate(record.triggerTime),
    batchErrorLastHappenTime: (record: any) =>
      formatDate(record.batchErrorLastHappenTime),
    operate: (record: any) => (
      <Button type="primary" onClick={() => lookRecordscreen(record)}>
        查看错误录屏
      </Button>
    )
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '普通错误事件',
      children: (
        <div style={{ marginBottom: 20 }}>
          <Alert
            type="warning"
            message="错误事件的捕获会有延迟，特别是在开启了批量错误的情况下，一般会有2s延迟"
            style={{ marginBottom: 20 }}
          />
          <div>
            <Button
              id="codeErr"
              danger
              ghost
              onClick={codeError}
              style={{ marginRight: 10 }}
            >
              代码错误
            </Button>
            <Button
              danger
              ghost
              onClick={promiseError}
              style={{ marginRight: 10 }}
            >
              Promise-错误
            </Button>
            <Button
              danger
              ghost
              onClick={consoleErr}
              style={{ marginRight: 10 }}
            >
              console-错误
            </Button>
            <Button
              danger
              ghost
              onClick={sendBizErr}
              style={{ marginRight: 10 }}
            >
              手动上报自定义错误
            </Button>
            <Button danger ghost onClick={openX} style={{ marginRight: 10 }}>
              开启错误录屏功能
            </Button>
            <Button danger ghost onClick={closeX}>
              关闭错误录屏功能
            </Button>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: '资源错误事件',
      children: (
        <div>
          <Alert
            type="warning"
            message="加载资源如果发生错误会产生两个事件："
            description={
              <div>
                <div>1.资源本身请求的事件</div>
                <div>
                  2.针对此次错误请求的错误事件（目前加载资源的错误无法拿到，例如404）
                </div>
                <div>
                  3.资源的错误加载没有明确字段表示，但会在err模块被监听捕获，所以要在管理端筛选
                </div>
              </div>
            }
            style={{ marginBottom: 20 }}
            showIcon={false}
          />
          <div className="mb resource">
            <Button danger ghost onClick={() => setShowImgTrue(true)}>
              加载错误图片
            </Button>
            {showImgTrue && (
              <img src="https://www.baidu.com/as.webp" alt="error" />
            )}
            <Button
              type="success"
              ghost
              onClick={() => setShowImgFalse(true)}
            >
              加载正常图片
            </Button>
            {showImgFalse && (
              <img
                src="https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/web-tracing/Annapurna-Ranges-2560x1440.tq4fx9hd9gg.webp"
                alt="success"
              />
            )}
          </div>
          <div className="mb resource">
            <Button danger ghost onClick={() => setShowAudioTrue(true)}>
              加载错误音频
            </Button>
            {showAudioTrue && <audio src="https://someaudio.wav" controls />}
            <Button
              type="success"
              ghost
              onClick={() => setShowAudioFalse(true)}
            >
              加载正常音频
            </Button>
            {showAudioFalse && (
              <audio
                src="https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3"
                controls
              />
            )}
          </div>
          <div className="mb resource">
            <Button danger ghost onClick={() => setShowVideoTrue(true)}>
              加载错误视频
            </Button>
            {showVideoTrue && (
              <video src="https://str39/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4" />
            )}
            <Button
              type="success"
              ghost
              onClick={() => setShowVideoFalse(true)}
            >
              加载正常视频
            </Button>
            {showVideoFalse && (
              <video src="https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4" />
            )}
          </div>
        </div>
      )
    },
    {
      key: '3',
      label: '批量错误事件',
      children: (
        <div>
          <Alert
            type="warning"
            message="开启了批量错误【scopeError：true】会导致所有错误有2s延迟，针对批量错误还会有20s的轮询"
            style={{ marginBottom: 20 }}
          />
          <Alert
            type="warning"
            message="具体要查看是否发送了错误可以打开控制台的打印信息"
            style={{ marginBottom: 20 }}
          />
          <Alert
            type="success"
            message="捕获批量错误原理"
            description={
              <div>
                <div>1. 先把所有错误都放入 a错误栈</div>
                <div>
                  2. 每次发生错误后防抖 2s查
                  a栈是否有批量错误(批量错误:errMessage、errType相同且发生个数大于等于5)
                  <div style={{ paddingLeft: 20 }}>
                    1.
                    如果为批量错误则合并这些错误并加入[时间区间参数、发生个数参数]后放入
                    b栈
                  </div>
                  <div style={{ paddingLeft: 20 }}>
                    2. 不为批量错误则发送这些错误
                  </div>
                </div>
                <div>
                  3.资源的错误加载没有明确字段表示，但会在err模块被监听捕获，所以要在管理端筛选
                </div>
                <div>4. 每次推入错误到b栈后延迟 20s查 b栈并发送这些错误</div>
                <div>
                  5. 在这个过程中，如果用户关闭了网页，会统一把
                  a栈、b栈内的数据发送
                </div>
                <div>
                  6.
                  在这个过程中，a栈每满50个错误也会强制触发a栈和b栈的错误处理（处理结果为直接发送批量错误）
                </div>
              </div>
            }
            style={{ marginBottom: 20 }}
          />

          <div className="mb">
            <Button
              danger
              ghost
              onClick={() => batchErrorA_Safe(10)}
              style={{ marginRight: 10 }}
            >
              立即触发代码错误-10条
            </Button>
            <Button danger ghost onClick={() => batchErrorA_Safe(100)}>
              立即触发代码错误-100条
            </Button>
          </div>

          <div className="mb">
            <Button
              danger
              ghost
              onClick={() => batchErrorAT(20)}
              style={{ marginRight: 10 }}
            >
              异步触发代码错误-20条
            </Button>
            <Button danger ghost onClick={() => batchErrorAT(100)}>
              异步触发代码错误-100条
            </Button>
          </div>

          <div className="mb">
            <Button
              danger
              ghost
              onClick={() => batchErrorB(10)}
              style={{ marginRight: 10 }}
            >
              立即触发【reject-10条 + 代码错误-10条 + console.error-10条】
            </Button>
            <Button danger ghost onClick={() => batchErrorB(20)}>
              立即触发【reject-20条 + 代码错误-20条 + console.error-20条】
            </Button>
          </div>

          <div className="mb">
            <Button
              danger
              ghost
              onClick={() => batchErrorC(10)}
              style={{ marginRight: 10 }}
            >
              异步触发【reject-10条 + 代码错误-10条 + console.error-10条】
            </Button>
            <Button danger ghost onClick={() => batchErrorD()}>
              异步触发无限错误
            </Button>
          </div>
        </div>
      )
    }
  ]

  // 辅助函数：触发代码错误
  const triggerCodeError = () => {
    const a = {}
    // @ts-ignore
    a.split('/')
  }

  return (
    <div className="err">
      <Tabs defaultActiveKey="1" items={items} />

      <Button
        type="primary"
        onClick={getAllTracingList}
        style={{ marginBottom: 10, marginTop: 20 }}
      >
        获取最新采集数据
      </Button>
      <CTable
        data={data}
        tableHeight={400}
        config={config}
        renderers={renderers}
      />

      <Modal
        title="错误录屏"
        open={errDialogVisible}
        onCancel={() => setErrDialogVisible(false)}
        width={1024}
        footer={null}
        destroyOnClose
      >
        <div id="recordscreen" ref={recordScreenRef}></div>
      </Modal>
    </div>
  )
}

export default Err
