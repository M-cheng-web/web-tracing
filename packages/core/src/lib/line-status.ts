import { _support } from '../utils/global'
import { EVENTTYPES } from '../common'
import { eventBus } from './eventBus'
import { debug } from '../utils/debug'

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

export function initLineStatus() {
  _support.lineStatus = new LineStatus()
  lineStatus = _support.lineStatus
}
