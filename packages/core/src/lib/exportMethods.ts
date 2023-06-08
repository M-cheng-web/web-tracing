import type { AnyFun, TargetGather, ElementOrList, VoidFun } from '../types'
import { options } from './options'
import { _support } from '../utils/global'
import { getIPs as _getIPs } from '../utils/getIps'
import { validateMethods } from '../utils'
import { handleSendError } from './err'
import { handleSendPerformance } from './performance'
import { handleSendEvent } from './event'
import { handleSendPageView } from './pv'
import { intersection } from './intersectionObserver'
import { sendData } from './sendData'
import { SDK_LOCAL_KEY } from '../common/config'
import { LocalStorageUtil } from '../utils/localStorage'

/**
 * 钩子：放入事件队列之前
 * @param fun 回调函数
 */
export function beforePushEventList(fun: AnyFun): void {
  if (!validateMethods('beforePushEventList')) return
  options.value.beforePushEventList.push(fun)
}

/**
 * 钩子：发送之前
 * @param fun 回调函数
 */
export function beforeSendData(fun: AnyFun): void {
  if (!validateMethods('beforeSendData')) return
  options.value.beforeSendData.push(fun)
}

/**
 * 钩子：发送之后
 * @param fun 回调函数
 */
export function afterSendData(fun: AnyFun): void {
  if (!validateMethods('afterSendData')) return
  options.value.afterSendData.push(fun)
}

/**
 * 设置用户id
 * @param id 用户id
 */
export function setUserUuid(id: string): void {
  if (!validateMethods('setUserUuid')) return
  options.value.userUuid = id
}

/**
 * 获取用户id（此id是手动设置的id）
 */
export function getUserUuid(): string | void {
  if (!validateMethods('getUserUuid')) return
  return options.value.userUuid
}

/**
 * 获取sdk中的用户id
 */
export function getSDKUserUuid(): string | void {
  if (!validateMethods('getSDKUserUuid')) return

  return options.value.sdkUserUuid
}

/**
 * 获取在sdk中记录的所有基础的信息（包括硬件，地理位置等等）
 */
export function getBaseInfo(): object | void {
  if (!validateMethods('getBaseInfo')) return

  return {
    ..._support.baseInfo.base,
    userUuid: options.value.userUuid
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
 * 主动触发error事件上报
 * @param options 自定义配置信息
 */
export function traceError(options = {}) {
  if (!validateMethods('traceError')) return

  return handleSendError(options)
}

/**
 * 主动触发性能事件上报
 * @param options 自定义配置信息
 */
export function tracePerformance(options = {}) {
  if (!validateMethods('tracePerformance')) return

  return handleSendPerformance(options)
}

/**
 * 主动触发事件上报
 * @param options 自定义配置信息
 */
export function traceCustomEvent(options = {}) {
  if (!validateMethods('traceCustomEvent')) return

  return handleSendEvent(options)
}

/**
 * 主动触发pv事件上报
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

/**
 * 曝光 - 对目标元素进行监听
 * @param params 附带的额外参数
 */
export function intersectionObserver(gather: TargetGather): void {
  if (!validateMethods('intersectionObserver')) return
  intersection.observe(gather)
}

/**
 * 曝光 - 对目标元素进行取消监听
 */
export function intersectionUnobserve(target: ElementOrList): void {
  if (!validateMethods('intersectionUnobserve')) return
  intersection.unobserve(target)
}

/**
 * 曝光 - 取消所有监听
 */
export function intersectionDisconnect(): void {
  if (!validateMethods('intersectionDisconnect')) return
  intersection.disconnect()
}

/**
 * 手动发送本地数据
 */
export function sendLocal(): void {
  if (!validateMethods('sendData') && !options.value.localization) return
  const localItem = LocalStorageUtil.getItem(SDK_LOCAL_KEY)
  if (localItem) {
    sendData.sendLocal(localItem)
    LocalStorageUtil.removeItem(SDK_LOCAL_KEY)
  }
}

/**
 * 设置本地化存储溢出后的回调
 * @param overFlowFun 回调函数
 */
export function setLocalizationOverFlow(overFlowFun: VoidFun): void {
  if (!validateMethods('localizationOverFlow') && !options.value.localization)
    return
  options.value.localizationOverFlow = overFlowFun
}
