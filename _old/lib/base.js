import { uuid, sendBeacon, map, nextTime } from '../utils/methods'
import device from '../utils/device'
import { getSessionId, refreshSession } from '../utils/session'
import { DEBUG_LOG, MAX_CACHE_LEN, MAX_WAITING_TIME } from '../utils/constant'
import { version } from '../../package.json'

// 当前应用ID,在整个页面生命周期内不变,单页应用路由变化也不会改变,加载SDK时创建,且只创建一次
const pageId = uuid()

// 与一般业务上理解的sessionId做区分,此session与业务无关,单纯就是浏览器端和后端直接的联系
const sessionId = getSessionId()

let requestUrl = '' // 服务请求地址
let events = [] // 批次队列
let timer = null // 定时发送定时器
const base = {
  // 基础数据
  ...device,
  pageId,
  sessionId,
  sdkVersion: version
}

/**
 * 初始化基础数据
 * @param {*} options 基础配置
 */
function init(options = {}) {
  const { appName, appCode, ext } = options
  requestUrl = options.requestUrl
  base.appName = appName
  base.appCode = appCode
  base.ext = ext
}

/**
 * 记录需要发送的埋点数据
 * @param {*} e 需要发送的事件信息
 * @param {boolean} flush 是否立即发送
 */
function emit(e, flush = false) {
  events = events.concat(e) // 追加到事件队列里
  refreshSession()
  debug('receive event, waiting to send', e)
  clearTimeout(timer)

  // 满足最大记录数,立即发送,否则定时发送(flush为true代表立即发送)
  events.length >= MAX_CACHE_LEN || flush
    ? send()
    : (timer = setTimeout(() => {
        send()
      }, MAX_WAITING_TIME))
}

/**
 * 发送埋点信息
 */
function send() {
  if (events.length) {
    // 选取首部的部分数据来发送,performance会一次性采集大量数据追加到events中
    const sendEvents = events.slice(0, MAX_CACHE_LEN) // 需要发送的事件
    events = events.slice(MAX_CACHE_LEN) // 剩下待发的事件
    debug('send events', sendEvents)

    const time = Date.now()
    sendBeacon(requestUrl, {
      baseInfo: { ...base, sendTime: time },
      eventInfo: map(sendEvents, e => {
        e.sendTime = time // 设置发送时间

        // 补充type字段,将click、scroll、change、submit事件作为一类存储
        if (
          e.eventType === 'click' ||
          e.eventType === 'scroll' ||
          e.eventType === 'submit' ||
          e.eventType === 'change'
        ) {
          e.type = 'mix'
          return e
        }

        if (e.eventType === 'performance') {
          // 将性能进行分类,不同类型的性能数据差异较大,分开存放,资源、页面、请求
          switch (e.eventId) {
            case 'resource':
              e.type = 'resourcePerformance'
              break
            case 'page':
              e.type = 'pagePerformance'
              break
            case 'server':
              e.type = 'serverPerformance'
              break
            default:
              break
          }
          return e
        }
        e.type = e.eventType // 其他类型type同eventType
        return e
      })
    })
    if (events.length) nextTime(send) // 继续传输剩余内容,在下一个时间择机传输
  }
}

/**
 * 设置额外的 customerId
 * @param {*} id 需要设置的id
 */
function setCustomerId(id) {
  base.customerId = id
}

/**
 * 设置额外的 userUuid
 * @param {*} id 需要设置的id
 */
function setUserUuid(id) {
  base.userUuid = id
}

/**
 * 控制台输出信息
 * @param  {...any} args 输出信息
 */
function debug(...args) {
  if (DEBUG_LOG) console.log(...args)
}

export { emit, debug, pageId }

export default {
  init,
  emit,
  pageId,
  setCustomerId,
  setUserUuid
}
