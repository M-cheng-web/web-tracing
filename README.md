# web-tracing
前端 - 埋点, 性能采集, 异常采集, 请求采集, 路由采集

## 使用
将打包好的`trace.js`文件放在`public`文件夹下,随后在`public -> index.html`页面初始化
> public文件夹指的是vue项目中跟路径下的public文件夹
``` html
<script type="text/javascript" src="<%= BASE_URL %>trace.js"></script>
<script type="text/javascript">
  _trace.init({
    appName: "ops_wit",
    hashtag: true
  });
</script>
```
采集方式
+ 自动采集: 通过元素上的已挂载的属性获取参数后传递给后端
+ 手动采集: 调用插件内的目标方法来触发相对应的采集后会自动传递给后端

### init
``` js
_trace.init(options)
```
### options
| 名称                      | 类型           | 是否必填 | 默认值    | 说明                                                                                         |
| ------------------------- | -------------- | -------- | --------- | -------------------------------------------------------------------------------------------- |
| requestUrl                | string         | 是       | -         | 是否开启触发事件时控制台输出     **必填**                                                    |
| appName                   | string         | 是       | -         | 应用的标记,以此来区分各个应用,**必填**                                                       |
| appCode                   | string         | 否       | -         | 应用的code,附加作用                                                                          |
| appVersion                | string         | 否       | -         | 应用版本                                                                                     |
| ext                       | object         | 否       | undefined | 自定义的全局附加参数                                                                         |
| debug                     | boolean        | 否       | false     | 是否开启触发事件时控制台输出                                                                 |
| pv                        | boolean/object | 否       | false     | boolean: true代表其所有属性为true/false代表其所有属性为false                                 |
| pv.core                   | boolean        | 否       | false     | 页面跳转-是否自动发送页面跳转相关数据                                                        |
| pv.hashtag                | boolean        | 否       | false     | 页面跳转-浏览器的动作发生时(例如浏览器的回退按钮)是否监听hash变化,如果是hash路由请开启此开关 |
| performance               | boolean/object | 否       | false     | boolean: true代表其所有属性为true/false代表其所有属性为false                                 |
| performance.core          | boolean        | 否       | false     | 性能数据-是否采集静态资源、接口的相关数据                                                    |
| performance.firstResource | boolean        | 否       | false     | 性能数据-是否采集首次进入页面的数据(ps: tcp连接耗时,HTML加载完成时间,首次可交互时间)         |
| performance.server        | boolean        | 否       | false     | 接口请求-是否采集接口请求(成功的才会采集)                                                    |
| error                     | boolean/objcet | 否       | false     | boolean: true代表其所有属性为true/false代表其所有属性为false                                 |
| error.core                | boolean        | 否       | false     | 是否采集异常数据(ps: 资源引入错误,promise错误,控制台输出错误)                                |
| error.server              | boolean        | 否       | false     | 接口请求-是否采集报错接口数据                                                                |
| event                     | boolean/objcet | 否       | false     | boolean: true代表其所有属性为true/false代表其所有属性为false                                 |
| event.core                | boolean        | 否       | false     | 页面点击-是否采集点击事件                                                                    |
| event.unload              | boolean        | 否       | false     | 页面卸载-是否在页面卸载时采集页面状态信息                                                    |

### 页面元素标记
| 属性名称             | 说明                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| data-warden-container  | 该元素作为采集容器,内部的需要采集的元素上如果没有这些属性会使用容器上的属性最为填充 |
| data-warden-event-id | 元素上标记事件的id                                                                  |
| data-warden-title    | 元素上标记事件的title,也可以使用原生的title属性,但是此时鼠标悬浮会有提示            |
| data-warden-*        | 其他的属性都会被当作参数,例如 data-warden-name="a"会被收集为{ name: 'a' }           |

### 方法
挂载在`window._trace`上的一些方法,可以用来修改配置或者主动触发采集

#### init
初始化,通过参数控制采集
``` js
_trace.init({});
```

#### setCustomerId
设置customerId,后续采集中会携带这一参数
``` js
_trace.setCustomerId('customId');
```

#### setUserUuid
设置userUuid,后续采集中会携带这一参数
``` js
_trace.setUserUuid('uuid');
```

#### tracePageView
触发一次页面采集
``` js
_trace.tracePageView({
    url: '',
    referer: '',
    action: '',
    title: '',
    params: {},
});
```

#### tracePerformance
采集自定义性能数据
``` js
_trace.tracePerformance({
    eventId: '性能类型名称',
    options: {},
});
```

#### traceError
记录错误消息
``` js
_trace.traceError('错误类型名称', '错误消息', {
    // 上报参数
    params: {},
    // 可其他自定义属性
});
```

