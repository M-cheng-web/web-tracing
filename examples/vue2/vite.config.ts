import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [createVuePlugin()],
  server: {
    https: false,
    host: '0.0.0.0',
    port: 6656,
    cors: true,
    proxy: {
      '/getBaseInfo': {
        target: 'http://localhost:3351'
      },
      '/getAllTracingList': {
        target: 'http://localhost:3351'
      },
      '/trackweb': {
        target: 'http://localhost:3351'
      },
      '/getList': {
        target: 'http://localhost:3351/',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false //  设置支持https协议的代理,
      },
      '/setList': {
        target: 'http://localhost:3351/',
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false //  设置支持https协议的代理,
      }
    }
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src')
      }
    ]
  }
})
