// 这里存放请求域名

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://xxx.dev.xxx.com' : 'http://xxx.xxx.com'

export default baseUrl