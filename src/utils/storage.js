// 进行本地存储的操作封装
// 封装对于本地token的处理
const tokenKey = 'hm-tt-mobile-75-token'

// 1. 存token
export const setToken = (tokenInfo) => {
  localStorage.setItem(tokenKey, JSON.stringify(tokenInfo))
}
// 2. 取token
export const getToken = () => {
  return JSON.parse(localStorage.getItem(tokenKey)) || {}
}
// 3. 删除token
export const removeToken = () => {
  localStorage.removeItem(tokenKey)
}

// 封装对于本地搜索历史的处理
const historyKey = 'hm-tt-mobile-75-history'

// 1.存 history 历史记录
export const setHistory = (arr) => {
  localStorage.setItem(historyKey, JSON.stringify(arr))
}
// 2.取 history 历史记录
export const getHistory = () => {
  return JSON.parse(localStorage.getItem(historyKey)) || []
}
// 3.清空 history 历史记录
export const removeHistory = () => {
  localStorage.removeItem(historyKey)
}
