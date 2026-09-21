<div align="center">
  <img src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/logo.7k1jidnhjr40.svg" width="128" alt="logo" />
  <h1>web-tracing 监控插件</h1>
  <p>
    基于 JS 跨平台插件，为前端项目提供【 埋点、行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段
  </p>
</div>

> [!IMPORTANT]
> **项目近况**
>
> web-tracing 是 Tracera 的开源技术起点。后续本项目将以低频、必要维护为主，不再进行高频的新功能迭代，也不承诺固定的版本与 Issue 响应周期。
>
> Tracera 不是 web-tracing 的简单改名，而是沿着这套前端监控技术积累重新构建的独立项目，继续完善服务端可靠处理、数据分析、错误现场回放、Source Map 定位、PageSpy 用户直连、私有部署，以及基于真实系统证据的 Agent Runtime。
>
> Tracera 当前处于 Beta 内测阶段，功能、界面与开放方式仍会持续调整（当前已经确定 sdk、前端层面都会进行开源，目前还在内测，完毕后会进行开源等 sdk 发布动作）。项目介绍、在线体验入口、体验账号和相关说明请查看 [Tracera Site](https://tracera.cn)。

## 官方文档
[官方文档 https://m-cheng-web.github.io/web-tracing/](https://m-cheng-web.github.io/web-tracing/)

## DeepWiki文档
[DeepWiki文档 https://deepwiki.com/M-cheng-web/web-tracing](https://deepwiki.com/M-cheng-web/web-tracing)

## 示例项目(本地)
[js版本 https://github.com/M-cheng-web/web-tracing-examples-js](https://github.com/M-cheng-web/web-tracing-examples-js)

[vue2版本 https://github.com/M-cheng-web/web-tracing-examples-vue2](https://github.com/M-cheng-web/web-tracing-examples-vue2)

[vue3版本 https://github.com/M-cheng-web/web-tracing-examples-vue3](https://github.com/M-cheng-web/web-tracing-examples-vue3)

[react版本 https://github.com/boychina/web-tracing-examples-react](https://github.com/boychina/web-tracing-examples-react)

[nuxt版本 https://github.com/boychina/web-tracing-examples-nuxt](https://github.com/boychina/web-tracing-examples-nuxt)

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

## 从 web-tracing 到 Tracera

web-tracing 最初聚焦浏览器侧的埋点、行为、性能、异常、请求、资源、路由、曝光和录屏等采集能力，并在早期规划过服务端和管理后台方向。

这条技术路线现在已经继续演进为独立项目 Tracera。Tracera 不只是为 web-tracing 增加一个后台，而是围绕多运行时 SDK、服务端可靠处理、数据分析、错误现场还原、Source Map、PageSpy、私有部署，以及基于真实系统证据的 Agent Runtime，重新构建完整产品链路。

Tracera 当前仍处于 Beta 内测阶段，预计会保持较长时间的验证与打磨。项目介绍、在线体验入口、体验账号和相关说明统一放在 [Tracera Site](http://8.152.161.95:7200)。

## 三方监控平台
目前支持的三方监控平台有：
+ [WebTracingAnalysis](https://github.com/boychina/web-tracing-analysis) : Spring Boot + MySQL + React + Ant Design（支持容器化部署）

## 联系我
<img align="left" width="180" src="https://github.com/M-cheng-web/image-provider/raw/main/web-tracing/image.19hrnxwgkdpc.jpg" />

- 如果对此项目有疑虑或者有优化点，欢迎与我讨论，也可以加入 Tracera 技术交流群
- Bug 反馈可以提交 GitHub Issue；web-tracing 当前以低频、必要维护为主，不承诺固定的响应和版本周期

<br/>
<br/>
<br/>
<br/>
<br/>

## 🙏🙏🙏 点个Star

**如果您觉得这个项目还不错, 可以在 [Github](https://github.com/M-cheng-web/web-tracing) 上面帮我点个`star`, 支持一下作者ヾ(◍°∇°◍)ﾉﾞ**

<br/>

## 贡献者

<a href="https://github.com/M-cheng-web/web-tracing/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=M-cheng-web/web-tracing" />
</a>

<br/>

## 特别感谢
+ [xy-sea](https://github.com/xy-sea)为我提供了很多好主意，这是他的关于[监控平台文章以及blog](https://github.com/xy-sea/blog/blob/main/markdown/%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0%EF%BC%8C%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87%E7%9A%84%E4%BA%AE%E7%82%B9%E9%A1%B9%E7%9B%AE.md)，写的很好受益匪浅
+ [wangshitao929@163.com](wangshitao929@163.com) - 特别赞助
+ [rrweb](https://github.com/rrweb-io/rrweb) - sdk内部使用其帮助错误录屏
+ [fingerprintjs v3.4.1](https://github.com/fingerprintjs/fingerprintjs) - sdk内部采用了其离线版本，用于标识唯一用户
+ [webrtc-ip v3.0.1](https://github.com/joeymalvinni/webrtc-ip) - sdk内部采用了其离线版本，用于获取公网ip
