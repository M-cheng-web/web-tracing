# http
采集所有的 ajax & axios & fetch 请求(因为是劫持了XMLHttpRequest.prototype.send方法,基于此实现的请求都会被有效采集)

触发事件时给后台的对象
| 属性名称       | 值                                    | 说明                          |
| -------------- | ------------------------------------- | ----------------------------- |
| eventId        | server                                | 事件ID                        |
| eventType      | 请求错误时error, 请求正确时performance | 事件类型                      |
| src            |                                       | 请求地址                      |
| errMessage     |                                       | 请求错误信息                  |
| responseStatus |                                       | 请求返回代码                  |
| duration       |                                       | 请求消耗时间                  |
| sendTime       |                                       | 发送时间                      |
| triggerTime    |                                       | 事件发生时间                  |
| params         |                                       | 请求的参数 (只有POST请求会带) |
| url            |                                       | 页面地址                      |
| type           |                                       | 大类type,参考`数据结构`       |

当一个请求报错后会触发三个采集: 
1. 插件内置http捕捉错误采集 
2. 控制台vue的捕捉错误被错误采集给收集了 
3. 控制台Error实例报错被错误采集了

**插件对这种情况暂时不会做特殊处理**

## 传给后台格式示例
``` js
{
  eventInfo: [
    {
      duration: 38
      eventId: "server"
      eventType: "performance"
      responseStatus: 200
      sendTime: 1641974433133
      src: "http://172.15.1231/ance/form/riskApperaisal/getRiskAppraisal"
      triggerTime: 1641974432132
      type: "serverPerformance"
      url: "http://localhost:8083/http.html"
    }
  ]
}
```