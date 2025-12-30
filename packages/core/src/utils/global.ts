import { isWindow } from './is'
import { WebTracing } from '../types'

/**
 * 是否为浏览器环境
 */
export const isBrowserEnv = isWindow(typeof window !== 'undefined' ? window : 0)

/**
 * 是否为 electron 环境
 */
export const isElectronEnv =
  typeof window !== 'undefined' && !!(window as any).process?.versions?.electron

/**
 * 是否为测试环境
 */
export const isTestEnv =
  (typeof navigator !== 'undefined' && navigator.userAgent.includes('jsdom')) ||
  // @ts-expect-error: jsdom
  (typeof window !== 'undefined' && window.jsdom)

/**
 * 获取全局变量
 */
export function getGlobal(): Window {
  if (isBrowserEnv || isElectronEnv || isTestEnv) return window
  return {} as Window
}

/**
 * 获取全部变量 __webTracing__ 的引用地址
 */
export function getGlobalSupport(): WebTracing {
  _global.__webTracing__ = _global.__webTracing__ || ({} as WebTracing)
  return _global.__webTracing__
}

/**
 * 判断sdk是否初始化
 * @returns sdk是否初始化
 */
export function isInit(): boolean {
  return !!_global.__webTracingInit__
}

const _global = getGlobal()
const _support = getGlobalSupport()

export { _global, _support }
