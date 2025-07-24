import { _support, _global } from '../utils/global'
import { refreshSession } from '../utils/session'
import { LocalStorageUtil } from '../utils/localStorage'
import {
  sendByBeacon,
  sendByImage,
  sendByXML,
  nextTime,
  map,
  typeofAny,
  randomBoolean,
  getTimestamp,
  isObjectOverSizeLimit
} from '../utils'
import { debug, logError } from '../utils/debug'
import { baseInfo } from './base'
import { options } from './options'
import { AnyObj } from '../types'
import { isFlase, isArray } from '../utils/is'
import { SDK_LOCAL_KEY } from '../common/config'
import { executeFunctions } from '../utils'
import { computed } from '../observer'

export class SendData {
  private events: AnyObj[] = [] // 批次队列
  private timeoutID: NodeJS.Timeout | undefined // 延迟发送ID
  private isServerAvailable = true // 接口是否可用
  private retryTimer: NodeJS.Timeout | undefined // 重试定时器

  /**
   * 发送事件列表
   */
  private send() {
    if (!this.events.length) return
    if (!this.isServerAvailable) return // 接口异常时暂停上报

    // 选取首部的部分数据来发送,performance会一次性采集大量数据追加到events中
    const sendEvents = this.events.slice(0, options.value.cacheMaxLength) // 需要发送的事件
    this.events = this.events.slice(options.value.cacheMaxLength) // 剩下待发的事件

    const time = getTimestamp()
    const sendParams = computed(() => ({
      baseInfo: {
        ...baseInfo.base?.value,
        sendTime: time,
        userUuid: options.value.userUuid
      },
      eventInfo: map(sendEvents, (e: any) => {
        e.sendTime = time
        return e
      })
    }))

    // 本地化拦截
    if (options.value.localization) {
      const success = LocalStorageUtil.setSendDataItem(
        SDK_LOCAL_KEY,
        sendParams.value
      )
      if (!success) options.value.localizationOverFlow(sendParams.value)
      return
    }

    const afterSendParams = executeFunctions(
      options.value.beforeSendData,
      false,
      sendParams.value
    )
    if (isFlase(afterSendParams)) return
    if (!this.validateObject(afterSendParams, 'beforeSendData')) return

    debug('send events', sendParams.value)

    this.executeSend(options.value.dsn, afterSendParams).then((res: any) => {
      if (res.success === false) {
        this.handleServerError()
      } else {
        this.isServerAvailable = true
        executeFunctions(options.value.afterSendData, true, {
          ...res,
          params: afterSendParams
        })
      }
    })

    // 如果一次性发生的事件超过了阈值(cacheMaxLength)，那么这些经过裁剪的事件列表剩下的会直接发，并不会延迟等到下一个队列
    if (this.events.length) {
      nextTime(this.send.bind(this)) // 继续传输剩余内容,在下一个时间择机传输
    }
  }

  private handleServerError() {
    this.isServerAvailable = false
    // 定时重试，直到接口恢复
    if (this.retryTimer) clearTimeout(this.retryTimer)
    if (options.value.checkRecoverInterval === -1) return
    const interval = (options.value.checkRecoverInterval ?? 1) * 60 * 1000;
    this.retryTimer = setTimeout(() => {
      this.testServerAvailable()
    }, interval)
  }

  private testServerAvailable() {
    // 尝试发送一个空包检测接口是否恢复
    sendByXML(options.value.dsn, { ping: 1 }, options.value.timeout).then(() => {
      this.isServerAvailable = true
      if (this.retryTimer) clearTimeout(this.retryTimer)
      // 恢复上报
      if (this.events.length) this.send()
    }).catch(() => {
      this.handleServerError()
    })
  }

  /**
   * 发送本地事件列表
   * @param e 需要发送的事件信息
   */
  public sendLocal(e: AnyObj) {
    const afterSendParams = executeFunctions(
      options.value.beforeSendData,
      false,
      e
    )
    if (isFlase(afterSendParams)) return
    if (!this.validateObject(afterSendParams, 'beforeSendData')) return

    debug('send events', afterSendParams)

    this.executeSend(options.value.dsn, afterSendParams)
  }
  /**
   * 记录需要发送的埋点数据
   * @param e 需要发送的事件信息
   * @param flush 是否立即发送
   */
  public emit(e: AnyObj, flush = false) {
    if (!e) return
    if (!_support.lineStatus.onLine) return
    if (!flush && !randomBoolean(options.value.tracesSampleRate)) return
    if (!isArray(e)) e = [e]

    // 如果接口异常，且队列已达最大缓存数，则丢弃旧日志，保留最新日志
    const maxQueueLength = options.value.maxQueueLength ?? 200;
    if (!this.isServerAvailable && this.events.length >= maxQueueLength) {
      // 丢弃最旧的日志，保留最新日志
      this.events = this.events.slice(this.events.length - maxQueueLength + e.length).concat(e)
      return
    }

    const eventList = executeFunctions(
      options.value.beforePushEventList,
      false,
      e
    )

    if (isFlase(eventList)) return
    if (!this.validateObject(eventList, 'beforePushEventList')) return

    this.events = this.events.concat(eventList)
    refreshSession()
    // debug('receive event, waiting to send', e)
    if (this.timeoutID) clearTimeout(this.timeoutID)

    // 如果基础信息还未初始化完成，则等待完成后上报
    if (!baseInfo._initSuccess) {
      return
    }

    // 满足最大记录数,立即发送,否则定时发送
    if (this.events.length >= options.value.cacheMaxLength || flush) {
      this.send()
    } else {
      this.timeoutID = setTimeout(
        this.send.bind(this),
        options.value.cacheWatingTime
      )
    }
  }
  /**
   * 发送数据
   * @param url 目标地址
   * @param data 附带参数
   */
  private executeSend(url: string, data: any) {
    let sendType = 1
    if (options.value.sendTypeByXmlBody) {
      // 强制指定 xml body 形式
      sendType = 3
    } else if (_global.navigator) {
      // sendBeacon 最大64kb
      sendType = isObjectOverSizeLimit(data, 60) ? 3 : 1
    } else {
      // img 限制在 2kb
      sendType = isObjectOverSizeLimit(data, 2) ? 3 : 2
    }

    return new Promise(resolve => {
      switch (sendType) {
        case 1:
          resolve({ sendType: 'sendBeacon', success: sendByBeacon(url, data) })
          break
        case 2:
          sendByImage(url, data).then(() => {
            resolve({ sendType: 'image', success: true })
          }).catch(() => {
            resolve({ sendType: 'image', success: false })
          })
          break
        case 3:
          sendByXML(url, data, options.value.timeout).then(() => {
            resolve({ sendType: 'xml', success: true })
          }).catch(() => {
            resolve({ sendType: 'xml', success: false })
          })
          break
      }
    })
  }
  /**
   * 验证选项的类型 - 只验证是否为 {} []
   * 返回 false意思是取消放入队列 / 取消发送
   */
  private validateObject(target: any, targetName: string): boolean | void {
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

  /**
   * 销毁定时器和队列
   */
  public destroy() {
    if (this.timeoutID) clearTimeout(this.timeoutID)
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.events = []
    this.isServerAvailable = true
  }
}

export let sendData: SendData

export function initSendData() {
  _support.sendData = new SendData()
  sendData = _support.sendData
}
