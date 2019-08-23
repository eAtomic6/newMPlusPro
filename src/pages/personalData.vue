<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="iconfont icon-three_points topbar-right" @click="goMore"></span>
    </topbar>
    <ul>
      <li @click="photograph">
        <span>头像</span>
        <span class="right photo iconfont">
          <img :src="headImg?headImg:getImg('default.png')">
        </span>
      </li>
      <li>
        <span>姓名</span>
        <span class="right">{{msg.name}}</span>
      </li>
      <li>
        <span>电话号码</span>
        <span class="right">{{msg.mobile}}</span>
      </li>
      <li>
        <span>所属部门</span>
        <span class="right">{{msg.depName}}</span>
      </li>
      <li class="right_L">
        <span>权限</span>
        <span class="right rightList">{{msg.roles}}</span>
      </li>
      <li>
        <span>入职日期</span>
        <span class="right">{{msg.joinTime}}</span>
      </li>
    </ul>
    <!-- <div class="upload" v-show="false">
      <input type="file" id="change" @change="change" accept="image/*" ref="upload">
    </div> -->
    <Actionsheet v-model='value1' :show-cancel='true' :menus='menus1' @on-click-menu="invite1"></Actionsheet>
    <Actionsheet v-model='value' :show-cancel='true' :menus='menus' @on-click-menu="invite"></Actionsheet>
    <div class="logout" @click="logout">
      退出登录
    </div>
    <Confirm title="提示" v-model='value2' :content='tipWord' @on-confirm="confirm"></Confirm>
    <!-- 加载中 -->
    <loading :show="loadingBoolean" text="加载中" class="customer-loading"></loading>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import { Actionsheet, Confirm, Popup, Loading } from "vux";
import axios from "axios";
import ImageCompressor from "image-compressor.js";
//import "@/assets/JS/commonH5";

