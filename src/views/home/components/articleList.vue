<template>
  <div class="articleList">
    <!-- list 瀑布流滚动加载，用于展示长列表,当列表即将滚动到底部时，会触发事件并加载更多列表项。(相当于移动端的分页) -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 展示大数，要配合toString() -->
      <van-cell v-for="item in list" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { reqGetArticles } from '@/api/articles.js'
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
      // 加载完, 需要将 loading 手动设置为 false,才能再次进行onLoad事件
      finished: false, // 所有的数据是否都已经加载完成
      // true 没有数据可以加载了——》“没有更多了”，这用户再怎么触底，都不会再有数据了
      timestamp: null // 时间戳
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
      console.log(res)
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
    }
  }
}
</script>

<style>

</style>
