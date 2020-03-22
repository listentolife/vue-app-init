// 引入不同环境的配置文件
const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
// 引入webpack-merge，用于合并配置
const merge = require('webpack-merge');
// 引入path模块
const path = require('path');

let resolve = route => path.resolve(__dirname, route);

medule.exports = (env) => {
  let isDev = env.development; // 获取环境参数

  const base = {
    entry: { // 打包入口配置
      main: resolve('../src/index.js') // main为指定打包入口名字
    },
    output: {
      filename: isDev ? '[name].js' : '[name].js?v=[chunkhash]',
      chunkFilename: isDev ? '[name].js' : '[name].js?v=[chunkhash]',
      path: resolve('../dist'),
      publicPath: '/'
    }
  }

  if (isDev) {
    return merge(base, dev); // merge的原理是循环后面的配置，定义插到前面配置中
  } else {
    return merge(base, prod);
  }
}