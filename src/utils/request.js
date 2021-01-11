import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
const http = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/', // 配置基地址
  timeout: 5000, // 请求超时时间
  // 对于响应数据做格式处理
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    // data => 原始的后台返回的 json 字符串数据
    // 这里是丢失精度的源头： 在JSON.parse中丢失了精度，需要换成JSONbig.parse
    try {
      return JSONbig.parse(data)
    } catch {
      // 如果解析不了, 说明不是json格式, 原样输出
      return data
    }
  }]
})

// 添加请求拦截器
// 所有的请求在发送出去之前都会经过axios的请求拦截器， 在请求拦截器中统一携带 token
http.interceptors.request.use(function (config) {
  // config：请求的配置信息
  // 在发起请求前，先拿到token
  console.log('请求拦截器')
  const token = store.state.user.tokenInfo.token
  // 有token才携带，注意：Bearer 后面带有空格
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器(暂时用不到)
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

export default http
