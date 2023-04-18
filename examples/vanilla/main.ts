import { init } from '@web-tracing/core'
// import { pad } from '@web-tracing/utils'
// console.log('pad', pad)

init({
  dsn: 'http://1.15.224.10:22/trackweb/tra',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 2,
  cacheWatingTime: 1000
})
