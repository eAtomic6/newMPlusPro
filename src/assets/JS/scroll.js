import BScroll from 'better-scroll'

const SCROLL = {
  data(){
    return{
      scroll:null,
      currentPage:1,//当前页
      
      total:0,//列表总数
      scrollList:[],//列表数组
    }
  },
  mounted(){
    this.$nextTick(()=>{
      // debugger
      this.scroll = new BScroll(this.$refs.wrapper,{
        click:true,
        scrollY:true,
        pullDownRefresh:{
          threshold: 30,
          stop: 20
        },
        pullUpLoad:{
          threshold: -30,
          stop: 20
        }
      })
      this._initPullDownRefresh()
      this._initPullUp()
      //添加自定义滚动事件
      this._initDiyFn()
    })
  },
  methods: {
    _initPullDownRefresh:function () {
      this.scroll.on('pullingDown',()=>{
        // debugger
        // alert(`下拉刷新`)
        this.scroll.finishPullDown()
        this.scroll.refresh()
      })
    },
    _initPullUp:function () {
      this.scroll.on('pullingUp',()=>{
        this.currentPage+=1
        if(this.total===this.scrollList.length){
          return
        }else {
          this.$ajax.get(this.listRequest,this.newPage).then(res=>{
            res = res.data
            if(res.status === 200){
              this.total = res.data.total
              this.scrollList = res.data.list.concat(this.scrollList)
            }
          })
        }
        this.scroll.finishPullUp()
        this.scroll.refresh()
      })
    },
    _initDiyFn(){}
  }
}

export {
  SCROLL
}
