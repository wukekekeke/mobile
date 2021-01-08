<template>
  <div class="home">
    <!-- tab栏部分 -->
  <van-tabs v-model="active">
    <van-tab v-for="item in channels" :key="item.id" :title="item.name">
      <!-- 每个面板下, 都有自己的 article-list, 所以互相不影响 -->
      <!-- 父传子, 将频道数据传递进去 -->
      <article-list :channel='item'></article-list>
    </van-tab>
  </van-tabs>
  </div>
</template>

<script>
import { reqGetChannels } from '@/api/channel.js'
import ArticleList from './components/articleList.vue'
export default {
  name: 'home',
  data () {
    return {
      active: 0,
      channels: []
    }
  },
  methods: {
    async loadChannels () {
      const res = await reqGetChannels()
      // console.log(res)
      this.channels = res.data.data.channels
      // console.log(this.channels)
    }
  },
  created () {
    this.loadChannels()
  },
  components: {
    ArticleList
  }
}
</script>

<style lang='scss' scoped>
// 加了scoped, 样式, 只会作用于当前组件模板，不会往下渗透，不会影响组件内部元素的！！！
// 深度作用选择器
// 写法：
// ::v-deep (sass/scss)
// /deep/ (less)
// >>> (css)
.home{
  // calc():用于动态计算长度值,calculate(计算)的缩写
  // vh 在任何屏幕中，100wh，是一个屏幕的高度
  // 当前可视区域的高 - 头部的高 - 底部的高
  // !!!注意 减号前后要有空格，否则不生效！！！！
  height: calc(100vh - 46px - 50px);
  padding-top: 44px;
  box-sizing: border-box;
  // background-color: pink;
  ::v-deep{
    // 写在这个选择器中的所有内容, 往下渗透影响到内部的所有子组件, 以及子组件的内部元素
    .van-tabs{
      height: 100%;
      // 高亮线
      .van-tabs__line{
        background-color:#1989fa;
      }
      // 上面的定位的导航
      .van-tabs__wrap{
        position: fixed;
        left: 0;
        top: 46px;
        width: 100%;
      }
      // 下面的内容部分
      .van-tabs__content{
        height: 100%;
        //  内部滚动容器 （每个tab下的容器都有自己的滚动条）
        .van-tab__pane{
          height: 100%;
          overflow: auto; // 滚动条
        }
      }
    }
  }
}
</style>
