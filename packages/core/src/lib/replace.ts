import type { VoidFun } from '../types'
import { _global } from '../utils/global'
import {
  on,
  replaceAop,
  throttle,
  isValidKey,
  getTimestamp,
  off
} from '../utils'
import { EVENTTYPES } from '../common'
import { eventBus } from './eventBus'

// 存储原始方法，用于恢复
const originalMethods = {
  consoleError: null as any,
  xhrOpen: null as any,
  xhrSend: null as any,
  fetch: null as any,
  historyPushState: null as any,
  historyReplaceState: null as any
}

// 存储事件监听器引用，用于移除
const eventListeners = {
  error: null as any,
  unhandledrejection: null as any,
  click: null as any,
  load: null as any,
  beforeunload: null as any,
  hashchange: null as any,
  popstate: null as any,
  offline: null as any,
  online: null as any
}

/**
 * 根据入参初始化 重写、监听
 *
 * 定义一个产出模块
 * 其注册所有模块所需要的 - 监听，改写
 * 当那些模块要用的时候，去产出模块那数据，这个模块的数据不应该有业务数据
 * 只负责去采集数据，具体怎么拿是业务模块需要去分辨的，采集哪些数据是注册的时候决定的
 * 只会管兼容性问题，不兼容的api就不做动作
 * 这样就不需要所有的模块都要init了，之后需要init的模块，可以专门去做模块内的事
 * 注意这里面耦合性不能太高，不要抽了还不如不抽，做到模块内改了代码不需要去另外个文件再改
 */
export function initReplace(): void {
  for (const key in EVENTTYPES) {
    if (isValidKey(key, EVENTTYPES)) {
      replace(key)
    }
  }
}

function replace(type: EVENTTYPES): void {
  if (!isValidKey(type, EVENTTYPES)) return

  const value = EVENTTYPES[type]
  // debug('replace-初始化挂载事件:', value)
  switch (value) {
    case EVENTTYPES.ERROR:
      listenError(EVENTTYPES.ERROR)
      break
    case EVENTTYPES.UNHANDLEDREJECTION:
      listenUnhandledrejection(EVENTTYPES.UNHANDLEDREJECTION)
      break
    case EVENTTYPES.CONSOLEERROR:
      replaceConsoleError(EVENTTYPES.CONSOLEERROR)
      break
    case EVENTTYPES.CLICK:
      listenClick(EVENTTYPES.CLICK)
      break
    case EVENTTYPES.LOAD:
      listenLoad(EVENTTYPES.LOAD)
      break
    case EVENTTYPES.BEFOREUNLOAD:
      listenBeforeunload(EVENTTYPES.BEFOREUNLOAD)
      break
    case EVENTTYPES.XHROPEN:
      replaceXHROpen(EVENTTYPES.XHROPEN)
      break
    case EVENTTYPES.XHRSEND:
      replaceXHRSend(EVENTTYPES.XHRSEND)
      break
    case EVENTTYPES.FETCH:
      replaceFetch(EVENTTYPES.FETCH)
      break
    case EVENTTYPES.HASHCHANGE:
      listenHashchange(EVENTTYPES.HASHCHANGE)
      break
    case EVENTTYPES.HISTORYPUSHSTATE:
      replaceHistoryPushState(EVENTTYPES.HISTORYPUSHSTATE)
      break
    case EVENTTYPES.HISTORYREPLACESTATE:
      replaceHistoryReplaceState(EVENTTYPES.HISTORYREPLACESTATE)
      break
    case EVENTTYPES.POPSTATE:
      listenPopState(EVENTTYPES.POPSTATE)
      break
    case EVENTTYPES.OFFLINE:
      listenOffline(EVENTTYPES.OFFLINE)
      break
    case EVENTTYPES.ONLINE:
      listenOnline(EVENTTYPES.ONLINE)
      break

    default:
      break
  }
}

/**
 * 监听 - error
 */
