# Pv
采集页面跳转的数据,主要原理是劫持`history.pushState history.replaceState`,以及监听`popstate hashchange`这两个事件

触发事件时生成的对象
| 属性名称       | 值                                          | 说明         |
| -------------- | ------------------------------------------- | ------------ |
| eventId        | 根据时间戳计算得来的字符 (固定为pageId)     | 事件ID       |
| eventType      | pv                                          | 事件类型     |
| triggerPageUrl |                                             | 当前页面URL  |
| referer        |                                             | 上级页面URL  |
| title          | document.title                              | 页面标题     |
| sendTime       |                                             | 发送时间     |
| triggerTime    |                                             | 事件发生时间 |
| action         | navigate / reload / back_forward / reserved | 页面加载来源 |

``` js
// 真实场景产生的事件对象
{
  eventType: 'pv',
  eventId: '134b23f7-56a67609-802eb5fc1a34fde9',
  triggerPageUrl: 'http://localhost:6656/#/pv',
  referer: 'http://localhost:6656/#/err',
  title: 'example-vue2',
  action: 'navigation',
  triggerTime: 1689728946196,
  sendTime: 1689728947199
}
```
## action 字段解释
+ navigate - 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
+ reload - 网页通过“重新加载”按钮或者location.reload()方法加载
+ back_forward - 网页通过“前进”或“后退”按钮加载
+ reserved - 任何其他来源的加载

## 页面停留时间捕获
::: tip
在每次跳转到新的页面时都会触发两个事件，分别为 pv 跳转页面事件、pv-duration 页面停留事件

上面讲的是pv事件，而这里讲重点讲一下 pv-duration 事件
:::


首先其触发时生成的对象格式为
| 属性名称       | 值                                          | 说明                                    |
| -------------- | ------------------------------------------- | --------------------------------------- |
| eventId        | 根据时间戳计算得来的字符 (固定为pageId)     | 事件ID                                  |
| eventType      | pv-duration                                 | 事件类型                                |
| triggerPageUrl |                                             | 当前页面URL(也就是在哪个页面发生的停留) |
| referer        |                                             | 上级页面URL(停留页面的上一张页面)       |
| title          | document.title                              | 页面标题                                |
| durationTime   |                                             | 页面具体停留的时间                      |
| sendTime       |                                             | 发送时间                                |
| triggerTime    |                                             | 事件发生时间                            |
| action         | navigate / reload / back_forward / reserved | 页面加载来源                            |
