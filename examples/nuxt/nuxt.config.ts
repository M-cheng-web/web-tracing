import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // @ts-ignore - compatibilityDate is supported in Nuxt 3.4.0+ but may not be in type definitions
  compatibilityDate: '2025-12-27',

  devtools: { enabled: true },

  modules: ['@element-plus/nuxt'],

  css: ['~/assets/global.scss'],

  // @ts-ignore - @element-plus/nuxt module config not recognized by TypeScript
  elementPlus: {
    importStyle: 'scss',
    icons: []
  },

  imports: {
    presets: [
      {
        from: 'element-plus/es/hooks/use-id/index',
        imports: ['ID_INJECTION_KEY']
      },
      {
        from: 'element-plus/es/hooks/use-z-index/index',
        imports: ['ZINDEX_INJECTION_KEY']
      }
    ]
  },

  vite: {
    server: {
      proxy: {
        '/trackweb': 'http://localhost:3352',
        '/getAllTracingList': 'http://localhost:3352',
        '/cleanTracingList': 'http://localhost:3352',
        '/getBaseInfo': 'http://localhost:3352',
        '/getSourceMap': 'http://localhost:3352',
        '/api': {
          target: 'http://localhost:3352',
          changeOrigin: true
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "~/assets/variables.scss" as *;`
        }
      }
    },
    optimizeDeps: {
      include: ['element-plus/es']
    }
  },

  app: {
    head: {
      title: 'Web-Tracing Nuxt3 示例',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      webTracing: {}
    }
  },

  nitro: {
    experimental: {
      wasm: true
    }
  }
})
