# options

sdk初始化时的配置项

::: warning
在后续业务中也可以对某个配置项进行更改，sdk内部会检测到更改并及时更新

配置项的动态更改，目前所有的都可更改，没加限制，所以开发需要自行判断哦
:::


| 名称                  | 类型                 | 必填   | 默认值    | 说明                       |
|---------------------| -------------------- | ------ | --------- |--------------------------|
| dsn                 | string               | **是** | -         | 上报地址                     |
| appName             | string               | **是** | -         | 应用名称                     |
| appCode             | string               | 否     | -         | 应用code                   |
| appVersion          | string               | 否     | -         | 应用版本                     |
| userUuid            | string               | 否     | -         | 用户id                     |
| debug               | boolean              | 否     | false     | 是否开启触发事件时控制台输出        |
| recordScreen        | boolean              | 否     | false     | 是否开启录屏功能                 |
| pv                  | object/boolean       | 否     | false     | ***见下方 pv 解释***          |
| performance         | object/boolean       | 否     | false     | ***见下方 performance 解释*** |
| error               | object/boolean       | 否     | false     | ***见下方 error 解释***       |
| event               | object/boolean       | 否     | false     | ***见下方 event 解释***       |
| ext                 | object               | 否     | undefined | 自定义的全局附加参数               |
| tracesSampleRate    | number               | 否     | 1         | 抽样发送(0-1)                |
| cacheMaxLength      | number               | 否     | 5         | 上报数据最大缓存数                |
| cacheWatingTime     | number               | 否     | 5000      | 上报数据最大等待时间(ms)           |
| ignoreErrors        | Array<string/RegExp> | 否     | []        | 错误类型事件过滤                 |
| ignoreRequest       | Array<string/RegExp> | 否     | []        | 请求类型事件过滤                 |
| scopeError          | boolean              | 否     | false     | 开启范围错误                   |
| localization        | boolean              | 否     | false     | 是否本地化                    |
| sendTypeByXmlBody   | boolean              | 否     | false     | 是否强制指定发送形式为xml，body请求方式  |
| timeout       | number             | 否     | 5000         | 日志上报超时时间（毫秒）              |
| maxQueueLength       | number             | 否     | 200          | 上报接口异常，日志队列最大缓存数              |
| checkRecoverInterval       | number             | 否     | 1         | 多长时间检测一次上报接口是否恢复（分钟）              |
| beforePushEventList | function             | 否     | -         | 添加到行为列表前的 hook           |
| beforeSendData      | function             | 否     | -         | 数据上报前的 hook              |
| afterSendData       | function             | 否     | -         | 数据上报后的 hook              |
| destroyMonitoring       | function             | 否     | -         | 卸载日志插件的函数              |

## pv
当 pv 为布尔值时其内部所有属性都为此布尔值（例如：pv = true 代表 pv: {core: true}）

| 属性名 | 类型    | 是否必填 | 默认值 | 说明                     |
| ------ | ------- | -------- | ------ | ------------------------ |
| core   | boolean | 否       | false  | 是否发送页面跳转相关数据 |

## performance
当 performance 为布尔值时其内部所有属性都为此布尔值

| 属性名        | 类型    | 是否必填 | 默认值 | 说明                             |
| ------------- | ------- | -------- | ------ | -------------------------------- |
| core          | boolean | 否       | false  | 是否采集静态资源、接口的相关数据 |
| firstResource | boolean | 否       | false  | 是否采集首次进入页面的数据       |
| server        | boolean | 否       | false  | 是否采集接口请求                 |

## error
当 error 为布尔值时其内部所有属性都为此布尔值

| 属性名 | 类型    | 是否必填 | 默认值 | 说明                 |
| ------ | ------- | -------- | ------ | -------------------- |
| core   | boolean | 否       | false  | 是否采集异常数据     |
| server | boolean | 否       | false  | 是否采集报错接口数据 |

## event
当 event 为布尔值时其内部所有属性都为此布尔值

| 属性名 | 类型    | 是否必填 | 默认值 | 说明             |
| ------ | ------- | -------- | ------ | ---------------- |
| core   | boolean | 否       | false  | 是否采集点击事件 |

## 具体参数解释

::: tip
sdk 中所有的配置都可以在项目运行中更改

例如

import { options } from '@web-tracing/vue2'

options.value.dsn = 'www.baidu.com' // 从此刻开始所有的事件都会发送到此服务器上
:::

### dsn
+ 解释: 上报地址
+ 作用: 将收集到的数据根据dsn地址上报到服务端
+ 备注: 必填

### appName
+ 作用: 作为附带参数 - `项目名称` 给到服务端
+ 解释: 被监控的项目名称
+ 备注: 必填

