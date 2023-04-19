import { init } from '@web-tracing/core'
// import { pad } from '@web-tracing/utils'
// console.log('pad', pad)

init({
  // dsn: 'https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/blog/Annapurna-Ranges-2560x1440.5r9m9t5vg1g0.webp',
  dsn: 'http://1.15.224.10:22/trackweb/tra',
  appName: 'cxh',
  debug: false,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 2,
  cacheWatingTime: 1000,
  beforePushEventList(data) {
    // console.log('beforePushEventList-data', data)
    return data
  },
  beforeSendData(data) {
    // console.log('beforeSendData-data', data)
    // return { xx: 2123 }
    return data
  },
  afterSendData(data) {
    // console.log('afterSendData-data', data)
  }
})
