import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'

import './assets/css/index.css'
import './utils/flexible'
import webSocket from './utils/websocket.js'

import axios from 'axios'
// 默认请求的基础url（如果axios请求的地址不带域名，自动添加baseURL）（默认请求域名，/当前域名）
// axios.defaults.baseURL = 'http://39.108.181.54:8081'
// axios.defaults.baseURL = 'http://10.21.235.20:8081'
// 设置post请求头的content-Type值
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// 请求超时4分钟
// axios.defaults.timeout = 240000;
const service = axios.create({
  // baseURL: 'http://10.21.196.68:8081',
  baseURL: 'http://10.21.63.25:18081',
  // baseURL: 'http://43.138.237.196:8081',
  // 超时
  timeout: 240000
})
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  if (localStorage.getItem('btapex') && !isToken) {
    config.headers['Access-Token'] = localStorage.getItem('btapex') // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})
// 拦截响应回来的数据，通过判断success值到底是true还是false,如果是true,res.data.data -> data 如果false -> 直接到catch
// 响应拦截器
service.interceptors.response.use(response => {
  if (response.data.code === '420') {
    Vue.prototype.$message.error('登录过期')
    router.push('/login')
  }
  return response
  // axios默认加了一层data
}, error => {
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})

Vue.use(ElementUI)
Vue.use(VueCookies)

Vue.config.productionTip = false
Vue.prototype.$axios = service
Vue.prototype.webSocket = webSocket

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
