<!--  -->
<template>
 <div class="main">
   <topbar :title="title" :back="getBack" v-on:goBack="goBack"></topbar>
   <div class="list">
     <ul>
       <li>
        <span>当前版本</span>
        <span class="right">{{version}}</span>
      </li>
      <li>
        <span>内存</span>
        <span class="right">18M</span>
      </li>
      <li class="iconfont back" @click="upload">
        <span>检查新版本</span>
      </li>
      <li class="iconfont back" @click="clear">
        <span>清除缓存</span>
      </li>
      <!-- <li class="iconfont back">
        <span>关于我们</span>
      </li> -->
     </ul>
   </div>
 </div>
</template>

<script>
import topbar from '@/components/topbar'
import {MIXINS} from "@/assets/JS/mixins"
import { fail } from 'assert';

export default {
  mixins: [MIXINS],
  components: {
    topbar
  },
 data () {
  return {
    getBack:true,
    title:'关于我们',
    version:''
  };
 },
 methods: {
   getVersion(){
     this.$ajax.get('/api/version').then(res=>{
       res=res.data
       if(res.status===200){
         this.version=res.data.sysVersion
       }
     })
   },
   upload(){
     this.$vux.toast.text("当前已是最新版本", "middle");
   },
   clear(){
     this.$vux.toast.text("清除成功", "middle");
   }
 },
 created(){
   this.getVersion()
 }
}

</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main{
  .list{
    ul {
      background-color: @bg-ff;
      margin-top: 20px;
      width: 750px;
      padding: 0 26px 0 26px;
      box-sizing: border-box;
      li {
        width: 690px;
        height: 112px;
        box-sizing: border-box;
        border-bottom: 1px solid @border-ea;
        line-height: 112px;
        &:last-child{
          border: none;
        }
        span {
          font-size: @font-size-m;
          color: @color-main;
        }
        .right {
          float: right;
          color: @color-assist;
        }
      }
      .back{
        position: relative;
        &:before {
          content: "\e60f";
          position: absolute;
          top: 0;
          right: 0;
          transform: rotate(180deg);
          font-size: @font-size-xxl;
          color: @color-minor;
        }
      }
    }
  }
}
</style>