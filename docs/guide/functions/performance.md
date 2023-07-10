# performance
自动采集基础的性能数据
+ DOM加载
+ 资源加载

## 数据来源
依赖于`performance.getEntriesByType('navigation')[0]`或者`performance.timing`的数据(nt2Timing优先)

## 发送格式
t = nt2Timing || performance.getEntriesByType('navigation')[0]

### 首次页面性能数据对象格式
| 属性名称   | 值                                            | 说明                    |
| ---------- | --------------------------------------------- | ----------------------- |
| eventId    | page                                          | 事件ID                  |
| eventType  | performance                                   | 事件类型                |
| type       | pagePerformance                               | 大类type,参考`数据结构` |
| appcache   | t.domainLookupStart - t.fetchStart            | dns缓存时间             |
| dom        | t.domInteractive - t.responseEnd              | dom解析耗时             |
| dns        | t.domainLookupEnd - t.domainLookupStart       | dns查询耗时             |
| firstbyte  | t.responseStart - t.domainLookupStart         | 首包时间                |
| fmp        | t.fetchStart                                  | 首屏时间                |
| loadon     | t.loadEventStart - t.fetchStart               | 页面完全加载时间        |
| ready      | t.domContentLoadedEventEnd - t.fetchStart     | HTML加载完成时间        |
| res        | t.loadEventStart - t.domContentLoadedEventEnd | 同步资源加载耗时        |
| sendTime   |                                               | 发送时间                |
| ssllink    | t.connectEnd - t.secureConnectionStart        | SSL安全连接耗时         |
| tcp        | t.connectEnd - t.connectStart                 | tcp连接耗时             |
| trans      | t.responseEnd - t.responseStart               | 内容传输耗时            |
| ttfb       | t.responseStart - t.requestStart              | 请求响应耗时            |
| tti        | t.domInteractive - t.fetchStart               | 首次可交互时间          |
| redirect   | t.redirectEnd - t.redirectStart               | 重定向时间              |
| unloadTime | t.unloadEventEnd - t.unloadEventStart         | 上一个页面的卸载耗时    |
| url        | window.location.href                          | 当前页面地址            |

### 同步 & 异步资源加载时传给后台的对象格式(大部分依赖于`performance.getEntriesByType('resource')`)
| 属性名称          | 值                  | 说明                                   |
| ----------------- | ------------------- | -------------------------------------- |
| eventId           | resource            | 事件ID                                 |
| eventType         | performance         | 事件类型                               |
| type              | resourcePerformance | 大类type,参考`数据结构`                |
| src               |                     | 资源具体url                            |
| initiatorType     |                     | 通过某种方式请求的资源,比如script,link |
| transferSize      |                     | 传输的数据包大小                       |
| encodedBodySize   |                     | 数据包压缩后大小                       |
| decodedBodySize   |                     | 数据包解压后大小                       |
| duration          |                     | 加载具体时长                           |
| redirectStart     |                     | 重定向开始时间                         |
| redirectEnd       |                     | 重定向结束时间                         |
| startTime         |                     | 开始时间                               |
| fetchStart        |                     | 开始发起请求时间                       |
| domainLookupStart |                     | DNS开始解析时间                        |
| domainLookupEnd   |                     | DNS结束解析时间                        |
| connectStart      |                     | 开始建立连接时间                       |
| connectEnd        |                     | 连接建立完成时间                       |
| requestStart      |                     | 开始发送数据包时间                     |
| responseStart     |                     | 开始接收数据包时间                     |
| responseEnd       |                     | 数据包接收完成时间                     |
| triggerTime       |                     | 事件触发时间                           |
| url               |                     | 当前页面地址                           |

## 传给后台格式示例
``` js
{
  eventInfo: [
    {
      duration: 26.3
      eventId: "resource"
      eventType: "performance"
      fetchStart: 201966.4
      initiatorType: "script"
      responseEnd: 201992.7
      sendTime: 1641976273811
      src: "http://172.15.4.131:4873/-/static/vendors.064cfdd8107ff39d68ca.js"
      startTime: 201966.4
      triggerTime: 1641976272810
      type: "resourcePerformance"
      url: "http://localhost:8083/performance.html#/"
    }
  ]
}
```