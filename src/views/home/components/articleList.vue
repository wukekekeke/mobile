<template>
  <div class="articleList">
    <!-- <p>文章列表组件 - {{ channel }} - {{ Math.random() }}</p> -->
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- list 上拉加载(相当于移动端的分页) -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 展示大数，要配合toString() -->
        <van-cell v-for="item in list" :key="item.art_id.toString()" :title="item.title">
          <!-- 使用插槽（显示在下方） -->
          <template #label>
            <!-- 图片，展示使用宫格组件 -->
            <!-- 动态设置图片的显示数量 -->
            <van-grid :column-num="item.cover.images.length">
              <van-grid-item v-for="(img,index) in item.cover.images" :key="index">
                <!-- 图片懒加载 -->
                <van-image :src="img" lazy-load/>
              </van-grid-item>
            </van-grid>
            <!-- 文字说明 -->
            <div class="meta">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <!-- 使用全局过滤器 -->
              <span>{{item.pubdate|relative}}</span>
              <!-- 只有登录的用户, 才能看见这个 x 按钮 -->
              <span class="close" v-if="tokenInfo.token" @click="close(item)" >
                <van-icon name="cross"></van-icon>
              </span>
            </div>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { reqGetArticles } from '@/api/articles.js'
import { mapState } from 'vuex'
export default {
  name: 'articleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false, // 数据是否在加载中
      // ture加载中不会再次触发onLoad事件(为了屏蔽用户的频繁触底，一直发请求)
      // 当组件滚动到底部时，会自动触发load事件并将loading设置成true
      // 加载完, 需要将 loading 手动设置为 false,才能再次进行onLoad事件
      finished: false, // 所有的数据是否都已经加载完成
      // true 没有数据可以加载了——》“没有更多了”，这用户再怎么触底，都不会再有数据了
      timestamp: null, // 时间戳
      refreshing: false // 是否在下拉刷新中
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      console.log('当前数据的条数', this.list.length)
      if (!this.timestamp) {
      // 1) 如果没有时间戳，表示第一次发，用当前的时间戳
        this.timestamp = +new Date()
      }
      // 2) 如果有时间戳，拿之前的时间戳，发请求
      const res = await reqGetArticles(this.channel.id, this.timestamp)
      // console.log(res)
      // 保存后台返回的时间戳, 用于下一次请求
      this.timestamp = res.data.data.pre_timestamp
      // 通过...展开运算符，把请求结果追加到list中
      const arr = res.data.data.results
      this.list.push(...arr)

      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (arr.length === 0) {
        this.finished = true
      }
    },
    async onRefresh () {
      // 刷新，重新请求第一页的数据(要传入最新的时间戳)
      const res = await reqGetArticles(this.channel.id, +new Date())
      this.timestamp = res.data.data.pre_timestamp
      // 将数据覆盖到 list中
      this.list = res.data.data.results
      // 恢复状态
      this.refreshing = false
      this.$toast.success('刷新成功')
    },
    close (item) {
      // console.log(item)
      this.$emit('show-more', item.art_id.toString())
    },
    // 根据 id 从 list 中删除相同id的项
    delListById (id) {
      this.list = this.list.filter(item => item.art_id.toString() !== id)
    }
  },
  computed: {
    ...mapState('user', ['tokenInfo'])
  },
  created () {
    // 子组件监听事件
    // this.$eventBus.$on('自定义事件名', 处理函数 )
    this.$eventBus.$on('del-article', obj => {
      // console.log(obj)
      // 解构对象
      const { ArticleId, channelId } = obj
      if (channelId !== this.channel.id) {
        console.log('不是我频道中的文章，女我无瓜')
        return
      }
      console.log('是我频道中的文章，需要找到文章id并删除')
      this.list = this.list.filter(item => item.art_id.toString() !== ArticleId)
    })
  }
}
</script>

<style lang="scss" scoped>
.articleList {
  .meta {
    width: 100%;
    span {
      margin-right:10px;
    }
    .close{
      float: right;
      margin-top: 4px;
    }
  }
}
</style>
