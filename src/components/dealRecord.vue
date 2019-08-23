<!--  -->
<template>
    <div class="client-list">
        <li class="item" v-for="(item,index) in getList" :key="index" @click="goDetail(item)">
            <p class="pic">{{item.cName|nameFormatter}}</p>
            <div class="info">
                <p class="name">{{item.cName}}
                    <span class="tel" v-if="item.phone">{{item.phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}}</span>
                    <span class="lock" v-if="getIsDeal">+1</span>
                    <span class="lock" v-else>¥{{item.commission.toFixed(2)}}</span>
                </p>
                <p class="client text-ellipsis">结算时间：{{item.accountingTime}}</p>
                <p class="follow">结算项目：{{item.bName}}</p>
            </div>
        </li>
    </div>
</template>

<script>
import { FILTERS, TIME } from '@/assets/JS/mixins'

export default {
  name: 'dealRecord',
  mixins: [FILTERS],
  data() {
    return {

    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
     isDeal: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    goDetail(item){
      // this.$ajax.get('/api/deal/customer',{customerId:item.customerId}).then(res=>{
      //   res=res.data
      //   if(res.status===200){
      //      this.$router.push({
      //         path: 'customerInfoComplete',
      //         query: {
      //           c_id: item.customerId
      //         }
      //     })
      //   }else{
      //     this.$vux.toast.text(res.message, 'middle')
      //   }
      // }).catch(err => {
      //     this.$vux.toast.text(this.$error[err.response.status], "middle");
      //   });
   }
  },
  computed: {
    getList() {
      return this.list
    },
    getIsDeal(){
      return this.isDeal
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/CSS/config';
.client-list {
  .item {
    display: flex;
    padding: 20px 30px;
    list-style: none;
    margin-bottom: 20px;
    background: @bg-ff;
    .pic {
      margin-right: 24px;
      flex: 0 0 94px;
      width: 94px;
      height: 94px;
      line-height: 94px;
      font-size: 46px;
      border: 1px solid @color-green;
      border-radius: 50%;
      background: rgba(92,165,42,.1);
      text-align: center;
      color: @color-green;
    }
    .info {
      flex: 1;
      width: 300px;
      .name {
        position: relative;
        height: 50px;
        line-height: 50px;
        color: @color-main;
        @font-size-h3();
        > .tel {
          display: inline-block;
          margin-left: 30px;
        }
        > .lock {
          float: right;
          color: @color-orange;
        }
      }
      > .client {
        width: 100%;
        height: 46px;
        line-height: 46px;
        font-size: @font-size-m;
        color: @color-minor;
      }
      > .follow {
        height: 36px;
        line-height: 36px;
         font-size: @font-size-m;
        color: @color-minor;
      }
    }
  }
}
</style>