// 简化的插件实现
export default function defineWebTracingPlugin() {
  return {
    name: "web-tracing-plugin",
    enforce: "pre",
    setup(nuxtApp: any) {
      // 获取运行时配置
      const webTracingConfig = nuxtApp.$config.public.webTracing;

      // 在客户端初始化web-tracing
      if (typeof window !== "undefined" && webTracingConfig) {
        // 动态导入核心模块
        import("@web-tracing/core")
          .then(({ init }) => {
            init(webTracingConfig);
          })
          .catch((error) => {
            console.error("Failed to load web-tracing-core:", error);
          });
      }
    },
  };
}
