import type { AnyFun } from '../types'
import { options } from './options'
import { _support } from '../utils/global'
import { getIPs as _getIPs } from '../utils/getIps'
import { validateMethods } from '../utils'
import { handleSendError } from './err'
import { handleSendPerformance } from './performance'
import { handleSendEvent } from './event'
import { handleSendPageView } from './pv'

/**
 * 钩子：放入事件队列之前
 * @param fun 回调函数
 */
export function beforePushEventList(fun: AnyFun): void {
  if (!validateMethods('beforePushEventList')) return
  options.beforePushEventList.push(fun)
}

/**
 * 钩子：发送之前
 * @param fun 回调函数
 */
export function beforeSendData(fun: AnyFun): void {
  if (!validateMethods('beforeSendData')) return
  options.beforeSendData.push(fun)
}

/**
 * 钩子：发送之后
 * @param fun 回调函数
 */
export function afterSendData(fun: AnyFun): void {
  if (!validateMethods('afterSendData')) return
  options.afterSendData.push(fun)
}

/**
 * 设置用户id
 * @param id 用户id
 */
export function setUserUuid(id: string): void {
  if (!validateMethods('setUserUuid')) return
  options.userUuid = id
}

/**
 * 获取用户id（此id是手动设置的id）
 */
export function getUserUuid(): string | void {
  if (!validateMethods('getUserUuid')) return
  return options.userUuid
}

/**
 * 获取sdk中的用户id
 */
export function getSDKUserUuid(): string | void {
  if (!validateMethods('getSDKUserUuid')) return

  return options.sdkUserUuid
}

/**
 * 获取在sdk中记录的所有基础的信息（包括硬件，地理位置等等）
 */
export function getBaseInfo(): object | void {
  if (!validateMethods('getBaseInfo')) return

  return {
    ..._support.baseInfo.base,
    userUuid: options.userUuid
  }
}

/**
 * 获取首屏数据
 */
export function getFirstScreen(): object | void {
  if (!validateMethods('getFirstScreen')) return

  return { ..._support.firstScreen }
}

/**
 * 主动触发error类型事件
 * @param eventId 事件ID
 * @param message 错误信息
 * @param options 自定义配置信息
 */
export function traceError(eventId: string, message: string, options = {}) {
  if (!validateMethods('traceError')) return

  return handleSendError(eventId, message, options)
}

/**
 * 主动触发性能事件上报
 * @param eventId 事件ID
 * @param options 自定义配置信息
 */
export function tracePerformance(eventId: string, options = {}) {
  if (!validateMethods('tracePerformance')) return

  return handleSendPerformance(eventId, options)
}

/**
 * 主动触发事件上报
 * @param eventId 事件ID
 * @param title 事件标题
 * @param options 自定义配置信息
 */
export function traceCustomEvent(eventId: string, title: string, options = {}) {
  if (!validateMethods('traceCustomEvent')) return

  return handleSendEvent(eventId, title, options)
}

/**
 * 主动触发一条pv事件
 * @param options 自定义配置信息
 */
export function tracePageView(option = {}) {
  if (!validateMethods('tracePageView')) return

  return handleSendPageView(option)
}

/**
 * 获取公网ip
 */
export function getIPs(): Promise<string> {
  return _getIPs().then((res: any) => res[0])
}
