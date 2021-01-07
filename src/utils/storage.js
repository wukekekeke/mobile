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
