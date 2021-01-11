import http from '@/utils/request.js'

// 获取用户频道列表
export const reqGetChannels = () => {
  return http({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}

// 获取全部频道列表
export const reqGetAllChannels = () => {
  return http({
    method: 'get',
    url: '/v1_0/channels'
  })
}

// 批量修改用户频道列表（重置式）
export const reqSetChannels = (channels) => {
  return http({
    method: 'put',
    url: '/v1_0/user/channels',
    data: {
      channels
    }
  })
}
