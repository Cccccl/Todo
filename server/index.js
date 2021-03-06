const Koa = require('koa')
const send = require('koa-send')
const path = require('path')
const koaBody = require('koa-body')
const koaSession = require('koa-session')

const staticRouter = require('./routers/static')
const todoApiRouter = require('./routers/todoApi')
const userRouter = require('./routers/user')
const createDb = require('./db/db')
const config = require('../config/app.config.js')

const db = createDb(config.db.appId, config.db.appKey)
const app = new Koa()
const isDev = process.env.NODE_ENV === 'development'

app.keys = ['vue ssr']
app.use(koaSession({
  key: 'v-ssr-id',
  maxAge: 2 * 60 * 60 * 1000
}, app))

app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') })
  } else {
    await next()
  }
})

app.use(async (ctx, next) => {
  try {
    console.log('日志：')
    console.log(`request with path ${ctx.path}`)
    await next()
  } catch (err) {
    // console.log(err)
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.body = '404!!!'
    }
  }
})

app.use(async (ctx, next) => {
  ctx.db = db
  await next()
})

app.use(koaBody())
app.use(userRouter.routes()).use(userRouter.allowedMethods())
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
app.use(todoApiRouter.routes()).use(todoApiRouter.allowedMethods())

let pageRouter
if (isDev) {
  pageRouter = require('./render/bundle/dev-ssr.js')
  // pageRouter = require('./render/no-bundle/dev-ssr-no-bundle.js')
} else {
  // pageRouter = require('./render/bundle/ssr.js')
  pageRouter = require('./render/no-bundle/ssr-no-bundle.js')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3333

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
