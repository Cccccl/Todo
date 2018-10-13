const path = require('path')
const baseConfig = require('./webpack.config.base.js')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')

const isDev = process.env.NODE_ENV === 'development'
const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"',
      VUE_ENV: '"client"'
    }
  }),
  new HTMLPlugin({
    /* 模板文件命名的时候最好不要命名为index.html，不然webpack-dev-server开启服务的时候，默认会直接找根路径下的index.html
     * 而不是去找html-webpack-plugin生成的index.html
     */
    template: path.join(__dirname, '../template.html')
  }),
  new VueClientPlugin()
]
const webpackDevServer = {
  port: 7777,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  proxy: {
    '/api': 'http://127.0.0.1:3333',
    '/user': 'http://127.0.0.1:3333'
  },
  // headers: {
  //   'Access-Control-Allow-Origin': '*'
  // },
  // 路由从hash模式变成history模式需要配置这个。
  historyApiFallback: {
    index: 'http://127.0.0.1:7777/dist/client/'
  },
  hot: true
}
let config
if (isDev) {
  // 开发环境
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          /* webpack的loader就是这样一层一层往上面，
           * 每个loader只处理自己关心的部分
           * vue的项目想要css样式的部分也有热重载，需要使用vue-style-loader,而不能使用style-loader
           */
          test: /\.styl/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devServer: webpackDevServer,
    plugins: defaultPlugins.concat([
      // 热加载
      new webpack.HotModuleReplacementPlugin(),
      // 捕捉到错误日志，不输出
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  // 生产环境
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/client-entry.js'),
      // 依赖的第三方库
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath: '/dist/client/'
    },
    module: {
      rules: [
        {
          /* 把css文件单独提取出来在生产环境下。
           * 开发环境的话，css没有单独提取出来，在服务端渲染的时候，是直出一张页面，但是样式没有，然后通过加载js文件，然后通过js文件里的css去渲染
           * 就会出现页面有一段时间是没有样式的情况。
           */
          test: /\.styl/,
          use: ExtractPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: defaultPlugins.concat([
      new ExtractPlugin('styles.[contentHash:8].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      }),
      // webpack异步打包的优化，使打包后的文件的名字是固定的
      new webpack.NamedChunksPlugin()
    ])
  })
}

config.resolve = {
  alias: {
    'model': path.join(__dirname, '../client/model/client-model.js')
  }
}

module.exports = config
