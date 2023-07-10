# 数据结构
了解一下插件发送给后端的数据格式是怎样的吧!

``` js
{
  baseInfo: {
    clientHeight: 977,
    clientWidth: 549,
    colorDepth: 24,
    deviceId: "t_13466167-991854d1-da9f0cf52c91fac4",
    gatherAppName: "chengxh",
    pageId: "13488cb7-57de65e0-8fa72c8ab05eeac7",
    pixelDepth: 24,
    platform: "Win32",
    screenHeight: 1080,
    screenWidth: 1920,
    sdkVersion: "0.0.1-alpha.8",
    sendTime: 1641518497118,
    sessionId: "s_13488cb7-57de65d5-4621697435f47777",
    vendor: "Google Inc.",
  },
  eventInfo: [
    {
      eventId: "13488cb7-57de65e0-8fa72c8ab05eeac7",
      eventType: "pv",
      operateAction: "back_forward",
      referer: "http://localhost:8083/contents.html",
      sendTime: 1641518497118,
      title: "trace performance",
      triggerTime: "1641518497107",
      type: "pv",
      url: "http://localhost:8083/event.html",
    },
    {
      dom: 100.2,
      eventId: "page",
      eventType: "performance",
      firstbyte: 7.8,
      fmp: 130.7,
      loadon: 145,
      ready: 109.5,
      res: 35.5,
      ssllink: 4.3,
      trans: 0.4,
      ttfb: 2.1,
      tti: 108.4,
      type: "pagePerformance",
      url: "http://localhost:8083/event.html",
    }
  ]
}
```

## baseInfo
全局的一些参数,每次发送采集都会附带传给后台
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
| sdkVersion   | 插件版本号                                                          |
| sendTime     | 发送时间                                                            |
| appName      | 应用Name                                                            |
| appCode      | 应用Code                                                            |
| pageId       | 应用ID                                                              |
| sessionId    | 会话ID                                                              |
| customerId   | 类型ID                                                              |
| userUuid     | 用户ID                                                              |

## eventInfo
采集到的事件数组,这些事件有不同的类型,**不同类型下的埋点数据结构有一些差异**<br>
:no_entry:这里主要介绍`eventType type eventId`的取值以及意义,不同事件类型的数据结构会在对应的目录中展示并说明:no_entry:

### eventType
eventType用于表明事件的类型,类型为固定的以下几种(浏览器自身基础事件和自定义事件)
+ pv ( 路由 )
+ error ( 错误 )
+ performance ( 资源 )
+ click ( 点击 )
+ dwell ( 页面卸载 )
+ custom ( 手动触发事件的类型 )

### type
作为`eventType`的补充字段,把某些事件类型合并,同时也增加某些事件区分度,易于后台分类
+ mix ( 合并这些eventType事件: click, submit, scroll, change )
+ resourcePerformance ( eventType === performance && eventId === resource )
+ pagePerformance ( eventType === performance && eventId === page )
+ serverPerformance ( eventType === performance && eventId === server )

> 其他 eventType 事件类型就不做特殊处理,例如 eventType === pv时 type 也会赋值为 pv

### eventId
eventId用于表明事件的唯一标识,同一类型下的事件可能会有细分

+ resource ( 在对资源进行采集时都会作为eventId )
+ page ( 在发送首次页面性能数据时会作为eventId )
+ code ( 在代码异常时会作为eventId )
+ server ( 在请求采集时会作为eventId )
+ [target.nodeName] ( 元素名 ps:script, 在html元素上发生异常时会作为eventId )
+ [pageId] ( 在页面跳转时会带上应用ID作为eventId )

特殊情况:

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

> 主动调用 tracePageView() 时不能指定 eventType(pv) 以及 eventId([pageId])
> 
> 主动调用 traceError() 时不能指定 eventType(error) ,可以指定eventId
> 
> 主动调用 traceCustomEvent() 时不能指定 eventType(custom) ,可以指定eventId
> 
> 主动调用 tracePerformance() 时不能指定 eventType(performance) ,可以指定eventId