<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
      >
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.update|relative}}</span>
            <van-button size="mini" type="default" @click="clickShowReply(item)">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" :name="item.is_like?'like':'like-o'" @click="toggleCommentLike"/>
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model='content'
      >
        <van-button slot="button" size="mini" type="info" @click="addComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->

    <!-- 评论弹出层 -->
    <van-popup v-model="isShowReply" round position='bottom' :style="{height:'85%'}">
      <!-- 把评论对象传到回复评论组件中 -->
      <!-- bug修复 -->
      <!-- 问题：van-popup组件底层是显示与隐藏，所以请求回复列表只在第一次创建这个组件时执行，所以导致第二次点击某个评论的回复时，还是显示第一次点击回复时取回来的回复列表 -->
      <!-- 解决：需要用过v-if="isReplyShow"，回复评论时，动态创建组件，重新发请求，拿到最新的数据 -->
      <comment-reply v-if="isShowReply" :comment='currentComment'
       :articleId='articleId'
       @close='isShowReply=false'>
      </comment-reply>
    </van-popup>
    <!-- /评论弹出层 -->
  </div>
</template>

<script>
import { reqGetComments, reqAddComment, reqAddCommentLike, reqDeleteCommentLike } from '@/api/comment.js'
import CommentReply from './commentReply.vue'
export default {
  name: 'ArticleComment',
  components: {
    CommentReply
  },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  // props: ['articleId'],
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 后台会返回的参数，表示下一页第一条数据的ID，下一次请求时需要带上
      content: '', // 评论内容
      isShowReply: false,
      currentComment: {}
    }
  },

  methods: {
    async onLoad () {
      // 发请求，获取评论数据
      // console.log(this.articleId)
      const res = await reqGetComments(this.articleId, this.offset)
      // console.log(res)
      // 将数据添加到list中
      const arr = res.data.data.results
      this.list.push(...arr)
      // 加载状态结束
      this.loading = false
      // 更新offset
      this.offset = res.data.data.last_id// last_id就是下一页第一条数据的ID，以便获取下一页数据
      // 数据全部加载完成
      if (arr.length === 0) {
        this.finished = true
      }
    },
    // 发布评论
    async addComment () {
      if (!this.content) return
      try {
        const res = await reqAddComment(this.articleId, this.content)
        // console.log(res)
        // 从接口的返回值中, 会有一个new_obj数据, 就表示新发布的评论对象
        // 把新添加的数据添加到最前面
        this.list.unshift(res.data.data.new_obj)
        // 清空评论区
        this.content = ''
        this.$toast.success('发布评论成功')
      } catch {
        this.$toast.fail('该文章禁止评论')
      }
    },
    // 控制回复评论弹层
    clickShowReply (item) {
      this.isShowReply = true
      // 把正在回复的评论，存到currentComment
      this.currentComment = item
    },
    // 切换评论的点赞
    async toggleCommentLike (comment) {
      try {
        const commentId = comment.com_id.toString()
        // 已经点赞，需要取消点赞
        if (comment.is_liking) {
          await reqDeleteCommentLike(commentId)
        } else {
          // 没有点赞，需要点赞
          await reqAddCommentLike(commentId)
        }
        // 更改状态
        comment.is_liking = !comment.is_liking
        this.$toast.success('点赞切换成功')
      } catch {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='scss'>
// 发表评论的区域是固定在下端的
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
// 给发表评论区空出地方
.van-list {
  margin-bottom: 45px;
}

::v-deep {
  i.van-icon-cross{
    color: white;
  }
}
</style>
