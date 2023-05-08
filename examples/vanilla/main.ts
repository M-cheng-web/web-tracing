import { init } from '@web-tracing/core'
// import { pad } from '@web-tracing/utils'

start()

function start() {
  init({
    // dsn: 'https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/blog/Annapurna-Ranges-2560x1440.5r9m9t5vg1g0.webp',
    dsn: 'http://1.15.224.10:22/trackweb/tra',
    appName: 'cxh',
    debug: true,
    pv: true,
    performance: true,
    error: true,
    event: true,
    cacheMaxLength: 10,
    cacheWatingTime: 1000,

    // scopeError: true,

    // tracesSampleRate: 0.5,

    // ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
    // ignoreRequest: ['111', /normal/],

    beforePushEventList(data) {
      // console.log('beforePushEventList-data', data)
      return data
    },
    beforeSendData(data) {
      // console.log('beforeSendData-data', data)
      // return { xx: 2123 }
      // 返回false代表sdk不再发送
      // return false
      return data
    },
    afterSendData(data) {
      // console.log('afterSendData-data', data)
    }
  })
}
