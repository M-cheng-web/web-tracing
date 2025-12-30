# 示例项目
目前sdk支持【 js、vue2、vue3、react、nuxt 】，项目内部包含有针对这些支持项目的demo版本

+ 示例项目目录：web-tracing > examples
  + js示例：web-tracing > examples > vanilla
  + vue2示例：web-tracing > examples > vue2
  + vue3示例：web-tracing > examples > vue3
  + react示例：web-tracing > examples > react
  + nuxt示例：web-tracing > examples > nuxt

[js示例 https://github.com/M-cheng-web/web-tracing-examples-js](https://github.com/M-cheng-web/web-tracing-examples-js)

[vue2示例 https://github.com/M-cheng-web/web-tracing-examples-vue2](https://github.com/M-cheng-web/web-tracing-examples-vue2)

[vue3示例 https://github.com/M-cheng-web/web-tracing-examples-vue3](https://github.com/M-cheng-web/web-tracing-examples-vue3)

[react示例 https://github.com/boychina/web-tracing-examples-react](https://github.com/boychina/web-tracing-examples-react)

[nuxt示例 https://github.com/boychina/web-tracing-examples-nuxt](https://github.com/boychina/web-tracing-examples-nuxt)

> 上面这几个示例项目，是通过脚本直接覆盖迁移过来的，目的是为了拟真测试，本地联调还是在 web-tracing 项目中完成的

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

## 在线demo
目前没有上线，后面会加；目前只能将就在本地运行啦