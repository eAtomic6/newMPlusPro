<template>
  <div>
    <topbar :title="title" :back="getBack" v-on:goBack="goBack"></topbar>

    <div class="layout">
      <!-- <div style="height:3vw;background-color:#f5f5f5;width:100%;"></div> -->
      <div class="img-layout">
        <img :src="uploadQr" alt v-if="uploadQr">
        <img src="../assets/img/wechat.png" ref="reference" v-else>
      </div>
      <p style="color:#5ca52a;text-align:center;">请上传微信二维码</p>

      <p style="text-align:center;margin-top:3vw;font-size:4vw;color:#c5c5c5;">温馨提示:</p>
      <p
        style="font-size:4vw;color:#c5c5c5;padding:4vw;"
      >1、上传微信二维码后，潜在客户将可以在您分享的房源和网店页面通过微信主动联系到您，请及时上传微信二维码，以便进行营销拓客。</p>
      <p style="font-size:4vw;color:#c5c5c5;padding:4vw;">2、上传的微信二维码最好为矩形且无遮挡部分，避免由于识别失败而需要重新上传</p>
    </div>

    <!-- <div ref="qrcode" id="qrcode">111</div> -->
    <div class="button" @click="goUpload">点击上传二维码</div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import QRCode from "qrcode";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
export default {
  mixins: [MIXINS, FILTERS],
  data() {
    return {
      getBack: true,
      title: "微信二维码",
      uploadQr: ""
    };
  },
  created() {
    let storage = JSON.parse(localStorage.getItem("userMessage"));
    let that = this;
    QRCode.toDataURL(storage.employee.wechatUrl)
      .then(url => {
        that.uploadQr = url;
      })
    console.log("我是我自己的微信二维码");
    console.log(this.uploadQr);
  },
  methods: {
    // 从相册中选择图片
    goUpload(e) {
      let that = this;
      plus.gallery.pick(
        function(e) {
          let name = e.substr(e.lastIndexOf("/") + 1);
          that.compressImage(e, name);
        },
        function(e) {
          //outSet('取消选择图片');
          that.loadingBoolean = false;
        },
        {
          filter: "image"
        }
      );
    },

    compressImage(url, filename) {
      let that = this;
      //压缩图片
      var name = "_doc/upload/" + filename;
      plus.zip.compressImage(
        {
          src: url, //src: (String 类型 )压缩转换原始图片的路径
          dst: name, //压缩转换目标图片的路径
          quality: 10, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
          overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
        },
        function(zip) {
          let maxSize = 2 * 1024 * 1024;
          let minSize = 3 * 1024;
          if (zip.size < minSize) {
            that.loadingBoolean = false;
            that.$vux.toast.text("上传图片请大于 3kb");
            return false;
          } else if (zip.size > maxSize) {
            that.loadingBoolean = false;
            that.$vux.toast.text("上传图片请小于 2Mba");
            return false;
          } else {
            //页面显示图片
            that.showPics(zip.target, name);
          }
        },
        function(error) {
          that.$vux.toast.text("压缩图片失败，请稍候再试");
        }
      );
    },
    //图片显示
    showPics(url, name) {
      let that = this;
      //根据路径读取到文件
      plus.io.resolveLocalFileSystemURL(url, function(entry) {
        entry.file(function(file) {
          var fileReader = new plus.io.FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onloadend = function(e) {
            var picUrl = e.target.result.toString();
            var fileVar = dataURLtoFile(picUrl);
            const form = new FormData();
            form.append("file", fileVar, file.name);
            that.$axios
              .post("api/personal/wechatQRCode", form, {
                headers: {
                  ContentType: "multipart/form-data"
                }
              })
              .then(res => {
                console.log(res);
                if (res.data.status == 200) {
                  // 判断是不是微信的二维码
                  if (
                    res.data.data.split("//")[1].split("/")[0] == "u.wechat.com"
                  ) {
                    // 根据微信的二维码生成客展示的二维码url
                    QRCode.toDataURL(res.data.data)
                      .then(url => {
                        that.uploadQr = url;
                        that.$vux.toast.text("二维码上传成功");
                      })
                      .catch(err => {
                        that.$vux.toast.text(this.$error[err.response.status]);
                      });
                  }
                } else {
                  console.log(444555);
                  that.$vux.toast.text("请上传有效微信二维码", "middle");
                }
              });

            /**
             * base 64  转换为图片
             * dataurl 64为图片
             * filename 图片名字
             * return 返回图片
             */
            function dataURLtoFile(urlData) {
              var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
              //处理异常,将ascii码小于0的转换为大于0
              var ab = new ArrayBuffer(bytes.length);
              var ia = new Uint8Array(ab);
              for (var i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
              }
              return new Blob([ab], { type: "image/png" });
            }
          };
        });
      });
    }
  },
  components: {
    topbar
  }
};
</script>

<style lang="less" scoped>
#app{
  background-color: pink!important;
}
.button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 10vw;
  line-height: 10vw;
  text-align: center;
  background-color: #5ca52a;
  color: #fff;
}
#qrcode {
  // margin-top: 50vw;
}
.layout {
  padding-top: 11.7333vw;
  background-color: #fff;
  box-sizing: border-box;
  border-top: 1px solid #ccc;
  // padding-bottom: 24vw;
  height: 100vh;

  // margin-top: 3vw;
  .img-layout {
    padding: 0 15vw;
    border-top: 1px solid #f5f5f5;
    img {
      width: 100%;
      height: 100%;
      margin-top: 5vw;
    }
  }
  // p{
  //   text-align: center;
  //   font-size: 3.2vw;
  // }
}
</style>

