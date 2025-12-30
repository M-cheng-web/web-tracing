import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-29',

  devtools: { enabled: false },

  devServer: {
    port: 3004
  },

  routeRules: {
    '/': { redirect: '/home' }
  },

  modules: ['@element-plus/nuxt', '@web-tracing/nuxt'],

  webTracing: {
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
      /getSourceMap/
    ]
  },

  css: ['~/assets/global.scss'],

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
    resolve: {
      alias: [{ find: /^dayjs$/, replacement: 'dayjs/esm' }]
    },
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
        clientPort: 3000
      },
      proxy: {
        '/trackweb': 'http://localhost:3352',
        '/getAllTracingList': 'http://localhost:3352',
        '/cleanTracingList': 'http://localhost:3352',
        '/getBaseInfo': 'http://localhost:3352',
        '/getSourceMap': 'http://localhost:3352',
        '/getList': 'http://localhost:3352',
        '/setList': 'http://localhost:3352',
        '/getList2': 'http://localhost:3352',
        '/setList2': 'http://localhost:3352',
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
          additionalData: `@use '~/assets/variables.scss' as *;`
        }
      }
    },
    optimizeDeps: {
      include: ['element-plus/es', 'dayjs', 'lodash-unified']
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
    public: {}
  },

  nitro: {
    compatibilityDate: '2025-12-29',
    experimental: {
      wasm: true
    }
  }
} as any)
