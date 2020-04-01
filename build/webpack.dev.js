const path = require('path');

// 把相对路径转为绝对路径
const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  mode: 'development',
  entry: {
    // 这里的eruda是对入口的命名
    eruda: resolve('../src/common/js/eruda.js')
  },
  devServer: {
    // 开发服务的配置
    // port: 8080, // 不配置默认为8080，如果同时有多个本地项目运行且占用8080端口，会自动改端口
    compress: true, // 启用gzip压缩 可以提升返回页面的速度
    contentBase: path.resolve(__dirname, '../dist'), // webpack 启动服务会在dist目录下 
    historyApiFallback: true // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
  }
}