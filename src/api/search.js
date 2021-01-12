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
