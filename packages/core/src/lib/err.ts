import { EVENTTYPES } from '../common'
import { map, filter, getLocationHref } from '../utils'
import { _global } from '../utils/global'
import { sendData } from './sendData'
import { eventBus } from './eventBus'
import { isArray } from '../utils/is'
import { options } from './options'

function emit(errorInfo: any) {
  const info = {
    ...errorInfo,
    eventType: 'error',
    url: getLocationHref(),
    triggerTime: Date.now()
  }
  sendData.emit(info)
}

function parseStack(err: any) {
  const { stack = '', message = '' } = err
  const result = { errMessage: message, errStack: stack }

  if (stack) {
    const rChromeCallStack = /^\s*at\s*([^(]+)\s*\((.+?):(\d+):(\d+)\)$/
    const rMozlliaCallStack = /^\s*([^@]*)@(.+?):(\d+):(\d+)$/
    // chrome中包含了message信息,将其去除,并去除后面的换行符
    const callStackStr = stack.replace(
      new RegExp(`^[\\w\\s:]*${message}\n`),
      ''
    )
    const callStackFrameList = map(
      filter(callStackStr.split('\n'), (item: string) => item),
      (str: string) => {
        const chromeErrResult = str.match(rChromeCallStack)
        if (chromeErrResult) {
          return {
            src: chromeErrResult[2],
            line: chromeErrResult[3], // 错误发生位置的行数
            col: chromeErrResult[4] // 错误发生位置的列数
          }
        }

        const mozlliaErrResult = str.match(rMozlliaCallStack)
        if (mozlliaErrResult) {
          return {
            src: mozlliaErrResult[2],
            line: mozlliaErrResult[3],
            col: mozlliaErrResult[4]
          }
        }
        return {}
      }
    )
    const item = callStackFrameList[0] || {}
    return { ...result, ...item }
  }
  return result
}

function parseError(e: any) {
  if (e instanceof Error) {
    // fileName: 引发此错误的文件的路径 (此属性为非标准，所以下面得区分)
    const { message, stack, lineNumber, fileName, columnNumber } = e as any
    if (fileName) {
      return {
        errMessage: message,
        errStack: stack,
        line: lineNumber, // 不稳定属性 - 在某些浏览器可能是undefined，被废弃了
        col: columnNumber, // 不稳定属性 - 非标准，有些浏览器可能不支持
        src: fileName // 不稳定属性 - 非标准，有些浏览器可能不支持
      }
    }
    return parseStack(e)
  }
  if (e.message) return parseStack(e)

  // reject 错误
  if (typeof e === 'string') return { errType: 'reject', errMessage: e }

  // console.error 暴露的错误
  if (isArray(e)) return { errType: 'console.error', errMessage: e.join(';') }

  return {}
}

/**
 * 判断是否为 promise-reject 错误类型
 */
function isPromiseRejectedResult(
  event: ErrorEvent | PromiseRejectedResult
): event is PromiseRejectedResult {
  return (event as PromiseRejectedResult).reason !== undefined
}

function parseErrorEvent(event: ErrorEvent | PromiseRejectedResult) {
  // promise reject 错误
  if (isPromiseRejectedResult(event)) {
    return { eventId: 'code', ...parseError(event.reason) }
  }

  // html元素上发生的异常错误
  const { target } = event
  if (target instanceof HTMLElement) {
    // 为1代表节点是元素节点
    if (target.nodeType === 1) {
      const result = { eventId: target.nodeName, src: '' }
      switch (target.nodeName.toLowerCase()) {
        case 'link':
          result.src = (target as HTMLLinkElement).href
          break
        default:
          result.src =
            (target as HTMLImageElement).currentSrc ||
            (target as HTMLScriptElement).src
      }
      return result
    }
  }

  // 代码异常
  if (event.error) {
    // chrome中的error对象没有fileName等属性,将event中的补充给error对象
    const e = event.error
    e.fileName = e.filename || event.filename
    e.columnNumber = e.colno || event.colno
    e.lineNumber = e.lineno || event.lineno
    return { eventId: 'code', ...parseError(e) }
  }

  // ie9版本,从全局的event对象中获取错误信息
  return {
    eventId: 'code',
    line: _global.event.errorLine,
    col: _global.event.errorCharacter,
    message: _global.event.errorMessage,
    src: _global.event.errorUrl
  }
}

function initError() {
  if (!options.error.core) return

  // 捕获阶段可以获取资源加载错误,script.onError link.onError img.onError,无法知道具体状态
  eventBus.addEvent({
    type: EVENTTYPES.ERROR,
    callback: (e: ErrorEvent) => emit(parseErrorEvent(e))
  })

  // promise调用链未捕获异常
  eventBus.addEvent({
    type: EVENTTYPES.UNHANDLEDREJECTION,
    callback: (e: PromiseRejectedResult) => emit(parseErrorEvent(e))
  })

  // 劫持console.error
  eventBus.addEvent({
    type: EVENTTYPES.CONSOLEERROR,
    callback: e => emit({ eventId: 'code', ...parseError(e) })
  })
}

/**
 * 主动触发错误上报
 * @param eventId 事件ID
 * @param message 错误信息
 * @param options 自定义配置信息
 */
function handleSendError(eventId: string, message: string, options = {}): void {
  const customErrorRecord = { eventId, errMessage: message, ...options }
  emit(customErrorRecord)
}

export { initError, handleSendError }
