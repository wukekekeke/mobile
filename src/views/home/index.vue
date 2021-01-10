<template>
  <div class="home">
    <!-- tab栏部分 -->
    <van-tabs v-model="active">
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <!-- 每个面板下, 都有自己的 article-list, 所以互相不影响 -->
        <!-- 父传子, 将频道数据传递进去 -->
        <!-- 方法1：通过ref找到对应的文章，进行删除， -->
         <!-- this.$refs.articleList 如果同一个ref加给了多个组件, 将来拿到的是一个数组 -->
        <article-list :channel='item' @show-more="handleShowMore" ref='articleList'></article-list>
      </van-tab>
    </van-tabs>

    <!-- 弹层 -->
    <van-popup v-model="showMore" :style="{ width: '60%' }">
      <more-action @dislike='dislike' ></more-action>
    </van-popup>
  </div>
</template>

<script>
import { reqGetChannels } from '@/api/channel.js'
import ArticleList from './components/articleList.vue'
import MoreAction from './components/moreAction.vue'
import { reqDislikeArticles } from '@/api/articles.js'
export default {
  name: 'home',
  data () {
    return {
      active: 0,
      channels: [],
      showMore: false,
      ArticleId: null
    }
  },
  methods: {
    async loadChannels () {
      const res = await reqGetChannels()
      // console.log(res)
      this.channels = res.data.data.channels
      // console.log(this.channels)
    },
    handleShowMore (id) {
      this.showMore = true
      this.ArticleId = id
      // console.log(this.ArticleId)
    },
    async dislike () {
      console.log('dislike', this.ArticleId)
      // 1. 调用后端接口, 告诉后台, 这个文章我不感兴趣
      await reqDislikeArticles(this.ArticleId)
      // 2. 关闭弹出层
      this.showMore = false
      // 3. 将用户点击的那个文章删除
      // 方法1，this.$refs.articleList通过拿到文章下标，并通过调用articleList组件中的delListById方法
      // this.$refs.articleList[this.active].delListById(this.ArticleId)
      // 方法2，事件总线，在父组件中发布事件，子组件中监听事件，并做出反应
      // 父组件发布事件
      // this.$eventBus.$emit('自定义事件名', 参数...)
      const emitObj = {
        ArticleId: this.ArticleId,
        channelId: this.channels[this.active].id
      }
      this.$eventBus.$emit('del-article', emitObj)
      // console.log(emitObj)
    }
  },
  created () {
    this.loadChannels()
  },
  components: {
    ArticleList,
    MoreAction
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
