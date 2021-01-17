// vuex用户模块

// token存储：
// token 既 存到 vuex (响应式), 又存到localStorage(持久化 - 持久存储), 且两个存储需要同步

// 解决token刷新丢失状态的问题：
// 1.用户登陆成功之后，保存token到本地存储localstorage
// 2.在vuex初始化时，从本地中取token

import { setToken, getToken, removeToken } from '@/utils/storage.js'

const state = {
  // 存放关于token数据：token，refresh token
  // 这里的初始值, 不能为空, 需要从本地的localStorage中拿，否则页面一刷新，token会回到初始值（空）
  // localStorage中存的是JSON字符串，需要解析
  // tokenInfo: JSON.parse(localStorage.getItem('tokenInfo'))
  // 以上取token的方法封装到storage.js中了
  tokenInfo: getToken()
}

const mutations = {
  setTokenInfo (state, tokenObj) {
    state.tokenInfo = tokenObj
    // 拿到token中需要往本地存一份，持久存储
    // localStorage中存的是JSON字符串，需要转义
    // localStorage.setItem('tokenInfo', JSON.stringify(tokenObj))
    // 以上存token的方法封装到storage.js中了
    setToken(tokenObj)
  },
  // 清空本地token
  removeTokenInfo (state) {
    state.tokenInfo = {}
    removeToken()
  }
}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
