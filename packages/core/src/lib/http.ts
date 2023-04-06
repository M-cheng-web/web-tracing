import { handleSendError } from './err'
import type { Options } from '../types'
import { eventBus } from './eventBus'
import { EVENTTYPES } from '../common'
import { handleSendPerformance } from './performance'

class RequestTemplate {
  constructor(config = {}) {
    const list = ['src', 'method', 'duration', 'responseStatus']
    list.forEach(key => {
      this[key] = config[key] || null
    })
  }
}

/**
 * fetch请求拦截
 */
function interceptFetch(performanceServer, errorServer) {
  const nativeFetch = window.fetch
  if (nativeFetch) {
    window.fetch = function traceFetch(target, options = {}) {
      const fetchStart = Date.now()
      const { method = 'GET' } = options
      const result = nativeFetch(target, options)
      result.then(
        res => {
          const { url, status, statusText } = res
          if (status === 200 || status === 304) {
            if (performanceServer) {
              handleSendPerformance('server', {
                src: url,
                duration: Date.now() - fetchStart,
                responseStatus: status,
                params:
                  method.toUpperCase() === 'POST' ? options.body : undefined
              })
            }
          } else if (errorServer) {
            handleSendError('server', statusText, {
              src: url,
              responseStatus: status,
              params: method.toUpperCase() === 'POST' ? options.body : undefined
            })
          }
        },
        e => {
          // 无法发起请求,连接失败
          handleSendError('server', e.message, { src: target })
        }
      )
      return result
    }
  }
}

/**
 * ajax, axios请求拦截
 */
function interceptAjax(performanceServer, errorServer) {
  const { open, send } = XMLHttpRequest.prototype
  const _config = new RequestTemplate()

  // 劫持 open方法
  XMLHttpRequest.prototype.open = function openXHR(method, url, async) {
    _config.requestMethod = method
    _config.src = url
    return open.call(this, method, url, async)
  }

  // 劫持 send方法
  XMLHttpRequest.prototype.send = function (body) {
    // body 就是post方法携带的参数

    // readyState发生改变时触发,也就是请求状态改变时
    // readyState 会依次变为 2,3,4 也就是会触发三次这里
    this.addEventListener('readystatechange', () => {
      const {
        readyState,
        status,
        responseURL = _config.src,
        responseText
      } = this
      if (readyState === 4) {
        // 请求已完成,且响应已就绪
        if (status === 200 || status === 304) {
          if (performanceServer) {
            handleSendPerformance('server', {
              src: responseURL,
              responseStatus: status,
              duration: Date.now() - _config.triggerTime,
              params: body ? body : undefined
            })
          }
        } else if (errorServer) {
          handleSendError('server', responseText, {
            src: responseURL,
            responseStatus: status,
            params: body ? body : undefined
          })
        }
      }
    })

    _config.triggerTime = Date.now()
    return send.call(this, body)
  }
}

function initHttp(options: Options) {
  // if (!performanceServer && !errorServer) return;

  interceptAjax(performanceServer, errorServer)
  interceptFetch(performanceServer, errorServer)
}

export { initHttp }
