import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import type { OutputOptions, RollupOptions } from 'rollup'
import { packages } from '../meta/packages'

const configs: RollupOptions[] = []

const esbuildPlugin = esbuild({ target: 'esnext' })
const dtsPlugin = [dts()]

const externals = ['@web-tracing/core']

const esbuildMinifer = (options: ESBuildOptions) => {
  const { renderChunk } = esbuild(options)
  return { name: 'esbuild-minifer', renderChunk }
}

for (const {
  globals,
  name,
  external,
  iife,
  build,
  cjs,
  mjs,
  dts,
  target
} of packages) {
  if (build === false) continue

  const iifeGlobals = {
    '@web-tracing/core': 'WebTracing',
    '@web-tracing/utils': 'WebTracingUtils',
    ...(globals || {})
  }
  const iifeName = 'WebTracing'

  // 打包 hooks & utils
  const fn = 'index'
  const input = `packages/${name}/index.ts`
  const output: OutputOptions[] = []

  if (mjs !== false) {
    output.push({
      file: `packages/${name}/dist/${fn}.mjs`,
      format: 'es'
    })
  }

  if (cjs !== false) {
    output.push({
      file: `packages/${name}/dist/${fn}.cjs`,
      format: 'cjs'
    })
  }

  if (iife !== false) {
    output.push(
      {
        file: `packages/${name}/dist/${fn}.iife.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals
      },
      {
        file: `packages/${name}/dist/${fn}.iife.min.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [esbuildMinifer({ minify: true })]
      }
    )
  }

  configs.push({
    input,
    output,
    plugins: [
      commonjs(),
      nodeResolve(),
      json(),
      target ? esbuild({ target }) : esbuildPlugin
    ],
    external: [...externals, ...(external || [])]
  })

  if (dts !== false) {
    configs.push({
      input,
      output: {
        file: `packages/${name}/dist/${fn}.d.ts`,
        format: 'es'
      },
      plugins: dtsPlugin,
      external: [...externals, ...(external || [])]
    })
  }
}

export default configs
