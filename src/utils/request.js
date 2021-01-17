import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'

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

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 打印错误对象
  console.dir(error)

  // 超时处理
  if (error.code === 'ECONNABORTED') {
    Toast.fail('请求超时，请稍后重试')
  }

  // 处理token失效
  if (error.response.status === 401) {
    // 首先，判断是否有refreshToken
    const refreshToken = store.state.user.tokenInfo.refresh_token
    // 一、vuex中有refreshToken
    if (refreshToken) {
      try {
        // (1) 通过refreshToken发送请求, 进行刷新token操作, 获取新的token
        // 注意: 这边发请求, 不用http实例, 用它会自动在请求前帮你携带token(会覆盖你的refresh_token)
        // 这边, 直接用 axios 发送请求
        const res = await axios({
          method: 'put',
          url: 'http://toutiao-app.itheima.net/v1_0/authorizations',
          // 请求头中携带refresh_token信息
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        })
        const newToken = res.data.data.token
        // (2) 将新token更新到vuex中
        store.commit('user/setTokenInfo', {
          refresh_token: refreshToken,
          token: newToken
        })
        // (3) 重新使用我们创建的http实例, 再次发送请求
        return http(error.config)
      } catch {
        //  refresh_token 也过期了，只能去重新登录
        store.commit('user/removeTokenInfo')
        router.push({
          path: '/login',
          query: {
            backto: router.currentRoute.fullPath
          }
        })
      }
    } else {
      // 二、vuex中没有refreshToken
      // 直接去登录, 并且将来还能跳回来
      // 清除无效的token
      store.commit('user/removeTokenInfo')
      // 去登录页，并且登录过后需要回到原来的页面
      router.push({
        path: '/login',
        query: {
          backto: router.currentRoute.fullPath
          // 拿到当前路由的路径
          // this.$router.currentRoute===this.$route
        }
      })
    }
  }

  // 对响应错误做点什么
  return Promise.reject(error)
})

export default http
