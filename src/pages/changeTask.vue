<template>
  <div class="container">
    <topbar :title="title" :back="toBack" :rightTool="rightTool" v-on:goBack="goBack"></topbar>
    <div class="main">
      <c-scroll class="content" :data="scrollList" :total="total" :listenScroll="true" @scrollToEnd="getStaffList(newPage)">
        <div class="city">
          <header ref="tip">
            <div class="city-tips" ref="tipContent">
              <span v-for="(item,index) in routeArr" :key="item.id" ref="tipItem" :class="[activeDepartment.name===item.depName?'active':'']" style="white-space: nowrap;">{{item.depName}}<span class="crumb" v-if="(routeArr.length>1)&&(index<routeArr.length-1)">/</span></span>
            </div>
          </header>
          <ul class="list city-list" v-show="departmentList.length>0">
            <li>组织机构</li>
            <li v-for="item in departmentList" :key="item.id" @click="choseDepartment(item)">
              <span>{{item.depName}}</span>
              <p v-if="item.count>0">{{item.count}}<i class="iconfont icon-right_arrow"></i></p>
            </li>
          </ul>
        </div>
        <!--<c-scroll :data="scrollList" :total="total" :listenScroll="true" @scrollToEnd="getStaffList(newPage)">-->
          <div class="staff" :class="[departmentList.length>0?'':'no-data']">
            <ul class="list staff-list">
              <li>公司员工</li>
              <li class="iconfont" v-for="item in scrollList" :class="{'active':active===item.id}" :key="item.id"
                  @click="choseStaff(item)">
                <p class="list-item-index" v-if="item.headImg"><img :src="item.headImg"></p>
                <p class="list-item-index" v-else>{{item.name|getName}}</p>
                <div class="list-item" :class="{'manager':item.manager}">
                  <p>{{item.name}}<span v-if="item.manager">主管</span></p>
                  <p v-if="item.manager">总账号管理员</p>
                </div>
              </li>
            </ul>
          </div>
        <!--</c-scroll>-->
      </c-scroll>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import topbar from '@/components/topbar'
  import {MIXINS} from "@/assets/JS/mixins";

  export default {
    name: "change-task",
    mixins: [MIXINS],
    components: {
      topbar
    },
    data() {
      return {
        title: '商圈',
        toBack: true,
        rightTool: false,
        departmentList:[],
        total:0,
        currentPage:1,
        scrollList: [],
        active: 1,
        activeDepartment:{
          id:0,
          name:''
        },//当前组织
        routeArr:[]
      }
    },
    created(){
      this.getMe()
    },
    mounted(){
      let mineMsg = JSON.parse(localStorage.getItem("userMessage"));
      this.isDepMaster = mineMsg.isDepMaster;
      let param = {
        id:this.$route.query.departmentId,
        depName:this.$route.query.departmentName,
      }
      this.activeDepartment.id=param.id
      this.activeDepartment.name=param.depName
      // this.title = param.depName
      if(param.id){
        this.getData(param)
        if(this.isDepMaster) {
          this.getStaffList(this.newPage)
        }
        this.routeArr.push(param)
      }
    },
    methods: {
      //此接口调用是为了刷新本地存储的个人信息，如pc端修改了所拥有的权限，app端要及时更新
      getMe() {
        this.$ajax
          .get('api/personal/me')
          .then(res => {
            res = res.data
            if (res.status === 200) {
              this.mine=res.data
              localStorage.setItem('userMessage', JSON.stringify(res.data))
            }
          })
          .catch(err => {
            localStorage.setItem("userMessage", JSON.stringify({}));
            this.$vux.toast.text(this.$error[err.response.status], 'middle')
          })
      },
      _initScroll() {
        // debugger
        let width = 0
        if (!this.$refs.tip) {
          return
        }
        this.$nextTick(()=>{
          for(let i=0;i<this.routeArr.length;i++){
            // debugger
            console.log(this.$refs.tipItem[i].offsetWidth)
            width += this.$refs.tipItem[i].offsetWidth
          }
          this.$refs.tipContent.style.width = `${width}px`
          if (!this.scroll) {
            this.scroll=new BScroll(this.$refs.tip, {
              startX:0,
              click:true,
              scrollX:true,
              scrollY:false,
              eventPassthrough:'vertical'
            })
          }else{
            this.scroll.refresh()
          }
        })
      },
      /**
       * 获取部门列表
       */
      getData:function (param) {
        this.$ajax.get('/api/employee/countByDepartment',param).then(res=>{
          res = res.data
          if(res.status === 200){
            this.departmentList = res.data
          }
        }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        })
      },
      /**
       * 获取部门员工列表
       */
      getStaffList:function (param) {
        this.$ajax.get('/api/employee/list',param).then(res=>{
          res = res.data
          if(res.status === 200){
            this.total = res.data.total
            if (this.total === this.scrollList.length) {
              return
            } else {
              this.currentPage += 1
              this.scrollList = this.scrollList.concat(res.data.list)
            }
          }
        }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        })
      },
      /**
       * 选择组织部门
       * @param item
       */
      choseDepartment:function (item) {
        let param = {
          id:item.id
        }

        this.activeDepartment.id=item.id
        this.activeDepartment.name=item.depName
        this.currentPage = 1
        this.scrollList = []
        this.getData(param)
        this.getStaffList(this.newPage)
        this.routeArr.push(item)
        /*this.routeArr.forEach(res=>{
          if(item.id!==res.id){
            this.routeArr.push(item)
          }
        })*/
      },
      choseStaff: function (item) {
        this.active = item.id
        localStorage.setItem('staffID',item.id)
        this.$router.go(-1)
      },
      /**
       * 返回
       */
      goBack:function () {
        // debugger
        let length = this.routeArr.length
        if(length===1){
          this.$router.go(-1)
        }else{
          this.routeArr.pop()
          let param = {
            id: this.routeArr[this.routeArr.length-1].id,
            name: this.routeArr[this.routeArr.length-1].depName
          }
          this.activeDepartment.id=param.id
          this.activeDepartment.name=param.name
          this.currentPage=1
          this.scrollList = []
          this.total = 0
          this.getData(param)
          if(this.isDepMaster || length !== 2) {
            this.getStaffList(this.newPage)
          }
        }
      }
    },
    computed:{
      newPage:function () {
        let param = {
          depId:this.activeDepartment.id,
          pageNum:this.currentPage,
          pageSize:10
        }
        return param
      }
    },
    filters: {
      getName:function (name) {
        if(name.length>2){
          return name.substr(-2,2)
        }else {
          return name
        }
      }
    },
    watch:{
      routeArr:function (val) {
        // debugger
        this._initScroll()
        this.title = val[val.length-1].depName
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/CSS/config";

  .main {
    background-color: @bg-f5;
    position: relative;
    /*> p {
      position: absolute;
      top: 80px;
      left: 0;
      right: 0;
      height: 100px;
      z-index: 10;
      background-color: @bg-f5;
      padding: 0 30px;
      display: flex;
      align-items: center;
      overflow-x: auto;
      color: @color-green;
    }*/
  }
  .content{
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .crumb{
    padding: 0 10px;
  }

  .list {
    padding: 0 30px;
    background-color: @bg-ff;
    > li {
      padding: 35px 0;
      border-bottom: 1px solid @border-eb;
      &:first-of-type {
        @font-size-h3();
        font-size: @font-size-xl;
        border: 0px;
      }
      &:nth-of-type(2){
        padding-top: 0px;
      }
    }
  }

  .city {
    > header {
      background-color: @bg-f5;
      padding: 30px 0;
      color: @color-assist;
      .city-tips{
        padding: 0 30px;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
        >span{
          &.active{
            color: @color-blue;
          }
        }
      }
    }
    &-list {
      padding: 0 30px;
      background-color: @bg-ff;
      > li {
        padding: 35px 0;
        border-bottom: 1px solid @border-eb;
        &:nth-of-type(n+1) {
          display: flex;
          justify-content: space-between;
          > p {
            color: @color-assist;
            display: inherit;
            align-items: center;
            .iconfont {
              font-size: @font-size-icon-m;
              margin-left: 20px;
            }
          }
        }
        &:last-of-type {
          border: 0px;
        }
      }
    }
  }

  .staff {
    margin-top: 20px;
    &.no-data{
      margin: 0px;
    }
    &-list {
      > li:nth-of-type(n+1) {
        display: flex;
        &.active{
          position: relative;
          &:after{
            content: '\e621';
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            color: @color-green;
            font-size: @font-size-icon-m;
          }
        }

        .list-item {
          flex: 1;
          display: inherit;
          > p {
            &:first-of-type {
              align-self: center;
              > span {
                border: 1px solid @color-grey;
                display: inline-block;
                color: @color-grey;
                margin-left: 10px;
                padding: 0 10px;
                border-radius: @border-radiaus;
                font-size: @font-size-xs;
              }
            }
          }
          &.manager {
            display: flex;
            flex-direction: column;
            > p {
              &:first-of-type {
                align-self: initial;
              }
              &:nth-of-type(2) {
                color: @color-assist;
                font-size: @font-size-s;
              }
            }
          }
          &-index {
            width: 74px;
            height: 74px;
            background-color: @color-blue;
            color: @color-white;
            border-radius: 50%;
            display: inherit;
            justify-content: center;
            align-items: center;
            font-size: @font-size-xs;
            margin-right: 25px;
            > img {
              width: 74px;
              height: 74px;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
</style>
