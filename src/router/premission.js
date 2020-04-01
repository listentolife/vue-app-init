import router from './index'

// 加载进度条
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  console.log('router => to:', to)
  console.log('router => from:', from)
  if (to.matched.length === 0) next({name: 'building'})
  NProgress.start()
  // TODO 设置页面标题
  document.title = to.meta.title
  next()
})

router.afterEach((to, from) => {
  console.log('afterEach: ', to, from)
  NProgress.done()
  window.scrollTo(0, 0)
})