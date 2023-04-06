import type { Options } from '../types'
import { _support } from '../utils/global'
import { refreshSession } from '../utils/session'
import { sendBeacon, nextTime, map } from '../utils/index'
import { debug } from '../utils/debug'
import { baseInfo } from './base'

export class SendData {
  dsn = '' // 服务请求地址
  events = [] // 批次队列
  cacheMaxLength: number
  cacheWatingTime: number
  timeoutID: NodeJS.Timeout | null = null // 延迟发送

  constructor(options: Options) {
    this.dsn = options.dsn
    this.cacheMaxLength = options.cacheMaxLength
    this.cacheWatingTime = options.cacheWatingTime
  }
  send() {
    if (!this.events.length) return
    // 选取首部的部分数据来发送,performance会一次性采集大量数据追加到events中
    const sendEvents = this.events.slice(0, this.cacheMaxLength) // 需要发送的事件
    this.events = this.events.slice(this.cacheMaxLength) // 剩下待发的事件
    debug('send events', sendEvents)

    const time = Date.now()
    sendBeacon(this.dsn, {
      baseInfo: { ...baseInfo.base, sendTime: time },
      eventInfo: map(sendEvents, (e: any) => {
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
    if (this.events.length) nextTime(this.send) // 继续传输剩余内容,在下一个时间择机传输
  }
  /**
   * 记录需要发送的埋点数据
   * @param {*} e 需要发送的事件信息
   * @param {boolean} flush 是否立即发送
   */
  emit(e: any, flush = false) {
    this.events = this.events.concat(e) // 追加到事件队列里
    refreshSession()
    debug('receive event, waiting to send', e)
    if (this.timeoutID) clearTimeout(this.timeoutID)

    // 满足最大记录数,立即发送,否则定时发送(flush为true代表立即发送)
    this.events.length >= this.cacheMaxLength || flush
      ? this.send()
      : (this.timeoutID = setTimeout(() => {
          this.send()
        }, this.cacheWatingTime))
  }
}

export let sendData: SendData

export function initSendData(options: any) {
  _support.sendData = new SendData(options)
  sendData = _support.sendData
}
