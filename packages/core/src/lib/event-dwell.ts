import { uuid, isValidKey } from '../utils'
import { eventBus } from './eventBus'
import { EVENTTYPES } from '../common'
import { sendData } from './sendData'

class DwellRequestTemplate {
  eventId = '' // 事件ID
  eventType = '' // 事件类型
  url = '' // 当前页面URL
  referer = '' // 上级页面URL
  entryTime = -1 // 加载完成时间
  triggerTime = -1 // 卸载时间
  millisecond = -1 // 页面停留时间
  operateAction = '' // 页面加载来源
  constructor(config = {}) {
    Object.keys(config).forEach(key => {
      if (isValidKey(key, config)) {
        this[key] = config[key] || null
      }
    })
  }
}

/**
 * 加载 & 卸载事件
 */
function dwellCollector() {
  const _config = new DwellRequestTemplate({ eventType: 'dwell' })

  // 加载完成事件
  eventBus.addEvent({
    type: EVENTTYPES.LOAD,
    callback: () => {
      _config.entryTime = Date.now()
    }
  })

  // 卸载事件
  eventBus.addEvent({
    type: EVENTTYPES.BEFOREUNLOAD,
    callback: () => {
      _config.eventId = uuid()
      _config.url = window.location.href // 当前页面 url
      _config.referer = document.referrer // 上级页面 url(从哪个页面跳过来的就是上级页面)
      _config.triggerTime = Date.now() // 卸载时间
      _config.millisecond = Date.now() - _config.entryTime // 停留多久
      const mapping: Record<number, string> = {
        0: 'navigate', // 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
        1: 'reload', // 网页通过“重新加载”按钮或者location.reload()方法加载
        2: 'back_forward', // 网页通过“前进”或“后退”按钮加载
        255: 'reserved' // 任何其他来源的加载
      }
      const { type } = performance.navigation // 表示加载来源, type为 0,1,2,255
      _config.operateAction = mapping[type] || ''
      sendData.emit(_config, true)
    }
  })
}

function initEventDwell() {
  dwellCollector()
}

export { initEventDwell }
