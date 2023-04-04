import { UAParser } from 'ua-parser-js';
import { isWindow } from './is';
import { WebTracing } from '../types/common';

export const isBrowserEnv = isWindow(
  typeof window !== 'undefined' ? window : 0
);

/**
 * 获取全局变量
 */
export function getGlobal() {
  if (isBrowserEnv) return window;
  return {} as any
}

const _global = getGlobal();
const _support = getGlobalSupport();
const uaResult = new UAParser().getResult();

// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
};

_support.replaceFlag = _support.replaceFlag || {};
const replaceFlag = _support.replaceFlag;
export function setFlag(replaceType: string, isSet: boolean) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
export function getFlag(replaceType: string) {
  return replaceFlag[replaceType] ? true : false;
}

/**
 * 获取全部变量 __webTracing__ 的引用地址
 */
export function getGlobalSupport(): WebTracing {
  _global.__webTracing__ = _global.__webTracing__ || ({} as WebTracing);
  return _global.__webTracing__;
}
export function supportsHistory(): boolean {
  const chrome = _global.chrome;
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  const hasHistoryApi =
    'history' in _global && !!_global.history.pushState && !!_global.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}

export { _global, _support };
