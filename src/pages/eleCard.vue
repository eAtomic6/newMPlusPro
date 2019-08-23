<template>
  <div class="cardPart">
    <topbar
      :title="title"
      :back="getBack"
      @goBack="goBack"
      style="background-color: #2F3133;color:#fff;"
    ></topbar>

    <!-- 分享名片的内容 -->
    <div ref="imageWrapper">
      <div
        style="width:88.5333vw;height:70vh;margin:20vw auto 10vw; position: relative;"
        :style="background"
      >
        <p>
          <img
            :src="headImg"
            v-if="headImg"
            style="width: 11.73333vw; height: 11.73333vw;margin-top: 18.6667vw;margin-left: 15vw;border-radius: 50%;"
          >
          <img
            src="./../assets/img/default.png"
            v-else
            style="width: 11.73333vw;height:11.73333vw;margin-top:18.6667vw;margin-left:15vw;border-radius: 50%"
          >
          <span style="float: right;margin-top: 18.6667vw;margin-right: 10vw;width: 48vw;">
            <b>{{name}}</b>
            <p style="white-space: nowrap;text-overflow: ellipsis; overflow: hidden;">
              {{depName}}
              <span v-if="depName.length>8">...</span>
            </p>
          </span>
        </p>

        <p style="color:#333;margin-left:30vw;margin-top: 1.5vw;">{{mobile}}</p>

        <p id="qrcode" style="margin:5vh auto 0;width:35vw;height:35vw;" v-if="wechatUrl"></p>
        <p v-else style="margin-left:30vw;margin-top:13vh;color:#999;">暂未上传二维码</p>
        <p
          v-if="description"
          style="color: #333;width: 62%;line-height: 5vw; max-height: 15vw; overflow: hidden; text-overflow: ellipsis;position: absolute;left: 20vw;bottom: 18vw;"
        >
          团队介绍：
          <span>
            {{description}}
            <span v-if="description.length>28">...</span>
          </span>
        </p>
        <p style="position: absolute;color: #3eba70;left: 20vw;bottom: 8vw;">{{name}} 期待为您服务</p>
      </div>
    </div>
    <p style="padding:0 10vw;">
      <button class="saveBtn" @click="toImg()" ref="saveImg">保存</button>
      <button class="shareBtn" @click="shareHref">分享电子名片</button>
    </p>
    <!-- 加载中 -->
    <loading :show="loadingBoolean" text="加载中"></loading>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { qrcanvas } from "qrcanvas";
