import type { AnyObj } from '../types'
import { baseInfo } from './base'
import { sendData } from './sendData'
import { getLocationHref, getTimestamp } from '../utils'
import { _global } from '../utils/global'
import { options } from './options'
import { eventBus } from './eventBus'
import { EVENTTYPES, SEDNEVENTTYPES, WEBPAGELOAD } from '../common'

let oldURL = getLocationHref()

/**
 * 路由Pv采集
 *
 * 分为以下几种情况（sdk是兼容vue2以及vue3的，但可能有些部分是取了它们的一些特性的，可能会受到后续它们的更改的影响）
 * 针对 history/hash 以及 刷新页面/初始加载 的情况获取到的数据进行说明
 *
 * 1. 针对普通 html
 *    1. 初始化项目：不触发这里的钩子，只会触发首次进入页面方法(referer=''、action=navigation)
 *    2. 手动刷新当前页：不触发这里的钩子，只会触发首次进入页面方法(referer=''、action=reload)
 *    3. window.history.pushState 时会触发 pushState
 *    4. window.history.replaceState 时其会触发 replaceState
 *    5. 手动 更改地址栏地址(或者window.location.href) 时其触发顺序： popstate -> hashchange (history 模式手动更改地址会视为初始化项目)
 *
 * 2. 针对 vue2(vue-router)
 *    1. 手动刷新当前页
 *       1. history模式：不触发这里的钩子，只会触发首次进入页面方法(referer=''、action=reload)
 *       2. hash模式：触发首次进入页面的方法(referer=''、action=reload) + replaceState 钩子(referer字段与triggerPageUrl字段相同)
 *    2. 初始化项目
 *       1. history模式：不触发这里的钩子，只会触发首次进入页面方法(referer=''、action=navigation)
 *       2. hash模式：触发首次进入页面的方法(action=reload；referer字段为网址根路径) + replaceState 钩子(action=navigation；referer字段与triggerPageUrl字段相同)
 *    3. push 时其会触发 pushState (history、hash模式表现相同)
 *    4. repleace 时其会触发 replaceState (history、hash模式表现相同)
 *    5. 更改地址栏地址 时其触发顺序： popstate -> hashchange (history 模式手动更改地址会当做刷新页面，什么也不会触发)
 *    6. 浏览器回退：popstate -> hashchange (history模式只触发 popstate)
 *
 * 3. 针对 vue3(vue-router)
 *    1. 手动刷新当前页
 *       1. history模式：触发首次进入页面的方法(action=reload；referer字段为空) + replaceState 钩子(action=navigation；referer字段与triggerPageUrl字段相同)
 *       2. hash模式：触发首次进入页面的方法(action=reload；referer字段为空) + replaceState 钩子(action=navigation；referer字段与triggerPageUrl字段相同)
 *    2. 初始化项目
 *       1. history模式：触发首次进入页面的方法(action=navigation；referer字段为空) + replaceState 钩子(action=navigation；referer字段与triggerPageUrl字段相同)
 *       2. hash模式：触发首次进入页面的方法(action=navigation；referer字段为空) + replaceState 钩子(action=navigation；referer字段与triggerPageUrl字段相同)
 *    3. push 时其触发顺序： replaceState -> pushState (history、hash模式表现相同)
 *    4. repleace 时其会触发 replaceState (history、hash模式表现相同)
 *    5. 更改地址栏地址 时其触发顺序： replaceState -> popstate -> hashchange (history 模式仅触发 replaceState)
 *    6. 浏览器回退：popstate -> hashchange (history模式只触发 popstate)
 */
function initPv() {
  if (!options.value.pv.core) return

  let lastIsPop = false // 最后一次触发路由变化是否为popState触发
  let repetitionRoute = false // 在触发 replaceState 后 100ms 内的 pushState 会被无效记录

  sendPageView({ referer: document.referrer }) // 首次进入记录url变化

  eventBus.addEvent({
    type: EVENTTYPES.HISTORYPUSHSTATE,
    callback: () => {
      if (repetitionRoute) return
      lastIsPop = false
      sendPageView({ action: 'navigation' })
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.HISTORYREPLACESTATE,
    callback: () => {
      repetitionRoute = true
      lastIsPop = false
      sendPageView({ action: 'navigation' })
      setTimeout(() => {
        repetitionRoute = false
      }, 100)
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.HASHCHANGE,
    callback: () => {
      if (repetitionRoute) return
      if (!lastIsPop) sendPageView()
      lastIsPop = false
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.POPSTATE,
    callback: () => {
      if (repetitionRoute) return
      if (_global.location.hash !== '') {
        const oldHost =
          oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
            ? oldURL.slice(0, oldURL.indexOf('#'))
            : oldURL
        if (
          _global.location.href.slice(0, _global.location.href.indexOf('#')) ===
          oldHost
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
  const { referer = oldURL, action, params, title } = option
  let _action = action
  if (!_action) {
    _action = WEBPAGELOAD[performance.navigation.type] || ''
  }

  // 如果option.title为空,则等待框架处理document.title,延迟17ms
  // 为什么是17ms?  一秒60Hz是基准,平均1Hz是17毫秒,只要出来了页面那就有 document.title
  setTimeout(
    () => {
      oldURL = getLocationHref()

      sendData.emit({
        eventType: SEDNEVENTTYPES.PV,
        eventId: baseInfo.pageId,
        triggerPageUrl: getLocationHref(),
        referer,
        params,
        title: title || document.title,
        action: _action,
        triggerTime: getTimestamp()
      })
    },
    title ? 0 : 17
  )
}

/**
 * 手动发送数据
 * @param options 自定义配置信息
 */
function handleSendPageView(options: AnyObj = {}) {
  setTimeout(
    () => {
      sendData.emit({
        referer: oldURL,
        title: document.title,
        ...options,
        eventType: SEDNEVENTTYPES.PV,
        eventId: baseInfo.pageId,
        triggerPageUrl: getLocationHref(),
        triggerTime: getTimestamp()
      })
    },
    options.title ? 0 : 17
  )
}

export { initPv, handleSendPageView }
