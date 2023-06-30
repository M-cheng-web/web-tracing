import type { AnyObj } from '../types'
import { baseInfo } from './base'
import { sendData } from './sendData'
import { getLocationHref, getTimestamp } from '../utils'
import { _global } from '../utils/global'
import { options } from './options'
import { eventBus } from './eventBus'
import { EVENTTYPES, SEDNEVENTTYPES } from '../common'

let oldURL = getLocationHref()
let historyLength = _global.history.length

/**
 * 路由Pv采集
 *
 * 分为以下几种情况（sdk是兼容vue2以及vue3的，但可能有些部分是取了它们的一些特性的，可能会受到后续它们的更改的影响）
 *
 * 1. 针对普通 html
 *    1. window.history.pushState 时会触发 pushState
 *    2. window.history.replaceState 时其会触发 replaceState
 *    3. 手动 更改地址栏地址 时其触发顺序： popstate -> hashchange (history 模式手动更改地址会当做刷新页面，什么也不会触发)
 *
 * 2. 针对 vue2(vue-router)
 *    1. 手动 push 时其会触发 pushState (history、hash模式表现相同)
 *    2. 手动 repleace 时其会触发 replaceState (history、hash模式表现相同)
 *    3. 手动 更改地址栏地址 时其触发顺序： popstate -> hashchange (history 模式手动更改地址会当做刷新页面，什么也不会触发)
 *
 * 3. 针对 vue3(vue-router)
 *    1. 手动 push 时其触发顺序： replaceState -> pushState (history、hash模式表现相同)
 *    2. 手动 repleace 时其会触发 replaceState (history、hash模式表现相同)
 *    3. 手动 更改地址栏地址 时其触发顺序： replaceState -> popstate -> hashchange (history 模式仅触发 replaceState)
 */
function initPv() {
  if (!options.value.pv.core) return

  let lastIsPop = false // 最后一次触发路由变化是否为popState触发
  let repetitionRoute = false // 在触发 replaceState 后 100ms 内的 pushState 会被无效记录

  sendPageView({ url: oldURL, referer: document.referrer }) // 首次进入记录url变化

  eventBus.addEvent({
    type: EVENTTYPES.HISTORYPUSHSTATE,
    callback: (...args) => {
      console.log('history-pushState', repetitionRoute, args)
      if (repetitionRoute) return
      lastIsPop = false
      sendPageView({ actions: 'navigation', referer: getLocationHref() })
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.HISTORYREPLACESTATE,
    callback: (...args) => {
      console.log('history-replaceState', args)
      repetitionRoute = true
      lastIsPop = false
      sendPageView({ actions: 'navigation', referer: getLocationHref() })
      setTimeout(() => {
        repetitionRoute = false
      }, 100)
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.HASHCHANGE,
    callback: (...args) => {
      console.log('hashchange', args)
      if (repetitionRoute) return
      if (options.value.pv.hashtag && !lastIsPop) sendPageView()
      lastIsPop = false
    }
  })

  // hash变化也会触发 popstate 事件,而且会先触发popstate事件
  // 可以使用popstate来代替hashchange(需要支持History H5 Api)
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
  eventBus.addEvent({
    type: EVENTTYPES.POPSTATE,
    callback: (...args) => {
      console.log('popstate', args)
      if (repetitionRoute) return
      if (_global.location.hash !== '') {
        const oldHost =
          oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
            ? oldURL.slice(0, oldURL.indexOf('#'))
            : oldURL
        if (
          _global.location.href.slice(0, _global.location.href.indexOf('#')) ===
            oldHost &&
          !options.value.pv.hashtag
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
        eventType: SEDNEVENTTYPES.PV,
        eventId: baseInfo.pageId,
        triggerPageUrl: url || getLocationHref(),
        referer,
        params,
        title: option.title || document.title,
        action,
        triggerTime: getTimestamp()
      })
    },
    option.title ? 0 : 17
  )
  oldURL = url || getLocationHref()
  historyLength = _global.history.length
}

/**
 * 手动发送数据
 * @param options 自定义配置信息
 */
function handleSendPageView(options: AnyObj = {}) {
  setTimeout(
    () => {
      sendData.emit({
        ...options,
        eventType: SEDNEVENTTYPES.PV,
        eventId: baseInfo.pageId,
        triggerPageUrl: getLocationHref(),
        triggerTime: getTimestamp(),
        title: options.title || document.title,
        referer: oldURL
      })
    },
    options.title ? 0 : 17
  )
}

export { initPv, handleSendPageView }
