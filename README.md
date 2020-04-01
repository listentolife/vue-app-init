# vue-app-init

一个手写webpack配置，基于vue框架的初始化app项目

## 项目目录

### build

webpack配置文件目录，分base，dev和prod。其中dev配置测试环境打包配置，prod配置生产环境打包配置，base中使用`webpack-merge`合并不同环境中的配置。

### public

主要存放html模板

### src

项目主代码目录。

#### api

项目请求目录，里面request.js中是封装过的axios，支持axios的cancelToken，可以根据项目的实际情况增加头部信息的修改。axios的封装是以类的形式封装，然后导出的是一个实例，所以还可以进一步修改，保证每次导出独立的实例。

baseUrl.js是配置请求域名，methods.js是请求类型的集合，urls.js是请求的路径集合，home.js是封装请求的示例。

#### common

项目一般的资源目录，有fonts目录，images目录，js目录和scss目录，分别存放icon，图片，js方法及项目使用的全局样式，统一scss的变量和mixins。

#### components

存放组件的目录

#### mixins

存放vue mixins。目前里面有全局mixins及rem布局需要的resize mixins，分别会在main.js及app.js中引入。

#### router

路由集合。index.js为路由入口，premission.js为路由守卫，负责统一处理进入路由前后的处理。modules为路由分模块的集合，各个分块会在index中引入。

#### store

vuex状态树。index.js为store的入口，modules为多级状态树的集合，在index.js中整合后导入store中。使用示例在home.vue中。mutation-type是mutation类型的集合。

还有一种写法是把state，actions，getters和mutations分别放在不同的文件中，然后在index.js引入导入，但是如果再使用modules就感觉解耦方式不统一，而且一般这样的情况下就不使用modules了，后期项目变大，各个分块也会变大。而如果是用modules，其实一般只会把基础state放在index.js中，可以让每个modules都不会很大，代码容易读。

#### view

路由对应的页面组件。每个页面组件尽量以就近原则建自己的components组件目录及images目录，方便维护。

#### App.vue

挂载组件，使用了router-view组件跟resizeMixins。这个组件里可以完成一些项目数据初始化的操作。

#### main.js

引入vue，store，router，App组件，声明vue实例并挂载。同时会引入路由守卫，全局样式，导入全局mixins等。

### .babelrc

webpack中babel-loader的配置文件。其实是babel-loader会调@babel/core，然后@babel/core会去找babel配置或配置文件。配置文件中有注释解释用法。

### .browserslistrc

浏览器支持的配置

### .gitignore

git排除目录列表

### package-lock.json

一般解释是package-lock.json 是在 `npm install`时候生成一份文件，用以记录当前状态下实际安装的各个npm package的具体来源和版本号。简单的说明就是用来锁定依赖版本的。

### package.json

项目信息，仓库地址，打包环境跟线上环境依赖列表，script命令等。

### postcss.config.js

postcss-loader的配置文件，只配置了增加前缀。

## 部分处理方案

### 测试环境调试方案

测试环境调试方案主要使用eruda进行调试，本地环境跟测试环境也做了区分，本地环境将不开启eruda调试。

### 屏幕适配方案

屏幕适配方案主要是使用rem布局，接受px转rem或直接写rem的写法。

如果直接写rem，可以考虑不使用postcss-pxtorem的转换，直接写rem。如果希望只写px，可以直接使用，但如果需要页面直接用px布局，可以使用`Px`或`PX`的写法，postcss-pxtorem会自动忽略掉。

目前初始化状态下是以body宽度为12.42rem为基准的适配，使用了postcss-pxtorem依赖，可以直接写px或混用rem。在App挂载组件中引入了resize Mixins，用于监听window的resize事件，动态计算font-size并赋到html标签。

如果使用vant-ui及postcss-pxtorem的转换，则建议改用以body宽度为10rem为基准的适配，同时不配置postcss-pxtorem的`exclude: /node_modules/i`，可以得到最佳效果。

### 本地图片压缩方案

本地图片压缩方案主要是利用`canvas`来压缩图片的大小，压缩的图片可配置项比较多，可配置参数及具体实现可以到`/src/common/js/photo-compress.js`中查看。

### 本地缓存封装

本地缓存是使用`good-storage`进行二次封装，只需要配置需要缓存的字段，自动生成set，get及remove功能的函数，适用于单独操作缓存的字段。具体实现可以到`/src/common/js/cache.js`中查看。
