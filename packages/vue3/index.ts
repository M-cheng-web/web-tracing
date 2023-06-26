import {
  init,
  InitOptions,
  traceError,
  logError,
  parseError,
  SENDID
} from '@web-tracing/core'

function install(app: any, options: InitOptions) {
  // app.config.errorHandler = function (err: Error): void {
  //   console.log('err', err)
  //   logError(err)
  //   const errorInfo = { eventId: SENDID.CODE, ...parseError(err) }
  //   traceError(errorInfo)
  // }
  init(options)
}

export default { install }
