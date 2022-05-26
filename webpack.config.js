// var webpack = require('webpack');
var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/send-metrics.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  stats: {
    colors: true,
  },
  target: 'node',
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  devtool: 'source-map',
};