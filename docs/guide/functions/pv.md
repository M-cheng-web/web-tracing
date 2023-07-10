# pv
插件可以采集页面跳转的数据,主要原理是劫持`history.pushState history.replaceState`,以及监听`popstate hashchange`这两个事件,其中`popstate`事件优先

触发事件时给后台的对象
| 属性名称    | 值                                          | 说明                    |
| ----------- | ------------------------------------------- | ----------------------- |
| eventId     | 根据时间戳计算得来的字符 (固定为pageId)     | 事件ID                  |
| eventType   | pv                                          | 事件类型                |
| url         |                                             | 当前页面URL             |
| referer     |                                             | 上级页面URL             |
| title       | document.title                              | 页面标题                |
| sendTime    |                                             | 发送时间                |
| triggerTime |                                             | 事件发生时间            |
| action      | navigate / reload / back_forward / reserved | 页面加载来源            |
| type        |                                             | 大类type,参考`数据结构` |

> 如果是hash路由,在init时要设置 hashtag = true, 否则浏览器前进后退事件会失效

## action 字段解释
+ navigate - 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
+ reload - 网页通过“重新加载”按钮或者location.reload()方法加载
+ back_forward - 网页通过“前进”或“后退”按钮加载
+ reserved - 任何其他来源的加载

## 传给后台格式示例
``` js
{
  eventInfo: [
    {
      action: "navigation"
      eventId: "13488d07-80fbb29f-7cb722a3a5314e63"
      eventType: "pv"
      referer: "http://localhost:8083/pv.html#/pv-foo"
      sendTime: 1641966854635
      title: "trace pv"
      triggerTime: 1641966848858
      type: "pv"
      url: "http://localhost:8083/pv.html#/pv-bar"
    }
  ]
}
```