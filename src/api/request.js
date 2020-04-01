import axios from 'axios'
import baseUrl from './baseUrl'
import store from '@/store'
// import router from '@/router'
import { Toast } from 'vant'

/**
 * config有一个默认参数：
 * cancelToken: true 为使用cancelToken, 会有abort操作
 * 可以根据各自的项目需求增加参数
 */
class Ajaxquest {
  constructor () {
    this.baseURL = baseUrl
    this.withCredentials = true
    this.timeout = 60000
    this.cancelToken = null
  }
  _interceptorsRequest (config) {
    console.log('_interceptorsRequest config: ', config)

    // 这里可以处理请求头和其他请求配置

    return config
  }
  _interceptorsResponse (response) {
    console.log('response success: ', response)
    return response
  }
  _interceptorsReject (error) {
    console.log('response fail: ', error)
    console.log('response fail response: ', error.response)

    if (error.message === 'cancel a request') return Promise.reject(error)

    // 打印错误信息
    let errorMessage = '服务器繁忙，请刷新页面重试！'
    if (error.response && error.response.headers['x-info'] !== undefined && error.response.headers['x-info'] !== '') {
      errorMessage = decodeURIComponent(error.response.headers['x-info'])
    } else if (error.message) {
      errorMessage = error.message.toLowerCase()
      if (errorMessage.indexOf('timeout') > -1) {
        errorMessage = '服务器长时间未响应，请刷新页面重试！'
      } else if (errorMessage.indexOf('abort') > -1) {
        errorMessage = '服务器连接中断 abort！'
      }
    }
    
    // Do something with response error
    console.log('报错信息：', errorMessage)

    // 报错分类处理
    if (error.response) {
      console.log('response fail response: ', error.response)
      switch (error.response.status) {
        case 302:
          // do something
          break
        case 400:
          // do something
          break
        case 401:
          // do something
          break
        case 403:
          // do something
          break
        case 404:
          // do something
          break
        case 500:
          // do something
          break
        default:
          // do something
      }
    }

    return Promise.reject(error)
  }
  abort (notice = 'cancel a request') {
    console.log('abort')
    if (this.cancelToken) {
      this.cancelToken.cancel(notice)
    }
  }
  request (config) {
    if (config.cancelToken) {
      this.cancelToken = axios.CancelToken.source()
    }
    const service = axios.create({
      baseURL: this.baseURL,
      withCredentials: this.withCredentials,
      timeout: this.timeout,
      cancelToken: config.cancelToken ? this.cancelToken.token : null
    })
    delete config.cancelToken
    service.interceptors.request.use(config => this._interceptorsRequest(config), error => {
      console.log('service error: ', error)
      // Do something with request error
      return Promise.reject(error)
    })
    service.interceptors.response.use(response => this._interceptorsResponse(response), error => this._interceptorsReject(error))
    return service(config)
  }
}

export default new Ajaxquest()
