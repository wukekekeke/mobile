<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中&文章详情是互斥的，需要通过v-if v-else实现 -->
    <!-- 加载中 loading -->
    <van-loading class="article-loading" v-if='loading'/>
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail" v-else>
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src='article.aut_photo'/>
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <!-- 相对时间处理：直接使用在前面定义的全局过滤器 -->
          <p class="time">{{article.pubdate|relative}}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="toggleFollow"
        >
        {{this.article.is_followed?'- 取关':'+ 关注'}}
        </van-button>
      </div>
      <!-- 文章正文是html格式字符串，需要用v-html才能正确显示 -->
      <div class="content">
        <div v-html="article.content">正文</div>
      </div>
      <van-divider>END</van-divider>
      <div class="zan">
        <van-button round size="small" hairline type="primary" plain
        :icon="article.attitude===1? 'good-job':'good-job-o'"
        @click="toggleLike">
          {{article.attitude===1?'取消点赞':'点赞'}}
          </van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" plain icon="delete"
        @click="toggleDislike">
          {{article.attitude===0?'取消不喜欢':'不喜欢'}}
        </van-button>
      </div>
    </div>
    <!-- /文章详情 -->

    <!-- 文章评论 -->
    <article-comment :articleId='$route.params.id'></article-comment>
    <!-- /文章评论 -->
  </div>
</template>

<script>
import { reqGetArticleDetail, reqUnFollowUser, reqFollowUser, reqAddLike, reqDeleteLike, reqAddDisLike, reqDeleteDisLike } from '@/api/articles.js'
import ArticleComment from './components/comment.vue'
export default {
  name: 'ArticleDetail',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      article: {}
    }
  },
  methods: {
    // 获取文章详情
    // 动态路由传参:/article/:id
    // 获取方式: this.$route.params
    async getArticle () {
      const res = await reqGetArticleDetail(this.$route.params.id)
      // console.log(res)
      // 保存文章详情
      this.article = res.data.data
      // 取消加载状态
      this.loading = false
    },
    // 关注和取关
    async toggleFollow () {
      try {
        // 根据当前的 is_followed 状态, 决定发送什么请求
        if (this.article.is_followed) {
          // 当前为 true, 已经关注了，做取关操作
          await reqUnFollowUser(this.article.aut_id.toString())
          this.$toast.success('取消关注成功')
        } else {
          await reqFollowUser(this.article.aut_id.toString())
          this.$toast.success('关注成功')
        }
        // 成功后更新视图, 直接更新状态即可
        this.article.is_followed = !this.article.is_followed
      } catch {
        this.$toast.fail('操作失败')
      }
    },
    // this.article.attitude
    //  -1 无态度 (取消点赞, 取消不喜欢)
    //  0  不喜欢 (后面写)
    //  1  点赞

    // 点赞和取消点赞
    async toggleLike () {
      try {
        // 根据当前的 attitude 状态, 决定发送什么请求
        // 已经点赞，做取消点赞操作
        if (this.article.attitude === 1) {
          await reqDeleteLike(this.article.art_id.toString())
          this.article.attitude = -1
        } else {
          // 没有点赞，做点赞操作
          await reqAddLike(this.article.art_id.toString())
          this.article.attitude = 1
        }
        this.$toast.success('操作成功')
      } catch {
        this.$toast.fail('操作失败')
      }
    },
    // 喜欢和不喜欢
    async toggleDislike () {
      // 根据当前的 attitude 状态, 决定发送什么请求
      // 不喜欢，做喜欢操作
      try {
        if (this.article.attitude === 0) {
          await reqAddDisLike(this.article.art_id.toString())
          this.article.attitude = -1
        } else {
          await reqDeleteDisLike(this.article.art_id.toString())
          this.article.attitude = 0
        }
        this.$toast.success('操作成功')
      } catch {
        this.$toast.fail('操作失败')
      }
    }
  },
  created () {
    this.getArticle()
  }
}
</script>

<style lang='scss' scoped>
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error{
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    font-size:14px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    ::v-deep img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
}
</style>
