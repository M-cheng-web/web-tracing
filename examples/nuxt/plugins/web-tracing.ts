export default defineNuxtPlugin((nuxtApp) => {
  // 只在客户端运行
  if (import.meta.client) {
    nuxtApp.hook('app:mounted', async () => {
      try {
        // 动态导入 SDK，避免服务端构建错误
        const { init, InitOptions } = await import('@web-tracing/core')

        const config = useRuntimeConfig()
        const webTracingConfig = config.public.webTracing as InitOptions || {}

        init({
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
          ...webTracingConfig
        })

        console.log('Web-Tracing SDK 初始化成功')
      } catch (error) {
        console.error('初始化 web-tracing 失败:', error)
      }
    })
  }
})
