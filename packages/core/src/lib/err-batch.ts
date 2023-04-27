import { sendData } from './sendData'
import { AnyFun } from '../types'
import { throttle, groupArray } from '../utils'

const SETTIMEA = 5000
const SETTIMEB = 20000

/**
 * 判断是否为批量错误
 * 判断流程:
 * 1. 先把所有错误都放入 a栈
 * 2. 每 2s查 a栈是否有批量错误(errMessage、errType相同且发生个数大于等于5)
 *     1. 如果为批量错误则合并这些错误并加入[时间区间参数、发生个数参数]后放入 b栈
 *     2. 不为批量错误则发送这些错误
 * 3. 每 30s查 b栈是否有批量错误(errMessage、errType相同且发生个数大于等于5) - b栈的批量错误可以视为持久错误了
 *     1. 如果为批量错误则合并这些错误并更新[时间区间参数、发生个数参数]，还是存放在 b栈(如果用户一直开网页并且一直报错会无限叠加这个时间,此类错误则为持久化错误)
 *     2. 不为批量错误则发送这些错误 (证明只是在某个区间报错)
 * 4. 在这个过程中，如果用户关闭了网页，会统一把 a栈、b栈内的数据发送
 */
class BatchError {
  cacheErrorA: any[]
  cacheErrorB: any[]
  throttleProxyAddCacheErrorA: AnyFun
  throttleProxyAddCacheErrorB: AnyFun
  constructor() {
    this.cacheErrorA = []
    this.cacheErrorB = []
    this.throttleProxyAddCacheErrorA = throttle(
      this.proxyAddCacheErrorA,
      SETTIMEA
    )
    this.throttleProxyAddCacheErrorB = throttle(
      this.proxyAddCacheErrorB,
      SETTIMEB
    )
  }
  proxyAddCacheErrorA() {
    // console.log('进入timmerA')
    let len = this.cacheErrorA.length
    if (!len) return
    const arr = groupArray(this.cacheErrorA, 'errMessage', 'errType')
    const arrA = arr.filter(item => item.length < 5)
    const arrB = arr.filter(item => item.length >= 5)

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
    // console.log('进入timmerB', JSON.stringify(this.cacheErrorB))
    const arr = groupArray(this.cacheErrorB, 'errMessage', 'errType')
    const arrA = arr.filter(item => item.length < 5)
    const arrB = arr.filter(item => item.length >= 5)

    console.log('arr', arr)

    while (len--) {
      this.cacheErrorB.shift()
    }

    if (arrA.length) {
      // 将区间报错合并
      const emitList: any[] = []
      arrA.forEach((itemList: any[]) => {
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
    if (arrB.length) {
      // 在这的错误就是无限错误
      const arrBsum: any[] = []
      arrB.forEach(itemList => {
        const sumItem = itemList[0]
        sumItem.batchError = true
        if (itemList.length > 1) {
          sumItem.batchErrorLength = itemList.reduce(
            (p, item) => (p += item.batchErrorLength),
            0
          )
          sumItem.batchErrorLastHappenTime =
            itemList[itemList.length - 1].triggerTime
        }
        arrBsum.push(sumItem)
      })
      this.cacheErrorB.push(...arrBsum)
      this.throttleProxyAddCacheErrorB()
    }
  }
  pushCacheErrorA(errorInfo: any) {
    this.cacheErrorA.push(errorInfo)
    this.throttleProxyAddCacheErrorA()
  }
}

export let batchError: BatchError

export function initBatchError() {
  batchError = new BatchError()
}
