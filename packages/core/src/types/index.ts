import type { EventBus } from '../lib/eventBus';

export type WebTracing = {
  eventBus: EventBus;
  baseInfo: any;
  sendData: any;
  options: Options; // 配置信息
}

interface Pv {
  core?: boolean
  hashtag?: boolean
}
interface Performance {
  core?: boolean
  firstResource?: boolean
  server?: boolean
}
interface Error {
  core?: boolean
  server?: boolean
}
interface Event {
  core?: boolean
  unload?: boolean
}

/**
 * sdk内部配置
 */
export type Options = {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode: string // 应用code
  appVersion: string // 应用版本
  userId: string // 用户id(应该是用户在库中的id)
  debug: boolean // 是否开启调试模式(控制台会输出sdk动作)
  pv: Pv
  performance: Performance
  error: Error
  event: Event
  ext: { [key: string]: any } // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate: number // 抽样发送(针对全局)
  tracesSampleRateDom: number // 抽样发送(针对埋点事件)
  // 事件流本地存储化(同样在发送的时候要触发钩子并且能看到类型)
  dataStreamLocal: {
    deadline: number // 期限（ps:设为1天则一天只上传一次，但会受到接口大小影响，所以还要手动规定服务端接口内容最大承受）
    maxCapacity: number // 服务端接口最大承受(超过此范围会分为多个接口)
  }
  fullPoint: boolean // 是否开启全自动记录
  delayInit: boolean // 是否延迟加载(需要用户后面手动加载)
  cacheMaxLength: number // 上报数据最大缓存数
  cacheWatingTime: number // 上报数据最大等待时间
  eventDomAttrsPerfix: string // 页面埋点的前缀
  ignoreErrors: Array<string | RegExp> // 错误类型事件过滤
  ignoreRequest: Array<string | RegExp> // 请求类型事件过滤
  scopeError: boolean // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  whiteScreen: boolean // 开启白屏检测
  // ------ 函数 ------
  // 这些函数一方面是可以在首次init可以用
  // 后面也要做到在某个页面调这个方法就可以多次引用
  // 比如 before 的钩子，在一个项目在多个地方引用了场景
  beforePushBreadcrumb: () => void // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeDataReport: () => void; // 数据上报前的 hook
}

/**
 * sdk初始化入参配置
 */
export type InitOptions = {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode?: string // 应用code
  appVersion?: string // 应用版本
  userId?: string // 用户id(应该是用户在库中的id)
  debug?: boolean // 是否开启调试模式(控制台会输出sdk动作)

  pv?: Pv | boolean
  pvCore?: boolean // 页面跳转-是否自动发送页面跳转相关数据
  pvHashtag?: boolean // 页面跳转-浏览器的动作发生时(例如浏览器的回退按钮)是否监听hash变化,如果是hash路由请开启此开关

  performance?: Performance | boolean
  performanceCore?: boolean // 性能数据-是否采集静态资源、接口的相关数据
  performanceFirstResource?: boolean // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
  performanceServer?: boolean // 接口请求-是否采集接口请求(成功的才会采集)

  error?: Error | boolean
  errorCore?: boolean // 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)
  errorServer?: boolean // 接口请求-是否采集报错接口数据

  event?: Event | boolean
  eventCore?: boolean // 页面点击-是否采集点击事件
  eventUnload?: boolean // 页面卸载-是否在页面卸载时采集页面状态信息

  // ------------- 未做 -------------
  ext?: { [key: string]: any } // 自定义全局附加参数(放在baseInfo中)

  tracesSampleRate?: number // 抽样发送(针对全局)
  tracesSampleRateDom?: number // 抽样发送(针对埋点事件)

  // 事件流本地存储化(同样在发送的时候要触发钩子并且能看到类型)
  dataStreamLocal?: {
    deadline: number // 期限（ps:设为1天则一天只上传一次，但会受到接口大小影响，所以还要手动规定服务端接口内容最大承受）
    maxCapacity: number // 服务端接口最大承受(超过此范围会分为多个接口)
  }

  fullPoint?: boolean // 是否开启全自动记录
  delayInit?: boolean // 是否延迟加载(需要用户后面手动加载)

  cacheMaxLength?: number // 上报数据最大缓存数
  cacheWatingTime?: number // 上报数据最大等待时间
  eventDomAttrsPerfix?: string // 页面埋点的前缀

  ignoreErrors?: Array<string | RegExp> // 错误类型事件过滤
  ignoreRequest?: Array<string | RegExp> // 请求类型事件过滤

  scopeError?: boolean // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围

  whiteScreen?: boolean // 开启白屏检测

  // ------ 函数 ------
  // 这些函数一方面是可以在首次init可以用
  // 后面也要做到在某个页面调这个方法就可以多次引用
  // 比如 before 的钩子，在一个项目在多个地方引用了场景

  beforePushBreadcrumb?: () => void // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeDataReport?: () => void; // 数据上报前的 hook
}

/**
 * 暴露给外部的方法
 */
export type ExportMethods = {
  beforePushBreadcrumb: () => void // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeDataReport: () => void // 数据上报前的 hook

  setUserId: () => void // // 设置用户id，与sdk的用户id绑定
  getBreadcrumb: () => any // 获取当前行为列表
  getUserId: () => string // 获取用户id(此id是初始化传入的id)
  getUserSDKId: () => string // 获取用户此时在sdk中的id
  handleDelayInit: () => void // 设置延迟加载后这边手动初始化
  getRouteTreeing: () => string[] // 获取路由历史记录 (前提是开启了监听路由)
  getBaseInfo: () => any // 获取在sdk中记录的所有基础的信息 (包括硬件，地理位置等等)
  getFirstScreen: () => any // 获取首屏数据

  trackScopeStart: () => void // 开始范围捕捉事件（在这个范围中发生的所有事件都会集中到此范围中）
  trackScopeEnd: () => void // 停止范围捕捉事件（后续可以加入一系列参数，回调等。让用户可选择的更多）
  traceError: () => void // 主动触发一条error类型事件
  tracePerformance: () => void // 主动触发性能事件上报
  traceCustomEvent: () => void // 主动触发事件上报
  tracePageView:() => void // 主动触发一条pv事件
}

export type VoidFun = {
  (...args: any[]): void
}

export type AnyFun = {
  (...args: any[]): any
}

export type AnyObj = {
  [key: string]: any
}