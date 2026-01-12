# 本地运行项目
> 建议在这之前看看 [使用 -> 基础说明](./declare.md) 文档

项目结构采用 Monorepo + pnpm 方式构建

## 项目结构
+ 文档项目：web-tracing > docs
+ 示例项目：web-tracing > examples
  + js示例：web-tracing > examples > vanilla
  + vue2示例：web-tracing > examples > vue2
  + vue3示例：web-tracing > examples > vue3
+ 埋点项目：web-tracing > packages
  + js版本：web-tracing > packages > core
  + vue2版本：web-tracing > packages > vue2
  + vue3版本：web-tracing > packages > vue3
+ 构建脚本：web-tracing > scripts

> web-tracing > packages 下的其他文件只是测试构建脚本作用，后续会删掉

## 初始化
先 `pnpm install`
```
第一步：初始化所有测试项目仓库
pnpm run test:install

第二步：打包并监听各个sdk
pnpm run watch

第三步：运行js测试项目
pnpm run test:js

pnpm run test:vue2 (也可以运行vue2测试项目)
pnpm run test:vue3 (也可以运行vue3测试项目)
pnpm run test:react (也可以运行react测试项目)
```

> web-tracing > package.json 下的其他命令可以自行研究，大部分都是些构建作用

