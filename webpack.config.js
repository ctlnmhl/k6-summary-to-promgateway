const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
    entry: './src/send-metrics.js',
    externals: {
        'prom-client': 'prom-client'
      },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new CleanWebpackPlugin()],
};