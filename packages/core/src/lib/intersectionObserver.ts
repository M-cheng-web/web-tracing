import type { ElementOrList, TargetGather, AnyObj } from '../types'
import { unKnowToArray, getTimestamp, getLocationHref } from '../utils'
import { sendData } from './sendData'
import { _support } from '../utils/global'
import { SEDNEVENTTYPES } from '../common'

interface IoMap {
  [key: number]: IntersectionObserver
}

interface TargetMap {
  target: Element
  threshold: number
  observeTime: number // sdk开始监视的时间
  showTime?: number // sdk检测到的开始时间
  showEndTime?: number // sdk检测到的结束时间
  params?: AnyObj
}

/**
 * 元素曝光收集
 * 收集参数：曝光开始时间、曝光结束时间、被曝光元素上附带的额外参数
 * 收集契机：划出目标元素的收集范围
 */
class Intersection {
  private ioMap: IoMap = {}
  private targetMap: TargetMap[] = []
  private options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // 阀值设为0.5，当只有比例达到一半时才触发回调函数
  }
  /**
   * 针对 threshold 生成不同监听对象 (不允许同一个dom被两个监听对象监听)
   * @param threshold 阈值
   */
  private initObserver(threshold: number) {
    return new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const targetObj = this.targetMap.find(
              mapTarget => mapTarget.target === entry.target
            )
            if (targetObj) {
              targetObj.showTime = getTimestamp()
            }
          } else {
            const targetObj = this.targetMap.find(
              mapTarget => mapTarget.target === entry.target
            )
            if (targetObj) {
              // 在进入页面时指定了没有在屏幕可视界面的dom，会立即触发这里
              // 此时需要根据有无 showTime 区分是否为一个完整事件再去发送
              if (!targetObj.showTime) return
              targetObj.showEndTime = getTimestamp()
              this.sendEvent(targetObj)
            }
          }
        })
      },
      {
        ...this.options,
        threshold
      }
    )
  }
  /**
   * 发送事件
   */
  private sendEvent(targetObj: TargetMap) {
    // 只发送必要的数据，不包含 DOM 元素
    sendData.emit({
      eventType: SEDNEVENTTYPES.INTERSECTION,
      triggerPageUrl: getLocationHref(),
      threshold: targetObj.threshold,
      observeTime: targetObj.observeTime,
      showTime: targetObj.showTime,
      showEndTime: targetObj.showEndTime,
      params: targetObj.params
    })
  }
  /**
   * 开始观察目标元素
   * 分为初始加载和过程中加载
   * @param params 附带的额外参数
   */
  public observe(gather: TargetGather | TargetGather[]) {
    const _gather = unKnowToArray(gather)
    _gather.forEach(item => {
      const _targetList = unKnowToArray(item.target)

      if (!Object.prototype.hasOwnProperty.call(this.ioMap, item.threshold)) {
        this.ioMap[item.threshold] = this.initObserver(item.threshold || 0.5)
      }

      _targetList.forEach(target => {
        const index = this.targetMap.findIndex(
          mapTarget => mapTarget.target === target
        )
        // 不允许重复观察
        if (index === -1) {
          this.ioMap[item.threshold].observe(target)

          // 记录哪些元素被监听
          this.targetMap.push({
            target,
            threshold: item.threshold,
            observeTime: getTimestamp(), // 开始监听的时间
            params: item.params
          })
        }
      })
    })
  }
  /**
   * 对元素停止观察
   */
  public unobserve(target: ElementOrList) {
    const _targetList = unKnowToArray(target)

    _targetList.forEach(_target => {
      // 第一步：找出此元素代表的 threshold 值
      const targetIndex = this.targetMap.findIndex(
        mapTarget => mapTarget.target === _target
      )
      if (targetIndex === -1) return // 不存在的元素则跳过

      // 第二步：根据 threshold 值从 ioMap 获取到 io 实例
      const io = this.ioMap[this.targetMap[targetIndex].threshold]
      if (!io) return

      this.targetMap.splice(targetIndex, 1)

      // 第二步：io 实例执行 unobserve 方法
      io.unobserve(_target)
    })
  }
  /**
   * 对所有元素停止观察
   */
  public disconnect() {
    for (const key in this.ioMap) {
      if (Object.prototype.hasOwnProperty.call(this.ioMap, key)) {
        const io = this.ioMap[key]
        io.disconnect()
      }
    }
    this.targetMap = []
    this.ioMap = {}
  }
}

export let intersection: Intersection

/**
 * 初始化曝光监听
 */
export function initIntersection() {
  _support.intersection = new Intersection()
  intersection = _support.intersection
}

/**
 * 卸载所有曝光监听
 */
export function destroyIntersection() {
  intersection?.disconnect()
}
