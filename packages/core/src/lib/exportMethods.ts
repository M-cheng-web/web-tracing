import type { ExportMethods, AnyFun } from '../types'
import { options } from './options'

export const exportMethods: ExportMethods = {
  // traceError: err.traceError,
  // tracePerformance: performance.tracePerformance,
  // traceCustomEvent: event.traceCustomEvent,
  // tracePageView: pv.tracePageView,

  // 钩子:放入事件队列之前
  beforePushEventList: function (fun: AnyFun) {
    options.beforePushEventList.push(fun)
  },
  // 钩子:发送之前
  beforeSendData: function (fun: AnyFun) {
    options.beforeSendData.push(fun)
  },
  // 钩子:发送之后
  afterSendData: function (fun: AnyFun) {
    options.afterSendData.push(fun)
  },
  // 设置用户id
  setUserUuid: id => {
    console.log('id', id)
  },
  getUserUuid: () => '', // 获取用户id(此id是初始化传入的id)
  getSDKUserUuid: () => '', // 获取用户此时在sdk中的id
  // 设置延迟加载后这边手动初始化
  handleDelayInit: () => {
    // do something
  },
  getRouteTreeing: () => ['asd'], // 获取路由历史记录 (前提是开启了监听路由)
  getBaseInfo: () => ({}), // 获取在sdk中记录的所有基础的信息 (包括硬件，地理位置等等)
  getFirstScreen: () => ({}), // 获取首屏数据

  // 开始范围捕捉事件（在这个范围中发生的所有事件都会集中到此范围中）
  trackScopeStart: () => {
    // do something
  },
  // 停止范围捕捉事件（后续可以加入一系列参数，回调等。让用户可选择的更多）
  trackScopeEnd: () => {
    // do something
  },
  // 主动触发error类型事件
  traceError: () => {
    // do something
  },
  // 主动触发资源性能事件上报
  tracePerformance: () => {
    // do something
  },
  // 主动触发手动事件上报
  traceCustomEvent: () => {
    // do something
  },
  // 主动触发一条pv事件
  tracePageView: () => {
    // do something
  }
}
