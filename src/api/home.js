import axios from './request'
import * as urls from './urls'
import * as methods from './methods'

// 该请求函数为演示
export const home = config => {
  if (config.cancel) { // 如果参数带了此值并为true，则触发cancelToken去abort请求
    console.log('axios', axios)
    axios.abort()
    return
  }
  let params = {
    xxx: config.xxx
  }
  return axios.request({
    url: urls.HOME,
    method: methods.GET,
    params,
    cancelToken: true // 如果请求需要使用cancelToken，可以发请求的时候传入这个值
  })
}