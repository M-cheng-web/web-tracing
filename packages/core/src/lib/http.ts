import { on, isValidKey } from '../utils'
import { handleSendError } from './err'
import { eventBus } from './eventBus'
import { EVENTTYPES } from '../common'
// import { handleSendPerformance } from './performance'
import { options } from './options'

class RequestTemplate {
  src = '' // 请求地址
  method = '' //
  duration = '' // 请求消耗时间
  responseStatus = '' // 请求返回状态
  requestMethod = '' //
  triggerTime = -1 //
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
function interceptFetch() {
  eventBus.addEvent({
    type: EVENTTYPES.FETCH,
    callback: (target: string, _options: Partial<Request> = {}, res: any) => {
      const fetchStart = Date.now()
      const { method = 'GET' } = _options

      // 正确回调
      const { url, status, statusText } = res
      if (status === 200 || status === 304) {
        console.log('成功')
        // if (performanceServer) {
        //   handleSendPerformance('server', {
        //     src: url,
        //     duration: Date.now() - fetchStart,
        //     responseStatus: status,
        //     params:
        //       method.toUpperCase() === 'POST' ? _options.body : undefined
        //   })
        // }
      } else if (options.error.server) {
        handleSendError('server', statusText, {
          src: url,
          responseStatus: status,
          params: method.toUpperCase() === 'POST' ? _options.body : undefined
        })
      }

      // 错误回调
      //   // 无法发起请求,连接失败
      //   handleSendError('server', e.message, { src: target })
    }
  })
}

/**
 * xhr 请求拦截
 */
function interceptXHR() {
  const _config = new RequestTemplate()

  eventBus.addEvent({
    type: EVENTTYPES.XHROPEN,
    callback: (method, url) => {
      console.log('XHROPEN', method, url)
      _config.requestMethod = method
      _config.src = url
    }
  })

  eventBus.addEvent({
    type: EVENTTYPES.XHRSEND,
    // body 就是post方法携带的参数
    callback: (that: XMLHttpRequest & any, body) => {
      console.log(11, body)
      // readyState发生改变时触发,也就是请求状态改变时
      // readyState 会依次变为 2,3,4 也就是会触发三次这里
      on(that, 'readystatechange', function () {
        const {
          readyState,
          status,
          responseURL = _config.src,
          responseText
        } = that
        if (readyState === 4) {
          // 请求已完成,且响应已就绪
          if (status === 200 || status === 304) {
            console.log('成功')
            // if (performanceServer) {
            //   handleSendPerformance('server', {
            //     src: responseURL,
            //     responseStatus: status,
            //     duration: Date.now() - _config.triggerTime,
            //     params: body ? body : undefined
            //   })
            // }
          } else if (options.error.server) {
            console.log('错误')
            handleSendError('server', responseText, {
              src: responseURL,
              responseStatus: status,
              params: body ? body : undefined
            })
          }
        }
      })

      _config.triggerTime = Date.now()
    }
  })
}

function initHttp() {
  interceptXHR()
  interceptFetch()
}

export { initHttp }
