import { AnyFun, AnyObj } from '../types'
import { logError } from './debug'
import { isRegExp, isArray, isFunction, isNumber } from './is'
import { isInit } from '../utils/global'

/**
 * 添加事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param opitons
 */
export function on(
  target: Window | Document,
  eventName: string,
  handler: AnyFun,
  opitons = false
): void {
  target.addEventListener(eventName, handler, opitons)
}

/**
 * 重写对象上面的某个属性
 * @param source 需要被重写的对象
 * @param name 需要被重写对象的key
 * @param replacement 以原有的函数作为参数，执行并重写原有函数
 * @param isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceAop(
  source: AnyObj,
  name: string,
  replacement: AnyFun,
  isForced = false
): void {
  if (source === undefined) return
  if (name in source || isForced) {
    const original = source[name]
    const wrapped = replacement(original)
    if (isFunction(wrapped)) {
      source[name] = wrapped
    }
  }
}

/**
 * 格式化对象(针对数字类型属性)
 * 小数位数保留最多两位、空值赋 undefined
 * @param source 源对象
 */
export function normalizeObj(source: AnyObj) {
  Object.keys(source).forEach(p => {
    const v = source[p]
    if (isNumber(v)) {
      source[p] = v === 0 ? undefined : parseFloat(v.toFixed(2))
    }
  })
  return source
}

/**
 * 获取当前页面的url
 * @returns 当前页面的url
 */
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return ''
  return document.location.href
}

/**
 * 获取当前的时间戳
 * @returns 当前的时间戳
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 * 函数节流
 * @param fn 需要节流的函数
 * @param delay 节流的时间间隔
 * @param runFirst 是否需要第一个函数立即执行 (每次)
 * @returns 返回一个包含节流功能的函数
 */
export function throttle(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null
  let lastArgs: any[]

  return function (this: any, ...args: any[]) {
    lastArgs = args

    if (timer === null) {
      if (runFirst) {
        func.apply(this, lastArgs)
      }
      timer = setTimeout(() => {
        timer = null
        func.apply(this, lastArgs)
      }, wait)
    }
  }
}

/**
 * 函数防抖
 * @param func 需要防抖的函数
 * @param wait 防抖的时间间隔
 * @param runFirst 是否需要第一个函数立即执行
 * @returns 返回一个包含防抖功能的函数
 */
export function debounce(func: AnyFun, wait: number, runFirst = false) {
  let timer: NodeJS.Timeout | null = null

  return function (this: any, ...arg: any[]) {
    if (runFirst) {
      func.call(this, ...arg)
      runFirst = false
    }
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.call(this, ...arg)
    }, wait)
  }
}

/**
 * 将数组内对象以对象内的属性分类
 * @param arr 数组源 - 格式为 [{}, {}...]
 * @param pop 是否需要在遍历后清除源数组内的数据
 * @param keys 需要匹配的属性名
 */
export function groupArray<T, K extends keyof T>(
  arr: T[],
  ...keys: K[]
): T[][] {
  const groups = new Map<string, T[]>()
  for (const obj of arr) {
    const key = keys
      .filter(k => obj[k])
      .map(k => obj[k])
      .join(':')
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(obj)
  }
  return Array.from(groups.values())
}

/**
 * 深度合并对象
 */
export function deepAssign<T>(target: AnyObj, ...sources: AnyObj[]) {
  sources.forEach(source => {
    for (const key in source) {
      if (source[key] !== null && isRegExp(source[key])) {
        target[key] = source[key]
      } else if (source[key] !== null && typeof source[key] === 'object') {
        // 如果当前 key 对应的值是一个对象或数组，则进行递归
        target[key] = deepAssign(
          target[key] || (isArray(source[key]) ? [] : {}),
          source[key]
        )
      } else {
        // 如果当前 key 对应的值是基本类型数据，则直接赋值
        target[key] = source[key]
      }
    }
  })
  return target as T
}

/**
 * 验证调用sdk暴露的方法之前是否初始化
 * @param methodsName 方法名
 * @returns 是否通过验证
 */
export function validateMethods(methodsName: string): boolean {
  if (!isInit()) {
    logError(`${methodsName} 需要在SDK初始化之后使用`)
    return false
  }
  return true
}

/**
 * 判断入参类型
 * @param target 任意入参
 * @returns 类型
 */
export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}

/**
 * 判断对象中是否包含该属性
 * @param key 键
 * @param object 对象
 * @returns 是否包含
 */
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

/**
 * 随机概率通过
 * @param randow 设定比例，例如 0.7 代表 70%的概率通过
 * @returns 是否通过
 */
export function randomBoolean(randow: number) {
  return Math.random() <= randow
}

/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
export function pad(num: number, len: number, placeholder = '0') {
  const str = String(num)
  if (str.length < len) {
    let result = str
    for (let i = 0; i < len - str.length; i += 1) {
      result = placeholder + result
    }
    return result
  }
  return str
}

export function getBaseUrl(url: string) {
  return url.split('?')[0]
  // // 正则表达式匹配不包含查询字符串的URL部分
  // const regex = /^(?:https?:\/\/)?[^/?]+(?:\/[^?]*)?(?=\?.*)?/
  // const match = url.match(regex)

  // // 如果匹配成功，则返回匹配的结果，否则返回原URL
  // return match ? match[0] : url
}

/**
 * 获取一个随机字符串
 */