#### traceEvent
自定义上报事件
``` js
_trace.traceEvent('事件ID', '事件标题', {
    // 事件参数
});
```

## 介绍
监控线上环境状态以及采集用户操作行为的数据

### 设计核心(WWWWH)
谁(Who)在什么时候(When)什么地方(Where)干了什么(What),怎么干的(How)

#### Who
**什么是用户**<br>
用户指的是访问这个页面的行为人,对于SDK来说使用同一个账户、同一个设备、同一个浏览器来访问页面的"人"就是同一个用户
<br>

**用户ID**<br>
每一次访问都有一个唯一的ID,不论什么时候来访问,用户是否登录,都携带有一个唯一的ID<br>
可以理解为用来标记这个访问设备,有网卡mac地址则使用mac地址(移动端用udid)<br>
mac地址、移动端设备id,SDK生成的ID在库中的字段都为 udid
<br>

**会话ID**<br>
会话ID用来标记某段时间内的连续访问为一次用户会话,当用户开始一个新的访问时,会创建一个session_id,存于cookie当中<br>
有效期三十分钟,当有用户交互发生时,会话有效期从交互时刻延长至该交互事件发生时刻的30分钟后,即重置session_id有效期
<br>

#### When
用户事件发生的时间,这个时间是客户端时间,客户端时间用于对这个客户端上的埋点记录进行排序,来串联用户的交互行为<br>

客户端时间是不准确的,比较准确的推算出用户事件发生的真实时刻,需要三个值:
1. 事件发生时间
2. 事件记录发送时间,我们是缓存后,批量发送,需要加上发送时间
3. 后端接收时间

推算前提:
+ 以后端时间为基准,后端时间是真实可靠的
+ 我们认为客户端发送给后端的这个网络开销时间忽略不计

后端接收时间和客户端发送时间的差值代表了基准时间和客户端时间的差值<br>
推算公式: realTime = receiveTime - sendTime + time

#### Where
物理位置: 用户所处的地理位置,通过ip或者app的定位服务计算用户所处在哪个地方

逻辑位置: 事件发生时用户当前所在的页面,事件发生时在页面内的位置信息

来源位置: 事件发生时当前页面的上一个页面

#### What
事件的内容

对于页面访问,内容就是页面标题
对于输入事件,内容就是用户输入的内容
对于点击事件,内容就是点击事件采集的规则(参考下方)

#### How
用户是怎么触发这个事件的

内置的几种类型:
+ page: 页面切换时会记录该类型数据,页面切换可以多普通页面切换,也可以是调用HistoryAPI,或是hashchange方式。
+ error: 页面发生异常时会记录该类型数据,异常可以是代码异常、接口异常、资源加载异常
+ performance: 性能相关的事件发生时会记录该类型数据,性能事件包括: 页面加载性能、请求响应性能、自定义性能条件触发
+ click: 用户点击交互事件

### 埋点自动分类采集

#### 事件采集
监听DOM上的事件(可以传入配置来选择监听哪种事件类型和元素)<br>
DOM事件在目标阶段可能会被阻止冒泡,在捕获阶段处理DOM事件则不会遗漏那些被阻止冒泡的事件<br>
当事件发生时要采集事件的类型、事件的标题和内容、事件发生的位置、事件的时间<br><br>

元素埋点属性:
+ data-warden-container
+ data-warden-event-id
+ data-warden-title
+ data-warden-params

##### 容器
data-warden-container<br>
元素拥有data-warden-container则视作是容器元素,内部元素触发的事件时,
如果触发事件的元素上没有埋点属性修饰那就认为这个事件是由容器节点触发的,
容器节点取代触发事件的子元素节点作为target,标题从容器上获取,内容依旧从真实触发事件的子元素上获取
``` html
<!-- 容器元素,内部的元素如果本身没有标记,父级有data-warden-container属性，则视作是由容器元素触发的事件 -->
<!-- 点击超链接或是图片时,按触发元素是父级div元素来处理 -->
<div data-warden-container data-warden-event-id="点击课程">
  <img src="" alt="" onClick="() => location.href = url" />
  <a href={url}>课程1</a>      
</div>
```
##### 事件标识(eventId字段)
data-warden-event-id, title<br>
事件的标题代表了埋点事件的ID,不用的事件埋点用不同的标题区分,是作为埋点事件的"身份"字段<br>

取值优先级:
1. 存在data-warden-event-id属性
2. 存在title属性
3. 如果被容器包裹,则target为容器节点,再按1、2的优先级读取一次标题值;如果1、2取不到值,则去读取data-warden-container属性值,如果值不为true,是个字符串,则返回data-warden-containr的属性值,否则返回标签名称
4. 如果没有被容器包裹,则title返回元素标签名称

