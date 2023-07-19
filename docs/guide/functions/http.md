# Http
捕获所有的 `xhr & axios & fetch` 请求,主要原理是劫持`XHR-open & XHR-send & fetch`

触发事件时给后台的对象
| 属性名称       | 值                                    | 说明         |
| -------------- | ------------------------------------- | ------------ |
| eventId        | server                                | 事件ID       |
| eventType      | 请求错误时error,请求正确时performance | 事件类型     |
| requestUrl     |                                       | 请求地址     |
| requestMethod  | get、post...                          | 请求方式     |
| requestType    | xhr、fetch...                         | 请求类型     |
| responseStatus |                                       | 请求返回代码 |
| duration       | 请求正确时才有此字段                  | 请求消耗时间 |
| params         |                                       | 请求的参数   |
| triggerTime    |                                       | 事件发生时间 |
| triggerPageUrl |                                       | 页面地址     |
| sendTime       |                                       | 发送时间     |
| errMessage     | 请求错误时才有此字段                  | 请求错误信息 |
| recordscreen   | 请求错误时才有此字段                  | 错误录屏数据 |

``` js
// 真实场景产生的事件对象 - 请求正确时
{
  eventId: 'server',
  eventType: 'performance',
  requestUrl: 'http://localhost:6656/getList?test=123',
  requestMethod: 'get',
  requestType: 'xhr',
  responseStatus: 200,
  duration: 13,
  params: { test: '123' },
  triggerTime: 1689729859862,
  triggerPageUrl: 'http://localhost:6656/#/http',
  sendTime: 1689729860863
}

// 真实场景产生的事件对象 - 请求错误时
{
  eventId: 'server',
  eventType: 'error',
  requestUrl: 'http://localhost:6656/getList2?test=123',
  requestMethod: 'get',
  requestType: 'xhr',
  responseStatus: 404,
  params: { test: '123' },
  triggerTime: 1689729859862,
  triggerPageUrl: 'http://localhost:6656/#/http',
  sendTime: 1689729860863
  errMessage: 'Not Found',
  recordscreen: 'H4sIAAAAAAAAA+R9V3vqyNLuD9oXh2C8h0sbm7RA3saYoDuChyQwswATfv2p6' // 错误录屏数据
}
```