import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import gsap from 'gsap'
import 'animate.css'
import VueLazyload from 'vue-lazyload'
// 新增：引入axios
import axios from 'axios'

import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// 配置 vue-lazyload
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://img.shiyit.com/base/mojian/img-error.jpg',
  loading: 'https://img.shiyit.com/base/mojian/lazy.gif',
  attempt: 1,
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
})

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


//表情组件
import EmojiPicker from '@/components/common/EmojiPicker.vue'
Vue.component('mj-emoji', EmojiPicker)



import ClickOutside from '@/directives/clickOutside'
Vue.directive('click-outside', ClickOutside)

//加载组件
import loading from './directives/loading'
Vue.directive('loading', loading)

//高亮
import 'highlight.js/styles/atom-one-dark.css'
import { animateOnScroll } from './directives/animate'
Vue.directive('animate-on-scroll', animateOnScroll)

//图片预览组件
import ImagePreview from '@/components/common/ImagePreview.vue'
Vue.component('mj-image-preview', ImagePreview)



// 为了支持 HMR
if (import.meta.hot) {
  import.meta.hot.accept()
}


import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
Vue.use(mavonEditor);

Vue.config.productionTip = false

import 'virtual:svg-icons-register'

// 注册全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
Vue.component('svg-icon', SvgIcon)

// ========== 核心新增：axios配置 & 全局挂载 ==========
// 创建axios实例，和环境变量匹配
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 对应.env里的/dev-api前缀
  timeout: 15000 // 请求超时15秒
})

// 响应拦截：统一处理返回数据，直接返回后端的业务数据
request.interceptors.response.use(
    res => {
      // 直接返回后端返回的data体，后续代码里直接用 res.code / res.data 即可
      return res.data
    },
    err => {
      return Promise.reject(err)
    }
)

// 挂载到Vue原型，全局所有页面都能用 this.$http 调用接口
Vue.prototype.$http = request

// ========== 原有挂载代码保留 ==========
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
