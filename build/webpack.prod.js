
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  optimization: {
    // 在生产环境下 将第三方模块进行抽离
    splitChunks: {
      chunks: 'all', // 'async' 默认支持异步的代码分割 如import()
      minSize: 30000, // 文件超过30k，就会抽离
      maxSize: 0,
      minChunks: 1, // 最少模块引用1次才抽离
      maxAsyncRequests: 6, // 最多6个请求
      maxInitialRequests: 4, // 最多首屏加载4个请求
      automaticNameDelimiter: '~', // 抽离文件名***~a~b，代表a,b都有引用，使用~来分隔
      automaticNameMaxLength: 30, // 最长名字大小
      cacheGroups: { // 缓存组
        vues: {
          test: /[\\/]node_modules[\\/]\/vue|vue-router|vuex/,
          priority: 1 // 优先级
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 1, // 至少引用1次
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    // 优化项
    minimizer: [
      new OptimizeCSSAssetsPlugin(), // 压缩css，但使用之后js文件也需要手动压缩
      new TerserWebpackPlugin(), // 压缩js
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin() // 打包代码分析
  ]
}