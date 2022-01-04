const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { merge } = require('webpack-merge');

const base = require('../webpack.base');
const defineProps = require('../build/define-properties');
const template = resolve(__dirname, './public/index.html');

module.exports = merge(base, {
  entry: {
    // sdk脚本
    sdk: resolve(__dirname, '../src/index.js'),

    // 具体的分类采集脚本
    pv: resolve(__dirname, './src/pv/pv.js'),
    err: resolve(__dirname, './src/err/err.js'),
    performance: resolve(__dirname, './src/performance/performance.js'),
    event: resolve(__dirname, './src/event/event.js'),
    http: resolve(__dirname, './src/http/http.js'),
  },
  output: {
    path: resolve(__dirname, './dist'),
    filename: process.env.NODE_ENV === 'production' ? '[name].[hash].js' : '[name].js'
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, '../src')
    }
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false,
        },
      },
    ],
  },
  optimization: {
    minimize: false,
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
    new HtmlWebpackPlugin({
      template,
      title: 'trace pv',
      chunks: ['sdk', 'pv'],
      filename: "pv.html",
    }),
    new HtmlWebpackPlugin({
      template,
      title: 'trace error',
      chunks: ['sdk', 'err'],
      filename: "err.html",
    }),
    new HtmlWebpackPlugin({
      template,
      title: 'trace performance',
      chunks: ['sdk', 'performance'],
      filename: "performance.html",
    }),
    new HtmlWebpackPlugin({
      template,
      title: 'trace performance',
      chunks: ['sdk', 'event'],
      filename: "event.html",
    }),
    new HtmlWebpackPlugin({
      template,
      title: 'http-request',
      chunks: ['sdk', 'http'],
      filename: 'http.html',
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'public'),
        }
      ],
    }),
  ],
  devServer: {
    publicPath: '/',
    open: true,
    openPage: 'contents.html',
    contentBase: resolve(__dirname, 'public'),
    historyApiFallback: {
      rewrites: [
        { from: /^\/pv-/, to: '/pv.html' },
      ],
    },
  },
});
