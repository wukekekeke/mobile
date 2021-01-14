<template>
  <div class="search-result">
    <!-- 导航栏 -->
    <van-nav-bar
      :title='keyword+"的搜索结果"'
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 点击搜索结果，跳转到文章详情页 -->
      <van-cell
        v-for="item in list"
        :key="item.art_id.toString()"
        :title="item.title"
        @click="$router.push('/articleDetail/'+item.art_id.toString())"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { reqGetSearch } from '@/api/search.js'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      keyword: ''
    }
  },

  methods: {
    async onLoad () {
      // 1.异步更新数据
      const res = await reqGetSearch(this.keyword, this.page)
      const arr = res.data.data.results
      // 把结果追加到list后面
      this.list.push(...arr)
      // 页码自增
      this.page++

      // 2.加载状态结束
      this.loading = false

      // 3.数据全部加载完成
      if (arr.length === 0) {
        this.finished = true
      }
    }
  },
  created () {
    // 获取路由上的参数
    // console.log(this.$route.query.keyword)
    this.keyword = this.$route.query.keyword
  }
}
</script>

<style lang="scss" scoped>
.search-result {
  .article-list {
    margin-top: 39px;
  }
}
</style>
