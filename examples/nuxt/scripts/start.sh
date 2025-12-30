#!/bin/bash

# Web-Tracing Nuxt3 示例启动脚本

echo "================================"
echo "Web-Tracing Nuxt3 示例启动脚本"
echo "================================"

# 切换到项目根目录
cd "$(dirname "$0")/../.."

echo ""
echo "步骤 1: 安装项目依赖..."
pnpm install

echo ""
echo "步骤 2: 构建 @web-tracing/core 包..."
pnpm run build

echo ""
echo "步骤 3: 启动 Nuxt3 示例..."
cd examples/nuxt
pnpm start

echo ""
echo "启动完成！"
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:3001"
