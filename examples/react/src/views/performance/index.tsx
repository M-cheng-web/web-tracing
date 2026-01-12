import { useEffect, useState } from 'react'
import { Button, Alert, message } from 'antd'
import axios from 'axios'
import CTable from '../../components/CTable'
import { formatDate } from '../../utils/tools'

const Performance = () => {
  const [tracingInfo, setTracingInfo] = useState<any>({
    data: [],
    table: {
      config: [
        { label: '序号', prop: 'index', width: 50, isTemplate: true },
        { label: '事件ID', prop: 'eventId' },
        { label: '事件类型', prop: 'eventType' },
        { label: '请求地址', prop: 'requestUrl', width: 200 },
        { label: '当前页面URL', prop: 'triggerPageUrl', width: 200 },
        { label: '发送时间', prop: 'sendTime', isTemplate: true, width: 140 },
        {
          label: '事件触发时间',
          prop: 'triggerTime',
          isTemplate: true,
          width: 140
        },
        { label: '请求方式', prop: 'initiatorType' },
        { label: '传输的数据包大小', prop: 'transferSize' },
        { label: '数据包压缩后大小', prop: 'encodedBodySize' },
        { label: '数据包解压后大小', prop: 'decodedBodySize' },
        { label: '加载时长', prop: 'duration' },
        { label: '重定向开始时间', prop: 'redirectStart' },
        { label: '重定向结束时间', prop: 'redirectEnd' },
        { label: '开始时间', prop: 'startTime' },
        { label: '开始发起请求时间', prop: 'fetchStart' },
        { label: 'DNS开始解析时间', prop: 'domainLookupStart' },
        { label: 'DNS结束解析时间', prop: 'domainLookupEnd' },
        { label: '开始建立连接时间', prop: 'connectStart' },
        { label: '连接建立完成时间', prop: 'connectEnd' },
        { label: '开始发送数据包时间', prop: 'requestStart' },
        { label: '开始接收数据包时间', prop: 'responseStart' },
        { label: '数据包接收完成时间', prop: 'responseEnd' },
        {
          label: '是否错误状态(仅MutationObserver情况下支持)',
          prop: 'responseStatus',
          width: 160
        }
      ]
    }
  })

  useEffect(() => {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
    getAllTracingList()
  }, [])

  const performanceAddScript = () => {
    message.success('成功触发事件，会有一些延迟，请稍等')
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/lodash'
    document.head.appendChild(script)
  }

  const performanceAddScriptError = () => {
    message.success('成功触发事件，会有一些延迟，请稍等')
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/lodash22'
    document.head.appendChild(script)
  }

  const performanceAddLink = () => {
    message.success('成功触发事件，会有一些延迟，请稍等')
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://ahooks.js.org/useExternal/bootstrap-badge.css'
    document.head.appendChild(link)
  }

  const performanceAddImg = () => {
    message.success('成功触发事件，会有一些延迟，请稍等')
    const img = document.createElement('img')
    img.src = `https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/blog/Annapurna-Ranges-2560x1440.5r9m9t5vg1g0.webp`
    const div = document.getElementById('performance-img-div-1')!
    div.style.cssText =
      'width: 100px; height: 100px; overflow: hidden; margin-top: 20px'
    div.appendChild(img)
  }

  const performanceAddLocalImg = () => {
    const img = document.createElement('img')
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAMAAAD+dOxOAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACEFBMVEU3R09BSE3/aAD/VyIAAAA3R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R080R1A0R1A1R08yR1AwRlA1R081R1A1R081R081R080R1A2R082R08vRlH4ViT/Whr/Whn/Wxb/WB7/WB//VyL/Wxj/XRD/Xg//XBX/WRv/XRH/XBX/WB7/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/ViH/VR//VSD/ViD+az39pYn8qY79qI78qpD+h2H+glv71cr9mHj9lnb9l3f+fFP+dEn8w7H/WiX/Uhv/Uxz+aDj7zr/9imX+fVT+flX+cET/WCP/XCj9qI38vqr8u6f8u6b8x7f8x7b/XSr/WCT/WSX+f1f8wK3/Wib+flb+hV//VB78tqD/VB/9iWX8vqv/Ux39m3z8rJP8xbT9oIP9jWn7z8L9jmr/YzL+f1j9o4f9mHn+cUQAAABiXhJiAAAAcXRSTlMAAAAAAAoJDQgdJREGARBWhZNAlNBUd3NLmmxr0dU9Pq0L6N3DtwIvOEYaFUk+V1lMLYNbAwIJCgkLCwsJCAgJCggIAji7xcRD9C/nH9sTzAkDp5N9aFT8QfYw7iDi4wZbpdf+5a9eAhlFgNaqYycFG/l+tLAAAAABYktHRASPaNlRAAAACXBIWXMAAAB4AAAAeACd9VpgAAAAB3RJTUUH5QISCDAI1QMDnAAAAUpJREFUGNNjYGBlY+fg5OJm5+HlY2NnAAJ+AUEhYRFRMXEJSX4pkIC0jKycvIKioJKyirSqvBoDo7qGppa2DpOunr6BoZGxCYOpmbmFpZWFtY2tnb2Do5Mzg4urmzscuLm6MHh4FiIBTw8GL+/ComIoKCn09mLw8S0tK6+oBIGq6kJfHwY//+Ka2rp6EGhoLPT3YwhwLWlqbmkFgbaSQtcAhsCgovaOzq5uIOjpLQwKZGAOLuzrnzBx4sRJk6dMLQxmZmAOAdo2bfr06YUzZs4qDAEKhBaWzJ5TUlg4t3NeYWEoUCAsfP6ChX3FcxctXlIcHgYUiIgsal86c9nyJStWFkdGAAWiogsLV61eM2/tupbC6CigQExsIcjxhUCHF8bFAAXiExKTIkEeS05JTYsHCjAzp2dkZrlm5+Tm5QM5DCzMYGBdEA+mWQDainMpZaFBiAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0xOVQwMzozOToxNSswMDowMFrQJhgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDEtMDhUMjA6MDc6NTUrMDA6MDAY1ESzAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIM5IkAsAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADcwNHxxE5sAA[... 336 chars omitted ...]'
    const div = document.getElementById('performance-img-div-2')!
    div.style.cssText =
      'width: 20px; height: 20px; overflow: hidden; margin-top: 20px'
    div.appendChild(img)
  }

  const getAllTracingList = () => {
    axios
      .get('/getAllTracingList', { params: { eventType: 'performance' } })
      .then(res => {
        const successList = res.data.data.filter(
          (item: any) => item.eventId === 'resource'
        )
        axios
          .get('/getAllTracingList', { params: { eventType: 'error' } })
          .then(res => {
            const errorList = res.data.data.filter(
              (item: any) => item.eventId === 'resource'
            )
            setTracingInfo((prev: any) => ({
              ...prev,
              data: errorList.concat(successList)
            }))
            // message.success('成功查询最新数据 - 资源事件');
          })
      })
  }

  return (
    <div className="performance">
      <Alert
        message="注意"
        description="加载错误的资源会产生两个事件【1.资源本身的加载情况 2.报错情况】"
        type="warning"
        showIcon={false}
        className="mb"
      />

      <Alert
        message="sdk监听资源加载情况采用的是【 PerformanceObserver > MutationObserver 】的降级策略"
        description={
          <div>
            <div>
              通过PerformanceObserver拿不到资源是否加载成功，但其加载失败会在控制台报错，所以能被错误监听模块捕获
            </div>
            <div>
              如果只想从资源监听模块获取是否加载成功，可通过以下四个属性是否等于0来判断，但因为各种情况它们是不准确的，
            </div>
            <div>
              仅供参考【duration，responseEnd，transferSize，decodedBodySize】
            </div>
            <div>
              MutationObserver的情况下，因为能拿到具体dom，可以通过监听dom的error事件来判断是否失败，当失败的情况下会给出responseStatus
              = 'error' 字段来表示
            </div>
          </div>
        }
        type="warning"
        showIcon={false}
        className="mb"
      />

      <div className="mb">
        <Button
          className="ant-btn-success ant-btn-background-ghost"
          onClick={performanceAddScript}
        >
          插入正确Script
        </Button>
        <Button
          className="ant-btn-danger ant-btn-background-ghost"
          onClick={performanceAddScriptError}
        >
          插入错误Script
        </Button>
      </div>

      <div className="flex mb">
        <Button
          className="ant-btn-success ant-btn-background-ghost"
          onClick={performanceAddLink}
        >
          插入Link(bootstrap)
        </Button>
        <div className="mb badge badge-pill badge-primary">我是小demo</div>
      </div>

      <div className="mb flex" style={{ height: "100px" }}>
        <div className="flex" style={{ marginRight: "20px" }}>
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={performanceAddImg}
          >
            插入Img
          </Button>
          <div id="performance-img-div-1" />
        </div>
        <div className="flex">
          <Button
            className="ant-btn-success ant-btn-background-ghost"
            onClick={performanceAddLocalImg}
          >
            插入Base64图片(不涉及请求所以不会被采集)
          </Button>
          <div id="performance-img-div-2" />
        </div>
      </div>

      <Button type="primary" onClick={getAllTracingList} className="mb">
        获取最新采集数据
      </Button>

      <CTable
        data={tracingInfo.data}
        tableHeight={400}
        config={tracingInfo.table.config}
        renderers={{
          index: (_: any, index: number) => index + 1,
          sendTime: (record: any) => formatDate(record.sendTime),
          triggerTime: (record: any) => formatDate(record.triggerTime),
        }}
      />
    </div>
  );
}

export default Performance
