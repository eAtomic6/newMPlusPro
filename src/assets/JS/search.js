const SEARCH = {
  methods: {
    _reqApi(url, param, listName = 'list') {
      this.$store.commit('SHOW_LOADING', true)
      this.$ajax
        .get(url, param, 'pt')
        .then(res => {
          res = res.data
          if (res.status === 200) {
            if (this.title === '客户搜索') {
              let listStr = 'my'
              if (this.activeName === '私客') {
                listStr = 'my'
              } else if (this.activeName === '公客') {
                listStr = 'public'
              } else if (this.activeName === '联动') {
                listStr = 'link'
              }
              this.scrollList = this.scrollList.concat(res.data[listStr].list)
              if (this.userNames.length === 0) {
                this.total = res.data['my'].total
              }
              if (this.userNames.length >= 2) {
                this.userNames[0].tatal = res.data['my'].total
                this.userNames[1].tatal = res.data['public'].total
                this.total = this.userNames[0].tatal + this.userNames[1].tatal
                if (this.userNames.length === 3) {
                  this.userNames[2].tatal = res.data['link'].total
                  this.total += this.userNames[2].tatal
                }
              }
            } else {
              this.total =
                listName === 'noticeList' ? res.data.count : res.data.total
              this.scrollList = this.scrollList.concat(res.data[listName])
            }
            this.$store.commit('SHOW_LOADING', false)
          }
        })
        .catch(err => {
          this.$store.commit('SHOW_LOADING', false)
          this._catchMess(err)
        })
    },
    /**
     * 我的跟进
     */
    followSearch: function(param) {
      this._reqApi('/api/records/my', param)
    },
    /**
     * 项目搜索
     */
    houseSearch: function(param) {
      this._reqApi('/api/appProjectSearch', param)
    },
    /**
     * 服务记录
     */
    ServicesSearch: function(param) {
      this._reqApi('/api/services', param)
    },
    /**
     * 客户搜索
     */
    CustomersSearch: function(param) {
      this._reqApi('/api/customers/search', param)
    },
    /**
     * 公告
     */
    NoticeSearch: function(param) {
      this._reqApi('/api/notice/list', param, 'noticeList')
    },
    /**
     * 意向项目
     */
    IntentionalProjectSearch: function(param) {
      this._reqApi('/api/intentionalProject', param)
    },
    /**
     * 组织架构
     */
    WorkMateSearch: function(param) {
      this._reqApi('/api/personal/workmate', param)
    },
    // _toastMess(text) {
    //   this.$vux.toast.text(text, 'middle')
    // },
    _catchMess(err) {
      this.$vux.toast.text(this.$error[err.response.status], 'middle')
    },
  }
}

export { SEARCH }
