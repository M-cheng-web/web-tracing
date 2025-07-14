import {
  on,
  isValidKey,
  getTimestamp,
  parseGetParams,
  getBaseUrl
} from '../utils'
import { handleSendError } from './err'
import { eventBus } from './eventBus'
import { EVENTTYPES, SENDID } from '../common'
import { options } from './options'
import { handleSendPerformance } from './performance'
// import { debug } from '../utils/debug'
import { isRegExp } from '../utils/is'

/**
 * fetch请求拦截
 */
function interceptFetch(): void {
  eventBus.addEvent({
    type: EVENTTYPES.FETCH,
    callback: async (
      reqUrl: string,
      _options: Partial<Request> = {},
      res: Response,
      fetchStart: number,
      traceObj: Partial<Request> = {}
    ) => {
      const { method = 'GET', body = {} } = _options
      const { url, status, statusText } = res
      const requestMethod = String(method).toLocaleLowerCase()

      if (isIgnoreHttp(url)) return

      if (status === 200 || status === 304) {
        if (options.value.performance.server) {
          handleSendPerformance({
            eventId: SENDID.SERVER,
            requestUrl: url,
            triggerTime: fetchStart,
            duration: getTimestamp() - fetchStart,
            responseStatus: status,
            requestMethod,
            requestType: 'fetch',
            ...traceObj,
            params: method.toUpperCase() === 'POST' ? body : parseGetParams(url)
          })
        }
      } else if (options.value.error.server) {
        handleSendError({
          eventId: SENDID.SERVER,
          triggerTime: fetchStart,
          duration: getTimestamp() - fetchStart,
          errMessage: statusText,
          requestUrl: getBaseUrl(url),
          responseStatus: status,
          requestMethod,
          requestType: 'fetch',
          ...traceObj,
          params: method.toUpperCase() === 'POST' ? body : parseGetParams(url)
        })
      }
    }
  })
}

class RequestTemplate {
  requestUrl = '' // 请求地址
  requestMethod = '' // 请求类型 GET POST
  requestParams = {} // get请求的参数
  triggerTime = -1 // 请求发生时间
  constructor(config = {}) {
    Object.keys(config).forEach(key => {
      if (isValidKey(key, config)) {
        this[key] = config[key] || null
      }
    })
  }
}

/**
 * xhr 请求拦截
 */
function interceptXHR(): void {
  const _config = new RequestTemplate()

  eventBus.addEvent({
    type: EVENTTYPES.XHROPEN,
    callback: (method, url) => {
      _config.requestMethod = String(method).toLocaleLowerCase()
      _config.requestUrl = url
      _config.requestParams = parseGetParams(url)
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.XHRSEND,
    callback: (that: XMLHttpRequest & any, body) => {
      // readyState发生改变时触发,也就是请求状态改变时
      // readyState 会依次变为 2,3,4 也就是会触发三次这里
      on(that, EVENTTYPES.READYSTATECHANGE, function () {
        const { readyState, status, responseURL, statusText } = that
        const responseText =
          that.responseType === '' || that.responseType === 'text'
            ? that.responseText
            : ''

        if (readyState === 4) {
          const requestUrl = responseURL || _config.requestUrl
          if (isIgnoreHttp(requestUrl)) return

          // 请求已完成,且响应已就绪
          if (status === 200 || status === 304) {
            if (options.value.performance.server) {
              handleSendPerformance({
                eventId: SENDID.SERVER,
                requestUrl,
                requestMethod: _config.requestMethod,
                requestType: 'xhr',
                responseStatus: status,
                duration: getTimestamp() - _config.triggerTime,
                params:
                  _config.requestMethod === 'post'
                    ? body
                    : _config.requestParams
              })
            }
          } else if (options.value.error.server) {
            handleSendError({
              eventId: SENDID.SERVER,
              errMessage: statusText || responseText,
              requestUrl,
              requestMethod: _config.requestMethod,
              requestType: 'xhr',
              responseStatus: status,
              params:
                _config.requestMethod === 'post' ? body : _config.requestParams
            })
          }
        }
      })

      _config.triggerTime = getTimestamp()
    }
  })
}

/**
 * 判断请求地址是否为需要拦截的
 * @param url 请求地址
 */
function isIgnoreHttp(url: string): boolean {
  if (!options.value.ignoreRequest.length) return false
  if (!url) return false

  return options.value.ignoreRequest.some(item => {
    if (isRegExp(item)) {
      if ((item as RegExp).test(url)) {
        // debug(`ignoreRequest拦截成功 - 截条件:${item} 拦截地址:${url}`)
        return true
      } else {
        return false
      }
    } else {
      if (url === item) {
        // debug(`ignoreRequest拦截成功 - 截条件:${item} 拦截地址:${url}`)
        return true
      } else {
        return false
      }
    }
  })
}

/**
 * 初始化http监控
 */
function initHttp(): void {
  if (!options.value.performance.server && !options.value.error.server) return

  interceptXHR()
  interceptFetch()
}

/**
 * 卸载所有请求监听
 */
export function destroyHttp() {
  eventBus.removeAllEvents()
}

export { initHttp }
