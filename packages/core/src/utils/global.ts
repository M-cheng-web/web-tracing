import { isWindow } from './is'
import { WebTracing } from '../types'

export const isBrowserEnv = isWindow(typeof window !== 'undefined' ? window : 0)

/**
 * 获取全局变量
 */
export function getGlobal() {
  if (isBrowserEnv) return window
  return {} as any
}

const _global = getGlobal()
const _support = getGlobalSupport()

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

export { _global, _support }
