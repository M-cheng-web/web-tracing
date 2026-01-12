import * as WebTracingCore from '@web-tracing/core'
import { init, InitOptions } from '@web-tracing/core'

function install(app: any, options: InitOptions) {
  init(options)
}

export default { install }
export * from '@web-tracing/core'

export const destroyTracing = WebTracingCore.destroyTracing
export const options = WebTracingCore.options
export const traceError = WebTracingCore.traceError
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
export const logError = WebTracingCore.logError
export const parseError = WebTracingCore.parseError
export const SENDID = WebTracingCore.SENDID
