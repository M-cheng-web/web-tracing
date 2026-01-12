import { addPluginTemplate, defineNuxtModule } from '@nuxt/kit'
import * as WebTracingCore from '@web-tracing/core'
import type { InitOptions } from '@web-tracing/core'

// Polyfill requestAnimationFrame for SSR
if (typeof global !== 'undefined' && !global.requestAnimationFrame) {
  ;(global as any).requestAnimationFrame = (callback: any) =>
    setTimeout(callback, 0)
}
if (typeof global !== 'undefined' && !global.cancelAnimationFrame) {
  ;(global as any).cancelAnimationFrame = (id: any) => clearTimeout(id)
}
if (typeof global !== 'undefined' && !global.window) {
  ;(global as any).window = global
}

export type ModuleOptions = InitOptions

function toJS(value: any): string {
  if (value === null) return 'null'

  const type = typeof value
  if (type === 'string') return JSON.stringify(value)
  if (type === 'number' || type === 'boolean') return String(value)
  if (type === 'undefined') return 'undefined'
  if (type === 'function') return value.toString()

  if (value instanceof RegExp) return value.toString()
  if (Array.isArray(value)) return `[${value.map(toJS).join(',')}]`

  if (type === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined)
    return `{${entries
      .map(([k, v]) => `${JSON.stringify(k)}:${toJS(v)}`)
      .join(',')}}`
  }

  return 'undefined'
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@web-tracing/nuxt',
    configKey: 'webTracing'
  },
  defaults: {} as ModuleOptions,
  setup(options: ModuleOptions, nuxt: any) {
    addPluginTemplate({
      filename: 'web-tracing.client.ts',
      getContents: () => {
        return [
          'import { defineNuxtPlugin } from "#app";',
          'import { init } from "@web-tracing/core";',
          '',
          `const options = ${toJS(options)};`,
          '',
          'export default defineNuxtPlugin(() => {',
          '  init(options);',
          '});',
          ''
        ].join('\n')
      }
    })
  }
}) as any

export * from '@web-tracing/core'

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
