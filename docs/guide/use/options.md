# options

sdk初始化时的配置项

::: warning
在后续业务中也可以对某个配置项进行更改，sdk内部会检测到更改并及时更新

配置项的动态更改，目前所有的都可更改，没加限制，所以开发需要自行判断哦
:::


| 名称                      | 类型           | 是否必填 | 默认值    | 说明                                                                                            |
| ------------------------- | -------------- | -------- | --------- | ----------------------------------------------------------------------------------------------- |
| dsn                       | string         | 是       | -         | 上报地址     **必填**                                                                           |
| appName                   | string         | 是       | -         | 应用的标记,以此来区分各个应用,**必填**                                                          |
| appCode                   | string         | 否       | -         | 应用的code,附加作用                                                                             |
| appVersion                | string         | 否       | -         | 应用版本                                                                                        |
| ext                       | object         | 否       | undefined | 自定义的全局附加参数                                                                            |
| debug                     | boolean        | 否       | false     | 是否开启触发事件时控制台输出                                                                    |
| pv                        | boolean/object | 否       | false     | 当为boolean值时:<br> true代表其所有属性为 true <br> false 代表其所有属性为false                 |
| pv.core                   | boolean        | 否       | false     | 页面跳转 - 是否自动发送页面跳转相关数据                                                         |
| pv.hashtag                | boolean        | 否       | false     | 页面跳转 - 浏览器的动作发生时 (例如浏览器的回退按钮)是否监听hash变化,如果是hash路由请开启此开关 |
| performance               | boolean/object | 否       | false     | 当为boolean值时:<br> true代表其所有属性为 true <br> false 代表其所有属性为false                 |
| performance.core          | boolean        | 否       | false     | 性能数据 - 是否采集静态资源、接口的相关数据                                                     |
| performance.firstResource | boolean        | 否       | false     | 性能数据 - 是否采集首次进入页面的数据 (ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)         |
| performance.server        | boolean        | 否       | false     | 接口请求 - 是否采集接口请求(成功的才会采集,采集失败的需打开error.server)                        |
| error                     | boolean/objcet | 否       | false     | 当为boolean值时:<br> true代表其所有属性为 true <br> false 代表其所有属性为false                 |
| error.core                | boolean        | 否       | false     | 是否采集异常数据 (ps: 资源引入错误,promise错误,控制台输出错误)                                  |
| error.server              | boolean        | 否       | false     | 接口请求 - 是否采集报错接口数据                                                                 |
| event                     | boolean/objcet | 否       | false     | 当为boolean值时:<br> true代表其所有属性为 true <br> false 代表其所有属性为false                 |
| event.core                | boolean        | 否       | false     | 页面点击 - 是否采集点击事件                                                                     |
| event.unload              | boolean        | 否       | false     | 页面卸载 - 是否在页面卸载时采集页面状态信息                                                     |
