const Router = require('koa-router')
const send = require('koa-send')

// 只会处理/dist/client开头的资源。处理静态资源的中间件
const staticRouter = new Router({ prefix: '/dist/client/' })
staticRouter.get('*', async(ctx) => {
  await send(ctx, ctx.path)
})

module.exports = staticRouter
