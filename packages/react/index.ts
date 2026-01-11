import {
  useEffect,
  createContext,
  useContext,
  ReactNode,
  createElement
} from 'react'
import type { InitOptions } from '@web-tracing/core'
import * as WebTracingCore from '@web-tracing/core'

export type { InitOptions } from '@web-tracing/core'

export const init = WebTracingCore.init
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

const WebTracingContext = createContext<boolean>(false)

export interface WebTracingProviderProps {
  options: InitOptions
  children: ReactNode
}

export const WebTracingProvider = ({
  options,
  children
}: WebTracingProviderProps) => {
  useEffect(() => {
    WebTracingCore.init(options)
  }, [options])

  return createElement(WebTracingContext.Provider, { value: true }, children)
}

export const useWebTracing = () => {
  return useContext(WebTracingContext)
}
