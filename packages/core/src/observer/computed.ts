import { Watcher } from './watcher'
import { ObserverValue, AnyFun } from './types'
import { OBSERVERSIGNBOARD } from './config'

/**
 * 计算属性响应式
 */
export class Computed<T> {
  target: ObserverValue<T>
  constructor(target: ObserverValue<T>) {
    this.target = target
  }
  defineReactive() {
    const computedWatcher = new Watcher(this, { computed: true })

    // const proxyCache = new WeakMap<ObserverValue<any>, any>()
    const handlers: ProxyHandler<ObserverValue<any>> = {
      get() {
        if (computedWatcher.proxy.dirty) {
          // 代表这个属性已经脏了,需要更新(重新运算)
          // console.log('计算属性：取新值')
          computedWatcher.depend() // 添加上下文与此属性绑定
          return computedWatcher.get()
        } else {
          // 代表这个属性不需要重新运算
          // console.log('计算属性：取旧值')

          // 取旧值的时候也要添加上下文绑定
          // 因为其他值在依赖这个计算属性的时候,有可能会依赖到旧的值
          // 所以在依赖到旧值时也要添加上下文绑定,从而当这个计算属性被改变时也能通知到对方改变
          // 一开始我就是没进行这一步,从而导致莫名bug
          computedWatcher.depend()
          return computedWatcher.proxy.value
        }
      }
    }
    return new Proxy<ObserverValue<T>>(this.target, handlers)
  }
}

export const computedMap = new WeakMap<Computed<any>, AnyFun>()

export function computed<T>(fun: AnyFun) {
  const target: any = { value: 0 }
  target[OBSERVERSIGNBOARD] = true

  const ob = new Computed<T>(target)
  const proxy = ob.defineReactive()

  computedMap.set(ob, fun)
  return proxy
}
