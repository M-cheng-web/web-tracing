# err
页面错误自动收集,原理是监听`error unhandledrejection`事件以及劫持`console.error`,采集三类错误
+ 资源加载错误,代码异常(error)
+ promise调用链异常(reject)
+ console.error异常

触发事件时给后台的对象
| 属性名称    | 值                                  | 说明                           |
| ----------- | ----------------------------------- | ------------------------------ |
| eventId     | code / HTML元素上发生异常则为元素名 | 事件ID                         |
| eventType   | error                               | 事件类型                       |
| url         |                                     | 当前页面URL                    |
| sendTime    |                                     | 发送时间                       |
| triggerTime |                                     | 事件发生时间                   |
| type        | error                               | 大类type,参考`数据结构`        |
| errMessage  |                                     | 错误信息                       |
| errStack    |                                     | 完整的错误信息                 |
| line        |                                     | 错误信息发生在第几行           |
| col         |                                     | 错误信息发生在第几列           |
| params      |                                     | 主动方法触发错误收集可以带参数 |

> 注意: vue中代码报错也会触发console.error,加上控制台本身也会输出,这就意味着会触发两次,这一点后续会优化

## 传给后台格式示例
### Error实例引起的报错提交数据
``` js
{
  eventInfo: [
    {
      col: "12"
      errMessage: "window.sss is not a function"
      errStack: "TypeError: window.sss is not a function\n ....... "
      eventId: "code"
      eventType: "error"
      line: "250"
      sendTime: 1641971814966
      src: "http://localhost:8083/err.js"
      triggerTime: 1641971813965
      type: "error"
      url: "http://localhost:8083/err.html"
    }
  ]
}
```

### 不是Error实例引起的报错提交数据(这里是vue的报错)
``` js
{
  eventInfo: [
    {
      errMessage: "[Vue warn]: Error in created hook: \"TypeError: windo ...."
      eventId: "code"
      eventType: "error"
      sendTime: 1641972159263
      triggerTime: 1641972158260
      type: "error"
      url: "http://localhost:8083/err.html"
    }
  ]
}
```