#!/bin/bash

echo "开始构建 @web-tracing/nuxt..."

# 创建dist目录
mkdir -p packages/nuxt/dist

# 复制package.json到dist
cp packages/nuxt/package.json packages/nuxt/dist/package.json

# 复制README到dist  
cp packages/nuxt/README.md packages/nuxt/dist/README.md

# 复制runtime文件
mkdir -p packages/nuxt/dist/runtime
cp packages/nuxt/runtime/* packages/nuxt/dist/runtime/

# 生成类型声明文件
echo "生成类型声明文件..."
cat > packages/nuxt/dist/index.d.ts << 'EOF'
import type { InitOptions } from '@web-tracing/core'

export type ModuleOptions = InitOptions

export default function defineWebTracingModule(options?: ModuleOptions): {
  name: string
  configKey: string
  setup(nuxt: any): void
}

export * from '@web-tracing/core'
EOF

# 生成ES模块版本
echo "生成ES模块版本..."
cat > packages/nuxt/dist/index.mjs << 'EOF'
import { init } from '@web-tracing/core'

// 简化的 Nuxt 模块定义
export default function defineWebTracingModule(options = {}) {
  return {
    name: '@web-tracing/nuxt',
    configKey: 'webTracing',
    
    setup(nuxt) {
      // 配置运行时配置
      nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {}
      nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
      nuxt.options.runtimeConfig.public.webTracing = options

      // 客户端初始化
      if (typeof window !== 'undefined') {
        nuxt.hook('app:created', () => {
          init(options)
        })
      }
    }
  }
}

// 导出核心功能
export * from '@web-tracing/core'
EOF

# 生成CommonJS版本
echo "生成CommonJS版本..."
cat > packages/nuxt/dist/index.cjs << 'EOF'
const { init } = require('@web-tracing/core')

// 简化的 Nuxt 模块定义
function defineWebTracingModule(options = {}) {
  return {
    name: '@web-tracing/nuxt',
    configKey: 'webTracing',
    
    setup(nuxt) {
      // 配置运行时配置
      nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {}
      nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
      nuxt.options.runtimeConfig.public.webTracing = options

      // 客户端初始化
      if (typeof window !== 'undefined') {
        nuxt.hook('app:created', () => {
          init(options)
        })
      }
    }
  }
}

// 导出核心功能
module.exports = defineWebTracingModule
module.exports.defineWebTracingModule = defineWebTracingModule

// 重新导出核心模块
const coreModule = require('@web-tracing/core')
Object.keys(coreModule).forEach(key => {
  if (key !== 'default') {
    module.exports[key] = coreModule[key]
  }
})
EOF

echo "✅ @web-tracing/nuxt 构建完成!"
ls -la packages/nuxt/dist/
