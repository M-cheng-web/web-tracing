# Error
页面错误自动收集,主要原理是 监听/劫持 `error unhandledrejection console.error`,采集这三类错误
+ 资源加载错误,代码异常(error)
+ promise调用链异常(reject)
+ console.error异常

触发事件时生成的对象
| 属性名称       | 值                                  | 说明                           |
| -------------- | ----------------------------------- | ------------------------------ |
| eventId        | code / HTML元素上发生异常则为元素名 | 事件ID                         |
| eventType      | error                               | 事件类型                       |
| triggerPageUrl |                                     | 当前页面URL                    |
| errMessage     |                                     | 错误信息                       |
| errStack       |                                     | 完整的错误信息                 |
| line           |                                     | 错误信息发生在第几行           |
| col            |                                     | 错误信息发生在第几列           |
| recordscreen   |                                     | 错误录屏数据                   |
| params         |                                     | 主动方法触发错误收集可以带参数 |
| sendTime       |                                     | 发送时间                       |
| triggerTime    |                                     | 事件发生时间                   |

``` js
// 真实场景产生的事件对象
{
  eventId: 'code',
  eventType: 'error',
  errMessage: 'a.split is not a function',
  line: '288',
  col: '9',
  sendTime: 1689728522923,
  triggerTime: 1689728522923,
  triggerPageUrl: 'http://localhost:6656/#/err',
  recordscreen: 'H4sIAAAAAAAAA+R9V3vqyNLuD9oXh2C8h0sbm7RA3saYoDuChyQwswATfv2p6' // 错误录屏数据
  errStack:
    'TypeError: a.split is not a function\n    at VueComponent.codeError (http://localhost:6656/src/views/err/index.vue:288:9)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at VueComponent.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at Vue2.$emit (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:2034:9)\n    at VueComponent.handleClick (http://localhost:6656/node_modules/.vite/deps/element-ui.js?v=534c31e8:27234:20)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at HTMLButtonElement.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at original._wrapper (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:3934:25)',
}
```

## 批量错误采集
错误过多自动转区间事件，也就是去重

::: tip
为了应对被监控的项目发生了批量错误时sdk会将这些重复的错误都一一发送到服务端，特别是当这些错误是循环无限错误时，对服务端的浪费是灾难性的，所以提出此参数；当开启了后sdk内部会判断是否为批量错误，然后归纳一起发送给服务端；当批量错误多了sdk会识别出无限错误，每隔20s才发送此错误
:::

### 开启方式
`scopeError = true`

开启后有以下两点体现上的不同
+ 普通单个错误的发生会延迟2s才采集到事件队列中(延迟2s是因为要观察是否会有批量相同错误)
+ 批量错误但不是无限错误，会延迟22s才采集到事件队列中
+ 无限错误每满50个则发送这些错误事件到事件队列中
+ 批量错误和普通单个错误的参数不同

### 捕获批量错误流程
1. 先把所有错误都放入 a错误栈
2. 每次发生错误后防抖 2s查 a栈是否有批量错误(批量错误:errMessage、errType相同且发生个数大于等于5)
   1. 如果为批量错误则合并这些错误并加入 `时间区间参数、发生个数参数` 后放入 b栈
   2. 不为批量错误则发送这些错误
3. 资源的错误加载没有明确字段表示，但会在err模块被监听捕获，所以要在管理端筛选
4. 每次推入错误到b栈后延迟 20s查 b栈并发送这些错误
5. 在这个过程中，如果用户关闭了网页，会统一把 a栈、b栈内的数据发送
6. 在这个过程中，a栈每满50个错误也会强制触发a栈和b栈的错误处理（处理结果为直接发送批量错误）

### 批量错误参数
| 属性名称                 | 值                                  | 说明                           |
| ------------------------ | ----------------------------------- | ------------------------------ |
| eventId                  | code / HTML元素上发生异常则为元素名 | 事件ID                         |
| eventType                | error                               | 事件类型                       |
| batchError               |                                     | 是否为批量错误                 |
| batchErrorLastHappenTime |                                     | 批量错误中最后一个错误发生时间 |
| batchErrorLength         |                                     | 批量错误的个数                 |
| triggerPageUrl           |                                     | 当前页面URL                    |
| errMessage               |                                     | 错误信息                       |
| errStack                 |                                     | 完整的错误信息                 |
| line                     |                                     | 错误信息发生在第几行           |
| col                      |                                     | 错误信息发生在第几列           |
| recordscreen             |                                     | 错误录屏数据                   |
| params                   |                                     | 主动方法触发错误收集可以带参数 |
| sendTime                 |                                     | 发送时间                       |
| triggerTime              |                                     | 事件发生时间                   |

``` js
// 真实场景产生的事件对象
{
  eventId: 'code',
  eventType: 'error',
  errMessage: 'a.split is not a function',
  batchError: true,
  batchErrorLastHappenTime: 1689744409113,
  batchErrorLength: 10,
  errStack:
    'TypeError: a.split is not a function\n    at VueComponent.codeError (http://localhost:6656/src/views/err/index.vue?t=1689734427168:288:9)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at VueComponent.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at Vue2.$emit (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:2034:9)\n    at VueComponent.handleClick (http://localhost:6656/node_modules/.vite/deps/element-ui.js?v=534c31e8:27234:20)\n    at invokeWithErrorHandling (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:787:26)\n    at HTMLButtonElement.invoker (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:892:14)\n    at original._wrapper (http://localhost:6656/node_modules/.vite/deps/chunk-A2PO35VE.js?v=534c31e8:3934:25)\n    at VueComponent.batchErrorA (http://localhost:6656/src/views/err/index.vue?t=1689734427168:325:44)',
  triggerPageUrl: 'http://localhost:6656/#/err',
  line: '288',
  col: '9',
  sendTime: 1689744811726,
  triggerTime: 1689744788264,
  recordscreen: 'H4sIAAAAAAAAA+R9V3vqyNLuD9oXh2C8h0sbm7RA3saYoDuChyQwswATfv2p6iB1' // 错误录屏数据
}
```