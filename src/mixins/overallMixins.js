import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'env',
      'platform',
      'isWechat'
    ])
  },
  methods: {
    formatTimestamp (timestamp = 0, format = '-') { // timestamp 为保留前10位的时间戳
      if (!timestamp) return ''

      timestamp = timestamp.toString() + '000' // 这样写可以兼容timestamp为字符串的情况
      let times = new Date(Number(timestamp))
      let timeY = times.getFullYear()
      let timeM = (times.getMonth() + 1 < 10 ? '0' + (times.getMonth() + 1) : times.getMonth() + 1)
      let timeD = (times.getDate() < 10 ? '0' + times.getDate() : times.getDate())
      let timeH = (times.getHours() < 10 ? '0' + times.getHours() : times.getHours())
      let timeMM = (times.getMinutes() < 10 ? '0' + times.getMinutes() : times.getMinutes())
      let timeSS = (times.getSeconds() < 10 ? '0' + times.getSeconds() : times.getSeconds())
      let normalDate = `${timeY}-${timeM}-${timeD}`
      if (format === 'minute') {
        normalDate = `${timeY}-${timeM}-${timeD} ${timeH}:${timeMM}`
      }
      if (format === 'date') {
        normalDate = `${timeY}.${timeM}.${timeD}`
      }
      if (format === 'hour-minute') {
        normalDate = `${timeH}:${timeMM}`
      }
      if (format === 'dateObj') {
        normalDate = {
          year: timeY,
          month: timeM,
          date: timeD,
          hour: timeH,
          minutes: timeMM,
          seconds: timeSS
        }
      }
      // 其他格式可以根据项目自行添加
      return normalDate
    },
  },
  filters: {
    timeToDescription (timestamp = 0) {
      let now = new Date().getTime()
      if (!timestamp) return ''
      timestamp = Number(timestamp.toString() + '000')
      if (timestamp > now) return ''
      let diff = parseInt(Math.abs((now - timestamp) / 1000))
      let timeDiffMM = parseInt(diff / 60)
      let timeDiffH = parseInt(timeDiffMM / 60)
      let timeDiffD = parseInt(timeDiffH / 24)
      let timeDiffW = parseInt(timeDiffD / 7)
      let timeDiffM = parseInt(timeDiffD / 30)
      let timeDiffY = parseInt(timeDiffD / 365)
      
      if (timeDiffY) {
        return timeDiffY === 1 ? '去年' : `${timeDiffY}年前`
      } else if (timeDiffM) {
        return timeDiffM === 1 ? '上个月' : `${timeDiffM}个月前`
      } else if (timeDiffW) {
        return timeDiffW === 1 ? '上周' : `${timeDiffW}周前`
      } else if (timeDiffD) {
        return timeDiffD === 1 ? '昨天' : `${timeDiffD}天前`
      } else if (timeDiffH) {
        return `${timeDiffH}小时前`
      } else if (timeDiffMM) {
        return `${timeDiffMM}分钟前`
      } else {
        return `刚刚`
      }
    }
  }
}
