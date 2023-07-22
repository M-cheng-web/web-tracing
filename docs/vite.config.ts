import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(async () => {
  return {
    server: {
      hmr: {
        overlay: false
      },
      fs: {
        allow: [resolve(__dirname, '..')]
      },
      host: '0.0.0.0',
      port: 8869
    },
    esbuild: {},
    plugins: [],
  }
})
