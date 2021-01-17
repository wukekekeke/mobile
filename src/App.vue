<template>
  <div id="app">
    <!-- <van-button class="btn" type="info" @click="req">测试发axios</van-button> -->
    <!-- <div class="one">学习scss sass所用</div> -->

    <!-- 组件缓存 -->
    <!-- 需要缓存的 -->
    <keep-alive>
      <router-view v-if='$route.meta.isKeepAlive'></router-view>
    </keep-alive>
    <!-- 不需要缓存的 -->
    <router-view v-if='!$route.meta.isKeepAlive'></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    req () {
      this.$http.get('/').then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">
// 声明变量 （less中声明变量是@color）
// $color:skyblue;
// .one{
//   width: 100px;
//   height: 100px;
//   background-color: $color
// }
// sass语法：必须省略花括号和分号
// $color: pink
// .one
//   width: 100px
//   height: 100px
//   background-color: $color
</style>
