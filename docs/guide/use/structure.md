# 数据结构
sdk发送给后端的数据格式（上报事件列表时的数据格式）

``` js
{
  baseInfo: {
    clientHeight: 831,
    clientWidth: 843,
    colorDepth: 30,
    pixelDepth: 30,
    deviceId: "t_134b23d7-a6beebb9-6c837db57a827b43",
    screenWidth: 1728,
    screenHeight: 1117,
    vendor: "Google Inc.",
    platform: "MacIntel",
    userUuid: "init_userUuid",
    sdkUserUuid: "3980225e0947a5f36c57ff63d27ddf65",
    ext: {},
    appName: "cxh",
    appCode: "",
    pageId: "134b23e7-9acc9418-0fa455bf47d76e2b",
    sessionId: "s_134b23e7-948b4e06-7da1d67c851e3138",
    sdkVersion: "1.0.1-beta.0",
    ip: "115.233.220.3",
    sendTime: 1689668599911
  },
  eventInfo: [
    {
      tti: 171.6,
      ready: 373.8,
      loadon: 442.2,
      firstbyte: 24.2,
      ttfb: 15.2,
      trans: 6.2,
      dom: 141.2,
      res: 68.4,
      ssllink: 4.7,
      triggerPageUrl: 'http://localhost:6656/#/event',
      eventType: 'performance',
      eventId: 'page',
      sendTime: 1689668884736
    },
    {
      initiatorType: 'script',
      transferSize: 300,
      encodedBodySize: 78636,
      decodedBodySize: 78636,
      duration: 35.4,
      startTime: 57.2,
      fetchStart: 57.2,
      domainLookupStart: 57.2,
      domainLookupEnd: 57.2,
      connectStart: 57.2,
      connectEnd: 57.2,
      requestStart: 85.6,
      responseStart: 88.9,
      responseEnd: 92.6,
      eventType: 'performance',
      eventId: 'resource',
      requestUrl: 'http://localhost:6656/@vite/client',
      triggerTime: 1689668883347,
      triggerPageUrl: 'http://localhost:6656/#/event',
      sendTime: 1689668884736
    },
    {
      eventType: 'pv',
      eventId: '134b23e7-9b42e328-fd20b4a18a4c46b7',
      triggerPageUrl: 'http://localhost:6656/#/event',
      referer: 'http://localhost:6656/#/event',
      title: 'example-vue2',
      action: 'navigation',
      triggerTime: 1689668883730,
      sendTime: 1689668884736
    }
  ]
}
```

## baseInfo
全局的一些属性，每次上报事件列表都会带上 `baseInfo`

| 属性名       | 说明                                                                |
| ------------ | ------------------------------------------------------------------- |
| clientHeight | 网页可见区高度                                                      |
| clientWidth  | 网页可见区宽度                                                      |
| colorDepth   | 显示屏幕调色板的比特深度                                            |
| pixelDepth   | 显示屏幕的颜色分辨率                                                |
| deviceId     | 设备ID                                                              |
| screenWidth  | 显示屏幕的宽度                                                      |
| screenHeight | 显示屏幕的高度                                                      |
| vendor       | 浏览器名称                                                          |
| platform     | 浏览器平台的环境,不是电脑系统的x64这样的(浏览器平台的环境可能是x32) |
| userUuid     | 用户ID                                                              |
| sdkUserUuid  | sdk内部会根据硬件位置等信息生成一个用户ID                           |
| ext          | 作为附带对象参数给到服务端                                          |
| appName      | 应用Name                                                            |
| appCode      | 应用Code                                                            |
| pageId       | 应用ID                                                              |
| sessionId    | 会话ID                                                              |
| sdkVersion   | 插件版本号                                                          |
| ip           | 用户的IP(可能为空)                                                  |
| sendTime     | 发送时间                                                            |

## eventInfo
sdk采集到的事件列表，列表内的事件对象会因为不同的事件类型而拥有不用的属性 (**不同类型下的事件对象属性有很大差异**)

::: tip
对于采集到的事件对象，内部会含有 `eventType、eventID` 字段，下面对这两个字段进行解释，不同事件类型的数据结构会在对应的目录中展示说明
:::


``` ts
/**
 * 触发的事件是什么类型 - eventType
 */
export enum SEDNEVENTTYPES {
  PV = 'pv', // 路由
  ERROR = 'error', // 错误
  PERFORMANCE = 'performance', // 资源
  CLICK = 'click', // 点击
  DWELL = 'dwell', // 页面卸载
  CUSTOM = 'custom', // 手动触发事件
  INTERSECTION = 'intersection' // 曝光采集
}

/**
 * 触发的事件id - eventID
 */
export enum SENDID {
  PAGE = 'page', // 页面
  RESOURCE = 'resource', // 资源
  SERVER = 'server', // 请求
  CODE = 'code', // code
  REJECT = 'reject', // reject
  CONSOLEERROR = 'console.error' // console.error

  // target.nodeName ( 元素名 ps:script, 在html元素上发生异常时会作为eventId )
  // pageId ( 在页面跳转时会带上应用ID作为eventId )
}
```

### 特殊情况
当`eventType`为`dwell`时`eventId`是一串根据时间戳计算得来的字符

当`eventType`为`click`时`eventId`的采集顺序为
1. 从触发的元素向上找其父级元素(直到body之下)的属性,用最先找到的`data-warden-event-id`属性的值
2. 与上同理,用最先找到的`title`属性的值
3. 与上同理,找到带有`data-warden-container`属性的元素
   1. 找到的话
   2. 用这个元素属性的`data-warden-event-id`值
   3. 用这个元素属性的`title`值
   4. 都没有的话就用这个元素属性的`data-warden-container`值
   5. 还是没有的话就用触发元素的`tagName`
4. 用触发元素的`tagName`

::: danger
主动调用 tracePageView() 时不能指定 eventType(pv) 以及 eventId(pageId)

主动调用 traceError() 时不能指定 eventType(error) ,可以指定eventId

主动调用 traceCustomEvent() 时不能指定 eventType(custom) ,可以指定eventId

主动调用 tracePerformance() 时不能指定 eventType(performance) ,可以指定eventId
:::