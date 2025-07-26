import type { InitOptions } from './src/types'
import { initReplace, destroyReplace } from './src/lib/replace'
import { initOptions, options as _options } from './src/lib/options'
import { initBase } from './src/lib/base'
import { initSendData, sendData } from './src/lib/sendData'
import { initLineStatus } from './src/lib/line-status'
import { initError, parseError, destroyError } from './src/lib/err'
import { initEvent, destroyEvent } from './src/lib/event'
import { initHttp, destroyHttp } from './src/lib/http'
import { initPerformance, destroyPerformance } from './src/lib/performance'
import { initPv, destroyPv } from './src/lib/pv'
import { initIntersection, destroyIntersection } from './src/lib/intersectionObserver'
import { _global } from './src/utils/global'
import { SENDID } from './src/common'
import { logError } from './src/utils/debug'
import { initRecordScreen, destroyRecordScreen } from './src/lib/recordscreen'
import * as exportMethods from './src/lib/exportMethods'
import './src/observer/index'

function init(options: InitOptions): void {
  if (_global.__webTracingInit__) return
  if (!initOptions(options)) return

  // 注册全局
  initReplace()
  initBase()
  initSendData()
  initLineStatus()

  // 注册各个业务
  initError()
  initEvent()
  initHttp()
  initPerformance()
  initPv()
  initIntersection()

  if (_options.value.recordScreen) initRecordScreen()

  _global.__webTracingInit__ = true
}

/**
 * 销毁SDK添加的事件监听器，不会影响用户手动添加的监听器
 */
function destroyTracing(): void {
  destroyEvent()
  destroyError()
  destroyHttp()
  destroyPerformance()
  destroyIntersection()
  destroyRecordScreen()
  destroyPv()
  destroyReplace()
  if (sendData) sendData.destroy()

  // 重置全局状态，确保重新初始化时能正常工作
  _global.__webTracingInit__ = false
}

export {
  init,
  destroyTracing,
  InitOptions,
  logError,
  parseError,
  SENDID,
  exportMethods,
  _options as options
}
export * from './src/lib/exportMethods'
export default { init, destroyTracing, ...exportMethods, options: _options }
