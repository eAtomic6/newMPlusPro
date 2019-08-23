<template>
  <div class="container">
    <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    <div class="main">
      <div class="list" v-if="list.length>0">
        <div class="count">共<span>{{total}}</span>个客户</div>
        <deal-record :list="list"></deal-record>
      </div>
      <div class="noData" v-if="list.length===0">
        <img src="../assets/img/nodeal.png">
        <span>暂无成交客户</span>
      </div>
    </div>
  </div>
</template>
<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import dealRecord from '@/components/dealRecord'

export default {
  mixins: [MIXINS],
  components: {
    topbar,
    dealRecord
  },
  data(){
    return{
      title:'成交列表',
      getBack:true,
      total:0,
      list:[],
    }
  },
  methods:{
    getList(){
      this.$ajax.get('/api/personal/countDealList').then(res=>{
        res=res.data
        if(res.status===200){
          this.list=res.data.countDealList
          this.total=res.data.totalCustomer
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    }
  },
  created(){
    this.getList()
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/CSS/config";
.main{
  overflow-y: scroll;
}
.count{
  padding:0 30px;
  background: @bg-f5;
  color: @color-assist;
  font-size: @font-size-s;
  font-size: @font-size-s;
  >span{
    color: @color-green;
    font-size: @font-size-xxl;
    font-weight: bold;
  }
}
.noData{
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  img{
    width: 240px;
    height: 280px;
  }
  span{
    display: block;
    padding: 30px 0;
    font-size: @font-size-m;
    color: @color-main;
  }
}
</style>