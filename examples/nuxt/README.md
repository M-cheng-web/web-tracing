# Web-Tracing Nuxt3 示例

这是一个基于 Nuxt3 框架的 web-tracing 埋点监控示例项目，展示了如何使用 @web-tracing/core SDK 进行前端监控。

## 快速开始

### 方式一：使用启动脚本（推荐）

```bash
# 进入示例目录
cd examples/nuxt

# 执行启动脚本（会自动安装依赖并构建核心包）
./scripts/start.sh
```

### 方式二：手动启动

```bash
# 1. 进入示例目录
cd examples/nuxt

# 2. 安装示例项目依赖
pnpm install

# 3. 构建核心包
pnpm run init

# 4. 启动项目
pnpm start
```

启动成功后，访问：
- 前端地址：http://localhost:3000
- 后端地址：http://localhost:3001

## 功能特性

✅ 自动页面浏览量统计 (PV)
✅ 错误监控
✅ 事件监控（点击事件）
✅ 请求监控
✅ 性能监控
✅ 曝光采集
✅ 录屏功能（可选）
✅ 完全支持 Nuxt3 SSR

## 页面结构

- `/home` - 首页，展示所有事件类型和ID
- `/err` - 错误监控页面，包含普通错误、资源错误、批量错误测试
- `/event` - 事件监控页面，展示点击事件埋点
- `/http` - HTTP请求监控页面，测试各种请求方式
- `/performance` - 性能监控页面，测试资源加载
- `/intersection` - 曝光监控页面，测试元素曝光
- `/pv` - PV监控页面，展示页面跳转事件

## 项目结构

```
examples/nuxt/
├── app.vue                  # 主应用布局
├── nuxt.config.ts          # Nuxt3 配置文件
├── package.json            # 项目依赖
├── server.js               # Express 模拟后端服务
├── scripts/
│   └── start.sh            # 快速启动脚本
├── plugins/
│   └── web-tracing.ts      # web-tracing SDK 初始化插件
├── components/
│   ├── MenuList.vue        # 左侧菜单组件
│   └── CTable.vue          # 表格组件
├── pages/
│   ├── home/index.vue      # 首页
│   ├── err/index.vue       # 错误监控
│   ├── event/index.vue     # 事件监控
│   ├── http/index.vue      # HTTP监控
│   ├── performance/index.vue # 性能监控
│   ├── intersection/index.vue # 曝光监控
│   └── pv/index.vue        # PV监控
├── router/
│   └── dynamic.ts          # 路由配置
└── assets/
    ├── global.scss         # 全局样式
    └── variables.scss      # SCSS 变量
```

## 使用说明

### 1. SDK 初始化

SDK 通过 Nuxt3 插件自动初始化，配置项在 `nuxt.config.ts` 中：

```typescript
runtimeConfig: {
  public: {
    webTracing: {
      dsn: '/trackweb',
      appName: 'nuxt-cxh',
      debug: true,
      pv: true,
      performance: true,
      error: true,
      event: true,
      cacheMaxLength: 10,
      cacheWatingTime: 1000,
      recordScreen: false,
      ignoreRequest: [
        /getAllTracingList/,
        /cleanTracingList/,
        /getBaseInfo/,
        /getSourceMap/,
      ],
    }
  }
}
```

### 2. 使用 SDK 功能

在页面中导入并使用 SDK：

```typescript
import { traceError, options } from '@web-tracing/core'

// 手动上报错误
traceError({
  eventId: '自定义错误ID',
  errMessage: '自定义错误message',
  src: '/interface/order',
  params: {
    id: '12121'
  }
})

// 动态修改配置
options.value.recordScreen = true
```

### 3. 查看埋点数据

- 点击页面上的"获取最新采集数据"按钮
- 查看表格展示的埋点数据
- 点击"清除所有事件信息"按钮清除数据
- 点击"查看核心基础信息"按钮查看服务端状态

## 模拟后端 API

项目使用 Express 模拟后端服务，提供以下接口：

- `POST /trackweb` - 接收埋点数据
- `GET /getAllTracingList` - 查询埋点数据
- `POST /cleanTracingList` - 清除埋点数据
- `GET /getBaseInfo` - 获取基础信息
- `GET /getSourceMap` - 获取 Source Map

## 注意事项

1. 确保 `@web-tracing/core` 包已正确构建
2. 后端服务运行在 3001 端口
3. 前端服务运行在 3000 端口
4. 使用 `$fetch` 进行 API 请求
5. 在客户端环境下才能使用 SDK 功能

## 开发建议

- 开发时开启 `debug: true` 查看详细日志
- 生产环境关闭 `debug` 并设置适当的抽样率
- 合理配置 `cacheMaxLength` 和 `cacheWatingTime` 优化性能
- 根据业务需求配置 `ignoreRequest` 过滤不必要的请求

## 与 Vue3 示例对比

Nuxt3 示例完全按照 Vue3 示例的页面结构和功能进行实现，包括：
- 相同的菜单布局
- 相同的页面功能
- 相同的组件实现
- 相同的 SDK 初始化方式

主要区别：
- 使用 Nuxt3 插件代替 Vue 插件
- 使用 `$fetch` 代替 `axios`
- 使用 `useRuntimeConfig` 管理配置
- 页面路由使用文件系统路由
