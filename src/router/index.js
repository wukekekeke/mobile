import Vue from 'vue'
import VueRouter from 'vue-router'

// 一级路由
import Login from '@/views/login'
import Layout from '@/views/layout'
import Search from '@/views/search'
import SearchResult from '@/views/search/searchResult.vue'
import ArticleDetail from '@/views/article/index.vue'
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
    {
      path: '/',
      component: Layout,
      children: [
        { path: '/', component: Home },
        { path: '/question', component: Qusetion },
        { path: '/user', component: User },
        { path: '/video', component: Video }
      ]
    }
  ]
})

export default router
