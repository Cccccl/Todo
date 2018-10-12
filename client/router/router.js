/* 以前老的网站开发，输入一个url，经过后台代码，然后生成html，在浏览器中显示，这是一次路由跳转
 * webapp, 是不经过后端服务器，我们页面渲染的内容全部来自js，路由跳转也是通过前端去做。前端路由
 *
 * 1.服务端渲染的内存问题。
 * 由于node端require是单例模式，当用户请求结束的时候是无法释放的，因为Main的引用是单例的，会node缓存住，所以这些变量就无法回收，会产生严重的内存泄露问题。
 * 为了解决这个问题，可以对每个用户请求，开辟一个新的Main实例，这样当用户请求结束了，Main的引用可以被顺利回收，就不会产生内存泄露的问题
 */

import Router from 'vue-router'
import routes from './routes'

export default () => {
  return new Router({
    routes,
    mode: 'history',
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link'
  })
}
