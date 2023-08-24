import { record } from 'rrweb'
import pako from 'pako'
import { Base64 } from 'js-base64'
import { RecordEventScope } from '../types'
import { getTimestamp } from '../utils'
import { options } from './options'

/**
 * 只存储最近30s的所有录屏 (分为3段)
 * 第一段：0-10
 * 第二段：10-20
 * 第三段：20-30
 *
 * 当结束 30-40 的录屏时会把 0-10 录屏推出，并将此次录屏放入
 * 数据结构: [
 *  {scope: '1684826667798-1684826669998', eventList: [...]},
 *  {scope: '1684826679998-1684826689998', eventList: [...]},
 *  {scope: '1684826699998-1684826799998', eventList: [...]},
 * ]
 *
 * 举例：当第34秒发生错误时，此时的录屏数组是这样 [
 *  {scope: '0-10', eventList: [...]},
 *  {scope: '10-20', eventList: [...]},
 *  {scope: '20-30', eventList: [...]},
 *  {scope: '30-40', eventList: [...]},
 * ]
 *
 * 此时30-40的 eventList 还在不断push中，但在错误发生时，我们可以把存住此时的录屏数组
 * 然后直接去数组的最后一位的 eventList + 最后第二位的 eventList 拼接（会导致视频时长不固定，但会在10-20，如果想缩小范围，可更改 MAXSCOPETIME）
 * 注意：如果拼接发现 eventList 长度为0或者很少，很大可能是用户没有手动操作且系统自动报错
 *
 * 而真正的录屏数组在填满 30-40 的 eventList 时则删除数组第一位数据
 *
 * 真实效果：
 * MAXSCOPETIME 我这边设置为 5s，所以最终录制的时长为 5s-10s
 * 但是会有几个特殊场景导致录屏时间过短:
 * 1. 因为录制的插件只会在用户操作网页时运作，当用户停止操作页面或者页面处于休眠状态则会停止记录
 *  直到用户重新操作页面，所以会出现用户停止操作1分钟后2s后触发了一个错误，此时sdk只会记录这个2s的操作
 * 2. 另外就是程序刚进来的报错也会导致录屏时间小于5s
 */

const MAXSCOPETIME = 5000 // 每5s记录一个区间
const MAXSCOPELENGTH = 3 // 录屏数组最长长度 - 不要小于3

export class RecordScreen {
  public eventList: RecordEventScope[] = [
    { scope: `${getTimestamp()}-`, eventList: [] }
  ]
  constructor() {
    this.init()
  }
  private init() {
    record({
      emit: (event, isCheckout) => {
        const lastEvents = this.eventList[this.eventList.length - 1]
        lastEvents.eventList.push(event)
        if (isCheckout) {
          if (this.eventList.length > 0) {
            this.eventList[this.eventList.length - 1].scope =
              lastEvents.scope + getTimestamp()
          }
          if (this.eventList.length > MAXSCOPELENGTH) {
            this.eventList.shift()
          }
          this.eventList.push({ scope: `${getTimestamp()}-`, eventList: [] })
        }
      },
      recordCanvas: true,
      checkoutEveryNms: MAXSCOPETIME // 每5s重新制作快照
    })
  }
}

export let recordscreenList: RecordEventScope[]

export function initRecordScreen() {
  recordscreenList = options.value.recordScreen
    ? new RecordScreen().eventList
    : []
}

/**
 * 压缩
 * @param data 压缩源
 */
export function zip(data: any): string {
  if (!data) return data

  // 判断数据是否需要转为JSON
  const dataJson =
    typeof data !== 'string' && typeof data !== 'number'
      ? JSON.stringify(data)
      : data

  // 使用Base64.encode处理字符编码，兼容中文
  const str = Base64.encode(dataJson as string)
  const binaryString = pako.gzip(str)
  const arr = Array.from(binaryString)
  let s = ''
  arr.forEach((item: number) => {
    s += String.fromCharCode(item)
  })
  return Base64.btoa(s)
}

/**
 * 解压
 * @param b64Data 解压源
 */
export function unzip(b64Data: string) {
  const strData = Base64.atob(b64Data)
  const charData = strData.split('').map(function (x) {
    return x.charCodeAt(0)
  })
  const binData = new Uint8Array(charData)
  const data: any = pako.ungzip(binData)
  // ↓切片处理数据，防止内存溢出报错↓
  let str = ''
  const chunk = 8 * 1024
  let i
  for (i = 0; i < data.length / chunk; i++) {
    str += String.fromCharCode.apply(
      null,
      data.slice(i * chunk, (i + 1) * chunk)
    )
  }
  str += String.fromCharCode.apply(null, data.slice(i * chunk))
  // ↑切片处理数据，防止内存溢出报错↑
  const unzipStr = Base64.decode(str)
  let result = ''
  // 对象或数组进行JSON转换
  try {
    result = JSON.parse(unzipStr)
  } catch (error: any) {
    if (/Unexpected token o in JSON at position 0/.test(error)) {
      // 如果没有转换成功，代表值为基本数据，直接赋值
      result = unzipStr
    }
  }
  return result
}
