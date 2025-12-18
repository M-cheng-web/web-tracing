#!/usr/bin/env sh

# 测试仓库初始化

# 确保脚本抛出遇到的错误
set -e

cd examples/vanilla/
pnpm install

cd -

cd examples/vue2/
pnpm install

cd -

cd examples/vue3/
pnpm install

cd -

cd examples/react/
pnpm install

cd -