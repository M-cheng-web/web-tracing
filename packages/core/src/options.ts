import type { Options as _Options, InitOptions } from "../types/option";
import { validateOption, deepAssign } from "../utils";
import { _support } from "../utils/global";

export class Options implements _Options {
  dsn = ""; // 上报地址
  appName = ""; // 应用名称
  appCode = ""; // 应用code
  appVersion = ""; // 应用版本 *********
  userId = ""; // 用户id(用户在sdk中的id) *********
  debug = false; // 是否开启调试模式(控制台会输出sdk动作)
  pv = {
    core: false, // 页面跳转-是否自动发送页面跳转相关数据
    hashtag: false, // 页面跳转-浏览器的动作发生时(例如浏览器的回退按钮)是否监听hash变化,如果是hash路由请开启此开关
  };
  performance = {
    core: false, // 性能数据-是否采集静态资源、接口的相关数据
    firstResource: false, // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
    server: false, // 接口请求-是否采集接口请求(成功的才会采集)
  };
  error = {
    core: false, // 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)
    server: false, // 接口请求-是否采集报错接口数据
  };
  event = {
    core: false, // 页面点击-是否采集点击事件
    unload: false, // 页面卸载-是否在页面卸载时采集页面状态信息
  };

  // ------------- 未做 -------------
  ext = {}; // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate = 1; // 抽样发送(针对全局)
  tracesSampleRateDom = 1; // 抽样发送(针对埋点事件)

  // 事件流本地存储化(同样在发送的时候要触发钩子并且能看到类型)
  dataStreamLocal = {
    // 设置为 0 代表不开启本地存储化
    deadline: 0, // 期限（ps:设为1天则一天只上传一次，但会受到接口大小影响，所以还要手动规定服务端接口内容最大承受）
    maxCapacity: 20000, // 服务端接口最大承受(超过此范围会分为多个接口)
  };

  fullPoint = false; // 是否开启全自动记录
  delayInit = false; // 是否延迟加载(需要用户后面手动加载)
  cacheMaxLength = 5; // 上报数据最大缓存数
  cacheWatingTime = 5000; // 上报数据最大等待时间
  eventDomAttrsPerfix = "data-warden-"; // 页面埋点的前缀
  ignoreErrors = []; // 错误类型事件过滤
  ignoreRequest = []; // 请求类型事件过滤
  scopeError = false; // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  whiteScreen = false; // 开启白屏检测

  // ------ 函数 ------
  // 这些函数一方面是可以在首次init可以用
  // 后面也要做到在某个页面调这个方法就可以多次引用
  // 比如 before 的钩子，在一个项目在多个地方引用了场景

  beforePushBreadcrumb = () => {}; // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeDataReport = () => {}; // 数据上报前的 hook

  constructor(initOptions: InitOptions) {
    const _options = this._transitionOptions(initOptions);
    this._initOptions(_options);
  }
  private _initOptions(options: Options) {
    deepAssign<Options>(this, options)
  }

  /**
   * 对入参配置项进行转换
   */
  private _transitionOptions(options: InitOptions): Options {
    // 这里的 this 目前是包括这些私有方法的，后面看看有没有风险
    const _options = deepAssign<Options>({}, this, options);
    const { pv, performance, error, event } = _options;

    if (typeof pv === "boolean") {
      _options.pv = {
        core: pv,
        hashtag: pv,
      };
    }
    if (typeof performance === "boolean") {
      _options.performance = {
        core: performance,
        firstResource: performance,
        server: performance,
      };
    }
    if (typeof error === "boolean") {
      _options.error = {
        core: error,
        server: error,
      };
    }
    if (typeof event === "boolean") {
      _options.event = {
        core: event,
        unload: event,
      };
    }

    return _options;
  }
}

/**
 * 内部参数默认配置(暂时不用)
 */
const defaultOptions: _Options = {
  dsn: "", // 上报地址
  appName: "", // 应用名称
  appCode: "", // 应用code
  appVersion: "", // 应用版本 *********
  userId: "", // 用户id(用户在sdk中的id) *********
  debug: false, // 是否开启调试模式(控制台会输出sdk动作)
  pv: {
    core: false, // 页面跳转-是否自动发送页面跳转相关数据
    hashtag: false, // 页面跳转-浏览器的动作发生时(例如浏览器的回退按钮)是否监听hash变化,如果是hash路由请开启此开关
  },
  performance: {
    core: false, // 性能数据-是否采集静态资源、接口的相关数据
    firstResource: false, // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
    server: false, // 接口请求-是否采集接口请求(成功的才会采集)
  },
  error: {
    core: false, // 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)
    server: false, // 接口请求-是否采集报错接口数据
  },
  event: {
    core: false, // 页面点击-是否采集点击事件
    unload: false, // 页面卸载-是否在页面卸载时采集页面状态信息
  },

  // ------------- 未做 -------------
  ext: {}, // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate: 1, // 抽样发送(针对全局)
  tracesSampleRateDom: 1, // 抽样发送(针对埋点事件)

  // 事件流本地存储化(同样在发送的时候要触发钩子并且能看到类型)
  dataStreamLocal: {
    // 设置为 0 代表不开启本地存储化
    deadline: 0, // 期限（ps:设为1天则一天只上传一次，但会受到接口大小影响，所以还要手动规定服务端接口内容最大承受）
    maxCapacity: 20000, // 服务端接口最大承受(超过此范围会分为多个接口)
  },

  fullPoint: false, // 是否开启全自动记录
  delayInit: false, // 是否延迟加载(需要用户后面手动加载)
  cacheMaxLength: 5, // 上报数据最大缓存数
  cacheWatingTime: 5000, // 上报数据最大等待时间
  eventDomAttrsPerfix: "data-warden-", // 页面埋点的前缀
  ignoreErrors: [], // 错误类型事件过滤
  ignoreRequest: [], // 请求类型事件过滤
  scopeError: false, // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  whiteScreen: false, // 开启白屏检测

  // ------ 函数 ------
  // 这些函数一方面是可以在首次init可以用
  // 后面也要做到在某个页面调这个方法就可以多次引用
  // 比如 before 的钩子，在一个项目在多个地方引用了场景

  beforePushBreadcrumb: () => {}, // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforeDataReport: () => {}, // 数据上报前的 hook
};

