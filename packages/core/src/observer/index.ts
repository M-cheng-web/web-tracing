import { ref as _ref } from './ref'
import { computed as _computed } from './computed'
import { watch as _watch } from './watch'
import { ObserverValue, AnyFun, voidFun } from './types'

/**
 * 响应式
 * 说明：与vue用法相似，但不提供多样的写法，只完成了基础用法，observer文件并不引用其他文件，为了方便移植
 * 完成功能：ref computed watch
 * 兼容性：需要支持proxy，如不支持则响应式无效
 *
 * 不支持proxy时各个函数表现：
 * ref：返回 { value: target } 对象
 * computed：返回 { value: fun() } 对象
 * watch：返回空函数
 */

function hasProxy(): boolean {
  return !!window.Proxy
}

function ref<T>(target: T) {
  return hasProxy() ? _ref<T>(target) : { value: target }
}

function computed<T>(fun: AnyFun) {
  return hasProxy() ? _computed<T>(fun) : { value: fun() }
}

function watch<T>(target: ObserverValue<T>, fun: voidFun<T>) {
  return hasProxy() ? _watch<T>(target, fun) : () => ({})
}

export { ref, computed, watch }

// ---------------- demo 1 ----------------
// const data = {
//   name: 'aaa',
//   age: 1,
//   cheng: {
//     a: 1,
//     b: 1,
//     c: 1
//   }
// }
// const a = ref(data)
// const b = ref({
//   name: 'bbb',
//   age: 2
// })
// const c = ref({
//   name: 'ccc',
//   age: 3
// })
// const d = computed<number>(() => a.value.age + b.value.age + c.value.age)

// watch(d, val => {
//   console.log('val', val)
// })

// setTimeout(() => {
//   a.value.age = 11
//   console.log('d', d.value)
// }, 1000)

// ---------------- demo 2 ----------------
// const a = ref(1)
// const b = ref(2)
// const c = ref(3)

// const d = computed<number>(() => a.value + b.value) // 3
// const e = computed<number>(() => d.value + c.value) // 6
// const f = computed<number>(() => e.value + d.value) // 9

// c.value = 6

// setTimeout(() => {
//   console.log('f', f.value) // 12
// }, 1000)

// ---------------- demo 3 ----------------
// const a = ref(1)
// const b = ref(2)
// const c = 3

// const d = computed<number>(() => a.value + b.value) // 3
// const e = computed<number>(() => d.value + c) // 6

// setTimeout(() => {
//   console.log('e', e.value) // 6
// }, 1000)