##### 事件标识(title字段)
点击事件的内容按以下规则采集
![埋点事件采集获取title字段流程图](https://gitee.com/M-cheng-web/map-storage/raw/master/design-img/%E5%9F%8B%E7%82%B9%E4%BA%8B%E4%BB%B6%E9%87%87%E9%9B%86%E8%8E%B7%E5%8F%96title%E5%AD%97%E6%AE%B5%E6%B5%81%E7%A8%8B%E5%9B%BE.png)

#### 异常采集
页面错误自动收集,可以设置相同错误重复发送的阈值,达到阈值不再上报,可以规避一些循环错误无限上报
需要记录所有已经发生的错误,错误重复发生的次数<br>
相同的错误: 错误类型一致,报错信息一致(例如: 同一个文件位置、同一个接口和入参)<br>
异常还包括: 服务器请求异常、资源加载异常,服务端异常由http请求采集协助收集

#### 性能采集
自动采集基础的性能数据
+ DOM加载
+ 资源加载
+ 请求RT - 由http请求采集协助

#### 请求采集
SDK拦截了以下两种请求,覆盖了axios,ajax,fetch
+ 拦截XMLHttpRequest.send请求
+ 拦截fetch请求

#### 路由pv采集
在单页应用中,页面的切换不会重新加载页面,SDK不会重新执行,PV不会自动记录<br>
所以在单页应用中SDK需要去监听"路由"的变化,路由的变化主要有两种: Hash路由,History路由<br>
SDK需要监听这两种路由的变化

### 事件数据结构
**各个事件发送的数据结构以及解释**

#### 基础字段
| 字段名        | 类型   | 约束 | 备注                                                                          |
| ------------- | ------ | ---- | ----------------------------------------------------------------------------- |
| gatherAppCode | string | 非空 | 应用code                                                                      |
| gatherAppName | string | 非空 | 应用名称 ( xueyuan_APP / xueyuan_PC / xueyuan_mini )                          |
| appVersion    | string | 非空 | 应用版本                                                                      |
| sdkVersion    | string |      | 采集版本 ( sdk自动采集 )                                                      |
| gatherEnd     | string |      | 采集端类型,区分app原生/web端: mobile web                                      |
| deviceModel   | string |      | 设备型号名称,采集具体型号名字,例如:iPhoneX,MI8,web取不到填空                  |
| deviceType    | string |      | 设备类型.例如:mobile/pad/pc                                                   |
| deviceId      | string |      | 设备号 imei、mac、前端产生的uuid                                              |
| vendor        | string |      | 设备商: mi apple oneplus oppo vivo,web取不到填空                              |
| systemVersion | string |      | 操作系统和版本                                                                |
| platform      | string |      | 运行平台(ios/android/微信/小程序/微端/浏览器)                                 |
| browser       | string |      | 浏览器+版本                                                                   |
| screenWidth   | number |      | 设备屏幕宽度                                                                  |
| screenHeight  | number |      | 设备屏幕高度                                                                  |
| clientWidth   | number |      | 可视区域宽度,native不统计                                                     |
| clientHeight  | number |      | 可视区域高度,native不统计                                                     |
| sendTime      | number |      | 埋点发送的客户端时间戳 单位:ms                                                |
| pageId        | string |      | WEB单页应用打开时生成的ID,在应用内切换路由,ID不变,到新页面或是刷新时,重新生成 |
| sessionId     | string |      | 会话ID,没有交互时30分钟后重新创建sessionId                                    |
| ip            | string |      | 埋点服务器记录时补充                                                          |
| receiveTime   | number |      | 埋点服务器记录时补充,埋点在服务端接收到的时间戳 单位:ms                       |
| geo           | string |      | 埋点服务器记录时补充,地理位置经纬度( x / y )                                  |
| ua            | string |      | 埋点服务器记录时补充,从请求头中获取补充,userAgent                             |

#### eventId和eventType
eventType用于表明事件的类型,类型为固定的以下几种(浏览器自身基础事件和自定义事件)
+ pv
+ dwell
+ error
+ performance
+ mix(合并这些事件: click, submit, scroll, change)
+ custom - 用户自定义事件,手动方法为此类型

eventId用于表明事件的唯一标识,同一类型下的事件可能会有细分
eventId由一般由业务方自己定义,一般在元素标签上定义属性"data-warden-event-id"

**注意: error和performance类型下会有内置的eventId,这类事件会自动采集,一般不用自定义**

#### pv
| 字段名        | 类型    | 约束 | 备注                                                                  |
| ------------- | ------- | ---- | --------------------------------------------------------------------- |
| eventType     | string  |      | pv(路由采集)                                                          |
| eventId       | string  |      | sdk自动产生,每次进入同一个页面,eventId保证相同 单页面应用保持不变     |
| url           | string  |      | 事件发生的URL，因为埋点数据缓存发送，SDK需要中url属性写入到每条记录中 |
| referer       | string  |      | 上游页面地址                                                          |
| action        | string  |      | navigate / reload / back_forward / reserved                           |
| params        | string  |      | 手动采集才有                                                          |
| time          | number  |      | 事件发生的客户端时间戳 单位: ms                                       |
| cookieEnabled | boolean |      | true/false,native不统计                                               |

#### dwell
| 字段名      | 类型   | 约束 | 备注                                                                |
| ----------- | ------ | ---- | ------------------------------------------------------------------- |
| eventType   | string |      | dwell(页面卸载事件)                                                 |
| eventId     | string |      | sdk自动产生,每次进入同一个页面,eventId保证相同 单页面应用保持不变   |
| url         | string |      | 事件发生的URL,因为埋点数据缓存发送,SDK需要中url属性写入到每条记录中 |
| referer     | string |      | 上游页面地址                                                        |
| action      | string |      | navigate / reload / back_forward / reserved                         |
| params      | string |      | 手动采集才有                                                        |
| triggerTime | number |      | 事件发生的客户端时间戳  单位: ms                                    |
| millisecond | string |      | 页面停留时长                                                        |

#### mix
| 字段名      | 类型   | 约束 | 备注                                                               |
| ----------- | ------ | ---- | ------------------------------------------------------------------ |
| eventType   | string | 非空 | mix(click、change、submit、scroll),多种事件集合                    |
| eventId     | string |      | click事件的唯一标识,如需采集,则web请看data-warden-event-id采集规则 |
| title       | string |      | 事件自动采集的内容                                                 |
| params      | string |      | 事件自定义参数JSON对象,比事件信息更结构化                          |
| path        | string |      | 事件发生的元素位置                                                 |
| x           | string |      | x坐标( app端暂时没有 )                                             |
| y           | string |      | y坐标( app端暂时没有 )                                             |
| href        | string |      | click - 如果是超链接,记录超链的href                                |
| url         | string |      | click事件发生时的页面url                                           |
| triggerTime | number |      | 事件发生的客户端时间戳  单位: ms                                   |

#### error
| 字段名         | 类型   | 约束 | 备注                                                                                                                      |
| -------------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------- |
| eventType      | string | 非空 | error(错误收集)                                                                                                           |
| eventId        | string |      | server / code / resource  / biz - 服务器异常（4xx、5xx的非正常响应）/ 代码异常 / 静态资源404 / 业务异常（主动上报的异常） |
| src            | string |      | 源码路径,资源路径,请求路径                                                                                                |
| triggerTime    | number |      | 事件发生的客户端时间戳  单位: ms                                                                                          |
| method         | string |      | 如果是请求的话,请求类型post/get                                                                                           |
| responseStatus | string |      | 如果是请求的话,请求状态码是啥                                                                                             |
| params         | string |      | 自定义的参数数据                                                                                                          |
| errMessage     | string |      | 错误消息                                                                                                                  |
| errName        | string |      | ReferenceError / 404 Not Found 错误类型名                                                                                 |
| errStack       | string |      | 异常堆栈                                                                                                                  |
| line           | number |      | 行号                                                                                                                      |
| col            | number |      | 列号                                                                                                                      |
| url            | string |      | 事件发生的URL,因为埋点数据缓存发送,SDK需要中url属性写入到每条记录中                                                       |

#### performance
| 字段名        | 描述                                       | 类型   | 计算方式                                  | 备注                                                                                                                               |
| ------------- | ------------------------------------------ | ------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| eventType     | performance                                | string |                                           | performance                                                                                                                        |
| eventId       | page-performance                           | string |                                           | page                                                                                                                               |
| navgationType |                                            | string |                                           | 打开方式'reload'                                                                                                                   |
| fmp           | First Meaningful Paint(首屏时间)           | number | 渲染节点增量最大的时间点                  | 这里我们理解FMP为渲染有效屏幕的时间,我们用节点渲染增量最大的点作为首屏时间,已经能适用于大部分渲染场景,后续引入节点权重算法精确此值 |
| fpt           | First Paint Time，首次渲染时间（白屏时间） | number | responseEnd - fetchStart                  | 从请求开始到浏览器开始解析第一批HTML文档字节的时间差                                                                               |
| tti           | Time to Interact，首次可交互时间           | number | domInteractive - fetchStart               | 浏览器完成所有HTML解析并且完成DOM构建,此时浏览器开始加载资源                                                                       |
| ready         | HTML加载完成时间， 即DOM Ready时间         | number | domContentLoadEventEnd - fetchStart       |                                                                                                                                    |
| load          | 页面完全加载时间                           | number | loadEventStart - fetchStart               | load = 首次渲染时间 + DOM解析耗时 + 同步JS执行 + 资源加载耗时                                                                      |
| firstbyte     | 首包时间                                   | number | responseStart - domainLookupStart         |                                                                                                                                    |
| dns           | dns查询耗时                                | number | domainLookupEnd - domainLookupStart       |                                                                                                                                    |
| tcp           | TCP连接耗时                                | number | connectEnd - connectStart                 |                                                                                                                                    |
| ttfb          | Time to First Byte（TTFB），请求响应耗时   | number | responseStart - requestStart              |                                                                                                                                    |
| trans         | 内容传输耗时                               | number | responseEnd - responseStart               |                                                                                                                                    |
| dom           | DOM解析耗时                                | number | domInteractive - responseEnd              |                                                                                                                                    |
| res           | 资源加载耗时                               | number | loadEventStart - domContentLoadedEventEnd | 页面中的同步加载资源                                                                                                               |
| ssl           | SSL安全连接耗时                            | number | connectEnd - secureConnectionStart        |                                                                                                                                    |
| url           | performance                                | string |                                           | 事件发生的URL,因为埋点数据缓存发送,SDK需要中url属性写入到每条记录中                                                                |

#### performance-server
| 字段名         | 类型   | 备注                                                                |
| -------------- | ------ | ------------------------------------------------------------------- |
| eventType      | string | performance                                                         |
| eventId        | string | server(请求)                                                        |
| src            | string | 请求地址,对应到performance的name                                    |
| method         | string | 'get'/'post'                                                        |
| duration       | number | 请求耗时                                                            |
| triggerTime    | number | 开始发送请求的时间,时间戳 13                                        |
| responseStatus | string | 返回状态                                                            |
| params         | object | 后端标识                                                            |
| url            | string | 事件发生的URL,因为埋点数据缓存发送,SDK需要中url属性写入到每条记录中 |

#### performance-resource
| 字段名            | 类型   | 备注                                                                               |
| ----------------- | ------ | ---------------------------------------------------------------------------------- |
| eventType         | string | performance                                                                        |
| eventId           | string | resource(资源)                                                                     |
| src               | string | 资源具体url，对应到performance的name                                               |
| initiatorType     | string | 初始化性能条目的资源类型( script link css img first-paint first-contentful-paint ) |
| transferSize      | number | 传输的数据包大小                                                                   |
| encodedBodySize   | number | 数据包压缩后大小                                                                   |
| decodedBodySize   | number | 数据包解压后大小                                                                   |
| duration          | number | 加载具体时长,如果是0,是momery cache(responseEnd-startTime)                         |
| redirectStart     | number | 重定向开始                                                                         |
| redirectEnd       | number | 重定向结束                                                                         |
| startTime         | number | 开始时间                                                                           |
| fetchStart        | number | 开始发起请求                                                                       |
| domainLookupStart | number | DNS开始解析                                                                        |
| domainLookupEnd   | number | DNS结束解析                                                                        |
| connectStart      | number | 开始建立连接                                                                       |
| connectEnd        | number | 连接建立完成                                                                       |
| requestStart      | number | 开始发送数据包                                                                     |
| responseStart     | number | 开始接收数据包                                                                     |
| responseEnd       | number | 数据包接收完成                                                                     |
| triggerTime       | number | 开始发送请求的时间,时间戳 13                                                       |
| responseStatus    | string | 返回状态                                                                           |
| url               | string | 事件发生的URL,因为埋点数据缓存发送,SDK需要中url属性写入到每条记录中  native不统计  |
| isCompressed      | number | 是否开启了gzip压缩,0代表未开启,1代表开启,-1代表未知                                |

#### 自定义事件
| 字段名      | 类型   | 备注                                                       |
| ----------- | ------ | ---------------------------------------------------------- |
| eventType   | string | custom                                                     |
| eventId     | string | 业务方定义                                                 |
| action      | string | 定义触发的动作,click、scroll等等,由用户自定义指定,默认为空 |
| triggerTime | string | 触发时间                                                   |
| title       | string | 事件标题                                                   |
| params      | string | 事件参数                                                   |
| url         | string | 发生事件时的页面url                                        |










