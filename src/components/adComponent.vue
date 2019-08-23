<template>
  <div>
    <topbar
      :title="title"
      :back="toBack"
      :rightTool="rightTool"
      v-on:goBack="goBack"
      style="position: relative;"
    >
      <template slot="topbar-right">
        <div class="share" @click="toShare">保存/分享</div>
      </template>
    </topbar>
    <!-- 置业顾问---传承 -->
    <div v-if="$route.query.goName == '传承'" ref="inherited" style="position: relative;">
      <img
        src="../assets/img/jjrcc_bg.jpg"
        alt
        style="display: inline-block;width: 100vw; height: 164vw;;"
      >
      <div style="position: absolute;top: 50vw; left: 0vw; width: 100%;">
        <img
          v-if="userInfo.headImg"
          :src="userInfo.headImg"
          alt
          style="margin-top: 38.5vw;margin-left: 40.8vw; width: 18vw; height: 18vw;border-radius: 50%;"
        >
        <img
          v-else
          src="../assets/img/default.png"
          style="margin-top: 38.5vw;margin-left: 40.8vw; width: 18vw; height: 18vw;border-radius: 50%;"
          alt
        >
        <p style="text-align: center;">{{userInfo.name}}</p>
        <p
          style="text-align: center;"
          v-if="userInfo.companyName&&userInfo.companyName.length>15"
        >{{userInfo.companyName.slice(0,15) + " ..."}}</p>
        <p style="text-align: center;" v-else>{{userInfo.companyName?userInfo.companyName:"暂无"}}</p>
        <p style="text-align: center;">tel:{{userInfo.mobile}}</p>
        <img
          v-if="layerCodeUrl"
          :src="layerCodeUrl"
          alt
          class="qscode"
          style="width: 20vw;height: 20vw; margin:2vw 40vw 1vw;"
        >
        <p
          style="text-align: center;"
          v-if="((userInfo.dep).description).length>12"
        >团队介绍：{{((userInfo.dep).description).slice(0,12) + " ..."}}</p>
        <p
          style="text-align: center;"
          v-else
        >团队介绍：{{(userInfo.dep).description?(userInfo.dep).description:"暂无"}}</p>
      </div>
    </div>
    <!-- 置业顾问---卡券 -->
    <div v-if="$route.query.goName == '简洁风格'" ref="cardCoupon" style="position: relative;">
      <img
        src="../assets/img/jjrkj_bg.png"
        alt
        style="display: inline-block;width: 100vw;height: 164vw;"
      >
      <div style="position: absolute;top: 50vw; left: 0vw;width: 100%;">
        <img
          v-if="userInfo.headImg"
          :src="userInfo.headImg"
          alt
          style="margin-top: 32vw;margin-left: 40.8vw; width: 18vw; height: 18vw;border-radius: 50%;"
        >
        <img
          v-else
          src="../assets/img/default.png"
          style="margin-top: 33.5vw;margin-left: 40.8vw; width: 18vw; height: 18vw;border-radius: 50%;"
          alt
        >
        <p style="text-align: center;margin-top:1vw;color:#fa7a58;">{{userInfo.name}}</p>
        <p
          style="text-align: center;margin-top:1vw;color:#fa7a58;"
          v-if="userInfo.companyName&&userInfo.companyName.length>15"
        >{{userInfo.companyName.slice(0,15) + " ..."}}</p>
        <p
          style="text-align: center;margin-top:1vw;color:#fa7a58;"
          v-else
        >{{userInfo.companyName?userInfo.companyName:"暂无"}}</p>
        <p style="text-align: center;margin-top:1vw;color:#fa7a58;">tel:{{userInfo.mobile}}</p>
        <img
          v-if="layerCodeUrl"
          :src="layerCodeUrl"
          alt
          class="qscode"
          style="width: 30vw;height: 30vw; margin:2vw 35vw 1vw;"
        >
        <p
          style="text-align: center;color:#fa7a58;"
          v-if="(userInfo.dep).description.length>12"
        >团队介绍：{{(userInfo.dep).description.slice(0,12) + " ..."}}</p>
        <p
          style="text-align: center;color:#fa7a58;"
          v-else
        >团队介绍：{{userInfo.dep.description?userInfo.dep.description:"暂无"}}</p>
      </div>
    </div>
    <!-- 项目---春日 -->
    <div v-if="$route.query.goName == '春日'" ref="springDay" style="position: relative;"></div>
    <!-- 加载中 -->
    <loading :show="loadingBoolean" text="正在生成图片"></loading>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { Loading } from "vux";
export default {
  mixins: [MIXINS],
  data() {
    return {
      title: "",
      toBack: true,
      rightTool: false,
      currentDemo: "", //当前HTML转图片的demo
      isPro: true, //判断是否是项目，是项目让其从项目详情里进入
      userInfo: "",
      loadingBoolean: false, //加载图片的
      layerCodeUrl: "" //微信二维码
    };
  },
  created() {
    this.title = this.$route.query.goName;
    switch (this.title) {
      case "传承": //置业顾问
        this.currentDemo = this.$refs.inherited;
        break;
      case "简洁风格": //置业顾问
        this.currentDemo = this.$refs.cardCoupon;
        break;
      case "春日": //项目
        this.isPro = false;
        this.currentDemo = this.$refs.springDay;
        break;
    }
    // 置业顾问的信息
    this.userInfo = JSON.parse(localStorage.getItem("userMessage")); //获得个人的信息
    QRCode.toDataURL(this.userInfo.employee.wechatUrl).then(url => {
      this.layerCodeUrl = url;
    });

    //项目的信息
  },
  methods: {
    // 点击保存/分享
    toShare() {
      let _this = this;
      if (!_this.isPro) {
        _this.$vux.toast.text("请从项目详情进入", "middle");
      } else {
        _this.loadingBoolean = true;
        html2canvas(_this.currentDemo, {
          useCORS: true,
          logging: true
        }).then(canvas => {
          let base64 = canvas.toDataURL("image/png");
          // console.log(base64);
          var bitmap = new plus.nativeObj.Bitmap();
          bitmap.loadBase64Data(
            base64,
            function() {
              bitmap.save(
                "_doc/psndt.png",
                {
                  overwrite: true
                },
                function(i) {
                  plus.gallery.save(i.target, function() {
                    _this.loadingBoolean = false;
                    _this.$vux.toast.text("保存成功", "middle");
                  });
                },
                function(e) {
                  _this.loadingBoolean = false;
                  _this.$vux.toast.text("保存图片失败", "middle");
                }
              );
            },
            function(e) {
              _this.loadingBoolean = false;
              _this.$vux.toast.text("加载图片失败", "middle");
            }
          );
        });
      }
    },
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  },
  components: {
    topbar,
    html2canvas,
    Loading,
    QRCode
  }
};
</script>

<style lang="less" scoped>
.topbar {
  padding-top: 2vw;
  .share {
    position: absolute;
    top: 2vw;
    right: 2vw;
    color: #04be02;
  }
}
#inherited {
  > div {
    width: 100%;
    p {
      text-align: center;
    }
  }
}
</style>

