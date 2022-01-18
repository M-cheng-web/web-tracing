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
};
