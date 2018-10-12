// loading应该是一个单例模式，全局只存在一个loading。
import Vue from 'vue'
import Component from './func-loading.js'

const LoadingConstructor = Vue.extend(Component)

const getSingle = (fn) => {
  let result
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}

const createLoading = () => {
  let instance
  instance = new LoadingConstructor({})
  /* 判断服务端渲染还是客户端渲染
   * 1. 通过$isServer
   * 2. 通过webpack.DefinePlugin 里 设置 默认值
   * console.log(instance.$isServer)
   * const isServer = process.env.VUE_ENV === 'server'
   * console.log(`env: ${process.env.VUE_ENV}`)
   * loading 这个方法的调用在客户端和服务端有区别，服务端不存在document
   * 或者不挂载在文档上，并且server-entry里获取数据并且存储在store里。
   * 服务端直出的页面所以不存在loading这个加载动画。
   * 在客户端环境下的话需要返回一个被挂载到document上的实例
   */
  if (instance.$isServer) {
    console.log('server')
  } else {
    console.log('client')
    instance.$mount()
    document.body.appendChild(instance.$el)
  }
  return instance
}

// 通过方法调用
const loading = getSingle(createLoading)

export default loading
