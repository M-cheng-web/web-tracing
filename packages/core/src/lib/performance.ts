import { sendData } from './sendData'
import { eventBus } from './eventBus'
import { EVENTTYPES, SEDNEVENTTYPES } from '../common'
import { AnyObj } from '../types'
import {
  on,
  getLocationHref,
  normalizeObj,
  isValidKey,
  sendReaconImageList,
  getTimestamp
} from '../utils'
import { _global, _support } from '../utils/global'
import { options } from './options'

// 兼容判断
const supported = {
  performance: !!_global.performance,
  getEntriesByType: !!(
    _global.performance && _global.performance.getEntriesByType
  ),
  PerformanceObserver: 'PerformanceObserver' in _global,
  MutationObserver: 'MutationObserver' in _global,
  PerformanceNavigationTiming: 'PerformanceNavigationTiming' in _global
}

// 资源属性
const performanceEntryAttrs = {
  initiatorType: '',
  transferSize: 0,
  encodedBodySize: 0,
  decodedBodySize: 0,
  duration: 0,
  redirectStart: 0,
  redirectEnd: 0,
  startTime: 0,
  fetchStart: 0,
  domainLookupStart: 0,
  domainLookupEnd: 0,
  connectStart: 0,
  connectEnd: 0,
  requestStart: 0,
  responseStart: 0,
  responseEnd: 0,
  workerStart: 0
}

/**
 * 发送页面追踪资源加载性能数据
 * (支持getEntriesByType的情况下才追踪)
 */
function traceResourcePerformance(performance: PerformanceObserverEntryList) {
  // 排除xmlhttprequest类型,服务器有响应便会记录,包括404的请求,转由http-request模块负责记录请求数据,区分请求状态
  // 同时也会排除一些其他类型,比如在引入一个script后会触发一次性能监控,它的类型是beacon,这一次的要排除
  const observerTypeList = ['img', 'script', 'link', 'audio', 'video', 'css']

  const entries = performance.getEntriesByType(
    'resource'
  ) as PerformanceResourceTiming[]
  const records: any[] = []

  entries.forEach(entry => {
    // initiatorType含义：通过某种方式请求的资源,例如script,link..
    const { initiatorType = '' } = entry

    // 只记录observerTypeList中列出的资源类型请求,不在列表中则跳过
    if (observerTypeList.indexOf(initiatorType.toLowerCase()) < 0) return

    // sdk内部 img 发送请求的错误不会记录
    if (sendReaconImageList.length) {
      const index = sendReaconImageList.findIndex(
        item => item.src === entry.name
      )

      if (index !== -1) {
        sendReaconImageList.splice(index, 1)
        return
      }
    }

    const value: AnyObj = {}
    Object.keys(performanceEntryAttrs).forEach(attr => {
      if (isValidKey(attr, entry)) {
        value[attr] = entry[attr]
      }
    })

    records.push(
      normalizeObj({
        ...value,
        eventType: SEDNEVENTTYPES.PERFORMANCE,
        eventId: 'resource',
        src: entry.name,
        triggerTime: getTimestamp(),
        url: getLocationHref()
      })
    )
  })

  if (records.length) sendData.emit(records)
  return records
}

/**
 * 监听 - 异步插入的script、link、img, DOM更新操作记录
 */
function observeSourceInsert() {
  const tags = ['img', 'script', 'link']
  // 检测异步插入的script、link、img,会有一些延迟,一些连接建立、包体大小的数据会丢失,精度下降
  // MutationObserver DOM3 Events规范,是个异步监听,只有在全部DOM操作完成之后才会调用callback
  const observer = new MutationObserver(mutationsList => {
    for (let i = 0; i < mutationsList.length; i += 1) {
      const startTime = getTimestamp()
      const { addedNodes = [] } = mutationsList[i]
      addedNodes.forEach((node: Node & { src?: string; href?: string }) => {
        const { nodeName } = node
        if (tags.indexOf(nodeName.toLowerCase()) !== -1) {
          on(node as Document, EVENTTYPES.LOAD, function () {
            sendData.emit(
              normalizeObj({
                eventType: SEDNEVENTTYPES.PERFORMANCE,
                eventId: 'resource',
                src: node.src || node.href,
                duration: getTimestamp() - startTime,
                triggerTime: getTimestamp(),
                url: getLocationHref()
              })
            )
          })
          on(node as Document, EVENTTYPES.ERROR, function () {
            sendData.emit(
              normalizeObj({
                eventType: SEDNEVENTTYPES.PERFORMANCE,
                eventId: 'resource',
                src: node.src || node.href,
                responseStatus: 'error',
                duration: getTimestamp() - startTime,
                triggerTime: getTimestamp(),
                url: getLocationHref()
              })
            )
          })
        }
      })
    }
  })
  observer.observe(_global.document, {
    subtree: true, // 目标以及目标的后代改变都会观察
    childList: true // 表示观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化
    // attributes: true, // 观察属性变动
    // attributeFilter: ['src', 'href'] // 要观察的属性
  })
  // observer.disconnect()
}

