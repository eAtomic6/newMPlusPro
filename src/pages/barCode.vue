<template>
  <div class="scan">
    <topbar class="topbar-info" :title="title" :back="true" v-on:goBack="goBack"></topbar>
    <div id="bcid" :class="[success?'bg-other':'']">
      <!--<div style="height:40%"></div>
      <p class="tip">...载入中...</p>-->
      <div class="code-success" v-if="success">
        <p><img :src="getImg('icon-code.png')" alt=""></p>
        <p @click="loginPc">确认登录电脑版</p>
      </div>
    </div>
    <!--<footer>
      <button @click="startRecognize">1.创建控件</button>
      <button @click="startScan">2.开始扫描</button>
      <button @click="cancelScan">3.结束扫描</button>

      <button @click="closeScan">4.关闭控件</button>
    </footer>-->
  </div>
</template>

<script type='text/ecmascript-6'>
  import topbar from '@/components/topbar'
  import {MIXINS} from "@/assets/JS/mixins"

  let scan = null;

  export default {
    mixins:[MIXINS],
    components:{
      topbar
    },
    data() {
      return {
        codeUrl: '',
        title: '登录电脑端',
        success:false
      }
    },
    mounted(){
      this.startRecognize()
    },
    destroyed(){
      this.cancelScan()
      this.closeScan()
    },
    methods: {
      //创建扫描控件
      startRecognize() {
        if (!window.plus) return;
        scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR], {
          frameColor: '#5ca52a',
          scanbarColor: '#5ca52a'
        });
        scan.onmarked = this.marked;
        this.startScan()
      },
      marked:function (type, result, file) {
        switch (type) {
          case plus.barcode.QR:
            type = 'QR';
            break;
          case plus.barcode.EAN13:
            type = 'EAN13';
            break;
          case plus.barcode.EAN8:
            type = 'EAN8';
            break;
          default:
            type = '其它' + type;
            break;
        }
        result = result.replace(/\n/g, '');
        this.codeUrl = result;
        this.success = true
        this.cancelScan()
        this.closeScan()
      },
      //开始扫描
      startScan() {
        if (!window.plus) return;
        scan.start();
      },
      //关闭扫描
      cancelScan() {
        if (!window.plus) return;
        scan.cancel();
      },
      //关闭条码识别控件
      closeScan() {
        if (!window.plus) return;
        scan.close();
      },
      goBack:function () {
        this.cancelScan()
        this.closeScan()
        this.$router.go(-1)
      },
      // 登录PC
      loginPc(){
        let param = {
          // captcha:this.codeUrl
         captcha:this.getParam(this.codeUrl, "captcha")
        }
        console.log(param);
       this.$ajax.post("/api/qr/sendMyToken", param).then(res=>{
         console.log("我是扫描后的结果");
         console.log(res.data);
         if (res.data.status == 200) {
          this.$vux.toast.text("扫描成功", "middle");
           setTimeout(() => {
             this.goBack()
           }, 800);
         }else{
           this.$vux.toast.text(res.data.message, "middle");
         }
       })
      },
      getParam(url, name) {
      try {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.split("?")[1].match(reg);
        if (r != null) {
          return r[2];
        }
        return ""; //如果此处只写return;则返回的是undefined
      } catch (e) {
        return ""; //如果此处只写return;则返回的是undefined
      }
    }
    }
  }
</script>
<style scoped lang="less">
  @import "~@/assets/CSS/config";
  .scan {
    height: 100%;
  }
  #bcid {
    position: absolute;
    left: 0;
    right: 0;
    top: 80px;
    bottom:0;
    background-color: rgba(0,0,0,1);
    &.bg-other{
      background-color: @bg-ff;
    }
  }
  .code-success{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    >p{
      &:first-of-type{
        margin-bottom: 80px;
        >img{
          width: 296px;
        }
      }
      &:last-of-type{
        width: 470px;
        padding: 29px 0;
        text-align: center;
        font-size: @font-size-xl;
        background-color: @color-green;
        color: @color-white;
        -webkit-border-radius: @border-radiaus;
        -moz-border-radius: @border-radiaus;
        border-radius: @border-radiaus;
      }
    }
  }
</style>
