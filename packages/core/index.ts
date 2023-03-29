import type { EventDemo } from '@web-tracing/types'
import { pad } from '@web-tracing/utils'

let sum = 0

const add = (num = 1): number => {
  sum += num
  return sum
}

const del = (num = 1): number => {
  sum -= num
  return sum
}

const change = (num: number): number => {
  sum = num
  return sum
}

const look = (): number => {
  return sum
}

const lookFormat = (): string => {
  const demoObj: EventDemo = {
    name: 'ccc'
  }
  console.log(111, demoObj)
  console.log('pad', pad(sum, 6))
  return pad(sum, 6)
}

export { add, del, change, look, lookFormat }
