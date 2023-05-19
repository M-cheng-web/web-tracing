import { _support, _global } from '../utils/global'
import { refreshSession } from '../utils/session'
import { LocalStorageUtil } from '../utils/localStorage'
import {
  sendByBeacon,
  sendByImage,
  nextTime,
  map,
  typeofAny,
  randomBoolean
} from '../utils'
import { debug, logError } from '../utils/debug'
import { baseInfo } from './base'
import { options } from './options'
import { AnyObj } from '../types'
import { isFlase } from '../utils/is'
import { SDK_LOCAL_KEY } from '../common/config'
import { executeFunctions } from '../utils'

export class SendData {
  dsn = '' // 服务请求地址
  events: AnyObj[] = [] // 批次队列
  cacheMaxLength: number // 最大发送长度
  cacheWatingTime: number // 延迟发送时间
  timeoutID: NodeJS.Timeout | null = null // 延迟发送ID

  constructor() {
    this.dsn = options.dsn
    this.cacheMaxLength = options.cacheMaxLength
    this.cacheWatingTime = options.cacheWatingTime
  }
  /**
   * 发送事件集
   */
  send() {
    if (!this.events.length) return

    // 选取首部的部分数据来发送,performance会一次性采集大量数据追加到events中
    const sendEvents = this.events.slice(0, this.cacheMaxLength) // 需要发送的事件
    this.events = this.events.slice(this.cacheMaxLength) // 剩下待发的事件

    const time = Date.now()
    const sendParams = {
      baseInfo: {
        ...baseInfo.base,
        sendTime: time,
        userUuid: options.userUuid // 这个暂时这样，后面改成响应式就不需要在这覆盖最新值了
      },
      eventInfo: map(sendEvents, (e: any) => {
        e.sendTime = time // 设置发送时间

        // 补充type字段,将click、scroll、change、submit事件作为一类存储
        if (['click', 'scroll', 'submit', 'change'].includes(e.eventType)) {
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
    }

    // 本地化拦截
    if (options.localization) {
      LocalStorageUtil.setSendDataItem(SDK_LOCAL_KEY, sendParams)
      return
    }

    const afterSendParams = executeFunctions(
      options.beforeSendData,
      false,
      sendParams
    )
    if (isFlase(afterSendParams)) return
    if (!this._validateObject(afterSendParams, 'beforeSendData')) return

    debug('send events', sendParams)

    this._sendBeacon(this.dsn, afterSendParams).then((res: any) => {
      executeFunctions(options.afterSendData, true, {
        ...res,
        params: afterSendParams
      })
    })

    // 如果一次性发生的事件超过了阈值(cacheMaxLength)，那么这些经过裁剪的事件列表剩下的会直接发，并不会延迟等到下一个队列
    if (this.events.length) {
      nextTime(this.send.bind(this)) // 继续传输剩余内容,在下一个时间择机传输
    }
  }
  /**
   * 发送本地事件集
   * @param e 需要发送的事件信息
   */
  sendLocal(e: AnyObj) {
    const afterSendParams = executeFunctions(options.beforeSendData, false, e)
    if (isFlase(afterSendParams)) return
    if (!this._validateObject(afterSendParams, 'beforeSendData')) return

    debug('send events', afterSendParams)

    this._sendBeacon(this.dsn, afterSendParams)
  }
  /**
   * 记录需要发送的埋点数据
   * @param e 需要发送的事件信息
   * @param flush 是否立即发送
   */
  emit(e: AnyObj, flush = false) {
    if (!_support.lineStatus.onLine) return

    if (!flush && !randomBoolean(options.tracesSampleRate)) return

    const eventList = executeFunctions(options.beforePushEventList, false, e)

    if (isFlase(eventList)) return
    if (!this._validateObject(eventList, 'beforePushEventList')) return

    this.events = this.events.concat(eventList)
    refreshSession()
    debug('receive event, waiting to send', e)
    if (this.timeoutID) clearTimeout(this.timeoutID)

    // 满足最大记录数,立即发送,否则定时发送(flush为true代表立即发送)
    if (this.events.length >= this.cacheMaxLength || flush) {
      this.send()
    } else {
      this.timeoutID = setTimeout(this.send.bind(this), this.cacheWatingTime)
    }
  }
  /**
   * 发送数据
   * @param url 目标地址
   * @param data 附带参数
   */
  private _sendBeacon(url: string, data: any) {
    // const sendType: any = 2
    const sendType = _global.navigator ? 1 : 2
    return new Promise(resolve => {
      if (sendType === 1) {
        const res = sendByBeacon(url, data)
        resolve({ sendType: 'sendBeacon', success: res })
      } else {
        sendByImage(url, data).then(res => {
          resolve({ sendType: 'image', ...res })
        })
      }
    })
  }
  /**
   * 验证选项的类型 - 只验证是否为 {} []
   * 返回 false意思是取消放入队列 / 取消发送
   */
  private _validateObject(target: any, targetName: string): boolean | void {
    if (target === false) return false

    if (!target) {
      logError(`NullError: ${targetName}期望返回 {} 或者 [] 类型，目前无返回值`)
      return false
    }
    if (['object', 'array'].includes(typeofAny(target))) return true
    logError(
      `TypeError: ${targetName}期望返回 {} 或者 [] 类型，目前是${typeofAny(
        target
      )}类型`
    )
    return false
  }
}

export let sendData: SendData

export function initSendData() {
  _support.sendData = new SendData()
  sendData = _support.sendData
}
