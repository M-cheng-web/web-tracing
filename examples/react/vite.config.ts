import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    proxy: {
      '/getAllTracingList': {
        target: 'http://localhost:3354',
        changeOrigin: true
      },
      '/getBaseInfo': {
        target: 'http://localhost:3354',
        changeOrigin: true
      },
      '/cleanTracingList': {
        target: 'http://localhost:3354',
        changeOrigin: true
      },
      '/getSourceMap': {
        target: 'http://localhost:3354',
        changeOrigin: true
      },
      '/getList': {
        target: 'http://localhost:3354',
        changeOrigin: true
      },
      '/setList': {
        target: 'http://localhost:3354',
        changeOrigin: true
      }
    }
  }
})
