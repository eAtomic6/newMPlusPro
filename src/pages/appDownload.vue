<!--  -->
<template>
 <div class="main">
   <div class="icon iconfont icon-select"></div>
   <div class="msg">
     <span>申请已提交</span>
     <p>正在等管理员审核</p>
   </div>
   <a class="download" href="https://newhousesys.jjw.com/download/zhiye.apk">下载APP</a>
 </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  methods: {}
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main{
  padding-top: 20px;
}
.icon{
  width: 750px;
  font-size: 300px;
  color: @color-green;
  text-align: center;
}
.msg{
  width: 750px;
  text-align: center;
  span{
    font-size: @font-size-icon-m;
    color: @color-main;
  }
  p{
    font-size: @font-size-sm;
    color: @color-assist;
    line-height: 45px;
  }
}
.download{
  text-decoration: none;
  width: 690px;
  display: block;
  height: 90px;
  line-height: 90px;
  text-align: center;
  color: @bg-ff;
  background: @color-green;
  border-radius:10px;
  margin: 40px 30px;
}
</style>