import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// require.context是webpack的api，可以自动读取目录中指定文件获得上下文
// 第一个参数是目录，第二个参数是是否遍历子目录，第三个参数是特定文件的匹配条件
// 返回的是一个函数，这个函数接受一个目录下的文件路径，会返回文件的上下文，其中default属性是文件内导出的内容
// 这个函数还带有其他属性，可以通过keys()获得这个目录下匹配条件的文件路径集合
// 所以这个函数可以用于自动导入vuex的modules。
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules = [...value.default, ...modules]
  // console.log(modules)
  return modules
}, [])

export const constantRouterMap = [
  {
    path: '/',
    redirect: {
      name: 'index'
    }
  }, 
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '首页'
    },
    component: () => import('../views/index')
  },
  {
    path: '/redirect/:path*',
    name: 'redirect',
    component: () => import('@/views/redirect/index')
  },
  {
    path: '/404',
    name: 'building',
    meta: {
      title: '页面出错'
    },
    component: () => import('@/views/error-page/404')
  },
  ...modules,
]

// 路由配置
const RouterConfig = {
  mode: 'history',
  base: '/app/',
  routes: constantRouterMap
}

export default new VueRouter(RouterConfig)

