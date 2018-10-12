/* 1.mutation必须要同步操作不能有异步的代码在mutation里面
 * 异步操作需要在action里面
 *
 * 2.vue实现一个事件订阅模式
 * 如果不采用事件订阅模式，要在action里面import一个router对象，这样就会导致 router 和 action 紧耦合，不合理
 * 如果后续要修改router上面的内容，可能action也要做相应的修改。
 * 如果通过事件扔出去，我们只需要在适当的地方监听事件就可以，这样可以做到解耦。router里的内容不需要关心action里的操作
 */
import model from 'model'
import notify from '../../components/notification/function'
import loading from '../../components/loading/function'
import bus from '../../common/util/bus'
const load = loading()

const handleError = (err) => {
  if (err.code === 401) {
    notify({
      content: '你需要先登录！'
    })
    bus.$emit('auth')
  }
}

export default {
  fetchTodos ({ commit }) {
    console.log(load)
    load.show()
    return model.getAllTodos()
      .then(data => {
        load.hide()
        commit('fillTodos', data)
      })
      .catch(err => {
        load.hide()
        handleError(err)
      })
  },
  addTodo ({ commit }, todo) {
    load.show()
    model.createTodo(todo)
      .then(data => {
        load.hide()
        commit('addTodo', data)
        notify({
          content: '添加一件要做的事！'
        })
      })
      .catch(err => {
        load.hide()
        handleError(err)
      })
  },
  updateTodo ({ commit }, { id, todo }) {
    load.show()
    model.updateTodo(id, todo)
      .then(data => {
        load.hide()
        commit('updateTodo', { id, todo: data })
        notify({
          content: '修改一件事的状态!'
        })
      }).catch(err => {
        load.hide()
        handleError(err)
      })
  },
  deleteTodo ({ commit }, id) {
    load.show()
    model.deleteTodo(id)
      .then(data => {
        load.hide()
        commit('deleteTodo', id)
        notify({
          content: '删除一件要做的事！'
        })
      }).catch(err => {
        load.hide()
        handleError(err)
      })
  },
  deleteAllcompleted ({ commit, state }) {
    load.show()
    const ids = state.todos.filter(t => {
      return t.completed
    }).map(t => {
      return t.id
    })
    model.deleteAllCompleted(ids)
      .then(() => {
        load.hide()
        commit('deleteAllCompleted')
        notify({
          content: '清理一下~'
        })
      }).catch(err => {
        load.hide()
        handleError(err)
      })
  },
  login ({ commit }, { username, password }) {
    load.show()
    return new Promise((resolve, reject) => {
      model.login(username, password)
        .then(data => {
          load.hide()
          commit('doLogin', data)
          notify({
            content: '登录成功'
          })
          resolve(data)
        })
        .catch(err => {
          load.hide()
          notify({
            content: '登录失败'
          })
          handleError(err)
          reject(err)
        })
    })
  }
}
