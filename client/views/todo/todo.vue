<template>
  <section class="real-app">
    <div class="tab-container">
      <tabs :value="filter"
        @change="handleChangeTab"
      >
        <tab :label="tab" :index="tab" v-for="(tab) in states" :key="tab"/>
      </tabs>
    </div>
    <input type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去做什么？"
      @keyup.enter="handleAdd"
    >
    <item :todo="todo"
      v-for="(todo,index) in filteredTodos"
      :key="index"
      @del="deleteTodo"
      @toggle="toggleTodoState"
    ></item>
    <helps :filter="filter" 
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    ></helps>
    </section>
</template>
<script>
import Item from './item.vue'
import Helps from './help.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  metaInfo: {
    title: 'The Todo App'
  },
  data: function () {
    return {
      filter: 'all',
      states: ['all', 'active', 'completed']
    }
  },
  computed: {
    ...mapGetters(['todos']),
    filteredTodos: function () {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter((todo) => completed === todo.completed)
    }
  },
  props: ['id'],
  mounted () {
    /* 在服务端渲染的时候mounted是执行不到的。
     * mounted,是$el对象插入到dom节点之后，才会被执行。
     * 服务端渲染是没有dom这个概念，所以执行不到。
     */
    if (this.todos && this.todos.length < 1) {
      this.fetchTodos()
    }
  },
  /* 定义方法，vue的生命周期里不执行。
   * 服务端渲染的时候执行该方法。
   */
  asyncData ({ store, router }) {
    if (store.state.user) {
      return store.dispatch('fetchTodos')
    }
    /* 服务端渲染的时候，用户未登录直接跳转到登录页，从/app跳转至/login
     * server.render 里的 context.router.currentRoute.fullPath发生变化
     */
    router.replace('/login')
    return Promise.resolve('未登录!!!!')
  },
  methods: {
    ...mapActions([
      'fetchTodos',
      'addTodo',
      'updateTodo',
      'deleteTodo',
      'deleteAllcompleted'
    ]),
    handleAdd: function (e) {
      const content = e.target.value.trim()
      if (!content) {
        this.$notify({
          content: '必须输入要做的内容！'
        })
        return
      }
      const todo = {
        content,
        completed: false
      }
      this.addTodo(todo)
      e.target.value = ''
    },
    toggleTodoState: function (todo) {
      this.updateTodo({
        id: todo.id,
        todo: Object.assign({}, todo, {
          completed: !todo.completed
        })
      })
    },
    clearAllCompleted: function () {
      this.deleteAllcompleted()
    },
    toggleFilter: function (state) {
      this.filter = state
    },
    handleChangeTab (value) {
      this.filter = value
    }
  },
  components: {
    Item,
    Helps
  }
}
</script>
<style lang="stylus">
.real-app
  width 700px
  margin 0 auto
  box-shadow 0 0 5px #666
  .tab-container
    background-color #fff
    padding 0 15px
  .add-input
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    outline: none;
    color: inherit;
    box-sizing: border-box;
    font-smoothing: antialiased;
    padding: 16px 16px 16px 36px;
    border: none;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
</style>
