<template>
  <div class="search">
    <!-- 搜索组件一级路由   $router.back()返回上一个页面-->
    <van-nav-bar
      left-arrow
      title="搜索中心"
      @click-left="$router.back()">
    </van-nav-bar>

    <!-- 搜索框 -->
    <van-search
      show-action
      placeholder="请输入搜索关键词"
      shape="round"
      v-model.trim="keyword"
      @input="getSuggestion"
    >
      <template #action>
        <div @click="clickSearch">搜索</div>
      </template>
    </van-search>

    <!-- 通过v-if和v-else来达到联想建议&历史记录的互斥效果 -->
    <!-- 联想建议 -->
    <van-cell-group v-if='keyword'>
      <van-cell icon="search" v-for="(item,index) in showSuggestion" :key="index" >
        <!-- 通过v-html解析标签 -->
        <!-- <van-cell v-html="item"></van-cell> -->
        <div v-html="item" @click="clickSuggestion(index)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 搜索历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-button plain type="info"  size="mini" @click="clearHistory">清空</van-button>
      </van-cell>
      <van-cell v-for="(item,index) in history" :key="index" :title="item" @click="clickHistory(item)">
        <van-icon name="close" @click.stop="delHistory(index)"></van-icon>
      </van-cell>
    </van-cell-group>
    <!-- /搜索历史记录 -->
  </div>
</template>

<script>
import { reqGetSuggestion } from '@/api/search.js'
import { setHistory, getHistory, removeHistory } from '@/utils/storage.js'
export default {
  name: 'Search',
  data () {
    return {
      keyword: '', // 搜索关键字
      suggestion: [], // 拿到的联想关键词
      history: getHistory(), // 从本地拿历史记录
      timeId: null // 延时器ID
    }
  },
  methods: {
    getSuggestion () {
      // 对发送的请求进行防抖处理(延迟执行)
      // 在每次发请求之前，都先清除延时器，重新开延时器
      clearTimeout(this.timeId)
      this.timeId = setTimeout(async () => {
        // 检查当前关键字是否为空
        if (!this.keyword) {
          this.suggestion = [] // 清空
          return
        }
        const res = await reqGetSuggestion(this.keyword)
        this.suggestion = res.data.data.options
      }, 300)
      // 延迟等待的时间越长，服务器的压力越小
      // 延迟等待的时间越短，用户体验感越好
      // 一般范围: 100-300
    },
    // 点击搜索&点击联想推荐都是添加历史操作，都可以调用addHistory()
    // 点击搜索按钮
    // 点击搜索按钮, 跳转到搜索结果页面，并传参
    clickSearch () {
      if (!this.keyword) return
      this.addHistory(this.keyword)
      this.$router.push('/searchResult?keyword=' + this.keyword)
    },
    // 点击联想推荐
    // 点击联想推荐, 跳转到搜索结果页面，并传参
    clickSuggestion (index) {
      this.addHistory(this.suggestion[index])
      // 通过下标从联想建议中拿
      this.$router.push('/searchResult?keyword=' + this.suggestion[index])
    },
    // 添加历史
    addHistory (str) {
      // console.log('追加历史', str)
      // 思路
      // 1. 把数据追加到前面去
      // 2. 如果已经有了相同的项, 应该删除旧的项

      // findIndex()找到就返回下标，没找到，返回-1
      const index = this.history.findIndex(item => item === str)
      // 找到删除项，说明历史记录中已经有了这一项, 应该删除掉
      // splice（从哪开始删，删几个，替换的项1......）
      if (index !== -1) {
        this.history.splice(index, 1)
      }
      // 没有重复的，在历史列表中，往前追加一项
      this.history.unshift(str)
      // 往本地存数据
      setHistory(this.history)
    },
    // 删除历史
    delHistory (index) {
      this.history.splice(index, 1)
      // 往本地存再存一次数据
      setHistory(this.history)
    },
    // 清空历史
    clearHistory () {
      // 清空本地数据
      removeHistory()
      this.history = []
    },
    // 点击历史中某一项, 也要更新历史
    // 点击历史记录, 跳转到搜索结果页面，并传参
    clickHistory (item) {
      this.addHistory(item)
      this.$router.push('/searchResult?keyword=' + item)
    }
  },
  computed: {
    // 基于返回的suggestion, 动态计算出用于渲染的高亮的showSuggestion
    showSuggestion () {
      // 1.创建正则表达式
      // 匹配的关键字是个变量，需要以构造函数的方式，创建正则
      const regExp = new RegExp(this.keyword, 'gi')
      // g开启全局匹配, i忽略大小写
      // 2.遍历拿到的suggestion，需要将替换完的结果收集起来，用于展示=>map
      const arr = this.suggestion.map(item => {
        // item 原本的字符串=》将item中对应的关键字，通过span包裹，并高亮
      // 3.正则替换 item.replace（正则表达式，函数）
        const newArr = item.replace(regExp, (mathch) => {
          return `<span style="color:red">${mathch}</span>`
        })
        return newArr
      })
      return arr
    },
    showSuggestion2 () {
      // 创建正则表达式
      const req = new RegExp(this.keyword, 'gi')
      // 遍历拿到的联想建议，高亮关键字
      const arr = this.suggestion.map(item => {
        // 正则替换
        const nweItem = item.replace(req, (match) => {
          return `<span style="color:red">${match}</span>`
        })
        return nweItem
      })
      return arr
    },
    showSuggestion3 () {
      const reg = new RegExp(this.keyword, 'gi')
      const arr = this.suggestion.map(item => {
        const newItem = item.replace(reg, (match) => {
          return `<span style='color:red'>${match}</span>`
        })
        return newItem
      })
      return arr
    }
  }
}
</script>

<style lang="" scoped>

</style>
