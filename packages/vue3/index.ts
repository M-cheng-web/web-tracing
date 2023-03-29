import { add, look, lookFormat } from '@web-tracing/core'

const vue3add = (): number => {
  return add()
}

const vue3look = (): number => {
  return look()
}

const vue3lookFormat = (): string => {
  return lookFormat()
}

export { vue3add, vue3look, vue3lookFormat }
