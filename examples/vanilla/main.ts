import {
  init,
  beforePushEventList,
  beforeSendData,
  afterSendData,
  setUserUuid,
  getBaseInfo,
  getFirstScreen,
  getIPs
} from '@web-tracing/core'
// import { pad } from '@web-tracing/utils'

start()

// beforePushEventList(data => {
//   console.log('-----------beforePushEventList--0', data)
//   return data
// })

// setTimeout(() => {
//   beforePushEventList(data => {
//     console.log('-----------beforePushEventList1', data)
//     return data
//   })
//   beforePushEventList(data => {
//     console.log('-----------beforePushEventList2', data)
//     return data
//   })
//   beforeSendData(data => {
//     console.log('-----------beforeSendData1', data)
//     return data
//   })
//   beforeSendData(data => {
//     console.log('-----------beforeSendData2', data)
//     return data
//   })
//   afterSendData(data => {
//     console.log('-----------afterSendData1', data)
//   })
//   afterSendData(data => {
//     console.log('-----------afterSendData2', data)
//   })
//   setUserUuid('xxxxxxxx1')
//   console.log('getBaseInfo', getBaseInfo())
//   console.log('getFirstScreen', getFirstScreen())
// }, 2000)

// // 手动发送错误
// setTimeout(() => {
//   traceError('自定义错误ID', '自定义错误message', {
//     src: '/interface/order',
//     params: {
//       id: '12121'
//     }
//   })
// }, 3000)

// // 手动发送资源事件
// setTimeout(() => {
//   tracePerformance('自定义ID', {
//     params: {
//       param1: 'param1222',
//       param2: 'param2',
//       param3: 'param3'
//     }
//   })
// }, 3000)

// // 手动发送点击事件
// setTimeout(() => {
//   traceCustomEvent('自定义ID', '自定义事件标题', {
//     params: {
//       params1: 'params1',
//       params2: 'params2',
//       params3: 'params3'
//     }
//   })
// }, 3000)

// // 手动发送pv事件
// setTimeout(() => {
//   tracePageView({
//     url: '自定义URL',
//     referer: '自定义上级URL',
//     params: { name: '自定义name' },
//     actions: 'reserved'
//   })
// }, 3000)

function start() {
  init({
    // dsn: 'https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/blog/Annapurna-Ranges-2560x1440.5r9m9t5vg1g0.webp',
    dsn: 'http://1.15.224.10:22/trackweb/tra',
    appName: 'cxh',
    debug: false,
    pv: true,
    performance: true,
    error: true,
    event: true,
    // localization: true,
    cacheMaxLength: 10,
    cacheWatingTime: 1000,
    userUuid: 'init_userUuid',

    scopeError: true,

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
      return false
      // return data
    },
    afterSendData(data) {
      // console.log('afterSendData-data', data)
    }
  })
}
