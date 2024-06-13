import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['packages/core/__test__/**.spec.ts'],
    environment: 'jsdom'
  }
})
