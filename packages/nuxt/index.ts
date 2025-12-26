import { init, InitOptions } from "@web-tracing/core";

export type ModuleOptions = InitOptions;

// 简化的 Nuxt 模块定义
export default function defineWebTracingModule(
  options: ModuleOptions = {} as ModuleOptions
) {
  return {
    name: "@web-tracing/nuxt",
    configKey: "webTracing",

    setup(nuxt: any) {
      // 配置运行时配置
      nuxt.options.runtimeConfig = nuxt.options.runtimeConfig || {};
      nuxt.options.runtimeConfig.public =
        nuxt.options.runtimeConfig.public || {};
      nuxt.options.runtimeConfig.public.webTracing = options;

      // 客户端初始化
      if (typeof window !== "undefined") {
        nuxt.hook("app:created", () => {
          init(options);
        });
      }
    },
  };
}

// 导出核心功能
export * from "@web-tracing/core";
