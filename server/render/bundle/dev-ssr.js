// fs 写入磁盘，浪费性能。 memory-fs 和 nodejs fs一样
const MemoryFS = require('memory-fs')
const fs = require('fs')
const mfs = new MemoryFS()
const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')

const VueServerRenderer = require('vue-server-renderer')
const serverRender = require('./server-render')
const serverConfig = require('../../../build/webpack.config.server.js')

let bundle
let i = 0
// 这里使用webpack,webpack相关
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs

serverCompiler.watch({}, (err, status) => {
  if (err) {
    throw err
  }
  status = status.toJson()
  status.errors.forEach(err => console.log(err))
  status.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json')
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated!')
})

const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = 'wait a moment!'
    return
  }
  // 服务端渲染
  const clientManifestResp = await axios.get('http://127.0.0.1:7777/dist/client/vue-ssr-client-manifest.json')
  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(path.join(__dirname, '../../server.template.ejs'), 'utf-8')
  const render = VueServerRenderer.createBundleRenderer(bundle, {
    inject: false,
    clientManifest
  })

  // 服务端渲染含有bundle的 就算地址被重定向，但是 server-render 里的 renderToString 还是被执行，消耗服务端资源。
  await serverRender(ctx, render, template)
}

const pageRouter = new Router()
pageRouter.get('*', handleSSR)

module.exports = pageRouter
