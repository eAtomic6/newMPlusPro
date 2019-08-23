<template>
<div class="container">
  <topbar :back="back" v-on:goBack="goBack">
    <p class="topbar-opera-btn" slot="topbar-content" @click="toChange">{{user.name}}-{{user.depName}}</p>
    <span slot="topbar-right" class="iconfont icon-added topbar-right" @click="toCreate"></span>
  </topbar>
  <div class="content">
    <div class="task-total">
      <div class="task-total-title">
        <span>{{getMonthStr|monthFormatter}}任务月统计</span>
        <p @click="showTime">完成任务天数：<span>{{taskDate}}</span>天<i class="iconfont icon-right_arrow"></i></p>
      </div>
      <ul class="task-list task-total-list">
        <li>
          <p>录客</p>
          <p>跟进</p>
          <p>报备</p>
          <p>带看</p>
        </li>
        <li>
          <p v-for="item in total" :key="item.id"><span>{{item.count|nullFormatter}}</span>/{{item.task|nullFormatter}}</p>
        </li>
      </ul>
    </div>
    <div class="task-details">
      <p class="task-details-title">任务明细</p>
      <ul class=" task-list task-details-list">
        <li>
          <p>日期</p>
          <p>录客</p>
          <p>跟进</p>
          <p>报备</p>
          <p>带看</p>
        </li>
        <li v-for="item in list" :key="item.id">
          <p class="split-time"><span>{{item.date}}</span><span>{{item.week}}</span></p>
          <p :class="[item.newCustomer<taskTotal.newCustomer?'tip-red':'']"><span>{{item.newCustomer}}</span>/{{taskTotal.newCustomer}}</p>
          <p :class="[item.follow<taskTotal.follow?'tip-red':'']"><span>{{item.follow}}</span>/{{taskTotal.follow}}</p>
          <p :class="[item.report<taskTotal.report?'tip-red':'']"><span>{{item.report}}</span>/{{taskTotal.report}}</p>
          <p :class="[item.look<taskTotal.lookHouse?'tip-red':'']"><span>{{item.look}}</span>/{{taskTotal.lookHouse}}</p>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
  import topbar from '@/components/topbar'
  import {MIXINS,FILTERS} from "@/assets/JS/mixins";
  import {TIME} from "../assets/JS/mixins";

  export default {
    name: "task",
    mixins: [MIXINS,FILTERS],
    components:{
      topbar
    },
    data(){
      return{
        title: '黄晓明-武汉商圈',
        operationBtn: true,
        back: true,
        add: true,
        user: {},
        total:[
          {
            id:1,
            success:12,
            all:120
          },
          {
            id:2,
            success:123,
            all:200
          },
          {
            id:3,
            success:18,
            all:60
          },
          {
            id:4,
            success:2,
            all:30
          }
        ],
        list:[],
        taskTotal:{
          newCustomer:0,
          follow:0,
          report:0,
          lookHouse:0
        },
        taskDate:0,
        timePicker:'',
        canSelcet: true
      }
    },
    created(){
      this.getTask()
    },
    destroyed(){
      this.$vux.datetime.hide()
    },
    methods:{
      /**
       * 获取任务报表
       */
      getTask:function () {
        let param = {}
        let staffId = localStorage.getItem('staffID')
        if(this.timePicker.length>0){
          param.time = this.timePicker
        }
        if(staffId){
          param.empId = staffId
          localStorage.removeItem('staffID')
        }
        this.$ajax.get('/api/task/report',param).then(res=>{
          res=res.data
          if(res.status === 200){
            this.user = Object.assign({},this.user,res.data.emp)
            this.total = res.data.monthCount
            this.list = res.data.dayList
            this.taskTotal = res.data.task
            this.taskDate = res.data.count
          }else {

          }
        }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        })
      },
      toCreate:function () {
        this.$router.push({
          path: 'addTask'
        })
      },
      toChange:function () {
        if(!this.canSelcet) return;
        this.haveChildDep({id:this.user.depId}).then(res=>{
          //判断是否为部门主管或所在部门有下级子部门
          if(res||this.user.isDepMaster){
            this.$router.push({
              path:'changeTask',
              query:{
                departmentId:this.user.depId,
                departmentName:this.user.depName
              }
            })
          }else {
            // this.$vux.toast.text('权限不足','middle')
            this.canSelcet = false
          }
        })
      },
      /**
       * 是否有子部门
       */
      haveChildDep:async function (param) {
        let state = await this.$ajax.get('/api/employee/countByDepartment',param).then(res=>{
          res = res.data
          if(res.status === 200){
            return res.data.length>0?true:false
          }
        }).catch((err) => {
          return false
        })
        return state
      },
      /**
       * 选择时间段
       */
      showTime: function () {
        this.$vux.datetime.show({
          format: 'YYYY-MM',
          minYear: '2000',
          maxYear: '2100',
          confirmText: '确定',
          cancelText: '取消',
          onConfirm: (val)=>{
            this.timePicker= `${val.split('-')[0]}年${val.split('-')[1]>9?val.split('-')[1]:val.split('-')[1].split('0')[1]}月`
            this.getTask()
          }
        })
      }
    },
    computed:{
      getMonthStr:function () {
        // debugger
        if(!this.timePicker){
          let date = new Date()
          return date.getMonth()+1
        }else {
          return parseInt(this.timePicker.split('年')[1].split('月')[0])
        }
      }
    },
    filters:{
      nullFormatter:function (val) {
        if(!val){
          return 0
        }else {
          return val
        }
      }
    }
  }
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";
.topbar-opera-btn{
  border: 1px solid @color-orange;
  padding: 0 40px;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  color: @color-orange;
  background-color: @bg-FB;
  font-size: @font-size-l;
  line-height: 1.6;
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.task-total{
  &-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 35px 0;
    >span{
      @font-size-h3();
    }
    >p{
      color: @color-assist;
      display: flex;
      align-items: center;
      >span{
        @font-size-h2();
        color: @color-orange;
      }
      >i{
        font-size: @font-size-icon;
        color: @color-base;
      }
    }
  }
  &-list{
    >li{
      border: 1px solid @border-eb;
      >p{
        border-right: 1px solid @border-eb;
        &:last-of-type{
          border: 0px;
        }
        >span{
          @font-size-h2();
          color: @color-orange;
        }
      }
      &:nth-of-type(odd){
        border-bottom: 0px;
      }
    }
  }
}
.task-details{
  margin-top: 30px;
  &-title{
    @font-size-h3();
    padding: 30px 0;
  }
  &-list{
    >li{
      padding: 20px;
      &:first-of-type{
        padding: 0;
      }
      .split-time{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        >span:first-of-type{
          font-size: @font-size-xs;
          color:@color-assist;
        }
      }
      .tip-red{
        color: @color-red;
      }
    }
  }
}
.task-list{
  >li{
    display: flex;
    >p{
      flex: 1;
      min-height: 80px;
      display: inherit;
      justify-content: center;
      align-items: center;
    }
    &:nth-of-type(odd){
      background-color: @bg-f5;
    }
  }
}
  .content{
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 30px;
    background-color: @bg-ff;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