import html2canvas from "html2canvas";
import { Loading } from "vux";
import { setTimeout } from "timers";
// import { debug } from "util";
let shares = null;
export default {
  name: "eleCard",
  components: {
    topbar,
    html2canvas,
    Loading
  },
  data() {
    return {
      getBack: true,
      title: "电子名片",
      background: {
        background:
          "url(" +
          require("../assets/img/el-card.png") +
          ") no-repeat center center/100% 100%"
      },
      layerCodeUrl: "",
      userInfo: null,
      imgSrc: "_doc/psndt.png",
      imgFlag: true,
      description: null,
      loadingBoolean: false,
      depName: "",
      headImg: null,
      name: null,
      mobile: null,
      wechatUrl: null
    };
  },
  created() {
    // 获取名片信息
    this.getMe();
    //初始化微信分享
    this.updateSerivces();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getMe() {
      let _this = this;
      this.$ajax.get("api/personal/me").then(res => {
        if (res.data.data.company) {
          _this.description = res.data.data.company.description.substring(
            0,
            31
          );
        }
        if (res.data.data.depName) {
          _this.depName = res.data.data.depName.substring(0, 10);
        }
        if (res.data.data.headImg) {
          _this.headImg = res.data.data.headImg;
        }
        if (res.data.data.name) {
          _this.name = res.data.data.name;
        }
        if (res.data.data.mobile) {
          _this.mobile = res.data.data.mobile;
        }
        if (res.data.data.employee) {
          _this.wechatUrl = res.data.data.employee.wechatUrl;
        }
        _this.$nextTick(function() {
          var canvas1 = qrcanvas({
            data: decodeURIComponent(_this.wechatUrl), //分享链接（根据需求来）
            size: 128 //二维码大小
          });
          document.getElementById("qrcode").innerHTML = "";
          document.getElementById("qrcode").appendChild(canvas1);
        });
      });
    },
    toImg(save) {
      // this.getMe();
      this.loadingBoolean = true;
      // 第一个参数是需要生成截图的元素, 第二个是自己需要配置的参数, 宽高等;
      let _this = this;
      html2canvas(_this.$refs.imageWrapper, {
        useCORS: true,
        logging: true
      }).then(canvas => {
        let base64 = canvas.toDataURL("image/png");
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
                // bitmap.clear();
                // alert("保存图片成功：" + JSON.stringify(i));
                plus.gallery.save(i.target, function() {
                  _this.loadingBoolean = false;
                  _this.$vux.toast.text("保存成功", "middle");
                });
              },
              function(e) {
                // bitmap.clear();
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
    },
    /**
     * 更新分享服务
     */
    updateSerivces() {
      let _this = this;
      plus.share.getServices(
        function(s) {
          shares = {};
          for (var i in s) {
            var t = s[i];
            shares[t.id] = t;
          }
          //   _this.$vux.toast.text("获取分享服务列表成功", "middle");
        },
        function(e) {
          _this.$vux.toast.text("获取分享服务列表失败：", "middle");
        }
      );
    },
    /**
     * 分享操作
     */
    shareAction(id, ex) {
      console.log(4);
      let _this = this;
      var s = null;
      if (!id || !(s = shares[id])) {
        _this.$vux.toast.text("无效的分享服务！", "middle");
        return;
      }
      if (s.authenticated) {
        // _this.$vux.toast.text("已授权", "middle");
        console.log(5);
        _this.shareMessage(s, ex);
      } else {
        // that.$vux.toast.text("未授权", "middle");
        s.authorize(
          function() {
            console.log(6);
            _this.shareMessage(s, ex);
          },
          function(e) {
            _this.$vux.toast.text("认证授权失败", "middle");
          }
        );
      }
    },
    /**
     * 发送分享消息
     */
    shareMessage(s, ex) {
      console.log(5);
      let _this = this;
      var msg = {
        type: "image",
        pictures: [this.imgSrc],
        title: "吉家",
        extra: {
          scene: ex
        }
      };
      // 发送分享
      s.send(
        msg,
        function(res) {
          // _this.$vux.toast.text("分享成功", "middle");
        },
        function(e) {
          console.log(e);
          _this.$vux.toast.text("分享失败", "middle");
        }
      );
    },
    /**
     * 分享按钮点击事件
     */
    shareHref() {
      this.loadingBoolean = true;
      this.getMe();
      // 第一个参数是需要生成截图的元素, 第二个是自己需要配置的参数, 宽高等;
      let _this = this;
      let target = null;
      html2canvas(this.$refs.imageWrapper, {
        useCORS: true,
        logging: true
      }).then(canvas => {
        let base64 = canvas.toDataURL("image/png");
        var bitmap = new plus.nativeObj.Bitmap();
        bitmap.loadBase64Data(
          base64,
          function() {
            //    console.log('加载图片成功');
            bitmap.save(
              "_doc/psndt.png",
              {
                overwrite: true
              },
              function(i) {
                target = i.target;
                _this.loadingBoolean = false;
                // alert("ids");
                var ids = [
                    {
                      id: "weixin",
                      ex: "WXSceneSession" /*微信好友*/
                    },
                    {
                      id: "weixin",
                      ex: "WXSceneTimeline" /*微信朋友圈*/
                    }
                  ],
                  bts = [
                    {
                      title: "发送给微信好友"
                    },
                    {
                      title: "分享到微信朋友圈"
                    }
                  ];
                // alert("actionSheet");
                plus.nativeUI.actionSheet(
                  {
                    cancel: "取消",
                    buttons: bts
                  },
                  function(e) {
                    // alert(123123);

                    var i = e.index;
                    if (i > 0) {
                      _this.shareAction(ids[i - 1].id, ids[i - 1].ex);
                    }
                  }
                );
              },
              function(e) {
                _this.$vux.toast.text("保存图片失败", "middle");
              }
            );
          },
          function(e) {
            _this.$vux.toast.text("保存图片失败", "middle");
          }
        );
      });
    },
    // 控制台输出日志
    outSet(msg) {
      console.log();
      console.log(msg);
    }
  }
};
</script>

<style lang="less" scoped>
.cardPart {
  width: 100vw;
  height: 100vh;
  background-color: #2f3133 !important;
  overflow: hidden;
}
button {
  background-color: #fff;
  width: 36vw;
  height: 9.3333vw;
  border: 0;
  outline: none;
  border-radius: 5px;
}

.saveBtn {
  float: left;
  color: #3eba70;
}
.shareBtn {
  float: right;
  background-color: #3eba70;
  color: #fff;
}
</style>
