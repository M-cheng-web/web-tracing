import { on, isValidKey, getTimestamp } from '../utils'
import { handleSendError } from './err'
import { eventBus } from './eventBus'
import { EVENTTYPES } from '../common'
import { options } from './options'
import { handleSendPerformance } from './performance'
import { debug } from '../utils/debug'
import { isRegExp } from '../utils/is'

class RequestTemplate {
  src = '' // 请求地址
  requestMethod = '' // 请求类型 GET POST
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
 * fetch请求拦截
 */
function interceptFetch(): void {
  eventBus.addEvent({
    type: EVENTTYPES.FETCH,
    callback: (
      reqUrl: string,
      _options: Partial<Request> = {},
      res: Response,
      fetchStart: number
    ) => {
      const { method = 'GET' } = _options
      const { url, status, statusText } = res

      if (isIgnoreHttp(url)) return

      if (status === 200 || status === 304) {
        if (options.value.performance.server) {
          handleSendPerformance('server', {
            src: url,
            duration: getTimestamp() - fetchStart, // 这里注定等于0  要改下
            responseStatus: status,
            params: method.toUpperCase() === 'POST' ? _options.body : undefined
          })
        }
      } else if (options.value.error.server) {
        handleSendError('server', statusText, {
          src: url,
          responseStatus: status,
          params: method.toUpperCase() === 'POST' ? _options.body : undefined
        })
      }
    }
  })
}

/**
 * xhr 请求拦截
 */
function interceptXHR(): void {
  const _config = new RequestTemplate()

  eventBus.addEvent({
    type: EVENTTYPES.XHROPEN,
    callback: (method, url) => {
      _config.requestMethod = method
      _config.src = url
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.XHRSEND,
    // body 就是post方法携带的参数
    callback: (that: XMLHttpRequest & any, body) => {
      // readyState发生改变时触发,也就是请求状态改变时
      // readyState 会依次变为 2,3,4 也就是会触发三次这里
      on(that, EVENTTYPES.READYSTATECHANGE, function () {
        const { readyState, status, responseURL, responseText, statusText } =
          that
        if (readyState === 4) {
          if (isIgnoreHttp(responseURL || _config.src)) return

          // 请求已完成,且响应已就绪
          if (status === 200 || status === 304) {
            if (options.value.performance.server) {
              handleSendPerformance('server', {
                src: responseURL || _config.src,
                responseStatus: status,
                duration: getTimestamp() - _config.triggerTime,
                params: body ? body : undefined
              })
            }
          } else if (options.value.error.server) {
            handleSendError('server', statusText || responseText, {
              src: responseURL || _config.src,
              responseStatus: status,
              params: body ? body : undefined
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
        debug(`ignoreRequest拦截成功 - 截条件:${item} 拦截地址:${url}`)
        return true
      } else {
        return false
      }
    } else {
      if (url === item) {
        debug(`ignoreRequest拦截成功 - 截条件:${item} 拦截地址:${url}`)
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

export { initHttp }