function listenError(type: EVENTTYPES): void {
  const errorHandler = function (e: ErrorEvent) {
    eventBus.runEvent(type, e)
  }
  eventListeners.error = errorHandler
  on(_global, 'error', errorHandler, true)
}
/**
 * 监听 - unhandledrejection（promise异常）
 */
function listenUnhandledrejection(type: EVENTTYPES): void {
  const rejectionHandler = function (ev: PromiseRejectionEvent) {
    eventBus.runEvent(type, ev)
  }
  eventListeners.unhandledrejection = rejectionHandler
  on(_global, 'unhandledrejection', rejectionHandler)
}
/**
 * 重写 - console.error
 */
function replaceConsoleError(type: EVENTTYPES): void {
  originalMethods.consoleError = console.error
  replaceAop(console, 'error', (originalError: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      if (
        !(args[0] && args[0].slice && args[0].slice(0, 12) === '@web-tracing')
      ) {
        eventBus.runEvent(type, args)
      }
      originalError.apply(this, args)
    }
  })
}
/**
 * 监听 - click
 */
function listenClick(type: EVENTTYPES): void {
  if (!('document' in _global)) return
  const clickThrottle = throttle(eventBus.runEvent, 100, true)
  const clickHandler = function (this: any, e: MouseEvent) {
    clickThrottle.call(eventBus, type, e)
  }
  eventListeners.click = clickHandler
  on(_global.document, 'click', clickHandler, true)
}
/**
 * 监听 - load
 */
function listenLoad(type: EVENTTYPES): void {
  const loadHandler = function (e: Event) {
    eventBus.runEvent(type, e)
  }
  eventListeners.load = loadHandler
  on(_global, 'load', loadHandler, true)
}
/**
 * 监听 - beforeunload
 */
function listenBeforeunload(type: EVENTTYPES): void {
  const beforeunloadHandler = function (e: BeforeUnloadEvent) {
    eventBus.runEvent(type, e)
  }
  eventListeners.beforeunload = beforeunloadHandler
  on(_global, 'beforeunload', beforeunloadHandler, false)
}
/**
 * 重写 - XHR-open
 */
function replaceXHROpen(type: EVENTTYPES): void {
  if (!('XMLHttpRequest' in _global)) return
  originalMethods.xhrOpen = XMLHttpRequest.prototype.open
  replaceAop(XMLHttpRequest.prototype, 'open', (originalOpen: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args)
      originalOpen.apply(this, args)
    }
  })
}
/**
 * 重写 - XHR-send
 */
function replaceXHRSend(type: EVENTTYPES): void {
  if (!('XMLHttpRequest' in _global)) return
  originalMethods.xhrSend = XMLHttpRequest.prototype.send
  replaceAop(XMLHttpRequest.prototype, 'send', (originalSend: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, this, ...args)
      originalSend.apply(this, args)
    }
  })
}
/**
 * 重写 - fetch
 */
function replaceFetch(type: EVENTTYPES): void {
  if (!('fetch' in _global)) return
  originalMethods.fetch = _global.fetch
  replaceAop(_global, 'fetch', originalFetch => {
    return function (this: any, ...args: any[]): void {
      const fetchStart = getTimestamp()
      const traceObj = {}
      return originalFetch.apply(_global, args).then((res: any) => {
        eventBus.runEvent(type, args[0], args[1], res, fetchStart, traceObj)
        return res
      })
    }
  })
}
/**
 * 监听 - hashchange
 */
function listenHashchange(type: EVENTTYPES): void {
  const hashchangeHandler = function (e: HashChangeEvent) {
    eventBus.runEvent(type, e)
  }
  eventListeners.hashchange = hashchangeHandler
  on(_global, 'hashchange', hashchangeHandler)
}
/**
 * 重写 - history-replaceState
 */
