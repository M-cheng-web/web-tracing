import { init, InitOptions } from '@web-tracing/core'

function install(app: any, options: InitOptions) {
  init(options)
}

export default { install }
export * from '@web-tracing/core'
