import { Dep } from './dep'
import { ObserverValue, AnyFun } from './types'
import { OBSERVERSIGNBOARD } from './config'

function isRegExp(value: any) {
  return Object.prototype.toString.call(value) === `[object RegExp]`
}

class Observer<T> {
  target: ObserverValue<T>
  constructor(target: ObserverValue<T>) {
    this.target = target
  }
  defineReactive() {
    const dep = new Dep()
    const handlers = getHandlers(
      () => {
        dep.addSub()
      },
      (oldValue: any) => {
        dep.notify(oldValue)
      }
    )
    return new Proxy<ObserverValue<T>>(this.target, handlers)
  }
}

function getHandlers(
  getCallBack?: AnyFun,
  setCallBack?: AnyFun
): ProxyHandler<ObserverValue<any>> {
  const proxyCache = new WeakMap<ObserverValue<any>, any>()
  const handlers: ProxyHandler<ObserverValue<any>> = {
    get(target, key: string, receiver) {
      // console.log(`读取属性：${key}`)
      const value = Reflect.get(target, key, receiver)
      getCallBack && getCallBack()
      if (typeof value === 'object' && value !== null && !isRegExp(value)) {
        let proxy = proxyCache.get(value)
        if (!proxy) {
          proxy = new Proxy(value, handlers)
          proxyCache.set(value, proxy)
        }
        return proxy
      }
      return value
    },
    set(target, key: string, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      if (oldValue === value) return oldValue
      // console.log(`设置属性：${key}=${value}, oldValue:${oldValue}`)
      const beforeTarget = JSON.parse(JSON.stringify(target))
      const result = Reflect.set(target, key, value, receiver)
      setCallBack && setCallBack(beforeTarget)
      return result
    }
  }
  return handlers
}

export const refMap = new WeakMap<any, ObserverValue<any>>()

export function ref<T>(target: T) {
  const newObj: any = { value: target }
  newObj[OBSERVERSIGNBOARD] = true

  const ob = new Observer<T>(newObj)
  const proxy = ob.defineReactive()

  refMap.set(ob, proxy)
  return proxy
}

export function isRef(ref: any) {
  return !!ref[OBSERVERSIGNBOARD]
}

export function unRef(ref: any) {
  return isRef(ref) ? ref.value : ref
}
