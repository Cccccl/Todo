/* vuex, store。
 * store由react最先提出的flux，flux是一个单项数据流，我们在做前端app的时候，所有的数据结构可以都放在store里面，
 * 下面的view层，无论是通过vue或者react来写的，都可以通过store的数据层的数据的变化，来控制view层页面的渲染的不同。
 * 通过store去维护数据，所有的数据都放在一起，修改数据需要通过特定的操作，比如触发action或者mutation，我们的操作只有这2各种
 * 数据的修改被限制，我们不能随意修改数据，这样就保证app的规范性。
 * 1. state,getters,mapState,mapGetters
 * 2. mutation,action,mapmutations,mapActions
 * 3. 模块，热重载
 */

import Vuex from 'vuex'
// 服务端渲染，会有一部分state数据去覆盖默认的defaultState的数据
import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
  const store = new Vuex.Store({
    strict: isDev,
    state: defaultState,
    mutations,
    getters,
    actions
  })

  // 热更新功能，vuex在业务逻辑开发的时候，编写代码如果刷新的会导致页面的状态没了，影响开发效率
  if (module.hot) {
    module.hot.accept([
      './state/state.js',
      './mutations/mutations.js',
      './getters/getters.js',
      './actions/actions.js'
    ], () => {
      // import 只能写在业务代码的最外层，这里只能使用require
      const newState = require('./state/state').default
      const newActions = require('./actions/actions').default
      const newGetters = require('./getters/getters').default
      const newMutations = require('./mutations/mutations').default
      store.hotUpdate({
        state: newState,
        getters: newGetters,
        mutations: newMutations,
        actions: newActions
      })
    })
  }
  return store
}
