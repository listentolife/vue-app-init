import Vue from 'vue'

import App from './App'
import router from '@/router'
import store from '@/store'

// 引入路由守卫
import '@/router/premission'

// 引入全局scss样式
import '@common/scss/index.scss'

// 阻止生产环境的警告提醒
Vue.config.productionTip = false

// 全局mixin
import overallMixins from './mixins/overallMixins'
Vue.mixin(overallMixins)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
