<template>
  <div class="loading" v-show="showFlag">
    <div class="spinner">
      <div class="dot1"></div>
      <div class="dot2"></div>
    </div>  
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      showFlag: false
    }
  },
  methods: {
    show: function () {
      this.showFlag = true
    },
    hide: function () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.loading{
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
  .spinner{
    margin 100px auto;
    width 40px;
    height 40px;
    position relative
    text-align center
    
    animation: sk-rotate 2.0s infinite linear;
    .dot1, .dot2{
      width 60%
      height 60%
      display inline-block
      position absolute
      top 0
      background-color #333
      border-radius 100% 

      animation sk-bounce 2.0s infinite ease-in-out
    }
    .dot2{
      top: auto
      bottom 0
      
      animation-delay -1.0s
    }
  }
}
@keyframes sk-rotate { 
  0% {
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
}
@keyframes sk-bounce {
  0%, 100% {
    transform: scale(0.0);
  } 50% {
    transform: scale(1.0);
  }
}
</style>
