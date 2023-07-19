# 其他事件

## 页面卸载事件
页面卸载时会触发`beforeunload`事件,并由此采集发送页面卸载信息给后台

| 属性名称      | 值                                              | 说明         |
| ------------- | ----------------------------------------------- | ------------ |
| eventId       | 根据时间戳计算得来的字符 (每次卸载事件都不相同) | 事件ID       |
| eventType     | dwell                                           | 事件类型     |
| url           |                                                 | 当前页面URL  |
| referer       |                                                 | 上级页面URL  |
| entryTime     |                                                 | 加载完成时间 |
| triggerTime   |                                                 | 卸载时间     |
| millisecond   |                                                 | 页面停留时间 |
| operateAction | navigate / reload / back_forward / reserved     | 页面加载来源 |
