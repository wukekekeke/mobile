import http from '@/utils/request.js'

// 注意：eslint 中默认声明变量需要使用驼峰命名
// 可以在package.json中修改rules：{“需要更改的规则”:"off"} 关闭规则
export const reqGetArticles = (channel_id, timestamp) => {
  return http({
    method: 'get',
    url: '/v1_1/articles',
    params: {
      channel_id,
      with_top: 1, // 包含置顶文章(写死)
      timestamp// 时间戳，用于做分页
      // （相当于一个分页的标识）后台会返回一个时间戳的标识，前端请求下一页数据时需要携带
      // 最新的：传当前的时间戳
      // 历史：传指定时间戳
    }
  })
}

// 对文章不喜欢
export const reqDislikeArticles = (articleId) => {
  return http({
    method: 'post',
    url: '/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 举报文章
export const reqReportArticles = (articleId, type) => {
  return http({
    method: 'post',
    url: '/v1_0/article/reports',
    data: {
      target: articleId,
      type
    }
  })
}

// 获取新闻文章详情
export const reqGetArticleDetail = art_id => {
  return http({
    method: 'get',
    url: '/v1_0/articles/' + art_id
  })
}

// 取消关注用户
export const reqUnFollowUser = (aut_id) => {
  return http({
    method: 'delete',
    url: '/v1_0/user/followings/' + aut_id
  })
}

// 关注用户
export const reqFollowUser = (aut_id) => {
  return http({
    method: 'post',
    url: '/v1_0/user/followings',
    data: {
      target: aut_id
    }
  })
}

// 对文章点赞
export const reqAddLike = art_id => {
  return http({
    method: 'post',
    url: '/v1_0/article/likings',
    data: {
      target: art_id
    }
  })
}

// 取消对文章点赞
export const reqDeleteLike = art_id => {
  return http({
    method: 'delete',
    url: '/v1_0/article/likings/' + art_id
  })
}

// 对文章不喜欢
export const reqAddDisLike = art_id => {
  return http({
    method: 'post',
    url: '/v1_0/article/dislikes',
    data: {
      target: art_id
    }
  })
}

// 取消对文章不喜欢
export const reqDeleteDisLike = art_id => {
  return http({
    method: 'delete',
    url: '/v1_0/article/dislikes/' + art_id
  })
}
