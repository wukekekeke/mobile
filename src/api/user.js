// 封装api接口
import http from '@/utils/request.js'
// import store from '@/store'

// 按需导出方法
// 写完整版的axios请求
// http.get(url)
// http.post(url, data)
// http({
//   method: 请求方式,
//   url: 请求地址,
//   data: 请求体中的参数, post请求的参数,
//   params: 拼接在地址栏的参数, get请求的参数,
//   headers: 请求头,
// })

// 用户登录
export const reqLogin = (mobile, code) => {
  // console.log('4444')
  return http({
    method: 'post',
    url: '/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
// 获取用户个人资料
export const reqProfile = () => {
  // 在发起请求前，先拿到token
  // const token = store.state.user.tokenInfo.token
  return http({
    method: 'get',
    url: '/v1_0/user/profile'
    // 已经在请求拦截器中配置过了
    // headers: {
    //   Authorization: `Bearer ${token}`
    // }
  })
}
