<div align="center">
  <img src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/logo.7k1jidnhjr40.svg" width="128" alt="logo" />
  <h1>web-tracing 监控插件</h1>
  <p>
    基于 JS 跨平台插件，为前端项目提供【 埋点、行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段
  </p>
</div>

## 官方文档
[官方文档 https://m-cheng-web.github.io/web-tracing/](https://m-cheng-web.github.io/web-tracing/)

## 示例项目(本地)
[js版本 https://github.com/M-cheng-web/web-tracing-examples-js](https://github.com/M-cheng-web/web-tracing-examples-js)

[vue2版本 https://github.com/M-cheng-web/web-tracing-examples-vue2](https://github.com/M-cheng-web/web-tracing-examples-vue2)

[vue3版本 https://github.com/M-cheng-web/web-tracing-examples-vue3](https://github.com/M-cheng-web/web-tracing-examples-vue3)

## 演示
### 事件监听
<img src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/image.4388hbrc1gc0.jpg" width="1200" alt="logo" />

### 错误监听
<img src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/Oct-11-2023-15-43-53.788yqv47x3k0.gif" width="1200" alt="logo" />

### 资源监听
<img src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/image.265x5n6f6ny8.jpg" width="1200" alt="logo" />

## 项目初衷
为了帮助开发们在公司平台上搭建一套前端监控平台

> 作者心声: 想降低一下前端在这方面耗费的时间与精力，此项目会尽量针对每个场景都提供解决方案；即使最后没用我这套，但从在这里对某些场景方案有了一些了解，我也很开心（为了方便大家移植代码所以没有分包，如果你有分包需求可联系我，干杯！）

## 亮点
提供了多种定制化api最大限度帮助你应付各个场景的业务，例如:
+ 提供钩子函数让你对数据精确把握
+ 提供本地化选项api，让开发手动控制去发送监控数据 - 节省带宽
+ 提供批量错误api，在遇到无限错误时融合批量错误信息 - 节省带宽
+ 提供抽样发送api - 节省带宽
+ 提供 错误/请求 事件的过滤api
+ 等等....

站在技术角度，因为明确此项目可能更多的是应用在公司平台上，大概率会二开，所以作者对项目结构以及代码都严格要求
+ 架构 - demo、核心sdk代码、文档都在同一个项目中，调试、部署都很方便
+ 封装 - sdk存在大量的重写或者监听，对此有统一流程
+ 响应式 - 项目内部实现了vue响应式，也应用在 options 对象中，相信你接触会后受益良多
+ 多版本 - 针对不同平台提供多个版本(目前只有js、vue2、vue3)，受益于monorepo架构可一键发布
+ 内聚 - 目前核心功能的所有代码都没有分包，虽然monorepo架构支持，但作者认为目前分包不利于代码阅读以及二开方便
+ 文档/注释 - 完善的文档以及非常全的注释，力求帮助你快速了解这一切

## 功能列表
具体参见[CHANGELOG.md](https://github.com/M-cheng-web/web-tracing/blob/main/CHANGELOG.md)

## 未来方向
会写一套服务端(nest) + 后台查看监控数据平台(vue)，有以下几点考量
+ 提供服务端能力（目前只是在采集端发力）
+ 可以在线体验此项目
+ 提供更多示例代码给开发们，再次降低这一套代码在公司的推广难度
+ 作者也想站在业务的角度多思考还能从哪些方面此项目还缺失哪些功能

针对首屏加载的监控做出更多精细化的东西，例如考虑sdk的绝对轻量化

## 联系我
<img align="left" width="180" src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/image.19hrnxwgkdpc.jpg" />

- 如果对此项目有疑虑或者有优化点，欢迎与我讨论
- Bug 反馈请直接去 Github 上面提 Issues，我会实时收到邮件提醒前去查看

<br/>
<br/>
<br/>
<br/>
<br/>

<img align="left" width="180" src="https://cdn.jsdelivr.net/gh/M-cheng-web/image-provider@main/web-tracing/image.2zvxgp2mh3u0.webp" />

- **如果你此项目能帮助到你、亦或者是你需要向我咨询一些事项，可否请我吃一块糖果，感受到你的善意！**

> **`注好你的微信号!`** **`微信看不到赞赏人信息`** **`所以你必须在备注里写上`**

<br/>
<br/>
<br/>
<br/>
<br/>

## 🙏🙏🙏 点个Star

**如果您觉得这个项目还不错, 可以在 [Github](https://github.com/M-cheng-web/web-tracing) 上面帮我点个`star`, 支持一下作者ヾ(◍°∇°◍)ﾉﾞ**

<br/>

## 特别感谢
+ [xy-sea](https://github.com/xy-sea)为我提供了很多好主意，这是他的关于[监控平台文章以及blog](https://github.com/xy-sea/blog/blob/main/markdown/%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0%EF%BC%8C%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87%E7%9A%84%E4%BA%AE%E7%82%B9%E9%A1%B9%E7%9B%AE.md)，写的很好受益匪浅
+ [wangshitao929@163.com](wangshitao929@163.com) - 特别赞助
+ [rrweb](https://github.com/rrweb-io/rrweb) - sdk内部使用其帮助错误录屏
+ [fingerprintjs v3.4.1](https://github.com/fingerprintjs/fingerprintjs) - sdk内部采用了其离线版本，用于标识唯一用户
+ [webrtc-ip v3.0.1](https://github.com/joeymalvinni/webrtc-ip) - sdk内部采用了其离线版本，用于获取公网ip