function replaceHistoryReplaceState(type: EVENTTYPES): void {
  originalMethods.historyReplaceState = history.replaceState
  replaceAop(history, 'replaceState', (originalReplaceState: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args)
      originalReplaceState.apply(this, args)
    }
  })
}
/**
 * 重写 - history-pushState
 */
function replaceHistoryPushState(type: EVENTTYPES): void {
  originalMethods.historyPushState = history.pushState
  replaceAop(history, 'pushState', (originalPushState: VoidFun) => {
    return function (this: any, ...args: any[]): void {
      eventBus.runEvent(type, ...args)
      originalPushState.apply(this, args)
    }
  })
}
/**
 * 监听 - popstate
 */
function listenPopState(type: EVENTTYPES): void {
  const popstateHandler = function (e: PopStateEvent) {
    eventBus.runEvent(type, e)
  }
  eventListeners.popstate = popstateHandler
  on(_global, 'popstate', popstateHandler)
}

/**
 * 监听 - offline 网络是否关闭
 */
function listenOffline(type: EVENTTYPES): void {
  const offlineHandler = function (e: Event) {
    eventBus.runEvent(type, e)
  }
  eventListeners.offline = offlineHandler
  on(_global, 'offline', offlineHandler)
}
/**
 * 监听 - online 网络是否开启
 */
function listenOnline(type: EVENTTYPES): void {
  const offlineHandler = function (e: Event) {
    eventBus.runEvent(type, e)
  }
  eventListeners.offline = offlineHandler
  on(_global, 'offline', offlineHandler)
}

/**
 * 销毁所有重写和监听
 */
export function destroyReplace(): void {
  // 恢复 console.error
  if (
    originalMethods.consoleError &&
    console.error !== originalMethods.consoleError
  ) {
    console.error = originalMethods.consoleError
  }

  // 恢复 XMLHttpRequest
  if (
    originalMethods.xhrOpen &&
    XMLHttpRequest.prototype.open !== originalMethods.xhrOpen
  ) {
    XMLHttpRequest.prototype.open = originalMethods.xhrOpen
  }
  if (
    originalMethods.xhrSend &&
    XMLHttpRequest.prototype.send !== originalMethods.xhrSend
  ) {
    XMLHttpRequest.prototype.send = originalMethods.xhrSend
  }

  // 恢复 fetch
  if (originalMethods.fetch && _global.fetch !== originalMethods.fetch) {
    _global.fetch = originalMethods.fetch
  }

  // 恢复 history
  if (
    originalMethods.historyPushState &&
    history.pushState !== originalMethods.historyPushState
  ) {
    history.pushState = originalMethods.historyPushState
  }
  if (
    originalMethods.historyReplaceState &&
    history.replaceState !== originalMethods.historyReplaceState
  ) {
    history.replaceState = originalMethods.historyReplaceState
  }

  // 移除全局事件监听器
  if (eventListeners.error) {
    off(_global, 'error', eventListeners.error, true)
  }
  if (eventListeners.unhandledrejection) {
    off(_global, 'unhandledrejection', eventListeners.unhandledrejection)
  }
  if (eventListeners.click) {
    off(_global.document, 'click', eventListeners.click, true)
  }
  if (eventListeners.load) {
    off(_global, 'load', eventListeners.load, true)
  }
  if (eventListeners.beforeunload) {
    off(_global, 'beforeunload', eventListeners.beforeunload, false)
  }
  if (eventListeners.hashchange) {
    off(_global, 'hashchange', eventListeners.hashchange)
  }
  if (eventListeners.popstate) {
    off(_global, 'popstate', eventListeners.popstate)
  }
  if (eventListeners.offline) {
    off(_global, 'offline', eventListeners.offline)
  }
  if (eventListeners.online) {
    off(_global, 'online', eventListeners.online)
  }

  // 清空存储
  Object.keys(originalMethods).forEach(key => {
    ;(originalMethods as any)[key] = null
  })
  Object.keys(eventListeners).forEach(key => {
    ;(eventListeners as any)[key] = null
  })
}
