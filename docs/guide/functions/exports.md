# 导出项
为了使用的便捷，sdk提供了多个导出项，下面针对这些导出项进行逐个说明

::: tip
这些导出项都在demo项目中使用了，想要了解更多可以查看demo项目

[vue2-demo地址](https://github.com/M-cheng-web/web-tracing-examples-vue2)

[vue3-demo地址](https://github.com/M-cheng-web/web-tracing-examples-vue3)
:::

## options
内部所有的配置已经全部适配下面这种使用方式，如有获取与更改的需求直接如下操作，sdk内部已经动态兼容
``` js
import { options } from '@web-tracing/core'

// 对内部参数进行修改
options.value.dsn = 'www.baidu.com'

// 获取内部某个参数
console.log(options.value.dsn)
```

## 曝光相关
具体demo可查看 [曝光事件](../functions/intersection.md)

### intersectionObserver
+ 作用: 对目标元素进行监听

入参 `options` 对象属性说明
| 参数名    | 类型                | 默认值 | 说明             |
| --------- | ------------------- | ------ | ---------------- |
| target    | Element / Element[] | -      | 需要被监听的元素 |
| threshold | number              | -      | 监听阈值         |
| params    | object              | {}     | 额外参数         |

> 监听阈值(threshold)解释：阀值默认为0.5，当为0.5时代表滚动超过图片达到一半时即为曝光结束；同理当为0.5时，代表滚动视图能看到图片一半时即为曝光开始

### intersectionUnobserve
+ 作用: 对目标元素进行取消监听
+ 入参: target - 已经被监听的元素

### intersectionDisconnect
+ 作用: 取消所有监听

## 钩子
目前所有的钩子都支持全局递加。例如在a页面声明了 `beforePushEventList` 方法，在b页面再次声明 `beforePushEventList` 也可以；这样导致在事件放入队列之前会按照放入顺序依次触发这些回调

### beforePushEventList
+ 作用: 放入事件队列之前的回调方法
+ 入参: data - 事件列表(数组类型)
+ 出参: 数组 / 对象 / false
+ 备注: sdk内部会将返回值作为新的事件放入事件队列，如果返回false则代表不放入事件队列
``` js
import { beforePushEventList } from '@web-tracing/core'

beforePushEventList(data) {
  data.forEach(item => {
    console.log('发送了数据: ', item)
  })
  // return false
  return data
}
```

### beforeSendData
+ 作用: 事件发送之前的回调方法
+ 入参: data - {baseInfo: xxx, eventInfo: []} 类型
+ 出参: 数组 / 对象 / false
+ 备注: sdk内部会将返回值作为新的事件发送到服务端，如果返回false则代表不发送
``` js
import { beforeSendData } from '@web-tracing/core'

beforeSendData(data) {
  // return false
  return data
}
```

### afterSendData
+ 作用: 事件发送之后的回调方法
+ 入参: data - {params: {baseInfo: xxx, eventInfo: []}, sendType: xx, success: true} 类型
+ 出参: 无
``` js
import { afterSendData } from '@web-tracing/core'

afterSendData(data) {
  this.$notify({
    title: '发送一批数据到服务端',
    message: data,
    position: 'top-right',
    dangerouslyUseHTMLString: true,
    duration: 1500
  })
}
```

## 主动上报方法
当遇到特殊场景需要手动触发采集时可以通过插件内置的方法来达到目的

### traceError
+ 作用: 主动触发错误信息
+ 入参: options - 对象内任意属性
+ 备注: 调用此方法，有以下参数会固定附加
  + eventType: error
  + recordscreen: 错误录屏信息
  + triggerPageUrl: 发生错误的页面
  + triggerTime: 发生错误的时间
``` js
import { traceError } from '@web-tracing/core'
traceError({
  message: 'xxx',
  params: {
    name: 'aa'
  }
})
```

### tracePerformance
+ 作用: 主动触发性能信息
+ 入参: options - 对象内任意属性
+ 备注: 调用此方法，有以下参数会固定附加
  + eventType: performance
  + triggerPageUrl: 发生错误的页面
  + triggerTime: 发生错误的时间
``` js
import { tracePerformance } from '@web-tracing/core'
tracePerformance({
  message: 'xxx',
  params: {
    name: 'aa'
  }
})
```

### traceCustomEvent
+ 作用: 自定义上报事件
+ 入参: options - 对象内任意属性
+ 备注: 调用此方法，有以下参数会固定附加
  + eventType: custom
  + triggerPageUrl: 发生错误的页面
  + triggerTime: 发生错误的时间
``` js
import { traceCustomEvent } from '@web-tracing/core'
traceCustomEvent({
  message: 'xxx',
  params: {
    name: 'aa'
  }
})
```

### tracePageView
+ 作用: 触发一次页面路由采集
+ 入参: options - 对象内任意属性
+ 备注: 调用此方法，有以下参数会固定附加
  + referer: 上一张页面地址
  + title: 页面标题
  + eventId: baseInfo.pageId
  + eventType: pv
  + triggerPageUrl: 发生错误的页面
  + triggerTime: 发生错误的时间
``` js
import { tracePageView } from '@web-tracing/core'
tracePageView({
  message: 'xxx',
  params: {
    name: 'aa'
  }
})
```

## 其他
### unzipRecordscreen
+ 作用: 解压错误录屏数据
+ 解释: 错误事件对象中会含有 `recordscreen` 字段是错误录屏数据，但这个数据是压缩过的，需要用此方法解压
``` js
import { unzipRecordscreen } from '@web-tracing/core'

unzipRecordscreen(recordscreen)
```

### getBaseInfo
+ 作用: 获取在sdk中记录的所有基础的信息（包括硬件，地理位置等等）

### getFirstScreen
+ 作用: 获取首屏数据

### getIPs
+ 作用: 获取公网ip
+ 备注: 不保证获取到，用的是第三方方法

### sendLocal
+ 作用: 手动发送本地数据
+ 解释: 当开启配置 `localization = true` 时，所有的事件信息都会存储在 `localstorage`，需要开发手动调用此方法触发发送事件条件

### setLocalizationOverFlow
+ 作用: 本地化存储溢出后的回调
+ 解释: 当开启配置 `localization = true` 时，所有的事件信息都会存储在 `localstorage`，但考虑到本地存储空间有限，当存储失败时会触发此方法
+ 入参: data - {params: {baseInfo: xxx, eventInfo: []}, sendType: xx, success: true} 类型
