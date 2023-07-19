# Performance
捕获应用所有的资源加载情况,加载分为以下两种情况
+ DOM加载
+ 资源加载

::: warning
加载错误的资源会产生两个事件【1.资源本身的加载情况 2.报错情况】
:::

::: warning
sdk监听资源加载情况采用的是【 PerformanceObserver > MutationObserver 】的降级策略
通过PerformanceObserver拿不到资源是否加载成功，但其加载失败会在控制台报错，所以能被错误监听模块捕获
如果只想从资源监听模块获取是否加载成功，可通过以下四个属性是否等于0来判断，但因为各种情况它们是不准确的，
仅供参考【duration，responseEnd，transferSize，decodedBodySize】
MutationObserver的情况下，因为能拿到具体dom，可以通过监听dom的error事件来判断是否失败，当失败的情况下会给出responseStatus = 'error' 字段来表示
:::

## 首次页面性能数据对象格式
t = nt2Timing || performance.getEntriesByType('navigation')[0]

| 属性名称       | 值                                            | 说明                 |
| -------------- | --------------------------------------------- | -------------------- |
| eventId        | page                                          | 事件ID               |
| eventType      | performance                                   | 事件类型             |
| appcache       | t.domainLookupStart - t.fetchStart            | dns缓存时间          |
| dom            | t.domInteractive - t.responseEnd              | dom解析耗时          |
| dns            | t.domainLookupEnd - t.domainLookupStart       | dns查询耗时          |
| firstbyte      | t.responseStart - t.domainLookupStart         | 首包时间             |
| fmp            | t.fetchStart                                  | 首屏时间             |
| loadon         | t.loadEventStart - t.fetchStart               | 页面完全加载时间     |
| ready          | t.domContentLoadedEventEnd - t.fetchStart     | HTML加载完成时间     |
| res            | t.loadEventStart - t.domContentLoadedEventEnd | 同步资源加载耗时     |
| ssllink        | t.connectEnd - t.secureConnectionStart        | SSL安全连接耗时      |
| tcp            | t.connectEnd - t.connectStart                 | tcp连接耗时          |
| trans          | t.responseEnd - t.responseStart               | 内容传输耗时         |
| ttfb           | t.responseStart - t.requestStart              | 请求响应耗时         |
| tti            | t.domInteractive - t.fetchStart               | 首次可交互时间       |
| redirect       | t.redirectEnd - t.redirectStart               | 重定向时间           |
| unloadTime     | t.unloadEventEnd - t.unloadEventStart         | 上一个页面的卸载耗时 |
| sendTime       |                                               | 发送时间             |
| triggerPageUrl | window.location.href                          | 当前页面地址         |

## 同步 & 异步资源加载时传给后台的对象格式
> 大部分数据依赖于`performance.getEntriesByType('resource')`

| 属性名称          | 值          | 说明                                   |
| ----------------- | ----------- | -------------------------------------- |
| eventId           | resource    | 事件ID                                 |
| eventType         | performance | 事件类型                               |
| requestUrl        |             | 资源具体url                            |
| initiatorType     |             | 通过某种方式请求的资源,比如script,link |
| transferSize      |             | 传输的数据包大小                       |
| encodedBodySize   |             | 数据包压缩后大小                       |
| decodedBodySize   |             | 数据包解压后大小                       |
| duration          |             | 加载具体时长                           |
| redirectStart     |             | 重定向开始时间                         |
| redirectEnd       |             | 重定向结束时间                         |
| startTime         |             | 开始时间                               |
| fetchStart        |             | 开始发起请求时间                       |
| domainLookupStart |             | DNS开始解析时间                        |
| domainLookupEnd   |             | DNS结束解析时间                        |
| connectStart      |             | 开始建立连接时间                       |
| connectEnd        |             | 连接建立完成时间                       |
| requestStart      |             | 开始发送数据包时间                     |
| responseStart     |             | 开始接收数据包时间                     |
| responseEnd       |             | 数据包接收完成时间                     |
| triggerTime       |             | 事件触发时间                           |
| triggerPageUrl    |             | 当前页面地址                           |

## 真实场景数据
### 首屏
``` js
{
  eventId: 'page',
  eventType: 'performance',
  fmp: 261.7,
  tti: 103.8,
  ready: 230.6,
  loadon: 304.7,
  firstbyte: 10,
  appcache: 3.3,
  tcp: 0.3,
  ttfb: 9.7,
  trans: 1.5,
  dom: 89,
  res: 74.1,
  ssllink: 5.1,
  triggerPageUrl: 'http://localhost:6656/#/performance',
  sendTime: 1689732460049,
  unloadTime: undefined,
  redirect: undefined,
  dns: undefined,
}
```

### 资源加载 - 正确时
``` js
{
  initiatorType: 'script',
  encodedBodySize: 26747,
  decodedBodySize: 73015,
  duration: 4.1,
  startTime: 237979.9,
  fetchStart: 237979.9,
  domainLookupStart: 237979.9,
  domainLookupEnd: 237979.9,
  connectStart: 237979.9,
  connectEnd: 237979.9,
  requestStart: 237982.5,
  responseStart: 237983.4,
  responseEnd: 237984,
  eventType: 'performance',
  eventId: 'resource',
  requestUrl: 'https://cdn.jsdelivr.net/npm/lodash',
  triggerTime: 1689732763613,
  triggerPageUrl: 'http://localhost:6656/#/performance',
  sendTime: 1689732764622
}
```

### 资源加载 - 错误时
> 加载错误的资源会产生两个事件【1.资源本身的加载情况 2.报错情况】

``` js
// 资源本身的加载情况
{
  eventId: 'resource',
  eventType: 'performance',
  initiatorType: 'script',
  duration: 1239,
  startTime: 271471.5,
  fetchStart: 271471.5,
  responseEnd: 272710.5,
  requestUrl: 'https://cdn.jsdelivr.net/npm/lodash22',
  triggerTime: 1689732798337,
  triggerPageUrl: 'http://localhost:6656/#/performance',
  sendTime: 1689732799342
}

// 报错情况
{
  eventId: 'resource',
  eventType: 'error',
  initiatorType: 'script',
  requestUrl: 'https://cdn.jsdelivr.net/npm/lodash22',
  triggerTime: 1689732798337,
  triggerPageUrl: 'http://localhost:6656/#/performance',
  sendTime: 1689732799342,
  recordscreen:
    'H4sIAAAAAAAAA+R9V3vqyNLuD9oXh2C8h0sbm7RA3saYoDuChyQwswATfv2p6iB1qFYL7LW/c57vYp5ZtqVWh+rK9Va/uFtM69ExfGvctxfHRVir5obw749z8zAudKLGcvvvxqZTmtTeFy/Lh11jHXyO' // 错误录屏数据
}
```