const webpack = require('webpack');
const defineProps = require('./build/define-properties');

module.exports = {
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin(defineProps),
  ],
};
