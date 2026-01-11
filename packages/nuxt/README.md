# @web-tracing/nuxt

基于 JS 跨平台插件，为 Nuxt3 项目提供【 埋点、行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段

## 安装

```bash
pnpm install @web-tracing/nuxt
# 或者
npm install @web-tracing/nuxt
# 或者
yarn add @web-tracing/nuxt
```

::: tip
`@web-tracing/nuxt` 依赖 `@web-tracing/core`，安装时会自动安装。用户只需要安装 `@web-tracing/nuxt` 即可。
:::

## 使用

### 1. 在 nuxt.config.ts 中配置

```typescript
export default defineNuxtConfig({
  modules: [
    '@web-tracing/nuxt'
  ],

  webTracing: {
    dsn: '/trackweb',
    appName: 'my-nuxt-app',
    debug: true,
    pv: true,
    performance: true,
    error: true,
    event: true,
    cacheMaxLength: 10,
    cacheWatingTime: 1000,
    ignoreRequest: [
      /getAllTracingList/,
      /cleanTracingList/,
      /getBaseInfo/,
      /getSourceMap/
    ],
    afterSendData(data) {
      console.log('数据已发送:', data)
    }
  }
})
```

### 2. 在组件中使用

在 Vue 组件中需要从 `@web-tracing/core` 导入 API：

```vue
<template>
  <div>
    <button @click="trackClick">点击埋点</button>
  </div>
</template>

<script setup lang="ts">
import { traceError, options } from '@web-tracing/core'

// 手动触发埋点
const trackClick = () => {
  console.log('按钮被点击')
}

// 手动上报错误
const handleTraceError = () => {
  traceError({
    eventId: '自定义错误ID',
    errMessage: '自定义错误message',
    src: '/interface/order',
    params: {
      id: '12121'
    }
  })
}

// 动态修改配置
options.value.recordScreen = true
</script>
```

::: warning 注意
不要在 Vue 组件中直接从 `@web-tracing/nuxt` 导入，因为 `@web-tracing/nuxt` 是一个 Nuxt 模块，包含 `defineNuxtModule`，不能在 Vue 组件中直接导入。请始终从 `@web-tracing/core` 导入功能 API。
:::

## 配置选项

所有配置选项与 `@web-tracing/core` 相同：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| dsn | string | '/trackweb' | 埋点数据上报地址 |
| appName | string | 'web-tracing' | 应用名称 |
| debug | boolean | false | 是否开启调试模式 |
| pv | boolean | true | 是否开启页面浏览量统计 |
| performance | boolean | true | 是否开启性能监控 |
| error | boolean | true | 是否开启错误监控 |
| event | boolean | true | 是否开启事件监控 |
| recordscreen | boolean | false | 是否开启录屏功能 |
| skeletonProject | boolean | false | 是否是骨架屏项目 |
| cacheMaxLength | number | 10 | 数据缓存最大长度 |
| cacheWatingTime | number | 1000 | 数据缓存等待时间(ms) |
| ignoreRequest | RegExp[] | [] | 忽略的请求列表 |
| afterSendData | function | - | 数据发送后的回调函数 |

## SSR 支持

本模块完全支持 Nuxt3 的 SSR 模式：

- **客户端**: 自动初始化并执行所有监控功能
- **服务端**: 进行必要的 SSR 相关处理
- **SSR 兼容**: 自动区分客户端/服务端环境

## 可用 API

在 Vue 组件中可以从 `@web-tracing/core` 导入以下 API：

- `traceError` - 手动上报错误
- `options` - 动态修改配置
- `intersectionObserver` - 元素曝光采集
- `intersectionUnobserve` - 取消元素曝光采集
- `intersectionDisconnect` - 取消所有曝光采集
- `unzipRecordscreen` - 解压录屏数据
- `afterSendData` - 数据发送后的回调
- 以及其他 `@web-tracing/core` 提供的所有 API

## 功能特性

✅ 自动页面浏览量统计
✅ 性能监控
✅ 错误监控
✅ 事件监听
✅ 请求拦截
✅ 资源加载监控
✅ 路由变化监控
✅ 曝光采集
✅ 录屏功能(可选)
✅ 完全支持 Nuxt3 SSR
✅ 只需安装一个包，依赖自动管理
