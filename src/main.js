import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 它会根据的手机尺寸来调整rem的基准值：html标签上的font-size。
import 'amfe-flexible'
// 引入全局样式
// 导入封装的请求
import http from './utils/request.js'
// 导入封装的vant-ui(在vant中按需导入)
import '@/utils/vant-ui.js'
// 注意：写的全局样式需要在引入的vant-ui后面，覆盖默认的样式
import '@/styles/index.scss'
// 导入时间处理函数
import { getRelativeTime } from '@/utils/data-time.js'
// import { formateTime, getRelativeTime } from '@/utils/data-time.js'
// 测试一下
// console.log(formateTime(+new Date()))
// console.log(getRelativeTime(+new Date()))
// 定义成为全局过滤器
Vue.filter('relative', getRelativeTime)

// 创建事件总线，挂载到原型身上，所有组件都能访问
Vue.prototype.$eventBus = new Vue()

// 按需导入vant组件（体积小，加载速度快，适合移动端）
// import { Button, NavBar, CellGroup, Field, Toast } from 'vant'
// // 初始化
// Vue.use(Button)
// Vue.use(NavBar)
// Vue.use(CellGroup)
// Vue.use(Field)
// Vue.use(Toast)

// 开发模式
Vue.config.productionTip = false

// 挂载到 vue 原型, 将来所有的组件中, 都可以 this.$http 使用这个方法
Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