### appCode
+ 作用: 作为附带参数 - `项目code` 给到服务端
+ 解释: 被监控的项目code

### appVersion
+ 作用: 作为附带参数 - `项目版本` 给到服务端
+ 解释: 被监控项目的版本号

### userUuid
+ 作用: 作为附带参数 - `用户id` 给到服务端
+ 解释: 登录被监控的项目的用户id

### debug
+ 作用: 查看sdk内部的console.log
+ 解释: 需要在浏览器控制台查看发送的事件信息时可以打开此参数

### ext
+ 作用: 作为附带对象参数给到服务端
+ 解释: 在 `baseinfo` 对象中会带上 `ext` 对象，如果想要传递一些额外的公共数据可通过此参数附加
+ 备注: 可在使用过程中对 `ext` 对象进行增删改查，sdk内部会带上最新值

### tracesSampleRate
+ 作用: 针对已发生的事件进行抽样发送
+ 解释: 抽样发送(0-1)
+ 默认值: 1

### cacheMaxLength
+ 作用: 设置上报数据最大缓存数
+ 解释: sdk内部对所有已发生的事件会先存到事件列表中，在达到最大缓存数时会触发事件上报
+ 默认值: 5

### cacheWatingTime
+ 作用: 设置上报数据最大等待时间(ms)
+ 解释: sdk内部对所有已发生的事件会先存到事件列表中，同时也会开始倒计时(也就是最大等待时间)，倒计时结束后无论事件列表中是否满足最大缓存数都会触发发送
+ 默认值: 5000

### recordScreen
+ 作用: 是否启动录屏功能
+ 解释: 错误采集时会保存页面录屏信息，该选项仅在启动错误采集时生效，为 false 时错误采集 recordscreen 属性为 null
+ 默认值: true

### ignoreErrors
+ 作用: 错误类型事件过滤
+ 解释: 在触发错误类型事件时，会依据此参数过滤一遍，最终决定哪些事件可以发生

### ignoreRequest
+ 作用: 请求类型事件过滤
+ 解释: 在触发请求类型事件时，会依据此参数过滤一遍，最终决定哪些事件可以发生

### scopeError
+ 作用: 开启范围错误
+ 解释: 为了应对被监控的项目发生了批量错误时sdk会将这些重复的错误都一一发送到服务端，特别是当这些错误是循环无限错误时，对服务端的浪费是灾难性的，所以提出此参数；当开启了后sdk内部会判断是否为批量错误，然后归纳一起发送给服务端；当批量错误多了sdk会识别出无限错误，每隔20s才发送此错误；具体查看 [错误采集](../functions/error.md)
+ 默认值: false

### localization
+ 作用: 是否本地化
+ 解释: 开启本地化后，数据会存储在 localStorage 中，需要开发手动去发送与清除；具体查看 [导出项](../functions/exports.md)
+ 默认值: false

### sendTypeByXmlBody
+ 作用: 是否强制指定发送形式为xml，body请求方式
+ 解释: sdk内部有三种发送方式（sendbeacon、img、xml），此参数可以强行指定发送数据方式为xml
+ 默认值: false

### beforePushEventList
+ 作用: 事件添加到事件列表前的hook
+ 解释: 为了让用户对采集到的数据进行自定义增删改查，提供此函数；例如捕获到了错误事件，在将此事件对象放入事件列表时会触发此函数，当此函数返回false时则不会将此错误事件放入事件列表，当函数返回其他对象时，sdk内部会将此对象放入事件列表；具体查看 [导出项](../functions/exports.md)
+ 备注: 初始化时可传入此函数，在项目运行中也可以继续使用此函数，sdk内部会将所有的 `beforePushEventList` 函数形成链路依次执行

### beforeSendData
+ 作用: 事件列表上报前的hook
+ 解释: 为了让用户对采集到的数据进行自定义增删改查，提供此函数；例如事件列表个数在超过最大缓存数时会发送事件列表，此时会触发此函数，当此函数返回false时则不会将此错误事件放入事件列表，当函数返回其他事件列表时，sdk内部会发送此事件列表；具体查看 [导出项](../functions/exports.md)
+ 备注: 初始化时可传入此函数，在项目运行中也可以继续使用此函数，sdk内部会将所有的 `beforeSendData` 函数形成链路依次执行

### afterSendData
+ 作用: 事件列表上报后的hook
+ 解释: 在事件列表上报后项目内部想做一些收尾工作则可以利用此函数；具体查看 [导出项](../functions/exports.md)
+ 备注: 初始化时可传入此函数，在项目运行中也可以继续使用此函数，sdk内部会将所有的 `afterSendData` 函数形成链路依次执行
