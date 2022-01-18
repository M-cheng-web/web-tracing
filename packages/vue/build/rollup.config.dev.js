import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from '../package.json'
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
    {
      file: pkg.jsdelivr,
      format: 'umd',
      name: 'webtracing',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify(),
  ],
  external: ['web-tracing'],
};