function _validateInitOption(options: InitOptions) {
  const {
    dsn,
    appName,
    appCode,
    appVersion,
    userId,
    debug,
    pv,
    pvCore,
    pvHashtag,
    performance,
    performanceCore,
    performanceFirstResource,
    performanceServer,
    error,
    errorCore,
    errorServer,
    event,
    eventCore,
    eventUnload,
    ext,
    tracesSampleRate,
    tracesSampleRateDom,
    dataStreamLocal,
    fullPoint,
    delayInit,
    cacheMaxLength,
    cacheWatingTime,
    eventDomAttrsPerfix,
    ignoreErrors,
    ignoreRequest,
    scopeError,
    whiteScreen,
    beforePushBreadcrumb,
    beforeDataReport,
  } = options;

  const validateFunList = [];

  if (pv && typeof pv === "object") {
    validateFunList.push(
      validateOption(pv.core, "pv.core", "boolean"),
      validateOption(pv.hashtag, "pv.hashtag", "boolean")
    );
  } else {
    validateFunList.push(validateOption(pv, "pv", "boolean"));
  }

  if (performance && typeof performance === "object") {
    validateFunList.push(
      validateOption(performance.core, "performance.core", "boolean"),
      validateOption(
        performance.firstResource,
        "performance.firstResource",
        "boolean"
      ),
      validateOption(performance.server, "performance.server", "boolean")
    );
  } else {
    validateFunList.push(
      validateOption(performance, "performance", "boolean")
    );
  }

  if (error && typeof error === "object") {
    validateFunList.push(
      validateOption(error.core, "error.core", "boolean"),
      validateOption(error.server, "error.server", "boolean")
    );
  } else {
    validateFunList.push(validateOption(error, "error", "boolean"));
  }

  if (event && typeof event === "object") {
    validateFunList.push(
      validateOption(event.core, "event.core", "boolean"),
      validateOption(event.unload, "event.unload", "boolean")
    );
  } else {
    validateFunList.push(validateOption(event, "event", "boolean"));
  }

  if (dataStreamLocal && typeof dataStreamLocal === "object") {
    validateFunList.push(
      validateOption(
        dataStreamLocal.deadline,
        "dataStreamLocal.deadline",
        "number"
      ),
      validateOption(
        dataStreamLocal.maxCapacity,
        "dataStreamLocal.maxCapacity",
        "number"
      )
    );
  }

  const validateList = [
    validateOption(dsn, "dsn", "string"),
    validateOption(appName, "appName", "string"),
    validateOption(appCode, "appCode", "string"),
    validateOption(appVersion, "appVersion", "string"),
    validateOption(userId, "userId", "string"),
    validateOption(debug, "debug", "boolean"),

    validateOption(pvCore, "pvCore", "boolean"),
    validateOption(pvHashtag, "pvHashtag", "boolean"),

    validateOption(performanceCore, "performanceCore", "boolean"),
    validateOption(
      performanceFirstResource,
      "performanceFirstResource",
      "boolean"
    ),
    validateOption(performanceServer, "performanceServer", "boolean"),

    validateOption(errorCore, "errorCore", "boolean"),
    validateOption(errorServer, "errorServer", "boolean"),

    validateOption(eventCore, "eventCore", "boolean"),
    validateOption(eventUnload, "eventUnload", "boolean"),
    validateOption(ext, "ext", "object"),
    validateOption(tracesSampleRate, "tracesSampleRate", "number"),
    validateOption(tracesSampleRateDom, "tracesSampleRateDom", "number"),

    validateOption(fullPoint, "fullPoint", "boolean"),
    validateOption(delayInit, "delayInit", "boolean"),
    validateOption(cacheMaxLength, "cacheMaxLength", "number"),
    validateOption(cacheWatingTime, "cacheWatingTime", "number"),
    validateOption(eventDomAttrsPerfix, "eventDomAttrsPerfix", "string"),
    validateOption(ignoreErrors, "ignoreErrors", "array"),
    validateOption(ignoreRequest, "ignoreRequest", "array"),
    validateOption(scopeError, "scopeError", "boolean"),
    validateOption(whiteScreen, "whiteScreen", "boolean"),
    validateOption(beforePushBreadcrumb, "beforePushBreadcrumb", "function"),
    validateOption(beforeDataReport, "beforeDataReport", "function"),
  ];

  return validateList.every((res) => !!res);
}

export let options: Options;

export function initOptions(initOptions: InitOptions): Options | undefined {
  // 必传校验
  if (!initOptions.appName) throw Error('请传入appName参数');
  if (!initOptions.dsn) throw Error('请传入dsn参数');

  // 入参类型校验
  if (!_validateInitOption(initOptions)) return;
  options = new Options(initOptions);
  _support.options = options;
  return options
}
