import type { InternalOptions, AnyFun, InitOptions, VoidFun } from '../types'
import { typeofAny, deepAssign } from '../utils'
import { isEmpty } from '../utils/is'
import { _support } from '../utils/global'
import { logError } from '../utils/debug'
import { ref } from '../observer'
import type { ObserverValue } from '../observer/types'

/**
 * 管理全局的参数
 */
export class Options implements InternalOptions {
  dsn = '' // 上报地址
  appName = '' // 应用名称
  appCode = '' // 应用code
  appVersion = '' // 应用版本
  userUuid = '' // 用户id(外部填充进来的id)
  sdkUserUuid = '' // 用户id(sdk内部生成的id)
  debug = false // 是否开启调试模式(控制台会输出sdk动作)
  pv = {
    core: false // 页面跳转-是否自动发送页面跳转相关数据
  }
  performance = {
    core: false, // 性能数据-是否采集静态资源、接口的相关数据
    firstResource: false, // 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)
    server: false // 接口请求-是否采集接口请求(成功的才会采集)
  }
  error = {
    core: false, // 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)
    server: false // 接口请求-是否采集报错接口数据
  }
  event = {
    core: false // 页面点击-是否采集点击事件
  }
  recordScreen = true // 是否启动录屏
  timeout = 5000 // 日志上报超时时间（毫秒）
  maxQueueLength = 200 // 上报接口异常，日志队列最大缓存数
  checkRecoverInterval = 1 // 多长时间检测一次上报接口是否恢复（分钟）

  ext = {} // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate = 1 // 抽样发送

  cacheMaxLength = 5 // 上报数据最大缓存数
  cacheWatingTime = 5000 // 上报数据最大等待时间
  ignoreErrors = [] // 错误类型事件过滤
  ignoreRequest: Array<string | RegExp> = [] // 请求类型事件过滤
  scopeError = false // 当某个时间段报错时，会将此类错误转为特殊错误类型，会新增错误持续时间范围
  localization = false // 是否本地化：sdk不再主动发送事件，事件都存储在本地，由用户手动调用方法发送
  sendTypeByXmlBody = false // 是否强制指定发送形式为xml，body请求方式

  // whiteScreen = false // 开启白屏检测

  // 添加到行为列表前的 hook (在这里面可以给出错误类型，然后就能达到用户想拿到是何种事件类型的触发)
  beforePushEventList: AnyFun[] = []

  // 数据上报前的 hook
  beforeSendData: AnyFun[] = []

  // 数据上报后的 hook
  afterSendData: VoidFun[] = []

  // 本地化存储溢出后的回调
  localizationOverFlow: VoidFun = () => {
    //   do something
  }

  constructor(initOptions: InitOptions) {
    const _options = this.transitionOptions(initOptions)
    _options.ignoreRequest.push(new RegExp(_options.dsn))
    deepAssign<Options>(this, _options)
  }

  /**
   * 对入参配置项进行转换
   */
  private transitionOptions(options: InitOptions): Options {
    const _options = deepAssign<Options>({}, this, options)
    const { beforePushEventList, beforeSendData, afterSendData } = options
    const { pv, performance, error, event } = _options

    if (typeof pv === 'boolean') {
      _options.pv = {
        core: pv
      }
    }
    if (typeof performance === 'boolean') {
      _options.performance = {
        core: performance,
        firstResource: performance,
        server: performance
      }
    }
    if (typeof error === 'boolean') {
      _options.error = {
        core: error,
        server: error
      }
    }
    if (typeof event === 'boolean') {
      _options.event = {
        core: event
      }
    }

    if (beforePushEventList) {
      _options.beforePushEventList = [beforePushEventList]
    }
    if (beforeSendData) {
      _options.beforeSendData = [beforeSendData]
    }
    if (afterSendData) {
      _options.afterSendData = [afterSendData]
    }

    if (options.timeout !== undefined) {
      _options.timeout = options.timeout
    }

    if (options.maxQueueLength !== undefined) {
      _options.maxQueueLength = options.maxQueueLength
    }

    if (options.checkRecoverInterval !== undefined) {
      _options.checkRecoverInterval = options.checkRecoverInterval
    }

    return _options
  }
}

