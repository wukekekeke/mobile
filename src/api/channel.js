import http from '@/utils/request.js'

// 获取用户频道列表
export const reqGetChannels = () => {
  return http({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}
