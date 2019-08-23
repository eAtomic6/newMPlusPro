<!--  -->
<template>
 <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    <div class="msg">
      <div class="head">
        <div class="image">
          <img v-if="msg.headImg" :src="msg.headImg">
          <img v-else src="../assets/img/default.png">
        </div>
        <div class="name">{{msg.name}}</div>
        <div class="affiliated">
          <span v-if="msg.depName">{{msg.depName}}</span>
          <span v-else>暂无部门</span>
          <span v-if="msg.title">{{msg.title}}</span>
          <span v-else>职位暂无</span>
        </div>
      </div>
      <div class="tel iconfont">
        <span class="left">{{msg.mobile}}</span>
        <span class="right"><a :href="call">拨打电话</a></span>
      </div>
    </div>
 </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
export default {
  mixins: [MIXINS],
  components: {
    topbar
  },
  data() {
    return {
      id:'',
      getBack: true,
      msg:{},
      title: this.$route.query.msg.name,
      call:''
    };
  },
  methods: {
     getStaffMsg() {
      let param = {
        id: this.id
      };
      this.$ajax.get("/api/employee", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.msg=res.data
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
     }
  },
  created(){
    this.id=this.$route.query.msg.id
    this.call="tel:"+this.$route.query.msg.mobile
    this.getStaffMsg()
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.msg {
  width: 690px;
  height: 400px;
  margin: 30px;
  background: @bg-ff;
  border-radius: 16px;
  overflow: hidden;
  .head {
    height: 299px;
    overflow: hidden;
    .image {
      width: 128px;
      height: 128px;
      margin: 30px 281px 0 281px;
      //background: @color-green;
      border-radius: 50%;
      img{
        width: 128px;
        height: 128px;
        display: block;
        border-radius: 50%;
      }
    }
    .name {
      font-size: @font-size-xl;
      color: @color-main;
      line-height: 74px;
      text-align: center;
    }
    .affiliated {
      color: @color-assist;
      font-size: @font-size-sm;
      text-align: center;
      span:last-of-type {
        padding-left: 30px;
      }
    }
  }
  .tel {
    height: 100px;
    line-height: 100px;
    border-top: 1px solid @border-eb;
    font-size: @font-size-m;
    position: relative;
    &:before {
      content: "\e60f";
      position: absolute;
      top: 0;
      right: 10px;
      transform: rotate(180deg);
      font-size: @font-size-icon-m;
      color: @color-assist;
    }
    .left {
      color: @color-main;
      padding-left: 32px;
    }
    .right {
      float: right;
      margin-right: 60px;
      color: @color-assist;
      a{
        color: @color-assist;
        text-decoration: none;
      }
    }
  }
}
</style>