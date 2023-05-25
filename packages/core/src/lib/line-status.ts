import { _support } from '../utils/global'
import { EVENTTYPES } from '../common'
import { eventBus } from './eventBus'
import { debug } from '../utils/debug'

/**
 * 监听网络状态
 * 当处于断网状态下的所有埋点事件都无效（认为此时采集的数据大部分是无效的）
 */
export class LineStatus {
  onLine = true
  constructor() {
    this.init()
  }
  init() {
    eventBus.addEvent({
      type: EVENTTYPES.OFFLINE,
      callback: e => {
        if (e.type === 'offline') {
          debug('网络断开')
          this.onLine = false
        }
      }
    })
    eventBus.addEvent({
      type: EVENTTYPES.ONLINE,
      callback: e => {
        if (e.type === 'online') {
          debug('网络连接')
          this.onLine = true
        }
      }
    })
  }
}

export let lineStatus: LineStatus

/**
 * 初始化网络监听
 */
export function initLineStatus() {
  _support.lineStatus = new LineStatus()
  lineStatus = _support.lineStatus
}
