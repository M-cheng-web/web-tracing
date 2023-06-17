import { sendData } from './sendData'
import { AnyFun } from '../types'
import { debounce, throttle, groupArray } from '../utils'

const SETTIMEA = 2000
const SETTIMEB = 20000
const MAXLENGTHA = 5
const GROUPARRAYKEY = ['errMessage', 'eventId', 'requestUrl']

/**
 * 判断是否为批量错误
 * 判断流程:
 * 1. 先把所有错误都放入 a栈
 * 2. 每次发生错误后防抖 2s查 a栈是否有批量错误(批量错误: errMessage、errType相同且发生个数大于等于5)
 *     1. 如果为批量错误则合并这些错误并加入[时间区间参数、发生个数参数]后放入 b栈
 *     2. 不为批量错误则发送这些错误
 * 3. 每次推入错误到b栈后延迟 20s查 b栈并发送这些错误
 * 4. 在这个过程中，如果用户关闭了网页，会统一把 a栈、b栈内的数据发送
 * 5. 在这个过程中，a栈每满50个错误也会强制触发a栈和b栈的错误处理（处理结果为直接发送批量错误）
 */
class BatchError {
  cacheErrorA: any[]
  cacheErrorB: any[]
  throttleProxyAddCacheErrorA: AnyFun
  throttleProxyAddCacheErrorB: AnyFun
  constructor() {
    this.cacheErrorA = []
    this.cacheErrorB = []
    this.throttleProxyAddCacheErrorA = debounce(
      this.proxyAddCacheErrorA,
      SETTIMEA
    )
    this.throttleProxyAddCacheErrorB = throttle(
      this.proxyAddCacheErrorB,
      SETTIMEB
    )
  }
  proxyAddCacheErrorA() {
    let len = this.cacheErrorA.length
    if (!len) return
    const arr = groupArray(this.cacheErrorA, ...GROUPARRAYKEY)
    const arrA = arr.filter(item => item.length < MAXLENGTHA)
    const arrB = arr.filter(item => item.length >= MAXLENGTHA)

    if (arrA.length) {
      sendData.emit(arrA.flat(Infinity))
    }
    if (arrB.length) {
      const arrBsum: any[] = []
      arrB.forEach(item => {
        const sumItem = item[0]
        sumItem.batchError = true
        sumItem.batchErrorLength = item.length
        sumItem.batchErrorLastHappenTime = item[item.length - 1].triggerTime
        arrBsum.push(sumItem)
      })
      this.cacheErrorB.push(...arrBsum)
      this.throttleProxyAddCacheErrorB()
    }

    while (len--) {
      this.cacheErrorA.shift()
    }
  }
  proxyAddCacheErrorB() {
    let len = this.cacheErrorB.length
    if (!len) return
    const arr = groupArray(this.cacheErrorB, ...GROUPARRAYKEY)

    while (len--) {
      this.cacheErrorB.shift()
    }

    // 将区间报错合并
    const emitList: any[] = []
    arr.forEach((itemList: any[]) => {
      const sumItem = itemList[0]
      if (itemList.length > 1) {
        sumItem.batchErrorLength = itemList.reduce(
          (p, item) => (p += item.batchErrorLength),
          0
        )
        sumItem.batchErrorLastHappenTime =
          itemList[itemList.length - 1].triggerTime
      }
      emitList.push(sumItem)
    })
    sendData.emit(emitList)
  }
  /**
   * 获取所有的错误
   * 用户突然关闭页面时调用此方法集成错误
   */
  sendAllCacheError() {
    const errInfoList = this.cacheErrorA.concat(this.cacheErrorB)
    const arr = groupArray(errInfoList, ...GROUPARRAYKEY)
    const arrA = arr.filter(item => item.length < MAXLENGTHA)
    const arrB = arr.filter(item => item.length >= MAXLENGTHA)

    if (arrA.length) {
      sendData.emit(arrA.flat(Infinity), true)
    }
    if (arrB.length) {
      const arrBsum: any[] = []
      arrB.forEach(item => {
        const sumItem = item[0]
        sumItem.batchError = true
        sumItem.batchErrorLength = item.length
        sumItem.batchErrorLastHappenTime = item[item.length - 1].triggerTime
        arrBsum.push(sumItem)
      })
      sendData.emit(arrBsum, true)
    }
  }
  pushCacheErrorA(errorInfo: any) {
    this.cacheErrorA.push(errorInfo)
    this.throttleProxyAddCacheErrorA()

    // 每 50 个触发一次强制发送事件
    if (this.cacheErrorA.length >= 50) {
      this.proxyAddCacheErrorA()
      this.proxyAddCacheErrorB()
    }
  }
}

export let batchError: BatchError

/**
 * 初始化错误缓存
 */
export function initBatchError() {
  batchError = new BatchError()
}