export default {
  name: "personal-data",
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    Actionsheet,
    Confirm,
    Popup,
    Loading
  },
  data() {
    return {
      tipWord: "",
      title: "个人资料",
      sheetVisible: false,
      getBack: true,
      value: false,
      pop: false,
      isTransparent: true,
      value1: false,
      menus: { menu1: "拍照", menu2: "从相册中获取" },
      menus1: { menu1: "退出该企业" },
      value2: false,
      msg: {},
      // Img: "",
      headImg: "",
      isIos: false,
      // loading
      loadingBoolean: false,
      id: ''
    };
  },

  methods: {
    logout() {
      this.value2 = !this.value2;
      this.tipWord = '请确认是否退出登录';
    },
    goMore() {
      this.value1 = !this.value1;
    },
    invite1(menuKey) {
      if (menuKey == "menu1") {
        this.$ajax.get("/api/employee/custCount",{id:this.id}).then(res => {
          if (res.data.status == 200) {
            this.$router.push({
              path: "/outCompany",
              query: {
                mobile: this.msg.mobile
              }
            });
          }else if (res.data.status == 400) {
            this.tipWord = res.data.message;
            this.value2 = true;
          }
        }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        })
        
      }
    },
    confirm() {
      if(this.tipWord == '请确认是否退出登录') {
        localStorage.removeItem("token");
        //localStorage.removeItem("userMessage");
        this.$router.push("/login");
      }
    },
    photograph() {
      this.$ajax
        .put("/api/personal/headImg/can")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.value = true;
          } else {
            this.$vux.toast.text("权限不足", "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    invite(i, e) {
      const that = this;
      //压缩图片
      function compressImage(url, filename) {
        var name = "_doc/upload/" + filename;
        plus.zip.compressImage(
          {
            src: url, //src: (String 类型 )压缩转换原始图片的路径
            dst: name, //压缩转换目标图片的路径
            quality: 10, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
          },
          function(zip) {
            let maxSize = 1 * 1024 * 1024;
            let minSize = 3 * 1024;
            if (zip.size < minSize) {
              that.loadingBoolean = false;
              that.tips("上传图片请大于 3kb");
              return false;
            } else if (zip.size > maxSize) {
              that.loadingBoolean = false;
              that.tips("上传图片请小于 1Mba");
              return false;
            } else {
              //页面显示图片
              showPics(zip.target, name);
            }
          },
          function(error) {
            that.tips("压缩图片失败，请稍候再试");
          }
        );
      }
      //图片显示
      function showPics(url, name) {
        //根据路径读取到文件
        plus.io.resolveLocalFileSystemURL(url, function(entry) {
          entry.file(function(file) {
            var fileReader = new plus.io.FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = function(e) {
              var picUrl = e.target.result.toString();
              var fileVar = dataURLtoFile(picUrl);
              const form = new FormData();
              form.append("watermark", false);
              form.append("file", fileVar, file.name);
              that.$axios
                .post("/img/upload", form)
                .then(res => {
                  that.loadingBoolean = false;
                  that.headImg = res.data.images[0].src;
                  let param = {
                    headImg: that.headImg
                  };
                  that.$ajax.put("/api/personal/headImg", param).then(res => {
                    res = res.data;
                    if (res.status === 200) {
                      that.getPersonalMsg();
                      that.$vux.toast.text("修改成功", "middle");
                    } else {
                      that.$vux.toast.text("修改失败", "middle");
                    }
                  });
                })
                .catch(err => {
                  that.loadingBoolean = false;
                  that.tips(err);
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
      // 拍照
      if (i === "menu1") {
        that.loadingBoolean = true;
        var cmr = plus.camera.getCamera();
        cmr.captureImage(
          function(path) {
            plus.gallery.save(
              path,
              function() {
                let name = path.substr(path.lastIndexOf("/") + 1);
                compressImage(path, name);
              },
              function(e) {
                that.loadingBoolean = false;
                that.tips("保存失败: " + JSON.stringify(e));
              }
            );
          },
          function(e) {
            // outSet('取消拍照');
            that.loadingBoolean = false;
          },
          { filename: "_doc/gallery/", index: 1 }
        );
        return false;
      }
      // 相册选取
      if (i === "menu2") {
        that.loadingBoolean = true;
        // 从相册中选择图片
        plus.gallery.pick(
          function(e) {
            let name = e.substr(e.lastIndexOf("/") + 1);
            compressImage(e, name);
          },
          function(e) {
            //outSet('取消选择图片');
            that.loadingBoolean = false;
          },
          {
            filter: "image"
          }
        );
        return false;
      }
    },
    getPersonalMsg() {
      this.$ajax.get("/api/personal/me").then(res => {
        res = res.data;
        if (res.status === 200) {
          localStorage.setItem("userMessage", JSON.stringify(res.data));
        }
      });
    }
  },
  created() {
    this.msg = JSON.parse(localStorage.getItem("userMessage"));
    if (this.msg.headImg) {
      this.headImg = this.msg.headImg;
    }

    this.msg.joinTime = this.msg.joinTime.substr(0, 10);
    this.id = this.msg.id;
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/CSS/config";
.main {
  ul {
    margin-top: 20px;
    width: 750px;
    padding: 0 26px 0 26px;
    box-sizing: border-box;
    background-color: @bg-ff;
    li {
      width: 690px;
      height: 112px;
      box-sizing: border-box;
      border-bottom: 1px solid @border-ea;
      line-height: 112px;
      &:last-child {
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
      .rightList {
        max-width: 500px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .photo {
        height: 70px;
        width: 70px;
        border-radius: 50%;
        margin-top: 21px;
        margin-right: 46px;
        position: relative;
        &:before {
          content: "\e625";
          position: absolute;
          color: @color-assist;
          top: 50%;
          right: -60px;
          transform: translateY(-50%);
          font-size: @font-size-icon-m;
        }
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
      }
    }
  }
  // .upload{
  //   > input{
  //     width: 0;
  //     height: 0;
  //   }
  // }
  .logout {
    height: 120px;
    text-align: center;
    width: 750px;
    line-height: 120px;
    font-size: @font-size-m;
    color: @color-green;
    position: absolute;
    background-color: @bg-ff;
    bottom: 0;
  }
  .model {
    height: 320px;
    width: 710px;
    font-size: @font-size-l;
    color: @color-black;
    margin-bottom: 20px;
    margin-left: 20px;
    .top {
      width: 710px;
      height: 200px;
      border-radius: 6px;
      background: @bg-ff;
      input {
        clear: both;
      }
    }
    .bottom {
      width: 710px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      margin-top: 20px;
      border-radius: 6px;
      background: @bg-ff;
    }
  }
  /deep/.weui-mask {
    background: rgba(0, 0, 0, 0.48);
  }
  /deep/.weui-actionsheet {
    width: 710px;
    left: 20px;
    background: rgba(0, 0, 0, 0);
    .weui-actionsheet__menu {
      //height: 200px;
      background: rgba(255, 255, 255, 1);
      border-radius: 6px;
      .weui-actionsheet__cell {
        font-size: 30px;
        color: @color-black;
        height: 100px;
        line-height: 100px;
        padding: 0;
        &:before {
          border: none;
        }
      }
    }
    .weui-actionsheet__action {
      height: 100px;
      border-radius: 6px;
      line-height: 100px;
      margin-top: 20px;
      margin-bottom: 20px;
      &:before {
        border: none;
      }
      .weui-actionsheet__cell {
        font-size: 30px;
        color: @color-black;
        padding: 0;
      }
    }
  }
  /deep/.weui-dialog {
    border-radius: 6px;
    .weui-dialog__bd {
      color: @color-black;
    }
    .weui-dialog__ft {
      .weui-dialog__btn_primary {
        color: @color-green;
      }
    }
  }
}
</style>