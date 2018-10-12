/* 1. 命名视图
 * 使用场景，顶部菜单栏，切换的时候，左边的导航栏需要跟换大量的内容，产生新的导航，然后根据新的导航显示右边的内容区块
 * 这时候左边的导航栏就可以用到命名视图，来切换内容。当然可以有别的解决办法，多写几个layout，或者获取不同的数据
 *
 * 2. 路由的导航守卫
 *
 * 3. 异步组件
 * 很多的组件如果使用webpack一次打包的话，这个js文件会很大，首屏会有白屏的情况。
 * 对于不同的路由，我们只加载该路由对应组件的代码，以及核心的代码。其他路由的代码，只在访问其他路由的时候，才加载对应的代码。
 *
 * 4.服务端渲染的路由.#,hash的路由。 hash更多时候是用来作为定位的状态的记录。 hash路由不利于seo。
 *
 * 5.参数匹配, 常见使用常见，商品列表页，根据商品id的不同显示不同的内容，
 * 可以根据这里携带的参数，请求不同的内容，那么商品活动页就是完全可以复用的，这里的：id类似于组件里的props的作用。
 * 这里是路由params 的形式， 当然还有一种query的形式。都可以通过this.$route去获取到。
 *
 * 6.子路由 还是要通过router-view去匹配,嵌套路由
 *
 * 7.webpack 打包
 * 路由的异步加载组件，打包的时候使用0,1,2表示，用id数字来表示的话，顺序是随机的，
 * 顺序的变化，可能会导致bundle的hash产生变化，这样会导致强缓存失效。
 * 这样可能会导致，有时候重新打包一次，整个网站的缓存都失效。
 *
 * webpack.NamedChunksPlugin
 * 使用之后，打包之后的名字都是固定的。除非改变对应的文件，那么文件的hash值才会发生改变。
 * 这样可以防止修改部分文件导致，整个项目的文件的hash都发生变化的情况。
 * webpack打包异步的优化
 */
// 配合mfs使用 开发环境
// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export default [
  {
    path: '/',
    redirect: '/app'
  },
  {
    // path: '/app/:id', // /app/xxx
    path: '/app',
    // 可以直接在组件里通过props 获取参数，不需要用到this.$route
    props: true,
    // component: Todo,
    component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
    // 命名,通过name，路由进行跳转 :to="{name:'app'}"
    name: 'app',
    meta: {
      title: 'this is app',
      description: 'asdasd'
    },
    beforeEnter (to, from, next) {
      // console.log('app route before enter')
      next()
    }
  },
  {
    path: '/login',
    name: 'login',
    // component: Login
    component: () => import(/* webpackChunkName: "login-view" */ '../views/login/login.vue')
  }
]
