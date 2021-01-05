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
// 按需导入
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
