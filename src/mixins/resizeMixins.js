/**
 * rem适配方案，监听resize事件，把body的宽度除以12.42作为font-size的值，rem全部以这个font-size值为单位。
 * 如果配合postcss-pxtorem，则同样可以用这套方案，然后在开发期间直接写px，会自动打包转换为rem写法
 * 如果使用vant-ui，则建议改成body宽度除以10作为font-size的值，因为vant内部的样式是body宽度除以10作为font-size的值的，同时postcss-pxtorem的rootValue也要改成375/10=37.5
 */
const { body, documentElement } = document

export default {
  beforeMount () {
    window.addEventListener('resize', this.resetFontSize)
  },
  mounted () {
    this.resetFontSize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resetFontSize)
  },
  methods: {
    resetFontSize () {
      console.log('resetFontSize')
      const rect = body.getBoundingClientRect()
      console.log('页面宽度： ', rect.width)
      documentElement.style.fontSize = (rect.width / 12.42) + 'px'
    }
  }
}