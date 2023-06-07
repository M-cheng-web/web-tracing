import type { InitOptions } from './src/types'
import { initReplace } from './src/lib/replace'
import { initOptions } from './src/lib/options'
import { initBase } from './src/lib/base'
import { initSendData } from './src/lib/sendData'
import { initLineStatus } from './src/lib/line-status'
import { initError } from './src/lib/err'
import { initEvent } from './src/lib/event'
import { initEventDwell } from './src/lib/event-dwell'
import { initHttp } from './src/lib/http'
import { initPerformance } from './src/lib/performance'
import { initPv } from './src/lib/pv'
import { initIntersection } from './src/lib/intersectionObserver'
import { _global } from './src/utils/global'
import { logError } from './src/utils/debug'
import { initRecordScreen } from './src/lib/recordscreen'
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
  initEventDwell()
  initHttp()
  initPerformance()
  initPv()
  initIntersection()
  initRecordScreen()

  _global.__webTracingInit__ = true
}

export { init, InitOptions, logError }
export * from './src/lib/exportMethods'
export default { init, ...exportMethods }
