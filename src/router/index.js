import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 一级路由
import Login from '@/views/login'
import Layout from '@/views/layout'
import Search from '@/views/search'
import SearchResult from '@/views/search/searchResult.vue'
import ArticleDetail from '@/views/article/index.vue'
import UserProfile from '@/views/user/profile.vue'
import UserChat from '@/views/user/chat.vue'
// 二级路由
import Home from '@/views/home'
import Qusetion from '@/views/question'
import Video from '@/views/video'
import User from '@/views/user'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/search', component: Search },
    { path: '/searchResult', component: SearchResult },
    // 如果路由状态要传ID，也可以用动态路由参数的方式
    { path: '/articleDetail/:id', component: ArticleDetail },
    { path: '/userProfile', component: UserProfile },
    { path: '/userchat', component: UserChat },
    {
      path: '/',
      component: Layout,
      children: [
        { path: '/', component: Home, meta: { isKeepAlive: true } },
        // 添加路由元信息 meta，配合组件缓存
        { path: '/question', component: Qusetion },
        { path: '/user', component: User },
        { path: '/video', component: Video }
      ]
    }
  ]
})

// 在重复跳转路由, 或者重定向时，浏览器会警告，
// 但不影响功能，可以对错误进行屏蔽
// 将原型上原始的方法, 存到了一个变量中
const originalPush = VueRouter.prototype.push
// 对原型上的方法进行重写, 额外新增了错误的屏蔽
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// 配置全局守卫，做权限处理
// 需要认证的token页面，需要登录才能访问
const AuthUrls = ['/user']
// to:路由对象去哪里，要去的路由
// from:路由对象从哪来
// next:决定是否放行
router.beforeEach((to, from, next) => {
  const token = store.state.user.tokenInfo.token

  // 如果是去登陆页, 判断 token 存不存在, 如果 token 存在说明登录过了, 直接跳转到首页
  if (to.path === '/login' && token) {
    next('/')
    return
  }

  if (AuthUrls.includes(to.path)) {
    // 一、如果是需要授权的页面
    if (token) {
      next() // 1.有token，直接放行
    } else {
      next({
        path: '/login', // 2.没有token。则拦截到首页
        query: {
          backto: to.fullPath // 回到原来的页面，并且通过fullPath带上查询参数
        }
      })
    }
  } else {
    next() // 二、不去需要登录才能访问的页面，可以直接放行
  }
})

export default router
