import { add, look, lookFormat } from '@web-tracing/core'

const vue2add = (): number => {
  return add()
}

const vue2look = (): number => {
  return look()
}

const vue2lookFormat = (): string => {
  return lookFormat()
}

export { vue2add, vue2look, vue2lookFormat }
