const { resolve } = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const base = require('./webpack.base');
const defineProps = require('./build/define-properties');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.BUILD_ENV === 'prod';

module.exports = merge(base, {
  entry: resolve(__dirname, './src/index.js'),
  mode: process.env.NODE_ENV,
  devtool: isProduction ? false : 'cheap-source-map',
  // target: ['web', 'es5'],
  output: {
    publicPath: '/',
    path: resolve(__dirname, 'lib'),
    filename: 'trace.js',
    library: '_trace',
    libraryTarget: 'umd',
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
  plugins: [
    // new BundleAnalyzerPlugin(),
  ],
});
