const ejs = require('ejs')
module.exports = async (ctx, renderer, template) => {
  ctx.headers['Content-Type'] = 'text/html'
  const context = {
    url: ctx.path,
    user: ctx.session.user
  }
  try {
    // 服务端渲染含有bundle的 就算地址被重定向，但是 server-render 里的 renderToString 还是被执行，消耗服务端资源。
    const appString = await renderer.renderToString(context)
    console.log('~~~~~~~~~~~~~~~~`')
    console.log(context.router.currentRoute.fullPath)
    console.log(ctx.path)
    console.log('~~~~~~~~~~~~~~~~~~')
    if (context.router.currentRoute.fullPath !== ctx.path) {
      return ctx.redirect(context.router.currentRoute.fullPath)
    }
    const { title } = context.meta.inject()
    const html = ejs.render(template, {
      appString,
      style: context.renderStyles(),
      script: context.renderScripts(),
      title: title.text(),
      initialState: context.renderState()
    })
    ctx.body = html
  } catch (err) {
    console.log('render err:', err)
    throw err
  }
}
