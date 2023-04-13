import type { AnyObj } from '../types'
import { baseInfo } from './base'
import { sendData } from './sendData'
import { getLocationHref } from '../utils'
import { _global } from '../utils/global'
import { options } from './options'
import { eventBus } from './eventBus'
import { EVENTTYPES } from '../common'
import { debug } from '../utils/debug'

let oldURL = getLocationHref() // 最后一次的url
let historyLength = _global.history.length

/**
 * 路由Pv采集
 */
function initPv() {
  if (!options.pv.core) return

  const referer = document.referrer // 获取是从哪个页面跳转来的
  let lastIsPop = false // 最后一次触发路由变化是否为popState触发

  sendPageView({ url: oldURL, referer }) // 首次进入记录url变化

  // hash路由 和 history路由是隔离开的，不会互相触发钩子

  eventBus.addEvent({
    type: EVENTTYPES.HISTORYPUSHSTATE,
    callback: () => {
      debug('pv-pushState')
      lastIsPop = false
      sendPageView({ actions: 'navigation' })
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.HISTORYREPLACESTATE,
    callback: () => {
      debug('pv-replaceState')
      lastIsPop = false
      sendPageView({ actions: 'navigation' })
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.HASHCHANGE,
    callback: () => {
      debug('pv-hashchange')
      lastIsPop = false
      if (options.pv.hashtag && !lastIsPop) sendPageView()
    }
  })

  // hash变化也会触发 popstate 事件,而且会先触发popstate事件
  // 可以使用popstate来代替hashchange(需要支持History H5 Api)
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
  eventBus.addEvent({
    type: EVENTTYPES.POPSTATE,
    callback: () => {
      debug('pv-popstate')
      if (_global.location.hash !== '') {
        const oldHost =
          oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
            ? oldURL.slice(0, oldURL.indexOf('#'))
            : oldURL
        if (
          _global.location.href.slice(0, _global.location.href.indexOf('#')) ===
            oldHost &&
          !options.pv.hashtag
        )
          return
      }
      lastIsPop = true
      sendPageView()
    }
  })
}

/**
 * 发送数据
 */
function sendPageView(option: AnyObj = {}) {
  const { url, referer = oldURL, actions = '', params } = option
  let action = actions
  if (!action && _global.history.length < 50) {
    action =
      historyLength === _global.history.length ? 'back_forward' : 'navigation'
    historyLength = _global.history.length
  }

  // 如果option.title为空,则等待框架处理document.title,延迟17ms
  // 为什么是17ms?  一秒60Hz是基准,平均1Hz是17毫秒,只要出来了页面那就有 document.title
  setTimeout(
    () => {
      sendData.emit({
        eventType: 'pv',
        eventId: baseInfo.pageId,
        url: url || getLocationHref(),
        referer,
        params,
        title: option.title || document.title,
        action,
        triggerTime: Date.now()
      })
    },
    option.title ? 0 : 17
  )
  oldURL = url || getLocationHref()
  historyLength = _global.history.length
}

/**
 * 手动发送数据
 */
function handleSendPageView(option: AnyObj = {}) {
  const {
    url = getLocationHref(),
    referer = oldURL,
    actions = '',
    params
  } = option
  // 如果option.title为空,则等待框架处理document.title,延迟17ms
  // 为什么是17ms?  一秒60Hz是基准,平均1Hz是17毫秒,只要出来了页面那就有 document.title
  setTimeout(
    () => {
      sendData.emit({
        eventType: 'pv',
        eventId: baseInfo.pageId,
        url,
        referer,
        params,
        title: option.title || document.title,
        action: actions,
        triggerTime: Date.now()
      })
    },
    option.title ? 0 : 17
  )
}

export { initPv, handleSendPageView }
