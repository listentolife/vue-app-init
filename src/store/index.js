import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

import * as types from './mutation-types'


Vue.use(Vuex)

// 整合modules
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)
console.log('modules: ', modulesFiles.keys())
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  // console.log(modules)
  return modules
}, {})

const state = {
  env: NODE_ENV === 'dev' ? location.hostname === 'localhost' > -1 ? 'dev' : 'build:dev' : 'build:prod', // 运行环境 dev/prod
  platform: '', // 运行平台 ios/android
  isWechat: false, // 是否在微信中
}

const getters = {
  env: state => state.env,
  platform: state => state.platform,
  isWechat: state => state.isWechat
}

const mutations = {
  [types.SET_PLATFORM] (state, platform) {
    state.platform = platform
  }
}

const actions = {
  checkPlatform ({ commit }) {
    return new Promise((resolve, reject) => {
      let userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
      let platform = 'unknown'
      if (/ipad|iphone|ipod/.test(userAgent)) {
        platform = 'ios'
      } else if (/android/.test(userAgent)) {
        platform = 'android'
      }
      console.log('checkPlatform: ', platform)
      commit(types.SET_PLATFORM, platform)
      platform === 'unknown' ? reject('unknow platform') : resolve()
    })
  }
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules,
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

