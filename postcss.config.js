// 默认自动添加前缀
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-pxtorem')({
      rootValue: 30.1932367, // body宽折算为12.42rem。如果这里设置37.5，则宽折算为10rem
      unitPrecision: 5,
      propList: ['*'],
      // exclude: /node_modules/i
    }) 
  ]
}