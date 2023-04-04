import { map, filter } from "../utils/index";
import { getGlobal } from '../utils/global';
import { getLocationHref } from "../utils/helpers";
import { sendData } from './sendData';
import type { Options } from '../types/option';
import { eventBus } from './eventBus';
import { EVENTTYPES } from '../common';

function emit(errorInfo) {
  const info = {
    ...errorInfo,
    eventType: 'error',
    url: getLocationHref(),
    triggerTime: Date.now(),
  };
  sendData.emit(info);
}

function parseStack(err) {
  const { stack = '', message = '' } = err;
  const result = { errMessage: message, errStack: stack };

  if (stack) {
    const rChromeCallStack = /^\s*at\s*([^(]+)\s*\((.+?):(\d+):(\d+)\)$/;
    const rMozlliaCallStack = /^\s*([^@]*)@(.+?):(\d+):(\d+)$/;
    // chrome中包含了message信息,将其去除,并去除后面的换行符
    const callStackStr = stack.replace(new RegExp(`^[\\w\\s:]*${message}\n`), '');
    const callStackFrameList = map(filter(callStackStr.split('\n'), (item) => item), (str) => {
      const chromeErrResult = str.match(rChromeCallStack);
      if (chromeErrResult) {
        return {
          src: chromeErrResult[2],
          line: chromeErrResult[3], // 错误发生位置的行数
          col: chromeErrResult[4], // 错误发生位置的列数
        };
      }

      const mozlliaErrResult = str.match(rMozlliaCallStack);
      if (mozlliaErrResult) {
        return {
          src: mozlliaErrResult[2],
          line: mozlliaErrResult[3],
          col: mozlliaErrResult[4],
        };
      }
      return {};
    });
    const item = callStackFrameList[0] || {};
    return { ...result, ...item };
  }
  return result;
}

function parseError(e) {
  if (e instanceof Error) {
    const { message, stack, lineNumber, fileName, columnNumber } = e;
    if (fileName) {
      return {
        errMessage: message,
        errStack: stack,
        line: lineNumber,
        col: columnNumber,
        src: fileName,
      };
    }
    return parseStack(e);
  }
  if (e.message) return parseStack(e);
  if (typeof e === 'string') return { errMessage: e };
  return {};
}

function parseErrorEvent(event) {
  const { target, type } = event;
  // promise异常
  // 依旧使用code,不区分是否从promise中捕获的
  if (type === 'unhandledrejection') return { eventId: 'code', ...parseError(event.reason) };

  // html元素上发生的异常错误
  if (target.nodeType === 1) {
    const result = { eventId: target.nodeName };
    switch (target.nodeName.toLowerCase()) {
      case 'link':
        result.src = target.href;
        break;
      default:
        result.src = target.currentSrc || target.src;
    }
    return result;
  }

  // 代码异常
  if (event.error) {
    // chrome中的error对象没有fileName等属性,将event中的补充给error对象
    const e = event.error;
    e.fileName = e.filename || event.filename;
    e.columnNumber = e.colno || event.colno;
    e.lineNumber = e.lineno || event.lineno;
    return { eventId: 'code', ...parseError(e) };
  }

  // ie9版本,从全局的event对象中获取错误信息
  return {
    eventId: 'code',
    line: getGlobal().event.errorLine,
    col: getGlobal().event.errorCharacter,
    message: getGlobal().event.errorMessage,
    src: getGlobal().event.errorUrl,
  };
}

function initError(options: Options) {
  eventBus.addEvent({
    type: EVENTTYPES.ERROR,
    callback: (e) => emit(parseErrorEvent(e))
  })

  eventBus.addEvent({
    type: EVENTTYPES.UNHANDLEDREJECTION,
    callback: (e) => emit(parseErrorEvent(e))
  })

  // 捕获阶段可以获取资源加载错误,script.onError link.onError img.onError,无法知道具体状态
  // window.addEventListener('error', (e) => {
  //   emit(parseErrorEvent(e));
  // }, true);

  // promise调用链未捕获异常
  // window.addEventListener('unhandledrejection', (e) => {
  //   emit(parseErrorEvent(e));
  // });

  // 这个先不做
  // 劫持console.error
  const consoleError = console.error;
  console.error = function ce(...args) {
    args.forEach((e) => { emit({ eventId: 'code', ...parseError(e) }) });
    consoleError.apply(console, args);
  };
}

/**
 * 主动触发错误上报
 * @param {*} eventId 事件ID
 * @param {*} message 错误信息
 * @param {*} options 自定义配置信息
 * @returns
 */
function handleSendError(eventId, message, options = {}) {
  const customErrorRecord = { eventId, errMessage: message, ...options };

  // 针对自定义的异常上报,对params对特殊处理,将其序列化为string
  const { params } = customErrorRecord;
  if (params) {
    customErrorRecord.params = params;
  }
  return emit(customErrorRecord);
}

export {
  initError,
  handleSendError,
};
