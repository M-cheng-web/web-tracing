/**
 * 这部分功能移植到 pv 中，并且默认开启
 */
import { EVENTTYPES, SEDNEVENTTYPES, WEBPAGELOAD } from '../common'
import { uuid, isValidKey, getTimestamp, getLocationHref } from '../utils'
import { eventBus } from './eventBus'
import { sendData } from './sendData'
import { options } from './options'

class DwellRequestTemplate {
  eventId = '' // 事件ID
  eventType = '' // 事件类型
  triggerPageUrl = '' // 当前页面URL
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
  const _config = new DwellRequestTemplate({ eventType: SEDNEVENTTYPES.DWELL })

  // 加载完成事件
  eventBus.addEvent({
    type: EVENTTYPES.LOAD,
    callback: () => {
      _config.entryTime = getTimestamp()
    }
  })

  // 卸载事件
  eventBus.addEvent({
    type: EVENTTYPES.BEFOREUNLOAD,
    callback: () => {
      _config.eventId = uuid()
      _config.triggerPageUrl = getLocationHref() // 当前页面 url
      _config.referer = document.referrer // 上级页面 url(从哪个页面跳过来的就是上级页面)
      _config.triggerTime = getTimestamp() // 卸载时间
      _config.millisecond = getTimestamp() - _config.entryTime // 停留多久
      const { type } = performance.navigation // 表示加载来源, type为 0,1,2,255
      _config.operateAction = WEBPAGELOAD[type] || ''
      sendData.emit(_config, true)
    }
  })
}

function initEventDwell() {
  // options.value.event.unload && dwellCollector() // 放弃此方法
}

export { initEventDwell }
