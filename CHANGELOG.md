# 版本变更记录

## 已完成/提交 & 未发包

## 2.0.6(未发包)

## 2.0.5
+ event.md 事件流图片缺失
+ readme.md 添加赞赏码
+ fix issues https://github.com/M-cheng-web/web-tracing/issues/43

## 2.0.4
+ README.md 中微信名片地址更改
+ 兼容electron环境下获取window变量

## 2.0.3
+ package.json 中 clean 命令优化
+ package.json 中 esno 本地化
+ 添加 CHANGELOG.md 并对之前版本补充
+ README.md 更改介绍语
+ 暴露出的主动事件方法添加flush参数代表是否立即发送事件

## 2.0.2
+ 改进 mvvm-watch(原先有bug)
+ 添加 recordScreen 配置项

## 2.0.1
+ 去除 event.unload 参数(同时此事件也会去除)
+ 新增 sendTypeByXmlBody 参数强行控制发送方式是否为 xmlbody 形式
+ 新增 pv-duration 事件类型来标明页面停留时间

## 2.0.0（二期功能）
+ 整体代码结构更改
+ 文档系统与sdk核心代码融合 (vuepress -> vitepress)
+ ts
+ demo完善(vue2、vue3、js)
+ issues统一解决
+ ignoreErrors - 错误屏蔽
+ ignoreRequest - 请求屏蔽
+ 支持hook以及自定义hook -【1.放入消息队列的钩子 2.发送时的钩子 3.发送之后的钩子】（这些钩子能放置多个）
+ 支持暴露更多变量（例如最大缓存数、延迟上传时间）
+ 支持更多上传方式(xml、image、sendbeacon) - 可强制指定xml
+ 支持抽样发送(tracesSampleRate全局抽样，具体到模块的抽样可以用beforePushEventList来阻止)
+ sdk内部的img发送请求不会记录
+ sdk内部的console.error不会记录
+ 防止重复init
+ 设置断网情况下不采集任何元素(个人认为断网了不需要再去采集用户的操作了，除非是特别需要，所以加入此限制)
+ 错误过多自动转区间事件，也就是去重(场景大致描述：如果是批量错误会延长20s再发送，如果是普通单个错误会延长2s发送，如果是无限错误每隔50个会发送一次)
+ 支持暴露更多sdk内部方法（例如使用者想要拿到此时的硬件数据,用户更改入参的方法,一些钩子也要加到这里，例如上传之前的的钩子，然后组成一个数组，为什么这里需要是因为用户想要在每个页面细致化控制是否上传，例如只想在用户打开某个页面才开始采集，不是这个页面则结束采集）
+ 关于用户信息的重构 - 【1.分为未登录与已登录的场景，登录后进行绑定，机器与用户id进行多对多绑定(更多方案还在确定中) 2.支持动态修改用户信息】- 使用 fingerprintjs 去实现设备id
+ 获取公网ip - 放在了base信息中
+ 支持区域曝光度采集 - 采用 IntersectionObserver 来实现的，当不兼容时此功能无效（后面会平替为 scroll 来实现，看有木有需求） - 考虑到需要曝光的元素可能在任意页面，所以sdk索性只提供暴露方法供使用者在运行中再去手动调用，目前内部在切换页面时会自动销毁当前页面监听 - 目前需要手动清除监听，后面有需要再根据路由跳转自动清除 - 目前收集契机是必须进入+出去才收集，暂不考虑停留页面直接退出的场景
+ 支持数据临时存储本地的形式减少服务端压力(会设定存储的阈值大小，最大5M，先不支持跨域存储，否则内容太大上传慢或者不兼容导致此功能不稳定) - 需要用户手动发送 - navigator.sendBeacon 发送大小在 2M-4M，如果觉得不稳妥可以 beforeSendData 拦截自己发送
+ 错误录屏
+ 针对资源的异步加载监控，sdk不做是否加载成功判断，但会暴露 responseEnd 和 responseStart，一般失败的资源加载通过这俩个字段能发现端倪 - 只针对支持 PerformanceObserver 的场景下，不支持 PerformanceObserver 会用 MutationObserver 兼容，不同的是 MutationObserver 能判断请求资源是否报错，如果报错则提供 responseStatus: 'error' 字段 (注意：通过标签加载资源如果报错除了资源本身会有错误，错误模块也会暴露一个错误信息，但如果是通过XMR请求则不会额外暴露错误信息)
+ 将所有 options 变为响应式 - 也就是所有用到了 options 参数时，当动态去改它能实时更新(可能要将所有的变量都变为响应式了) - 也就是支持用户全局动态去改 options - 采用 proxy，如果不兼容则此功能无效
+ performance模块的src url 改名 (requestUrl triggerPageUrl)
+ http模块 src 改名为 requestUrl
+ err模块 url 改名为 triggerPageUrl
+ event模块 url 改名为 triggerPageUrl
+ event-dwell模块 url 改名为 triggerPageUrl
+ pv模块 url 改名为 triggerPageUrl
+ sdk内部所有主动方法都改为只传 options 一个参数，但所有的属性优先级是低于内部定义的
+ sdk内部发送方式增加至三种，sendbeacon、xml、img，优先 sendBeacon，其次img，最后为xml（因为增加了错误录屏导致数据量较大，xml不限制请求大小）但xml可能会有跨域问题，使用者应该注意这一问题，且sdk内部会将配置的dsn地址加入请求拦截名单(sendBeacon 有64kb限制 img 有2kb限制)
+ 兼容 vue2、vue3（错误处理机制已兼容去重）（react以及小程序优先级靠后一些）（vue3的demo项目的err模块会报警告，分别是：rrweb-player初始加载警告、执行 codeError 方法会报警告；均不影响正常调试）
+ 实现参数动态更改，目前所有的都可更改，没加限制，所以得提醒注意改的场景不要啥都改
+ error 检测那边，加了一个属性标识错误类型，例如 console.error 还是 Error 或者 reject

## 1.0.0 - 2.0.0（一期功能）
+ 简单支持 vue2 + vue3
+ 自动采集 + 暴露api给用户手动采集上报
+ 采集功能：【用户事件采集、页面跳转采集、请求采集、错误采集、资源加载采集】
+ 采集上传方法：只提供 sendBeacon(内部降级为image)

