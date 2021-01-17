import http from '@/utils/request.js'

// 获取评论或评论回复
// 获取文章评论
export const reqGetComments = (art_id, offset) => {
  return http({
    method: 'get',
    url: '/v1_0/comments',
    params: {
      type: 'a', // a表示对文章的评论 ,c表示对评论的回复
      source: art_id,
      offset // 后台会返回的参数，表示下一页第一条数据的ID，下一次请求时需要带上
    }
  })
}

// 添加对文章的评论
export const reqAddComment = (art_id, content) => {
  return http({
    method: 'post',
    url: '/v1_0/comments',
    data: {
      target: art_id,
      content
    }
  })
}

// 获取评论回复
export const reqGetCommentsReplys = (com_id, offset) => {
  return http({
    method: 'get',
    url: '/v1_0/comments',
    params: {
      type: 'c', // a表示对文章的评论 ,c表示对评论的回复
      source: com_id,
      offset // 后台会返回的参数，表示下一页第一条数据的ID，下一次请求时需要带上
    }
  })
}

// 添加对评论的回复
export const reqAddCommentReply = (com_id, content, art_id) => {
  return http({
    method: 'post',
    url: '/v1_0/comments',
    data: {
      target: com_id,
      content,
      art_id
    }
  })
}

// 对文章点赞
export const reqAddCommentLike = com_id => {
  return http({
    method: 'post',
    url: '/v1_0/article/likings',
    data: {
      target: com_id
    }
  })
}

// 取消对文章点赞
export const reqDeleteCommentLike = com_id => {
  return http({
    method: 'delete',
    url: '/v1_0/article/likings/' + com_id
  })
}
