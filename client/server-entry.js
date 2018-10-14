import createApp from './index.js'

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    // 在server-render 把登录信息直接传入
    if (context.user) {
      store.state.user = context.user
    } else {
      store.todos = []
      store.state.user = null
    }
    console.log(context.user)
    /* 开发环境下，不存在问题，
     * 生产环境下，就存在问题。开发环境下刷新store里的数据会自动重置为空值，但是生产环境下store里的数据会保持住。
     * store.state.user 的值没有被删除掉，就算退出登录 还是存在值
     * 后续的todo页还是会根据store.state.user
     */
    console.log(store.state.user)
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error('no component matched'))
      }
      Promise.all(matchedComponents.map((Component) => {
        if (Component.asyncData) {
          /* 服务端渲染
           * 用户未登录状态也会先看到todo页面，然后慢慢跳转到login，这样用户体验不够好
           * 根据webapp 的体验，用户应该直接看到login
           */
          return Component.asyncData({
            router,
            store
          })
        }
      })).then(data => {
        console.log(data)
        // context.router = router
        context.state = store.state
        context.router = router
        // 服务端渲染，通过$meta把值赋值到context上
        context.meta = app.$meta()
        resolve(app)
      })
    })
  })
}