export function uuid() {
  const date = new Date()

  // yyyy-MM-dd的16进制表示,7位数字
  const hexDate = parseInt(
    `${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(
      date.getDate(),
      2
    )}`,
    10
  ).toString(16)

  // hh-mm-ss-ms的16进制表示，最大也是7位
  const hexTime = parseInt(
    `${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(
      date.getSeconds(),
      2
    )}${pad(date.getMilliseconds(), 3)}`,
    10
  ).toString(16)

  // 第8位数字表示后面的time字符串的长度
  let guid = hexDate + hexTime.length + hexTime

  // 补充随机数，补足32位的16进制数
  while (guid.length < 32) {
    guid += Math.floor(Math.random() * 16).toString(16)
  }

  // 分为三段，前两段包含时间戳信息
  return `${guid.slice(0, 8)}-${guid.slice(8, 16)}-${guid.slice(16)}`
}

/**
 * 获取cookie中目标name的值
 * @param name cookie名
 * @returns
 */
export function getCookieByName(name: string) {
  const result = document.cookie.match(new RegExp(`${name}=([^;]+)(;|$)`))
  return result ? result[1] : undefined
}

/**
 * 发送数据方式 - navigator.sendBeacon
 */
export function sendByBeacon(url: string, data: any) {
  return navigator.sendBeacon(url, JSON.stringify(data))
}

export const sendReaconImageList: any[] = []

/**
 * 发送数据方式 - image
 */
export function sendByImage(url: string, data: any): Promise<void> {
  return new Promise(resolve => {
    const beacon = new Image()
    beacon.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`
    sendReaconImageList.push(beacon)
    beacon.onload = () => {
      // 发送成功
      resolve()
    }
    beacon.onerror = function () {
      // 发送失败
      resolve()
    }
  })
}

/**
 * 发送数据方式 - xml
 */
export function sendByXML(url: string, data: any): Promise<void> {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.send(JSON.stringify(data))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        resolve()
      }
    }
  })
}

/**
 * 批量执行方法
 * @param funList 方法数组
 * @param through 是否将第一次参数贯穿全部方法
 * @param args 额外参数
 * @returns
 */
export function executeFunctions(
  funList: AnyFun[],
  through: boolean,
  args: any
): any {
  if (funList.length === 0) return args

  let result: any = undefined
  for (let i = 0; i < funList.length; i++) {
    const func = funList[i]
    if (i === 0 || through) {
      result = func(args)
    } else {
      result = func(result)
    }
  }
  return result
}

/**
 * 将未知参数转换为数组格式
 * @param target
 */
export function unKnowToArray<T>(target: T[] | T): T[] {
  return (isArray(target) ? target : [target]) as T[]
}

const arrayMap =
  Array.prototype.map ||
  function polyfillMap(this: any, fn) {
    const result = []
    for (let i = 0; i < this.length; i += 1) {
      result.push(fn(this[i], i, this))
    }
    return result
  }

/**
 * map方法
 * @param arr 源数组
 * @param fn 条件函数
 * @returns
 */
export function map(arr: any[], fn: AnyFun) {
  return arrayMap.call(arr, fn)
}

const arrayFilter =
  Array.prototype.filter ||
  function filterPolyfill(this: any, fn: AnyFun) {
    const result = []
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        result.push(this[i])
      }
    }
    return result
  }

/**
 * filter方法
 * @param arr 源数组
 * @param fn 条件函数
 */
export function filter(arr: any[], fn: AnyFun) {
  return arrayFilter.call(arr, fn)
}

const arrayFind =
  Array.prototype.find ||
  function findPolyfill(this: any, fn: AnyFun) {
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        return this[i]
      }
    }
    return undefined
  }

/**
 * find方法
 * @param arr 源数组
 * @param fn 条件函数
 */
export function find(arr: any[], fn: AnyFun) {
  return arrayFind.call(arr, fn)
}

/**
 * 去除头部或者尾部的空格
 * @param str 需要去除的字符串
 * @returns 去除后的字符串
 */
export function trim(str = '') {
  return str.replace(/(^\s+)|(\s+$)/, '')
}

/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
export const nextTime =
  window.requestIdleCallback ||
  window.requestAnimationFrame ||
  (callback => setTimeout(callback, 17))

/**
 * 取消异步执行
 */
export const cancelNextTime =
  window.cancelIdleCallback || window.cancelAnimationFrame || clearTimeout

/**
 * 判断对象是否超过指定kb大小
 * @param object 源对象
 * @param limitInKB 最大kb
 */
export function isObjectOverSizeLimit(
  object: object,
  limitInKB: number
): boolean {
  const serializedObject = JSON.stringify(object)
  const sizeInBytes = new TextEncoder().encode(serializedObject).length
  const sizeInKB = sizeInBytes / 1024
  return sizeInKB > limitInKB
}

/**
 * 获取url地址上的参数
 * @param url 请求url
 * @returns 参数对象
 */
export function parseGetParams(url: string): AnyObj<string> {
  const params: AnyObj<string> = {}
  const query = url.split('?')[1]

  if (query) {
    const pairs = query.split('&')
    for (const pair of pairs) {
      const [key, value] = pair.split('=')
      params[decodeURIComponent(key)] = decodeURIComponent(value)
    }
  }
  return params
}

/**
 * 深拷贝
 * 兼容函数，对象，相互引用场景
 * @param target 需要深拷贝的原对象
 * @return 深拷贝后的对象
 */
export function deepCopy<T>(target: T, map = new Map()) {
  if (target !== null && typeof target === 'object') {
    let res = map.get(target)
    if (res) return res
    if (target instanceof Array) {
      res = []
      map.set(target, res)
      target.forEach((item, index) => {
        res[index] = deepCopy(item, map)
      })
    } else {
      res = {}
      map.set(target, res)
      Object.keys(target).forEach(key => {
        if (isValidKey(key, target)) {
          res[key] = deepCopy(target[key], map)
        }
      })
    }
    return res
  }
  return target
}
