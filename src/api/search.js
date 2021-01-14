import http from '@/utils/request.js'

// 获取联想建议（自动补全）
export const reqGetSuggestion = keyWord => {
  return http({
    method: 'get',
    url: '/v1_0/suggestion',
    params: {
      q: keyWord
    }
  })
}
// 获取搜索结果
export const reqGetSearch = (keyWord, page) => {
  return http({
    method: 'get',
    url: '/v1_0/search',
    params: {
      q: keyWord,
      page
    }
  })
}
