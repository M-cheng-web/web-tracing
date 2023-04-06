/**
 * index 入口文件应该只负责以下几个功能
 * 1. 调用初始化方法（入参的转换交给内部函数）
 * 2. 暴露一系列方法（主动上报方法等等）
 * 3. 兼容 vue2 和 vue3 的定制化api暴露
 * 4. 要对入参有校验
 */
import type  { InitOptions, ExportMethods } from './types/option';
import { _support } from './utils/global';
import { initReplace } from './src/replace';
import { initOptions } from './src/options'
import { initBase } from './src/base'
import { initSendData } from './src/sendData'
import { initError } from './src/err'
// import { initHttp } from './src/http'
// import { initPerformance } from './src/performance'
// import { initPv } from './src/pv'
// import { initEvent } from './src/event'

// 暴露给外部的方法
const exportMethods: ExportMethods = {
  // setCustomerId: base.setCustomerId, // 舍弃
  // setUserUuid: base.setUserUuid, // 舍弃
  // traceError: err.traceError,
  // tracePerformance: performance.tracePerformance,
  // traceCustomEvent: event.traceCustomEvent,
  // tracePageView: pv.tracePageView,

  beforePushBreadcrumb: () => {}, // 钩子:放入事件队列之前
  beforeDataReport: () => {}, // 钩子:发送之前

  setUserId: () => {}, // 设置用户id，与sdk的用户id绑定
  getBreadcrumb: () => {}, // 获取当前行为列表
  getUserId: () => '', // 获取用户id(此id是初始化传入的id)
  getUserSDKId: () => '', // 获取用户此时在sdk中的id
  handleDelayInit: () => {}, // 设置延迟加载后这边手动初始化
  getRouteTreeing: () => ['asd'], // 获取路由历史记录 (前提是开启了监听路由)
  getBaseInfo: () => '', // 获取在sdk中记录的所有基础的信息 (包括硬件，地理位置等等)
  getFirstScreen: () => '', // 获取首屏数据

  trackScopeStart: () => {}, // 开始范围捕捉事件（在这个范围中发生的所有事件都会集中到此范围中）
  trackScopeEnd: () => {}, // 停止范围捕捉事件（后续可以加入一系列参数，回调等。让用户可选择的更多）
  traceError: () => {}, // 主动触发一条error类型事件
  tracePerformance: () => {}, // 主动触发性能事件上报
  traceCustomEvent: () => {}, // 主动触发事件上报
  tracePageView:() => {} // 主动触发一条pv事件
}

function init(options: InitOptions) {
  const _options = initOptions(options)
  if (!_options) return;

  // 注册全局
  initReplace(_options)
  initBase(_options)
  initSendData(_options)

  // 注册各个业务
  initError(_options)
  // initHttp(_options);
  // initPerformance(_options)
  // initPv(_options)
  // initEvent(_options)
}


export default {
  init,
  ...exportMethods,
};
export { init, exportMethods };
