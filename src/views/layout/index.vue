<template>
  <div class="layout-container">
    <!-- 头部 -->
    <!-- vant中提供的属性 fixed固定在顶部 -->
    <van-nav-bar fixed v-if='$route.path!=="/user"' placeholder>
      <!-- 使用具名插槽，往头部添加图片和按钮 -->
      <template #left>
        <van-icon class="logo" @click="$router.push('/')"/>
      </template>
      <template #right>
        <van-button
          type="info"
          class="search-btn"
          round
          size="small"
          icon="search"
          @click="$router.push('/search')"
          >
        搜索
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 展示：中间的二级路由出口 -->
    <router-view></router-view>

    <!-- 底部 -->
    <!-- 需要添加route开启路由模式，配合内部的to -->
    <!--replace 在跳转时替换当前页面历史 -->
    <van-tabbar route v-model="active" fixed placeholder>
      <van-tabbar-item icon="home-o" replace to='/'>首页</van-tabbar-item>
      <van-tabbar-item icon="search" replace to='/question'>问答</van-tabbar-item>
      <van-tabbar-item icon="fire-o" replace to='/video'>视频</van-tabbar-item>
      <van-tabbar-item icon="smile-o" replace to='/user'>我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      active: 1
    }
  }
}
</script>

<style lang='scss' scoped>
.layout-container{
  // padding: 46px 0 50px 0;
  // logo区域
  // （css中要让使用@，需要加~识别）
  .logo{
    background: url('~@/assets/logo.png') no-repeat;
    background-size: cover;
    width: 100px;
    height: 30px;
  }
    // 搜索按钮
  .search-btn {
    background-color: #5babfb;
    width: 100px;
    font-size: 14px;
    .van-icon {
      color: #fff;
    }
  }
}
</style>
