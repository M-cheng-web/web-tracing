import base from './lib/base'
import pv from './lib/pv'
import http from './lib/http-request'
import err from './lib/err'
import event from './lib/event'
import performance from './lib/performance'

const methods = {
  setCustomerId: base.setCustomerId,
  setUserUuid: base.setUserUuid,
  traceError: err.traceError,
  tracePerformance: performance.tracePerformance,
  traceCustomEvent: event.traceCustomEvent,
  tracePageView: pv.tracePageView,
}

const init = (options = {}) => {
  const _options = {
    requestUrl: '', // 请求地址
    appName: '', // 应用名称
    appCode: '', // 应用code
    appVersion: '', // 应用版本
    ext: '', // 自定义全局附加参数
    debug: false, // 是否开启触发事件时控制台输出

    pvCore: false, // 页面跳转-是否自动发送页面跳转相关数据
    pvHashtag: false, // 页面跳转-浏览器的动作发生时(例如浏览器的回退按钮)是否监听hash变化,如果是hash路由请开启此开关

    performanceCore: false, // 性能数据-是否采集静态资源、接口的相关数据
    performanceFirstResource: false, // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
    performanceServer: false, // 接口请求-是否采集接口请求(成功的才会采集)

    errorCore: false, // 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)
    errorServer: false, // 接口请求-是否采集报错接口数据

    eventCore: false, // 页面点击-是否采集点击事件
    eventUnload: false, // 页面卸载-是否在页面卸载时采集页面状态信息
  };

  // 将传过来的参数转换
  transitionOptions(_options, options);

  base.init(_options);
  event.init(_options);
  pv.init(_options);
  http.init(_options);
  err.init(_options);
  performance.init(_options);
}

const transitionOptions = (_options, options) => {
  const {
    requestUrl,
    appName,
    appCode,
    appVersion,
    ext,
    debug,
    pv = {},
    performance = {},
    error = {},
    event = {},
  } = options;

  if (!requestUrl) throw Error('请传入requestUrl参数');
  if (!appName) throw Error('请传入appName参数');

  _options.requestUrl = requestUrl;
  _options.appName = appName;
  _options.appCode = appCode;
  _options.appVersion = appVersion;
  _options.ext = ext;
  _options.debug = debug;

  if (typeof pv === 'boolean') {
    _options.pvCore = _options.pvHashtag = pv;
  } else {
    _options.pvCore = Boolean(pv.core);
    _options.pvHashtag = Boolean(pv.server);
  }

  if (typeof performance === 'boolean') {
    _options.performanceCore = _options.performanceFirstResource = _options.performanceServer = performance;
  } else {
    _options.performanceCore = Boolean(performance.core);
    _options.performanceFirstResource = Boolean(performance.firstResource);
    _options.performanceServer = Boolean(performance.server);
  }

  if (typeof error === 'boolean') {
    _options.errorCore = _options.errorServer = error;
  } else {
    _options.errorCore = Boolean(error.core);
    _options.errorServer = Boolean(error.server);
  }

  if (typeof event === 'boolean') {
    _options.eventCore = _options.eventUnload = event;
  } else {
    _options.eventCore = Boolean(event.core);
    _options.eventUnload = Boolean(event.unload);
  }
}

const install = (Vue, options = {}) => {
  init(options);
  if (Vue.prototype) {
    Vue.prototype.$trace = { ...methods };
  } else {
    Vue.config.globalProperties.$trace = { ...methods };
  }
}

export default {
  install,
  init,
  ...methods
};
export { install, init, methods };