// 引入测试环境，生产环境打包配置
const dev = require('./webpack.dev.js');
const prod = require('./webpack.prod.js');
// 用于合并多个打包配置对象
const merge = require('webpack-merge');
// node模块，用于处理路径
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const webpack =  require('webpack');

// 把相对路径转为绝对路径
const resolve = dir => path.resolve(__dirname, dir)

module.exports = env => {
  let isDev = env.development;
  let base = {
    // 配置入口文件
    entry: {
      // 这里的main是对入口的命名
      main: resolve('../src/main.js')
    },
    // 配置输出
    output: {
      // 配置输出文件名，这里的name会被替换成入口命名，id会被替换成内部chunk id，chunkhash会被替换成内部chunk hash值
      /**
       * 正式环境的输出命名格式，目前遇到过有两种写法
       * 1. [name].js?v=[chunkhash]
       * 2. [name]-[chunkhash].js
       * 前者方便CDN部署的时候替换旧文件，不会增加CDN文件数
       * 后者能确保新打包后的项目指向新文件
       */
      filename: isDev ? '[name].js' : '[name].js?v=[chunkhash]',
      chunkFilename: isDev ? '[chunkhash].js' : '[id]-chunk.js?v=[chunkhash]',
      path: resolve('../dist'),
      // 配置输出文件路径。如果是相对路径，则域名指向当前域名下目录；如果是绝对URL，则访问以该URL为前缀的文件地址
      // 如配置'/asset/'，则'main.js'打包会输出'/asset/main.js'；
      // 如配置'https://cdn.example.com/assets/'，则'main.js'打包会输出'https://cdn.example.com/asset/main.js'。
      publicPath: '/'
    },
    module: {
      // rules是针对当前打包文件中导入的文件，可以对当前打包文件(issuer)跟导入文件(resource)做条件匹配
      // webpack原话：在规则中，属性 test, include, exclude 和 resource 对 resource 匹配，并且属性 issuer 对 issuer 匹配。
      /**
       * 匹配属性有test，include，exclude，and，or，not
       * test是提供一个正则表达式或正则表达式数组，用于匹配
       * include是提供一个字符串或字符串数组，用于匹配
       * exclude是提供一个字符串或字符串数组，用于排除
       * and是必须匹配数组中的所有条件
       * or是匹配数组中任一条件
       * not是必须排除某个条件
       */
      /**
       * use属性是指定打包使用的loader列表，打包时使用loader的顺序是从右往左，从上到下
       * webpack原话： Loaders can be chained by passing multiple loaders, which will be applied from right to left (last to first configured).
       * use配置可以写字符串，说明只使用一个loader；写数组说明使用多个loader，写json说明使用一个loader带其他配置如options
       */
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader' // vue的loader，用于解析.vue文件
        },
        {
          test: /\.js$/,
          // 用于转译es6及以上语法，需要配合.babelrc
          // 需要使用@babel/core @babel/preset-env babel-loader
          // 默认babel-loader调用@babel/core，然后core转化代码，转化中会调.babelrc配置使用@babel/presets-env
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader', // 用于编译.vue文件中css部分
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 一般使用MiniCssExtractPlugin就不使用style-loader
            {
              loader: 'css-loader', // 用于编译@import和url()跟解析css
              options: {
                // 在 loader 前应用的 loader 的数量，意思是解析css时需要用到'postcss-loader','sass-loader'
                // 因为引入的css文件中可能是sass文件
                // 如配置1，则应用'postcss-loader'，如配置2，则应用'postcss-loader','sass-loader'
                importLoaders: 2
              }
            },
            'postcss-loader', // 支持增加声明前缀，需要安装autoprefixer，并在postcss.config.js中配置
            'sass-loader' // sass编译，还需要安装node-sass依赖。安装node-sass建议使用cnpm
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(woff|ttf|eot|svg)$/,
          use: 'file-loader' // 用于解析通过import/require()引入的文件或外部链接
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          use: {
            loader: 'url-loader', // 用于把文件编译为base64格式
            options: {
              name: "image/[contentHash].[ext]", // 超过大小将使用file-loader解析，name为file-loader的配置，contentHash为图片的hash戳，ext是后缀
              limit: 100 * 1024, // 尺寸限制
              esModule: false // 启用CommonJS模块语法
            }
          }
        }
      ]
    },
    // resolve配置模块如何被解析
    resolve: {
      extensions: ['.js', '.vue'], // 自动解析确定的扩展名
      alias: { // 配置模块引入中的别名
        'vue': 'vue/dist/vue.esm.js',
        '@': path.join(__dirname, "../src"),
        '@images': path.join(__dirname, "../src/common/images"),
        '@components': path.join(__dirname, "../src/components"),
        '@common': path.join(__dirname, "../src/common"),
        '@api': path.join(__dirname, "../src/api"),
      }
    },
    // plugins配置webpack构建过程中使用的插件列表
    plugins: [
      new webpack.DefinePlugin({ // 可以在项目中拿到当前环境变量
        'NODE_ENV': JSON.stringify(isDev ? 'dev' : 'prod')
      }),
      new VueLoaderPlugin(), // 作用是处理匹配.vue文件的rule
      !isDev && new MiniCssExtractPlugin({ // 将css单独打包成一个文件的插件，它为每个包含css的js文件都创建一个css文件。它支持css和sourceMaps的按需加载。
        filename: 'main.css'
      }),
      new HtmlWebpackPlugin({ // 自动生成html文件
        template: path.resolve(__dirname, '../public/index.html'), // 配置生成HTML文件的模板
        filename: 'index.html', // 生成html文件的命名
        minify: !isDev && {
          removeComments: !isDev, // 移除注释
          removeAttributeQuotes: !isDev, // 移除引号
          collapseWhitespace: !isDev // 折叠空白
        }
      }),
      new HtmlWebpackTagsPlugin({ // 在html文件中插入引用文件
        tags: [
          {
            path: '//res.wx.qq.com/open/js/jweixin-1.4.0.js',
            type: 'js',
            publicPath: false, //不在路径面前应用publicPath 
          }
        ],
        append: false, //插入顺序在打包文件前面
      }),
      new CleanWebpackPlugin({ // 输出打包文件前清除旧的打包文件
        cleanOnceBeforeBuildPatterns: ['**/*', '!\.git', '!\.git/**/*'] // 旧版不会删除非打包文件目录，新版会，所以需要配置排除.git目录及目录下文件
      })
    ].filter(Boolean)
  };
  if (isDev) {
    return merge(base, dev);
  } else {
    return merge(base, prod);
  }
}