# @web-tracing/react

基于 JS 跨平台插件，为前端项目提供【 埋点、行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段 - React 版本。

## 安装

```bash
pnpm install @web-tracing/react
# 或者
npm install @web-tracing/react
# 或者
yarn add @web-tracing/react
```

## 使用

### 方式一：Provider 模式（推荐）

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WebTracingProvider } from '@web-tracing/react'
import App from './App'

const options = {
  dsn: 'http://localhost:3000/track',
  appName: 'react-app',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebTracingProvider options={options}>
      <App />
    </WebTracingProvider>
  </React.StrictMode>
)
```

### 方式二：函数式调用

```tsx
import { init } from '@web-tracing/react'

init({
  dsn: 'http://localhost:3000/track',
  appName: 'react-app',
  // ... 其他配置
})
```
