import { deepAssign } from '../utils'

interface SendData {
  baseInfo: object
  eventInfo: unknown[]
}

export class LocalStorageUtil {
  static maxSize = 5 * 1024 * 1000 // 5Mb

  static getItem(key: string): any {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
    return null
  }

  static setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  static getSize(): number {
    let size = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          size += this.getBytes(value)
        }
      }
    }
    return size
  }

  /**
   * sendData专属存储
   * 特殊性:
   * 1. 每次存储检查最大容量(5M)，如超过则不再继续存并通知外部
   * 2. 按照特定结构去拼接
   *
   * 注意：刷新页面测试会加入卸载事件，这在控制台是看不到的
   */
  static setSendDataItem(key: string, value: SendData) {
    if (this.getSize() >= this.maxSize) return

    const localItem = (this.getItem(key) || {
      baseInfo: {},
      eventInfo: []
    }) as SendData

    const newItem: SendData = {
      baseInfo: deepAssign(localItem.baseInfo, value.baseInfo),
      eventInfo: localItem.eventInfo.concat(value.eventInfo)
    }

    this.setItem(key, newItem)
  }

  private static getBytes(str: string): number {
    const blob = new Blob([str])
    return blob.size
  }
}
