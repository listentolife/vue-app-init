/**
 * 生成图片的Blob对象
 * @param {*} base64Data 图片URL
 */
const convertBase64UrlToBlob = function (base64Data) {
  const arr = base64Data.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)

  while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {type: mime})
}

/**
 * 使用canvas压缩图片，返回一个压缩过的图片的URL格式的Base64字符串
 * @param {*} dataURL 图片的URL
 * @param {*} options 压缩图片的配置
 */
const compressByCanvas = function (dataURL, options) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.src = dataURL
    img.onload = function () {
      const self = this
      const originWidth = self.width
      const originHeight = self.height

      const type = options.type
      const scale = options.scale && options.scale > 0 && options.scale <= 1 ? options.scale : 1;
      const quality = options.quality && options.quality > 0 && options.quality <= 1 ? options.quality : 1;
      let width = originWidth
      let height = originHeight

      if (options.width) {
        width = options.width
      } else if (options.height) {
        width = originWidth / originHeight * options.height
      } else if (options.maxWidth && originWidth > options.maxWidth) {
        width = options.maxWidth
      } else if (options.maxHeight && !options.height && originHeight > options.maxHeight) {
        width = originWidth / originHeight * options.maxHeight
      } else {
        width = originWidth * scale
      }

      if (options.height) {
        height = options.height
      } else if (options.width) {
        height = originHeight / originWidth * options.width
      } else if (options.maxHeight && originHeight > options.maxWidth) {
        height = options.maxHeight
      } else if (options.maxWidth && !options.width && originWidth > options.maxWidth) {
        height = originHeight / originWidth * options.maxWidth
      } else {
        height = originHeight * scale
      }

      const canvasNode = document.createElement('canvas')
      const ctx = canvasNode.getContext('2d')
      const attrWidth = document.createAttribute("width")
      attrWidth.nodeValue = width
      const attrHeight = document.createAttribute("height")
      attrHeight.nodeValue = height
      canvasNode.setAttributeNode(attrWidth)
      canvasNode.setAttributeNode(attrHeight)
      ctx.drawImage(self, 0, 0, width, height)

      const base64Data = canvasNode.toDataURL(type, quality)

      resolve(base64Data)

    }
  })
}

/**
 * 实现文件读取成URL格式的Base64字符串
 * @param {*} file 需要读取的文件
 */
const fileReader = function (file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.readAsDataURL(file) // 读取指定的Blob中的内容，完成后result属性将包含一个data: URL格式的Base64字符串以表示所读取文件的内容

    reader.onload = function () {
      let data = this.result
      resolve(data)
    }
  })
}


/**
 * 
 * @param {*} file 图片文件
 * @param {*} options 配置项
 * {
 *   type      压缩后图片类型，默认为原图片类型
 *   quality   压缩质量，默认为1，最大值为1，最小值为0.2
 *   scale     压缩比例，默认为1，最大值为1  
 *   width     压缩后宽度，默认为图片原宽度，默认高度保持原图比例，如果压缩后高度有预设值，则按预设值
 *   height    压缩后高度，默认为图片原高度，同上
 *   maxWidth  压缩后最大宽度，图片宽度大于此值将自动定比例压缩到最大宽度
 *   maxHeight 压缩后最大高度，图片高度大于此值将自动定比例压缩到最大高度
 *   优先级：width = height > maxWidth = maxHeight > scale
 * }
 */
export const photoCompress = function (file, options) {
  return new Promise(async (resolve, reject) => {

    if (!(file instanceof File)) {
      reject(new Error('not a File instance!'))
    }

    if (!(/image\/\s*/g.test(file.type))) {
      reject(new Error('not an image File!'))
    }

    const data = await fileReader(file)

    const base64Data = await compressByCanvas(data, Object.assign({}, {
      type: file.type
    }, options))

    const blobData = convertBase64UrlToBlob(base64Data)

    const newFile = new File([blobData], file.name, {type: blobData.type})
    console.log('image compress: ', file, newFile)
    resolve({blobData, newFile})
  })
}

/**
 * 把图片文件转为可展示在页面上的URL
 * @param {*} file 图片文件
 */
export const convertToImageUrl = function (file) {
  let url = ''
  if (window.URL.createObjectURL) {
    url = window.URL.createObjectURL(file)
  } else if (window.createObjectURL) {
    url = window.createObjectURL(file)
  } else if (window.webkitURL) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}
