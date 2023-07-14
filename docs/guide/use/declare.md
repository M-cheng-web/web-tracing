# 基础说明
帮助您快速了解本项目

## 项目架构
采用 Monorepo + pnpm 方式构建（会加上一些脚本），针对此项目有以下几项优势
+ 利于多包（core、vue2、vue3...）联调、发版
+ 利于示例项目实时看到效果（包括后续的批量上线）
+ 利于文档项目的编写（虽然现在没有联动）

## 基本原理

### 采集方式
+ 自动采集: 内部对多个浏览器事件进行了劫持或者是监听，自动获取 【 错误、性能、页面跳转... 】信息
+ 手动采集: 调用sdk暴露的方法去触发事件采集，见[导出项](../functions/exports.md)

### 数据流向
这里针对自动采集的数据流向进行说明

1. 内部对多个浏览器事件进行了劫持或者是监听，例如【 click、beforeunload、hashchange、replaceState、popstate...】
2. 对 监听/劫持 到的事件进行预处理【 例如监听到 replaceState 被触发会提前记录当前时间搓，这样就拿到了页面跳转时的时间啦 】
3. 每触发一个事件都会生成一个对象来描述此事件的信息，sdk会将这些对象放入列表中(在这个过程中会塞入一些公共信息)，等候统一发送

### 发送数据
::: tip
这里需要了解两个概念
+ 最大缓存数(cacheMaxLength 默认为5)
+ 延迟发送事件时长(cacheWatingTime 默认为5s)

最大缓存数: 在触发一次事件后会生成一个对象描述此事件，但并不会立即将此信息发送到服务端，而是会缓存起来等达到最大缓存数才会将这些采集到的信息组成列表发送给服务端（如果在 `延迟发送事件时长` 内还没有达到最大缓存数，则会将已记录的数据发送，反之在 `延迟发送事件时长` 内达到最大缓存数则立即将事件列表按照 `最大缓存数` 等份切割、分批发送）

延迟发送事件时长: 如果在触发一次后迟迟没有达到最大缓存数，达到 `延迟发送事件时长` 后也会将这一次的采集结果发送给服务端；反之已达到则立即发送给服务端
:::

sdk内部支持多种发送方式
+ navigator.sendBeacon
+ image
+ xml
+ 开启本地化(localization)后，数据会存储在 localStorage 中，需要开发手动去发送与清除
+ 通过sdk暴露的发送事件拦截事件，拦截所有的事件然后用自己的方式去发送
+ 断网后sdk不再主动发送事件

发送方式优先级
1. 浏览器支持sdk会使用 sendBeacon
2. 其次 image
3. 如果发送的数据量过大，超过 sendBeacon (60kb限制) 与 image(2kb限制)，则该用xml的方式发送

## 导出项
sdk内部导出了大量的钩子方便开发自定义，同时也导出了sdk内部的options，开发可动态更改此对象；具体请查看[导出项](../functions/exports.md)

::: tip
导出的钩子是可以被多页面同时调用的，最后触发的顺序会按照初始化的顺序
:::

例如以下场景:
+ 加密传输 (beforeSendData 拦截到事件信息后再 return新的被加密过的对象)
+ 每次发送事件后需要触发弹窗提醒 (afterSendData)
+ 中途需要对配置项中的 dsn 地址更改 (任意一个页面 options.value.dsn = 'www.bx.com')
+ 获取基础数据用做前端项目的展示 (getBaseInfo)

## 事件类型 & 事件ID
对于采集到的事件对象，内部会含有 `eventType、eventID` 字段，下面对这两个字段进行解释

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
}
```

## 特殊标识
为了最大程度标识用户以及细分业务,插件提供了以下几个属性
+ pageId (应用ID 自动生成)
+ sessionId (会话ID 自动生成)
+ deviceId (设备ID 自动生成)
+ appName (应用Name 使用者初始化设置)
+ appCode (应用Code 使用者初始化设置)
+ customerId (类型ID 使用者调用方法设置)
+ userUuid (用户ID 使用者调用方法设置)

`pageId sessionId deviceId` 的生成规则是一样的,最终会各自生成类似于这样的字符串
+ `13488cb7-85a62e2a-917f1a1d943f5ae5`
+ `s_13488cb7-85a6166f-8c296bb4a6089363`
+ `t_13466167-991854d1-da9f0cf52c91fac4`

注意点
+ `pageId` 在整个页面生命周期不变,只会在首次加载插件才会生成
+ `sessionId` 会存入cookie,存活时长为30分钟,每次触发采集事件都会刷新这个ID
+ `deviceId` 也会存入cookie,不设置存活时长
+ `appName` 以及 `appCode` 可以在 `init` 初始化时进行赋值以及后续更改 `options.value.appName`
+ `customerId` 以及 `userUuid` 有特有的方法对它们赋值

