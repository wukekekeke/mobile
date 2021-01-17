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

    <!-- 中间的弹层（不感兴趣） -->
    <van-popup v-model="showMore" :style="{ width: '60%' }">
      <more-action @dislike='dislike' @report='report' ref='showMore'></more-action>
    </van-popup>

    <!-- 修改频道列表按钮  -->
    <div class="bar-btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav"/>
    </div>

    <!-- 底部的弹层（频道管理） -->
    <van-action-sheet v-model="showChannelEdit" title="频道管理">
      <channel-edit
        :active='active' @update-curchannel='updateCurchannel'
        @update-active='updateActive'>
      </channel-edit>
    </van-action-sheet>
  </div>

</template>

<script>
// import { reqGetChannels } from '@/api/channel.js'
import ArticleList from './components/articleList.vue'
import MoreAction from './components/moreAction.vue'
import { reqDislikeArticles, reqReportArticles } from '@/api/articles.js'
import ChannelEdit from './components/channelEdit.vue'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'home',
  computed: {
    ...mapState('channels', ['channels', 'allChannels'])
  },
  data () {
    return {
      active: 0,
      // channels: [], //channels统一从vuex中获取
      showMore: false, // 控制x 中间的弹层
      ArticleId: null,
      showChannelEdit: false // 控制 底部的弹层
    }
  },
  methods: {
    // 为了让视图中的tab栏中频道，和下方弹层中的频道，同步更新，都通过vuex管理，channels统一从vuex中获取
    // async loadChannels () {
    //   const res = await reqGetChannels()
    //   // console.log(res)
    //   this.channels = res.data.data.channels
    //   // console.log(this.channels)
    // },
    handleShowMore (id) {
      this.showMore = true // 异步更新，不会立马执行，此时弹层还没有出现
      this.ArticleId = id
      // console.log(this.ArticleId)
      // 弹层显示的同时，通过更改子组件中isReport的属性，重置成默认状态
      // 注意：vue是异步DOM更新的，此时弹层还没出现，moreAmorection组件还没有生成，所以要等视图渲染完毕后，再执行，用到this.$nextTick
      this.$nextTick(() => {
        this.$refs.showMore.isReport = false
      })
    },
    // 不感兴趣
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
    },
    // 举报
    async report (type) {
      try {
        // 1. 调用接口
        await reqReportArticles(this.ArticleId, type)
        // 2. 关闭弹层
        this.showMore = false
        // 3. 删除文章(和不敢兴趣一样，都是通过事件总线)
        const emitObj = {
          ArticleId: this.ArticleId,
          channelId: this.channels[this.active].id
        }
        // 发布事件
        this.$eventBus.$emit('del-article', emitObj)
      } catch {
        this.$toast.fail('该文章已经被举报，请等待客服处理')
      }
      // try catch 用于解决 用户同时举报同一篇文章 而出现的报错问题
    },
    updateCurchannel (curchannel) {
      // 1. 关闭弹层
      this.showChannelEdit = false
      // 2. 切换到当前频道(更新下标active)
      this.active = curchannel
    },
    // 修改高亮
    updateActive (index) {
      this.active = index
    },
    ...mapActions('channels', ['setChannelsAsync', 'setAllChannelsAsync'])
  },
  created () {
    // this.loadChannels()
    this.setChannelsAsync()
    this.setAllChannelsAsync()
  },
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
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
        right: 30px;
      }
      // 下面的内容部分
      .van-tabs__content{
        height: 100%;
        //  内部滚动容器 （每个tab下的容器都有自己的滚动条）
        .van-tab__pane{
          height: 100%;
          // overflow: auto; // 滚动条
        }
      }
    }
  }
    // 频道管理的开关按钮（定位到右上角）
  .bar-btn {
    position: fixed;
    right: 5px;
    top: 57px;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
    z-index:1;
    .van-icon-wap-nav{
      font-size: 20px;
    }
  }
}
</style>
