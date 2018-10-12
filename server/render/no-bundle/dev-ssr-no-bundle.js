/* 2种方式
 * 1. 使用memoryfs 不能使用异步组件 从内存中读取
 * 2. 使用fs 可以使用异步组件 从硬盘中读取
 */
// 方法2
const fs = require('fs')

// 方法1
// const MemoryFS = require('memory-fs')
// const mfs = new MemoryFS()
// const NativeModule = require('module')
// const vm = require('vm')

const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')

const VueServerRenderer = require('vue-server-renderer')
const serverRender = require('./server-render-no-bundle.js')
const serverConfig = require('../../../build/webpack.config.server.js')

let bundle
// 这里使用webpack，webpack相关
const serverCompiler = webpack(serverConfig)
// 方法1
// serverCompiler.outputFileSystem = mfs

serverCompiler.watch({}, (err, status) => {
  if (err) {
    throw err
  }
  status = status.toJson()
  status.errors.forEach(err => console.log(err))
  status.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(serverConfig.output.path, 'server-entry.js')
  // 方法1
  // try {
  //   const m = { exports: {} }
  //   const bundleStr = mfs.readFileSync(bundlePath, 'utf-8')
  //   const wrapper = NativeModule.wrap(bundleStr)
  //   const script = new vm.Script(wrapper, {
  //     filename: 'server-entry.js',
  //     displayErrors: true
  //   })
  //   const result = script.runInThisContext()
  //   result.call(m.exports, m.exports, require, m)
  //   bundle = m.exports.default
  // } catch (err) {
  //   console.log('compile js error:', err)
  // }

  // 方法2
  delete require.cache[bundlePath]
  bundle = require('../../../dist/server/server-entry.js').default
  console.log('new bundle generated')
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
  const render = VueServerRenderer.createRenderer({
    inject: false,
    clientManifest
  })
  await serverRender(ctx, render, template, bundle)
}

const pageRouter = new Router()
pageRouter.get('*', handleSSR)

module.exports = pageRouter
