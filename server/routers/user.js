const Router = require('koa-router')

const userRouter = new Router({ prefix: '/user' })

userRouter.
  post('/login', async (ctx) => {
    const user = ctx.request.body
    if (user.username === 'ccc1l' && user.password === 'baozi#21') {
      ctx.session.user = {
        username: 'ccc1l'
      }
      ctx.body = {
        success: true,
        data: {
          username: 'ccc1l'
        }
      }
    } else {
      ctx.status = 400
      ctx.body = {
        success: false,
        message: 'username or password error!'
      }
    }
  })

module.exports = userRouter
