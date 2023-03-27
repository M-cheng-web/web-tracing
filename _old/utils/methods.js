/**
 * 补全字符
 * @param {*} num 初始值
 * @param {*} len 需要补全的位数
 * @param {*} placeholder 补全的值
 * @returns 补全后的值
 */
function pad(num, len, placeholder = '0') {
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

/**
 * 获取一个随机字符串(全局唯一标识符)
 */
function uuid() {
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
 * @param {String} name cookie名
 * @returns
 */
function getCookieByName(name) {
  const result = document.cookie.match(new RegExp(`${name}=([^;]+)(;|$)`))
  return result ? result[1] : undefined
}

/**
 * 向下兼容发送信号的方法
 */
const sendBeacon = navigator.sendBeacon
  ? (url, data) => {
      if (data) navigator.sendBeacon(url, JSON.stringify(data))
    }
  : (url, data) => {
      // 传统方式传递参数
      const beacon = new Image()
      beacon.src = `${url}?v=${encodeURIComponent(JSON.stringify(data))}`
    }

const arrayMap =
  Array.prototype.map ||
  function polyfillMap(fn) {
    const result = []
    for (let i = 0; i < this.length; i += 1) {
      result.push(fn(this[i], i, this))
    }
    return result
  }

/**
 * map方法
 * @param {Array} arr 源数组
 * @param {Function} fn 条件函数
 * @returns
 */
function map(arr, fn) {
  return arrayMap.call(arr, fn)
}

const arrayFilter =
  Array.prototype.filter ||
  function filterPolyfill(fn) {
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
 * @param {Array} arr 源数组
 * @param {Function} fn 条件函数
 * @returns
 */
function filter(arr, fn) {
  return arrayFilter.call(arr, fn)
}

const arrayFind =
  Array.prototype.find ||
  function findPolyfill(fn) {
    for (let i = 0; i < this.length; i += 1) {
      if (fn(this[i], i, this)) {
        return this[i]
      }
    }
    return undefined
  }

/**
 * find方法
 * @param {Array} arr 源数组
 * @param {Function} fn 条件函数
 * @returns
 */
function find(arr, fn) {
  return arrayFind.call(arr, fn)
}

/**
 * 去除头部或者尾部的空格
 * @param {*} str 需要去除的字符串
 * @returns 去除后的字符串
 */
function trim(str = '') {
  return str.replace(/(^\s+)|(\s+$)/, '')
}

/**
 * 可以理解为异步执行
 * requestIdleCallback 是浏览器空闲时会自动执行内部函数
 * requestAnimationFrame 是浏览器必须执行的
 * 关于 requestIdleCallback 和  requestAnimationFrame 可以参考 https://www.cnblogs.com/cangqinglang/p/13877078.html
 */
const nextTime =
  window.requestIdleCallback ||
  window.requestAnimationFrame ||
  (callback => setTimeout(callback, 17))

/**
 * 取消异步执行
 */
const cancelNextTime =
  window.cancelIdleCallback || window.cancelAnimationFrame || clearTimeout

export {
  uuid,
  getCookieByName,
  sendBeacon,
  map,
  filter,
  find,
  trim,
  nextTime,
  cancelNextTime
}