/**
 * 发送页面性能数据
 */
function observeNavigationTiming() {
  const times: AnyObj = {}
  const { performance } = _global
  let t: any = performance.timing

  times.fmp = 0 // 首屏时间 (渲染节点增量最大的时间点)
  if (supported.getEntriesByType) {
    const paintEntries = performance.getEntriesByType('paint')
    if (paintEntries.length) {
      times.fmp = paintEntries[paintEntries.length - 1].startTime
    }

    // 优先使用 navigation v2  https://www.w3.org/TR/navigation-timing-2/
    if (supported.PerformanceNavigationTiming) {
      const nt2Timing = performance.getEntriesByType('navigation')[0]
      if (nt2Timing) t = nt2Timing
    }
  }

  // 从开始发起这个页面的访问开始算起,减去重定向跳转的时间,在performanceV2版本下才进行计算
  // v1版本的fetchStart是时间戳而不是相对于访问起始点的相对时间
  if (times.fmp && supported.PerformanceNavigationTiming) {
    times.fmp -= t.fetchStart
  }

  // 白屏时间 (从请求开始到浏览器开始解析第一批HTML文档字节的时间差)
  // times.fpt = t.responseEnd - t.fetchStart;

  times.tti = t.domInteractive - t.fetchStart // 首次可交互时间

  times.ready = t.domContentLoadedEventEnd - t.fetchStart // HTML加载完成时间

  times.loadon = t.loadEventStart - t.fetchStart // 页面完全加载时间

  times.firstbyte = t.responseStart - t.domainLookupStart // 首包时间

  times.dns = t.domainLookupEnd - t.domainLookupStart // dns查询耗时

  times.appcache = t.domainLookupStart - t.fetchStart // dns缓存时间

  times.tcp = t.connectEnd - t.connectStart // tcp连接耗时

  times.ttfb = t.responseStart - t.requestStart // 请求响应耗时

  times.trans = t.responseEnd - t.responseStart // 内容传输耗时

  times.dom = t.domInteractive - t.responseEnd // dom解析耗时

  times.res = t.loadEventStart - t.domContentLoadedEventEnd // 同步资源加载耗时

  times.ssllink = t.connectEnd - t.secureConnectionStart // SSL安全连接耗时

  times.redirect = t.redirectEnd - t.redirectStart // 重定向时间

  times.unloadTime = t.unloadEventEnd - t.unloadEventStart // 上一个页面的卸载耗时

  const resultInfo = { ...times, url: getLocationHref() }

  _support.firstScreen = { ...resultInfo }

  sendData.emit(
    normalizeObj({
      ...resultInfo,
      eventType: SEDNEVENTTYPES.PERFORMANCE,
      eventId: 'page'
    })
  )
}

/**
 * 页面资源加载性能数据
 */
function observeResource() {
  if (supported.performance && options.value.performance.firstResource) {
    observeNavigationTiming()
  }

  if (supported.performance && options.value.performance.core) {
    traceResourcePerformance(_global.performance)

    if (supported.PerformanceObserver) {
      // 监听异步资源加载性能数据 chrome≥52
      const observer = new PerformanceObserver(traceResourcePerformance)
      observer.observe({ entryTypes: ['resource'] })
    } else if (supported.MutationObserver) {
      // 监听资源、DOM更新操作记录 chrome≥26 ie≥11
      observeSourceInsert()
    }
  }
}

function initPerformance() {
  if (
    !options.value.performance.firstResource &&
    !options.value.performance.core
  )
    return

  // 初始化方法可能在onload事件之后才执行,此时不会触发load事件了 (例如delayInit)
  // 检查document.readyState属性来判断onload事件是否会被触发
  if (document.readyState === 'complete') {
    observeResource()
  } else {
    eventBus.addEvent({
      type: EVENTTYPES.LOAD,
      callback: () => {
        observeResource()
      }
    })
  }
}

/**
 * 主动触发性能事件上报
 * @param eventId 事件ID
 * @param options 自定义配置信息
 */
function handleSendPerformance(eventId: string, options: AnyObj) {
  const record = {
    triggerTime: getTimestamp(),
    url: getLocationHref(),
    eventId,
    eventType: SEDNEVENTTYPES.PERFORMANCE,
    ...options
  }
  sendData.emit(normalizeObj(record))
}

export { initPerformance, handleSendPerformance }
