# 导出项
为了使用的便捷，sdk提供了多个导出项，下面针对这些导出项进行逐个说明

## 主动上报方法
当遇到特殊场景需要手动触发采集时可以通过插件内置的方法来达到目的

+ traceError
+ tracePerformance
+ traceCustomEvent
+ tracePageView

> 目前来说主动上报方法也要遵循最大缓存数和延迟时长的规则,还没有配置即刻触发

### traceError
采集错误信息(调用此方法时发送给后台的 eventType 为 error, 这是固定的)
| 参数名  | 类型   | 默认值 | 说明                                                             |
| ------- | ------ | ------ | ---------------------------------------------------------------- |
| eventId | string | -      | 作为eventId发送给后台,定义为和业务确定好的字段                   |
| message | string | -      | 作为errMessage发送给后台                                         |
| options | object | {}     | 对象内的值在解构一层后放在和eventId同级一起发给后台,作为额外参数 |

示例:
``` js
trace.traceError('自定义错误ID', '自定义错误message', {
  src: '/interface/order'
  params: {
    id: '12121'
  }
})

// 传给后台的数据格式
{
  eventInfo: [
    {
      errMessage: "自定义错误message"
      eventId: "自定义错误ID"
      eventType: "error"
      params: { id: "12121" }
      sendTime: 1641971060666
      src: "/interface/order"
      triggerTime: 1641971059665
      type: "error"
      url: "http://localhost:8083/err.html"
    }
  ]
}
```

### tracePerformance
采集自定义性能数据(调用此方法时发送给后台的 eventType 为 performance, 这是固定的)
| 参数名  | 类型   | 默认值 | 说明                                                             |
| ------- | ------ | ------ | ---------------------------------------------------------------- |
| eventId | string | -      | 作为eventId发送给后台,定义为和业务确定好的字段                   |
| options | object | {}     | 对象内的值在解构一层后放在和eventId同级一起发给后台,作为额外参数 |

示例:
``` js
trace.tracePerformance('自定义ID', {
  param1: 'param1',
  param2: 'param2',
  param3: 'param3',
})

// 传给后台的数据格式
{
  eventInfo: [
    {
      eventId: "自定义ID"
      eventType: "performance"
      param1: "param1"
      param2: "param2"
      param3: "param3"
      sendTime: 1641977427175
      triggerTime: 1641977426154
      url: "http://localhost:8083/pv.html#/"
    }
  ]
}
```

### traceCustomEvent
自定义上报事件(调用此方法时发送给后台的 eventType 为 custom, 这是固定的)
| 参数名  | 类型   | 默认值 | 说明                                           |
| ------- | ------ | ------ | ---------------------------------------------- |
| eventId | string | -      | 作为eventId发送给后台,定义为和业务确定好的字段 |
| title   | string | -      | 作为title发送给后台                            |
| params  | object | {}     | 作为params发送给后台                           |

示例:
``` js
trace.traceCustomEvent('自定义ID', '自定义Message', {
  params1: 'params1',
  params2: 'params2',
  params3: 'params3',
})

// 传给后台的数据格式
{
  eventInfo: [
    {
      eventId: "自定义ID"
      eventType: "custom"
      params: { params1: "params1", params2: "params2", params3: "params3" }
      sendTime: 1641970593873
      title: "自定义Message"
      triggerTime: 1641970592870
      type: "custom"
    }
  ]
}
```

### tracePageView
触发一次页面路由采集(调用此方法时发送给后台的 eventType 为 custom, 这是固定的)
| 参数名 | 类型   | 默认值                                                                | 说明                        |
| ------ | ------ | --------------------------------------------------------------------- | --------------------------- |
| option | object | { <br>url = window.location.href,<br> referer = oldURL,<br> actions = '',<br> params <br>} | url会作为url当前页面的意思传给后台<br>referer上级页面URL的意思传给后台<br>actions会作为为action给后台<br>params会作为额外参数传给后台(不限制类型)<br>**注意:只会取option对象中这四个属性,多给也不用** |

option.actions表示加载来源,可选值有这些(非必须,主要看使用者和后台的约定)
+ navigate 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
+ reload 网页通过“重新加载”按钮或者location.reload()方法加载
+ back_forward 网页通过“前进”或“后退”按钮加载
+ reserved 任何其他来源的加载

示例:
``` js
trace.tracePageView({
  url: '自定义URL',
  referer: '自定义上级URL',
  params: { name: '自定义name' },
  actions: 'reserved'
})

// 传给后台的数据格式
{
  eventInfo: [
    {
      action: "reserved"
      eventId: "13488d07-9c75a556-4af9699b30516737"
      eventType: "pv"
      params: { name: "自定义name" }
      referer: "自定义上级URL"
      sendTime: 1641976860759
      title: "trace pv"
      triggerTime: 1641976859757
      type: "pv"
      url: "自定义URL"
    }
  ]
}
```

## 其他方法
调用以下方法会在触发任意采集并发送给后台时附带上设置的参数
+ setCustomerId (设置类型ID)
+ setUserUuid (设置用户ID)

``` js
_trace.setCustomerId('customId');

_trace.setUserUuid('uuid');
```

> 后续会新增由使用者来配置想要的参数名
