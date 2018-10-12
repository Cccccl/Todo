<template>
    <div :class="['todo-item',todo.completed?'completed':'']">
        <input type="checkbox"
            class="toggle"
            :checked="todo.completed"
            @click="handleToggle"
        >
        <label>{{todo.content}}</label>
        <button class="destroy" @click="deleteTodo"></button>
    </div>
</template>
<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteTodo: function () {
      this.$emit('del', this.todo.id)
    },
    handleToggle: function (e) {
      /* item里面的todo.completed每次发生变化都需要发送一次请求，不能在使用v-model
      * 并且todo的值在vuex store里面，是不允许在组件内部修改的，需要通过action进行更改
      * 因此需要改变item的实现方式，绑定一个checked，通过checked让checkedbox自己控制自己的状态，
      * 并且监听他的一个点击事件，这里不能监听change事件，如果是change事件，那么这个input框已经发生改变
      *
      * 这里需要阻止默认的事件，需要阻止他默认的把选中的事件的状态进行更改，我们要通过todo.completed来控制他是否选中，
      * 这就是react中的一个概念。 通过状态来控制内容，他不会自动去修改值，如果我们不改绑定的value，todo.completed,那么他是不会有任何修改的
      * vue里需要自定义的方式实现，先阻止默认事件，阻止他修改自己的状态。
      */
      e.preventDefault()
      this.$emit('toggle', this.todo)
    }
  }
}
</script>
<style lang="stylus">
    .todo-item{
        position relative
        background-color #fff
        font-size 24px
        border-bottom 1px solid rgba(0,0,0,0.06)
        &:hover{
            .destroy:after{
                content: '×'
            }
        }
        label{
            white-space: pre-line;
            word-break: break-all;
            padding: 15px 60px 15px 15px;
            margin-left: 45px;
            display: block;
            line-height: 1.2;
            transition: color 0.4s;
        }
        &.completed{
            label{
                color: #d9d9d9;
                text-decoration line-through
            }
        }
    }
    .toggle{
        text-align: center;
        width: 40px;
        height: 40px;
        line-height: 40px
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        border: none;
        appearance: none;
        outline none
        padding-left 5px
        cursor pointer
        &:after{
            content: url('../../assets/images/round.svg')
        }
        &:checked:after{
            content: url('../../assets/images/done.svg')
        }
    }
    .destroy{
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin: auto 0;
        font-size: 30px;
        color: #cc9a9a;
        margin-bottom: 11px;
        transition: color 0.2s ease-out;
        background-color transparent
        appearance none
        border-width 0
        cursor pointer
        outline none
    }
</style>
