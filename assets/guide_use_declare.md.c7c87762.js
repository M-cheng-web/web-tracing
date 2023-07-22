import{_ as s,o as a,c as l,U as n}from"./chunks/framework.caeb0c25.js";const F=JSON.parse('{"title":"基础说明","description":"","frontmatter":{},"headers":[],"relativePath":"guide/use/declare.md","filePath":"guide/use/declare.md","lastUpdated":1689675202000}'),o={name:"guide/use/declare.md"},e=n(`<h1 id="基础说明" tabindex="-1">基础说明 <a class="header-anchor" href="#基础说明" aria-label="Permalink to &quot;基础说明&quot;">​</a></h1><p>帮助您快速了解本项目</p><h2 id="项目架构" tabindex="-1">项目架构 <a class="header-anchor" href="#项目架构" aria-label="Permalink to &quot;项目架构&quot;">​</a></h2><p>采用 Monorepo + pnpm 方式构建（会加上一些脚本），针对此项目有以下几项优势</p><ul><li>利于多包（core、vue2、vue3...）联调、发版</li><li>利于示例项目实时看到效果（包括后续的批量上线）</li><li>利于文档项目的编写（虽然现在没有联动）</li></ul><h2 id="基本原理" tabindex="-1">基本原理 <a class="header-anchor" href="#基本原理" aria-label="Permalink to &quot;基本原理&quot;">​</a></h2><h3 id="采集方式" tabindex="-1">采集方式 <a class="header-anchor" href="#采集方式" aria-label="Permalink to &quot;采集方式&quot;">​</a></h3><ul><li>自动采集: 内部对多个浏览器事件进行了劫持或者是监听，自动获取 【 错误、性能、页面跳转... 】信息</li><li>手动采集: 调用sdk暴露的方法去触发事件采集，见<a href="./../functions/exports">导出项</a></li></ul><h3 id="数据流向" tabindex="-1">数据流向 <a class="header-anchor" href="#数据流向" aria-label="Permalink to &quot;数据流向&quot;">​</a></h3><p>这里针对自动采集的数据流向进行说明</p><ol><li>内部对多个浏览器事件进行了劫持或者是监听，例如【 click、beforeunload、hashchange、replaceState、popstate...】</li><li>对 监听/劫持 到的事件进行预处理【 例如监听到 replaceState 被触发会提前记录当前时间搓，这样就拿到了页面跳转时的时间啦 】</li><li>每触发一个事件都会生成一个对象来描述此事件的信息，sdk会将这些对象放入列表中(在这个过程中会塞入一些公共信息)，等候统一发送</li></ol><h3 id="发送数据" tabindex="-1">发送数据 <a class="header-anchor" href="#发送数据" aria-label="Permalink to &quot;发送数据&quot;">​</a></h3><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>这里需要了解两个概念</p><ul><li>最大缓存数(cacheMaxLength 默认为5)</li><li>延迟发送事件时长(cacheWatingTime 默认为5s)</li></ul><p>最大缓存数: 在触发一次事件后会生成一个对象描述此事件，但并不会立即将此信息发送到服务端，而是会缓存起来等达到最大缓存数才会将这些采集到的信息组成列表发送给服务端（如果在 <code>延迟发送事件时长</code> 内还没有达到最大缓存数，则会将已记录的数据发送，反之在 <code>延迟发送事件时长</code> 内达到最大缓存数则立即将事件列表按照 <code>最大缓存数</code> 等份切割、分批发送）</p><p>延迟发送事件时长: 如果在触发一次后迟迟没有达到最大缓存数，达到 <code>延迟发送事件时长</code> 后也会将这一次的采集结果发送给服务端；反之已达到则立即发送给服务端</p></div><p>sdk内部支持多种发送方式</p><ul><li>navigator.sendBeacon</li><li>image</li><li>xml</li><li>开启本地化(localization)后，数据会存储在 localStorage 中，需要开发手动去发送与清除</li><li>通过sdk暴露的发送事件拦截事件，拦截所有的事件然后用自己的方式去发送</li><li>断网后sdk不再主动发送事件</li></ul><p>发送方式优先级</p><ol><li>浏览器支持sdk会使用 sendBeacon</li><li>其次 image</li><li>如果发送的数据量过大，超过 sendBeacon (60kb限制) 与 image(2kb限制)，则该用xml的方式发送</li></ol><h2 id="导出项" tabindex="-1">导出项 <a class="header-anchor" href="#导出项" aria-label="Permalink to &quot;导出项&quot;">​</a></h2><p>sdk内部导出了大量的钩子方便开发自定义，同时也导出了sdk内部的options，开发可动态更改此对象；具体请查看<a href="./../functions/exports">导出项</a></p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>导出的钩子是可以被多页面同时调用的，最后触发的顺序会按照初始化的顺序</p></div><p>例如以下场景:</p><ul><li>加密传输 (beforeSendData 拦截到事件信息后再 return新的被加密过的对象)</li><li>每次发送事件后需要触发弹窗提醒 (afterSendData)</li><li>中途需要对配置项中的 dsn 地址更改 (任意一个页面 options.value.dsn = &#39;www.bx.com&#39;)</li><li>获取基础数据用做前端项目的展示 (getBaseInfo)</li></ul><h2 id="事件类型-事件id" tabindex="-1">事件类型 &amp; 事件ID <a class="header-anchor" href="#事件类型-事件id" aria-label="Permalink to &quot;事件类型 &amp; 事件ID&quot;">​</a></h2><p>对于采集到的事件对象，内部会含有 <code>eventType、eventID</code> 字段，下面对这两个字段进行解释</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> * 触发的事件是什么类型 - eventType</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> */</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">enum</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">SEDNEVENTTYPES</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  PV </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pv</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 路由</span></span>
<span class="line"><span style="color:#A6ACCD;">  ERROR </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">error</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 错误</span></span>
<span class="line"><span style="color:#A6ACCD;">  PERFORMANCE </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">performance</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 资源</span></span>
<span class="line"><span style="color:#A6ACCD;">  CLICK </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">click</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 点击</span></span>
<span class="line"><span style="color:#A6ACCD;">  DWELL </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">dwell</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 页面卸载</span></span>
<span class="line"><span style="color:#A6ACCD;">  CUSTOM </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">custom</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 手动触发事件</span></span>
<span class="line"><span style="color:#A6ACCD;">  INTERSECTION </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">intersection</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 曝光采集</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">/**</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> * 触发的事件id - eventID</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"> */</span></span>
<span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">enum</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">SENDID</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  PAGE </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">page</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 页面</span></span>
<span class="line"><span style="color:#A6ACCD;">  RESOURCE </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">resource</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 资源</span></span>
<span class="line"><span style="color:#A6ACCD;">  SERVER </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">server</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// 请求</span></span>
<span class="line"><span style="color:#A6ACCD;">  CODE </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">code</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// code</span></span>
<span class="line"><span style="color:#A6ACCD;">  REJECT </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">reject</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// reject</span></span>
<span class="line"><span style="color:#A6ACCD;">  CONSOLEERROR </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">console.error</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">// console.error</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="特殊标识" tabindex="-1">特殊标识 <a class="header-anchor" href="#特殊标识" aria-label="Permalink to &quot;特殊标识&quot;">​</a></h2><p>为了最大程度标识用户以及细分业务,插件提供了以下几个属性</p><ul><li>pageId (应用ID 自动生成)</li><li>sessionId (会话ID 自动生成)</li><li>deviceId (设备ID 自动生成)</li><li>appName (应用Name 使用者初始化设置)</li><li>appCode (应用Code 使用者初始化设置)</li><li>userUuid (用户ID 使用者调用方法设置)</li></ul><p><code>pageId sessionId deviceId</code> 的生成规则是一样的,最终会各自生成类似于这样的字符串</p><ul><li><code>13488cb7-85a62e2a-917f1a1d943f5ae5</code></li><li><code>s_13488cb7-85a6166f-8c296bb4a6089363</code></li><li><code>t_13466167-991854d1-da9f0cf52c91fac4</code></li></ul><p>注意点</p><ul><li><code>pageId</code> 在整个页面生命周期不变,只会在首次加载插件才会生成</li><li><code>sessionId</code> 会存入cookie,存活时长为30分钟,每次触发采集事件都会刷新这个ID</li><li><code>deviceId</code> 也会存入cookie,不设置存活时长</li><li><code>appName</code> 以及 <code>appCode</code> 可以在 <code>init</code> 初始化时进行赋值以及后续更改 <code>options.value.appName</code></li></ul>`,32),p=[e];function t(c,r,i,D,y,d){return a(),l("div",null,p)}const A=s(o,[["render",t]]);export{F as __pageData,A as default};