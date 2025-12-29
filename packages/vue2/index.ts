import * as WebTracingCore from '@web-tracing/core'
import {
  init,
  InitOptions,
  traceError,
  logError,
  parseError,
  SENDID
} from '@web-tracing/core'

function install(Vue: any, options: InitOptions) {
  const handler = Vue.config.errorHandler
  Vue.config.errorHandler = function (err: Error, vm: any, info: string): void {
    // const match = err.stack!.match(/(?<=http:\/\/.*:\d+\/).*:\d+:\d+/)
    // const position = match ? match[0] : ''
    // const line = position.split(':')[1] // 行
    // const col = position.split(':')[2] // 列
    // traceError({
    //   eventId: err.name,
    //   errMessage: err.message,
    //   line,
    //   col
    // })

    logError(err)
    const errorInfo = { eventId: SENDID.CODE, ...parseError(err) }
    traceError(errorInfo)
    if (handler) handler.apply(null, [err, vm, info])
  }
  init(options)
}

export default { install }
export * from '@web-tracing/core'

export const destroyTracing = WebTracingCore.destroyTracing
export const options = WebTracingCore.options
export const tracePerformance = WebTracingCore.tracePerformance
export const traceCustomEvent = WebTracingCore.traceCustomEvent
export const tracePageView = WebTracingCore.tracePageView
export const unzipRecordscreen = WebTracingCore.unzipRecordscreen
export const intersectionObserver = WebTracingCore.intersectionObserver
export const intersectionUnobserve = WebTracingCore.intersectionUnobserve
export const intersectionDisconnect = WebTracingCore.intersectionDisconnect
export const beforePushEventList = WebTracingCore.beforePushEventList
export const beforeSendData = WebTracingCore.beforeSendData
export const afterSendData = WebTracingCore.afterSendData
export const sendLocal = WebTracingCore.sendLocal
export const setLocalizationOverFlow = WebTracingCore.setLocalizationOverFlow
export const getFirstScreen = WebTracingCore.getFirstScreen
export const getIPs = WebTracingCore.getIPs
export const getOptions = WebTracingCore.getOptions