function _validateInitOption(options: InitOptions) {
  const {
    dsn,
    appName,
    appCode,
    appVersion,
    userUuid,
    debug,
    recordScreen,
    pv,
    performance,
    error,
    event,
    ext,
    tracesSampleRate,
    cacheMaxLength,
    cacheWatingTime,
    ignoreErrors,
    ignoreRequest,
    scopeError,
    localization,
    sendTypeByXmlBody,
    // whiteScreen,
    beforePushEventList,
    beforeSendData,
    timeout,
    maxQueueLength,
    checkRecoverInterval
  } = options

  const validateFunList = []

  if (pv && typeof pv === 'object') {
    validateFunList.push(validateOption(pv.core, 'pv.core', 'boolean'))
  } else {
    validateFunList.push(validateOption(pv, 'pv', 'boolean'))
  }

  if (performance && typeof performance === 'object') {
    validateFunList.push(
      validateOption(performance.core, 'performance.core', 'boolean'),
      validateOption(
        performance.firstResource,
        'performance.firstResource',
        'boolean'
      ),
      validateOption(performance.server, 'performance.server', 'boolean')
    )
  } else {
    validateFunList.push(validateOption(performance, 'performance', 'boolean'))
  }

  if (error && typeof error === 'object') {
    validateFunList.push(
      validateOption(error.core, 'error.core', 'boolean'),
      validateOption(error.server, 'error.server', 'boolean')
    )
  } else {
    validateFunList.push(validateOption(error, 'error', 'boolean'))
  }

  if (event && typeof event === 'object') {
    validateFunList.push(validateOption(event.core, 'event.core', 'boolean'))
  } else {
    validateFunList.push(validateOption(event, 'event', 'boolean'))
  }

  const validateList = [
    validateOption(dsn, 'dsn', 'string'),
    validateOption(appName, 'appName', 'string'),
    validateOption(appCode, 'appCode', 'string'),
    validateOption(appVersion, 'appVersion', 'string'),
    validateOption(userUuid, 'userUuid', 'string'),
    validateOption(debug, 'debug', 'boolean'),
    validateOption(recordScreen, 'recordScreen', 'boolean'),

    validateOption(ext, 'ext', 'object'),
    validateOption(tracesSampleRate, 'tracesSampleRate', 'number'),

    validateOption(cacheMaxLength, 'cacheMaxLength', 'number'),
    validateOption(cacheWatingTime, 'cacheWatingTime', 'number'),

    validateOption(ignoreErrors, 'ignoreErrors', 'array'),
    validateOptionArray(ignoreErrors, 'ignoreErrors', ['string', 'regexp']),

    validateOption(ignoreRequest, 'ignoreRequest', 'array'),
    validateOptionArray(ignoreRequest, 'ignoreRequest', ['string', 'regexp']),

    validateOption(scopeError, 'scopeError', 'boolean'),
    validateOption(localization, 'localization', 'boolean'),
    validateOption(sendTypeByXmlBody, 'sendTypeByXmlBody', 'boolean'),
    // validateOption(whiteScreen, 'whiteScreen', 'boolean'),
    validateOption(beforePushEventList, 'beforePushEventList', 'function'),
    validateOption(beforeSendData, 'beforeSendData', 'function'),
    validateOption(timeout, 'timeout', 'number'),
    validateOption(maxQueueLength, 'maxQueueLength', 'number'),
    validateOption(checkRecoverInterval, 'checkRecoverInterval', 'number')
  ]

  return validateList.every(res => !!res)
}

/**
 * 验证必填项
 * @param options 入参对象
 */
function _validateMustFill(options: InitOptions) {
  const validateList = [
    validateOptionMustFill(options.appName, 'appName'),
    validateOptionMustFill(options.dsn, 'dsn')
  ]

  return validateList.every(res => !!res)
}

/**
 * 验证必填项
 * @param target 属性值
 * @param targetName 属性名
 * @returns 是否通过验证
 */
function validateOptionMustFill(target: any, targetName: string): boolean {
  if (isEmpty(target)) {
    logError(`【${targetName}】参数必填`)
    return false
  }
  return true
}

/**
 * 验证选项的类型是否符合要求
 * @param target 源对象
 * @param targetName 对象名
 * @param expectType 期望类型
 * @returns 是否通过验证
 */
function validateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean | void {
  if (!target || typeofAny(target) === expectType) return true
  logError(
    `TypeError:【${targetName}】期望传入${expectType}类型，目前是${typeofAny(
      target
    )}类型`
  )
  return false
}

/**
 * 验证选项的类型 - 针对数组内容类型的验证
 * @param target 源对象
 * @param targetName 对象名
 * @param expectTypes 期望类型
 * @returns 是否通过验证
 */
function validateOptionArray(
  target: any[] | undefined,
  targetName: string,
  expectTypes: string[]
): boolean | void {
  if (!target) return true
  let pass = true

  target.forEach(item => {
    if (!expectTypes.includes(typeofAny(item))) {
      logError(
        `TypeError:【${targetName}】数组内的值期望传入${expectTypes.join(
          '|'
        )}类型，目前值${item}是${typeofAny(item)}类型`
      )
      pass = false
    }
  })

  return pass
}

export let options: ObserverValue<InternalOptions>

/**
 * 初始化参数
 * @param initOptions 原始参数
 * @returns 是否初始化成功
 */
export function initOptions(initOptions: InitOptions): boolean {
  // 必传校验 && 入参类型校验
  if (!_validateMustFill(initOptions) || !_validateInitOption(initOptions))
    return false

  options = ref(new Options(initOptions))
  _support.options = options
  return true
}
