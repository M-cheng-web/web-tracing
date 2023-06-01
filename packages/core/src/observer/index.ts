// import { ref } from './ref'
import { computed } from './computed'
import { watch } from './watch'

export * from './ref'
export { computed, watch }

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
