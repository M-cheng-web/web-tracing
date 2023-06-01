import { Watcher } from './watcher'
import { isRef } from './ref'
import { ObserverValue, AnyFun, voidFun } from './types'

function watchInit(callback: AnyFun, getter: AnyFun) {
  new Watcher('', { watch: true, callback }, getter)
}

export function watch<T>(target: ObserverValue<T>, fun: voidFun<T>) {
  if (!isRef(target)) return
  watchInit(
    (newValue: T, oldValue: T) => {
      fun(newValue, oldValue)
    },
    function () {
      return target.value
    }
  )
}
