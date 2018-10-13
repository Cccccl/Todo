const path = require('path')
const createVueLoaderOptions = require('./vue-loader.config.js')

// 根据packjson里的 "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.client.js" 来判断是生产环境还是开发环境
const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  entry: path.join(__dirname, '../client/client-entry.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist/client'),
    /* 原理未知，需要添加这个，否则会报如下的错误
     * because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
     */
    // publicPath: '/'
    publicPath: 'http://127.0.0.1:7777/dist/client/'
  },
  module: {
    rules: [
      {
        // 预处理，使用真正的loader加载之前，先用eslint-loader去处理
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isDev)
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'resources/[path][name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
