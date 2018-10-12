<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from './views/layout/header.vue'
import Footer from './views/layout/footer.jsx'
export default {
  metaInfo: {
    title: 'ccc1l\'s Todo App'
  },
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="stylus" scoped>
#app{
  position absolute
  left 0
  right 0
  top 0
  bottom 0
}
#cover{
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  background-color #999
  opacity .9
  z-index -1
}
#loading{
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background-color rgba(255,255,255,.3)
  z-index 99
  display flex
  align-items center
  justify-content center
}
</style>
