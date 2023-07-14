# Start
WebTracing是一个基于 JavaScript 的埋点SDK

它努力为你的前端项目提供【 行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段

下面让我们开始逐步了解它吧，相信它不会让你失望

## 安装 - HTML & JS
``` html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <script src="https://cdn.jsdelivr.net/npm/web-tracing"></script>
  <script>
    webtracing.init({
      appName: 'cxh',
      debug: true,
      pv: true,
      performance: true,
      error: true,
      event: true,
      cacheMaxLength: 10,
      cacheWatingTime: 1000,
      userUuid: 'init_userUuid',

      scopeError: true,

      tracesSampleRate: 0.5,

      ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
      ignoreRequest: ['111', /normal/],

      beforePushEventList(data) {
        return data
      },
      beforeSendData(data) {
        // 返回false代表sdk不再发送
        return data
      },
      afterSendData(data) {
        // console.log('afterSendData-data', data)
      }
    })
  </script>
  <body></body>
</html>
```

## 安装 - Vue2
``` js
import WebTracing from '@web-tracing/vue2'

Vue.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  userUuid: 'init_userUuid',

  scopeError: true,

  tracesSampleRate: 0.5,

  ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
  ignoreRequest: [/getAllTracingList/, /cleanTracingList/],

  beforePushEventList(data) {
    const arr = ['intersection', 'click']
    data.forEach(item => {
      if (arr.includes(item.eventType)) {
        window.vm.sendMessage()
      }
    })
    return data
  },
  beforeSendData(data) {
    // 返回false代表sdk不再发送
    return data
  },
  afterSendData(data) {
  }
})
```

## 安装 - Vue3
``` js
import WebTracing from '@web-tracing/vue3'

app.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  ignoreRequest: [
    /getAllTracingList/,
    /cleanTracingList/,
    /getBaseInfo/,
    /getSourceMap/
  ],
  afterSendData(data) {
  }
})
```

