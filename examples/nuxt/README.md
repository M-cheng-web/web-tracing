# Web-Tracing Nuxt3 示例项目

这是一个使用 `@web-tracing/nuxt` 模块的示例 Nuxt3 应用，展示了如何在 Nuxt3 项目中集成和使用埋点监控功能。

## 功能特性

### 埋点监控
- ✅ **页面浏览量统计 (PV)**: 自动记录页面访问
- ✅ **性能监控**: 监控页面加载性能、资源加载等
- ✅ **错误监控**: 捕获 JavaScript 错误和异常
- ✅ **事件监听**: 监听用户交互事件
- ✅ **请求拦截**: 监控 HTTP 请求
- ✅ **路由变化**: 自动监听路由跳转

### 页面功能
- 📊 **首页**: 展示所有埋点功能的测试入口
- 📝 **关于页**: 介绍模块功能
- 👤 **用户详情页**: 动态路由参数测试

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务

```bash
npm run start
```

这将同时启动：
- Nuxt3 开发服务器: http://localhost:3000
- 埋点数据接收服务: http://localhost:3001

### 3. 访问应用

打开浏览器访问: http://localhost:3000

## 接口说明

### 埋点相关接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/trackweb` | POST | 接收埋点数据 |
| `/getAllTracingList` | GET | 查询所有埋点数据 |
| `/cleanTracingList` | POST | 清除埋点数据 |
| `/getBaseInfo` | GET | 获取基础信息 |
| `/getSourceMap` | GET | 获取 Source Map |

### 模拟API接口

| 接口 | 说明 |
|------|------|
| `/api/test` | 测试API接口 |
| `/api/user/:id` | 获取用户信息（可能随机失败） |

## 测试功能

### 1. 页面浏览量测试
- 在不同页面间跳转，观察控制台PV埋点

### 2. 点击事件测试
- 点击首页的"点击埋点测试"按钮

### 3. 性能监控测试
- 点击"性能数据查看"查看当前页面性能数据

### 4. 错误监控测试
- 点击"错误触发测试"按钮，查看错误捕获

### 5. 数据查询测试
- 使用"查看埋点列表"、"清除埋点数据"、"查看基础信息"功能

### 6. 动态路由测试
- 访问用户详情页: http://localhost:3000/user/123
- 测试不同用户ID的埋点数据

## 项目结构

```
nuxt/
├── pages/              # 页面目录
│   ├── index.vue       # 首页
│   ├── about.vue       # 关于页面
│   └── user/
│       └── [id].vue   # 用户详情页（动态路由）
├── assets/            # 静态资源
│   ├── global.scss    # 全局样式
│   └── variables.scss # SCSS变量
├── app.vue           # 应用入口组件
├── nuxt.config.ts    # Nuxt配置
├── server.js         # 模拟服务端
└── package.json       # 项目配置
```

## 配置说明

在 `nuxt.config.ts` 中的 webTracing 配置：

```typescript
webTracing: {
  dsn: '/trackweb',           // 埋点数据上报地址
  appName: 'nuxt-cxh',       // 应用名称
  debug: true,               // 开启调试模式
  pv: true,                 // 开启PV统计
  performance: true,         // 开启性能监控
  error: true,              // 开启错误监控
  event: true,              // 开启事件监控
  cacheMaxLength: 10,        // 数据缓存最大长度
  cacheWatingTime: 1000,     // 数据缓存等待时间
  ignoreRequest: [           // 忽略的请求
    /getAllTracingList/,
    /cleanTracingList/,
    /getBaseInfo/,
    /getSourceMap/
  ],
  afterSendData(data) {      // 数据发送回调
    console.log('埋点数据发送:', data)
  }
}
```

## SSR 支持

本示例完全支持 Nuxt3 的 SSR (服务端渲染)：

- **客户端**: 自动初始化埋点功能
- **服务端**: 进行 SSR 相关处理
- **同构**: 客户端/服务端代码统一

## 开发说明

1. 修改 `pages/` 目录下的页面来测试不同场景
2. 修改 `nuxt.config.ts` 来调整埋点配置
3. 查看 `server.js` 了解后端数据接收逻辑
4. 打开浏览器控制台查看埋点日志

## 注意事项

- 确保同时启动了前端服务(3000端口)和后端服务(3001端口)
- 埋点数据会实时发送到后端服务进行存储
- 可以通过 `/getAllTracingList` 接口查看当前收集到的埋点数据
- 生产环境请修改 `dsn` 为实际的埋点数据收集地址