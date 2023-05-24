import { record } from 'rrweb'
import pako from 'pako'
import { Base64 } from 'js-base64'
import { RecordEventScope } from '../types'
import { getTimestamp } from '../utils'

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
 */

const MAXSCOPETIME = 5000 // 每10s记录一个区间
const MAXSCOPELENGTH = 3 // 录屏数组最长长度

export class RecordScreen {
  public eventList: RecordEventScope[] = [
    { scope: `${getTimestamp()}-`, eventList: [] }
  ]
  constructor() {
    this.init()
  }
  private init() {
    setInterval(() => {
      // console.log('发生', this.eventList)
      if (this.eventList.length > 0) {
        const lastEvents = this.eventList[this.eventList.length - 1]
        this.eventList[this.eventList.length - 1].scope =
          lastEvents.scope + getTimestamp()
      }
      if (this.eventList.length > MAXSCOPELENGTH) {
        this.eventList.shift()
      }
      this.eventList.push({ scope: `${getTimestamp()}-`, eventList: [] })
    }, MAXSCOPETIME)

    record({
      emit: event => {
        const lastEvents = this.eventList[this.eventList.length - 1]
        lastEvents.eventList.push(event)
      },
      recordCanvas: true

      // 默认每10s重新制作快照
      // checkoutEveryNms: 1000
    })
  }
}

export let recordscreenList: RecordEventScope[]

export function initRecordScreen() {
  recordscreenList = new RecordScreen().eventList
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
  arr.forEach((item: any) => {
    s += String.fromCharCode(item)
  })
  return Base64.btoa(s)
}
