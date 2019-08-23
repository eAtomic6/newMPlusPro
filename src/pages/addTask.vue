<template>
    <div class="container">
      <topbar :title="title" :back="toBack" :rightTool="rightTool" v-on:goBack="goBack"></topbar>
      <div class="main">
        <div class="content new-task">
          <p class="iconfont icon-back-rotate" @click="showTime"><label>设置月份</label><span>{{!obj.time?'请设置任务月份':obj.time}}</span></p>
          <p>设置每日任务目标</p>
          <div class="context">
            <p>
              <label>每日录客</label>
              <input class="input-info" type="number" v-model="obj.newCustomer" @input="cutNumber('newCustomer')" placeholder="输入每日录客目标数量">
            </p>
            <p>
              <label>每日跟进</label>
              <input class="input-info" type="number" v-model="obj.follow" @input="cutNumber('follow')" placeholder="输入每日跟进目标数量">
            </p>
            <p>
              <label>每日报备</label>
              <input class="input-info" type="number" v-model="obj.report" @input="cutNumber('report')" placeholder="输入每日报备目标数量">
            </p>
            <p>
              <label>每日带看</label>
              <input class="input-info" type="number" v-model="obj.lookHouse" @input="cutNumber('lookHouse')" placeholder="输入每日带看目标数量">
            </p>
          </div>
        </div>
        <p class="submit-btn" @click="create">确定</p>
      </div>
    </div>
</template>

<script>
  import topbar from '@/components/topbar'
  import {MIXINS} from "@/assets/JS/mixins";

  export default {
    name: "add-task",
    mixins: [MIXINS],
    components:{
      topbar
    },
    data(){
      return{
        title:'新增任务',
        toBack: true,
        rightTool: false,
        obj:{
          time:'',
          newCustomer:'',
          follow:'',
          report:'',
          lookHouse:''
        }
      }
    },
    destroyed(){
      this.$vux.datetime.hide()
    },
    methods:{
      showTime:function () {
        this.$vux.datetime.show({
          format:'YYYY-MM',
          minYear:'2000',
          maxYear:'2100',
          confirmText:'确定',
          cancelText:'取消',
          onConfirm:(val)=>{
            this.obj.time = `${val.split('-')[0]}年${val.split('-')[1]>9?val.split('-')[1]:val.split('-')[1].split('0')[1]}月`
          }
        })
      },
      /**
       * 添加任务
       */
      create:function () {
        this.noNull(this.obj).then(res=>{
          this.$ajax.post('/api/task',this.obj).then(res=>{
            // debugger
            res = res.data
            if(res.status === 200){
              this.$vux.toast.text(res.message,'middle')
              this.goBack()
            }else {
              this.$vux.toast.text(res.message,'middle')
            }
          }).catch((err) => {
            this.$vux.toast.text(this.$error[err.response.status], 'middle')
          })
        }).catch(error=>{
          this.$vux.toast.text('填写完整信息','middle')
        })
      },
      /**
       * 限制输入长度
       */
      cutNumber:function (item) {
        this.obj[item] = this.obj[item].replace('\/.\g','')
        if(this.obj[item].length>4){
          console.log('test')
          this.obj[item]=this.obj[item].substr(0,4)
        }else{
          // debugger
          let arr = this.obj[item].split('')
          if(arr[0]===0){
            arr.splice(0,1)
          }
          this.obj[item] = parseInt(arr.join(''))
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/CSS/config";
  .new-task{
    >p{
      height: 100px;
      display: flex;
      align-items: center;
      padding: 0 30px;
      >label{
        margin-right: 60px;
      }
      &:first-of-type{
        border-top: 1px solid @border-eb;
        border-bottom: 1px solid @border-eb;
        >span{
          color: @color-assist;
        }
      }
      &:nth-of-type(2){
        background-color: @bg-f5;
        color: @color-minor;
      }
    }
    .context{
      margin: 0 30px;
      >p{
        height: 100px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid @border-eb;
        >label{
          margin-right: 60px;
        }
      }
    }
  }
  .submit-btn{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: @color-green;
    height: 100px;
    font-size: @font-size-xl;
    color: @color-white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
.content{
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 100px;
  background-color: @bg-ff;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
