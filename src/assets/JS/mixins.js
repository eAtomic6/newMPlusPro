import BMap from 'BMap'

const MIXINS = {
  methods: {
    // 获取位置
    getEl(pageN) {
      this.pageNum = pageN;
      this.savedY = this.$refs.bScroll ? this.$refs.bScroll.scroll.y : 0
      this.$store.commit('isBackToTrue')
    },
    goOldEl() {
      setTimeout(() => {
     
        this.$store.commit('isBackToFalse')
        if (this.$refs.bScroll && this.savedY) {
          this.$refs.bScroll.scrollTo(0,this.savedY)
        }
      }, 100)
    },
    /*
      进入选择员工界面 
    */
    goSelect() {
      this.$router.push({
        path: '/organization',
        query: {
          // depId: this.userData.depId,
          // depName: this.userData.depName,
          isSelect: '选择',
          path: this.myPath
        }
      })
    },
    goBack: function () {
      this.$router.go(-1)
    },
    goHome: function () {
      this.$router.push('/home')
    },
    getImg: function (src) {
      return require(`@/assets/img/${src}`)
    },
    noNull: function (param) {
      return new Promise((resolve, reject) => {
        for (let item in param) {
          if (!param[item]) {
            reject()
          }
        }
        resolve()
      })
    },
    /**
     * 获取定位
     */
    getCityLoaction: function () {
      if (BMap) {
        let _that = this
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (result) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            console.log(JSON.stringify(result))
            return result.point
          } else {
            _that.$vux.toast.text(`定位失败：${this.getStatus()}`)
          }
        }, {
            enableHighAccuracy: true
          })
      }

    }
  }
}
const FILTERS = {
  filters: {
    phoneFormatter: function (val) {
      if (!val) {
        return '****'
      } else {
        return `${val.substr(0, 3)}****${val.substr(-4, 4)}`
      }
    },
    nameFormatter: function (val) {
      if (!val) {
        return '无'
      } else {
        return val.substr(0, 1)
      }
    },
    timeFormatter: function (val) {
      return TIME(val)
    },
    monthFormatter: function (val) {
      let str = ''
      switch (val) {
        case 1:
          str = '一月'
          break
        case 2:
          str = '二月'
          break
        case 3:
          str = '三月'
          break
        case 4:
          str = '四月'
          break
        case 5:
          str = '五月'
          break
        case 6:
          str = '六月'
          break
        case 7:
          str = '七月'
          break
        case 8:
          str = '八月'
          break
        case 9:
          str = '九月'
          break
        case 10:
          str = '十月'
          break
        case 11:
          str = '十一月'
          break
        case 12:
          str = '十二月'
          break
        default:
          str = '--'
      }
      return str
    },
    maxLen(value, len = 3) {
      if (value) {
        var re = /[\u4e00-\u9fa5]/;
        if (re.test(value)) {
          value = value.length > len ? value.substr(0, len) + "..." : value;
        } else {
          value = value.length > 2 * len ? value.substr(0, 2 * len) + "..." : value;
        }
        return value
      }
    }
  }
}

let TIME = function (val, type = 3) {
  if (!val) {
    return '----'
  } else {
    let time = new Date(val)
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    let d = time.getDate()
    let H = time.getHours()
    let M = time.getMinutes()
    let S = time.getSeconds()
    if (type === 1) {
      return `${y}-${m > 9 ? m : ('0' + m)}-${d > 9 ? d : ('0' + d)}`
    } else if (type === 2) {
      return `${y}年${m > 9 ? m : ('0' + m)}月${d > 9 ? d : ('0' + d)}日`
    } else {
      return `${y}-${m > 9 ? m : ('0' + m)}-${d > 9 ? d : ('0' + d)} ${H > 9 ? H : ('0' + H)}:${M > 9 ? M : ('0' + M)}:${S > 9 ? S : ('0' + S)}`
    }
  }
}

export {
  MIXINS,
  FILTERS,
  TIME
}