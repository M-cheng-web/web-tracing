import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@element-plus/nuxt'],

  css: ['~/assets/global.scss'],

  routeRules: {
    '/trackweb': { proxy: 'http://localhost:3001/trackweb' },
    '/getAllTracingList': {
      proxy: 'http://localhost:3001/getAllTracingList'
    },
    '/cleanTracingList': { proxy: 'http://localhost:3001/cleanTracingList' },
    '/getBaseInfo': { proxy: 'http://localhost:3001/getBaseInfo' },
    '/getSourceMap': { proxy: 'http://localhost:3001/getSourceMap' },
    '/api/**': { proxy: 'http://localhost:3001/api/**' }
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
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/variables.scss" as *;`
        }
      }
    }
  }
})
