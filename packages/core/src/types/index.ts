import type { EventBus } from '../lib/eventBus'
import type { BaseInfo } from '../lib/base'
import type { ObserverValue } from '../observer/types'

export type WebTracing = {
  eventBus: EventBus
  baseInfo: BaseInfo
  sendData: any
  lineStatus: any
  options: ObserverValue<InternalOptions> // 配置信息
  firstScreen: any // 首屏信息
  intersection: any // 曝光采集
}

interface Pv {
  core?: boolean // 是否发送页面跳转相关数据
}
interface Performance {
  core?: boolean // 是否采集静态资源、接口的相关数据
  firstResource?: boolean // 是否采集首次进入页面的数据
  server?: boolean // 是否采集接口请求
}
interface Error {
  core?: boolean // 是否采集异常数据
  server?: boolean // 是否采集报错接口数据
}
interface Event {
  core?: boolean // 是否采集点击事件
}

/**
 * sdk内部配置
 */
export type InternalOptions = {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode: string // 应用code
  appVersion: string // 应用版本
  userUuid: string // 用户id(外部填充进来的id)
  sdkUserUuid: string // 用户id(sdk内部生成的id)
  debug: boolean // 是否开启调试模式(控制台会输出sdk动作)
  pv: Pv
  performance: Performance
  error: Error
  event: Event
  ext: AnyObj // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate: number // 抽样发送
  cacheMaxLength: number // 上报数据最大缓存数
  cacheWatingTime: number // 上报数据最大等待时间
  ignoreErrors: Array<string | RegExp> // 错误类型事件过滤
  ignoreRequest: Array<string | RegExp> // 请求类型事件过滤
  scopeError: boolean // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  localization: boolean // 是否本地化：sdk不再主动发送事件，事件都存储在本地，由用户手动调用方法发送
  sendTypeByXmlBody?: boolean // 是否强制指定发送形式为xml，body请求方式
  // whiteScreen: boolean // 开启白屏检测
  beforePushEventList: AnyFun[] // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeSendData: AnyFun[] // 数据上报前的 hook
  afterSendData: AnyFun[] // 数据上报后的 hook
  localizationOverFlow: VoidFun // 本地化存储溢出后的回调
  recordScreen: boolean // 是否启动录屏
}

/**
 * sdk初始化入参配置
 */
export type InitOptions = {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode?: string // 应用code
  appVersion?: string // 应用版本
  userUuid?: string // 用户id(外部填充进来的id)
  debug?: boolean // 是否开启调试模式(控制台会输出sdk动作)
  pv?: Pv | boolean
  performance?: Performance | boolean
  error?: Error | boolean
  event?: Event | boolean
  ext?: { [key: string]: any } // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate?: number // 抽样发送
  cacheMaxLength?: number // 上报数据最大缓存数
  cacheWatingTime?: number // 上报数据最大等待时间
  ignoreErrors?: Array<string | RegExp> // 错误类型事件过滤
  ignoreRequest?: Array<string | RegExp> // 请求类型事件过滤
  scopeError?: boolean // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  localization?: boolean // 是否本地化：sdk不再主动发送事件，事件都存储在本地，由用户手动调用方法发送
  sendTypeByXmlBody?: boolean // 是否强制指定发送形式为xml，body请求方式
  // whiteScreen?: boolean // 开启白屏检测
  beforePushEventList?: (data: any) => any // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeSendData?: (data: any) => any // 数据上报前的 hook
  afterSendData?: (data: any) => void // 数据上报后的 hook
  recordScreen?: boolean // 是否启动录屏
}

export type ElementOrList = Element | Element[]
export interface TargetGather {
  target: ElementOrList
  threshold: number
  params?: AnyObj
}

export interface RecordEventScope {
  scope: string
  eventList: any[]
}

export type VoidFun = {
  (...args: any[]): void
}

export type AnyFun = {
  (...args: any[]): any
}

export type AnyObj<T = any> = {
  [key: string]: T
}

export interface SendData {
  baseInfo: object
  eventInfo: unknown[]
}
