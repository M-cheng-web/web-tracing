const { resolve } = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const base = require('./webpack.base');
const defineProps = require('./build/define-properties');

const isProduction = process.env.BUILD_ENV === 'prod';

console.log('build_env', process.env.BUILD_ENV);
console.log('SDK_VERSION', process.env.SDK_VERSION);
console.log('LIBRARY_NAME', process.env.LIBRARY_NAME);
console.log('report_url', defineProps["process.env.REPORT_URL"]);

module.exports = merge(base, {
  entry: resolve(__dirname, './src/index.js'),
  mode: process.env.NODE_ENV,
  devtool: isProduction ? false : 'cheap-source-map',
  target: ['web', 'es5'],
  output: {
    publicPath: '/',
    path: resolve(__dirname, 'lib'),
    filename: 'trace.js',
    library: '_trace',
    libraryTarget: 'window',
  },
  module: {
    rules: [],
  },
  externals: {},
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 5,
          ie8: true,
          compress: {
            arrows: false,
          },
        },
      }),
    ],
  },
});
