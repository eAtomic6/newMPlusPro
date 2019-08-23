<template>
  <div class="container">
    <!-- <div v-if="adFlage"> -->
    <guide class="guide-page" v-on:swiperHidden="swiperHidden" v-if="swiperShow"></guide>
    <div class="login" v-else>
      <div class="login-brand">
        <img :src="imgurl" class="img">
      </div>
      <div class="input-box">
        <div class="tel">
          <span class="text">输入手机号码</span>
          <div class="itembox">
            <input type="tel" v-model="tel" class="input-tel" maxlength="11" placeholder="输入手机号码">
            <span class="iconfont icon-clear" @click="clearTel" v-show="tel_clear_show"></span>
          </div>
        </div>

        <div class="mess">
          <span class="text">短信验证码</span>
          <div class="itembox">
            <input type="text" v-model="mess" class="input-mess" maxlength="4" placeholder="短信验证码">
            <span
              class="iconfont icon-clear icon-clear-mess"
              @click="clearMess"
              v-show="mess_clear_show"
            ></span>
            <span v-if="send_disabled" class="send-btn disabled" v-show="send_show">发送验证码</span>
            <span v-else class="send-btn" v-show="send_show" @click="sendMess">发送验证码</span>
            <span
              class="send-time"
              v-show="!send_show"
              style="font-size:16px;color:#999999;font-family:'yahei'"
            >({{sendtime}})重新获取</span>
          </div>
        </div>
        <div class="yzm">
          <span v-if="send_disabled" class="send-voice disabled" v-show="sendv_show">收不到短信？试试语音</span>
          <span v-else class="send-voice" v-show="sendv_show" @click="sendVoice">收不到短信？试试语音</span>
        </div>
      </div>
      <button class="login-btn" @click="logIng" ref="loginbtn" disabled>确认登录</button>
      <Confirm
        v-model="comfirmlayer"
        @on-confirm="sendVMess"
        content="我们将以电话形式告知您验证码，您可能会收到【010、0511、024、029】开头的来电，请放心接听"
      ></Confirm>
    </div>
    <!-- </div> -->
    <!-- 广告页 -->
    <!-- <div v-if="!adFlage" class="banner">
      <img :src="banner.url" alt @click="goVideoList" :title="JSON.stringify(banner.links)">
      <span @click="goAd">{{goTime}}s跳过</span>
    </div>-->
  </div>
</template>

<script>
import guide from "@/pages/guide";
import { MIXINS } from "@/assets/JS/mixins";
import { Confirm } from "vux";
const TIME = 60;
let _id = JSON.parse(localStorage.getItem("userMessageId"));

export default {
  name: "login",
  mixins: [MIXINS],
  data() {
    return {
      comfirmlayer: false,
      imgurl: "",
      errors: [],

      copytel: "",
      tel: "",
      mess: "",
      captcha: "",

      send_show: true,
      sendv_show: true,
      send_disabled: true,
      tel_clear_show: false,
      mess_clear_show: false,

      sendtime: 0,
      swiperShow: true,
      // 视频
      banner: "",
      adFlage: true,
      goTime: 5,
      goType: "" // 根据类型来判断进入的页面,type == 1广告type == 2视频
    };
  },
  components: {
    Confirm,
    guide
  },
  beforeCreate: function() {
    document.getElementsByTagName("body")[0].className = "add_bg";
    document.getElementsByTagName("html")[0].className = "add_bg";
  },
  beforeDestroy: function() {
    document.body.removeAttribute("class", "add_bg");
  },
  mounted() {
    if (localStorage.getItem("guide")) {
      this.swiperShow = false;
      // _id 看该用户的id,可以看是否是非首次进入又可以作为广告的id
      // if (!this.$route.query.flase && _id) {
      //   this.addAd();
      // }
    } else {
      localStorage.setItem("guide", true);
    }
    this.checkLogin();
    this.getLogo();
  },
  methods: {
    
    // 跳过广告
    goAd() {
      this.adFlage = true;
    },
    // 判断是否有广告
    addAd() {
      this.$ajax
        .get("/api/banner/url", { id: _id })
        .then(res => {
          if (res.data.status === 200) {
            console.log(res.data);
            this.goType = res.data.data[0].type;
            // 如果没有广告或者this.goType == 0 表示是房源则不展示广告
            // else 表示是从goType == 1(h5广告)|| goType == 2(视频连接)
            if (res.data.data.length == 0 || this.goType == 0) {
              this.adFlage = true;
            } else {
              this.banner = res.data.data[0];
              console.log(this.banner[0]);
              this.adFlage = false;
              let mtime = setInterval(() => {
                this.goTime--;
                if (this.goTime <= 0) {
                  this.sendtime = 0;
                  clearInterval(mtime);
                  this.adFlage = true;
                }
              }, 1000);
            }
          } else {
            this.adFlage = true;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    // 跳转到videoList
    goVideoList(e) {
      console.log("我是第二次进入");
      console.log(this.goType);
      // 1(h5广告)   2(视频连接)
      if (this.goType == 1) {
        let obj = JSON.parse(e.target.getAttribute("title"));
        if (!!obj) {
          window.location.href = obj;
        }
      } else if (this.goType == 2) {
        this.$router.push("/adPage?goId=1");
      }
    },

    swiperHidden: function(payload) {
      this.swiperShow = !payload.state;
    },
    checkLogin() {
      if (localStorage["token"] !== undefined) {
      } else {
        this.tel = localStorage["tel"];
      }
      if (this.$route.query.toast !== undefined) {
        this._toastMess("登陆已过期,请重新登陆!");
      }
    },
    clearTel() {
      this.tel = null;
    },
    clearMess() {
      this.mess = null;
    },
    getLogo() {
      let _cacheLogo = JSON.parse(localStorage.getItem("userMessage"));
      if (_cacheLogo) {
        _cacheLogo = _cacheLogo.companyLogo;
      }
      if (!_cacheLogo) {
        this.$ajax
          .get("api/logo", {}, "pt")
          .then(res => {
            res = res.data;
            if (res.status === 200) this.imgurl = res.data;
          })
          .catch(err => {
            this._catchMess(err);
          });
      } else {
        this.imgurl = _cacheLogo;
      }
    },
    logIng() {
      let cid, deviceToken;
      console.log(this.$osName);
      if (this.$osName) {
        //移动端
        cid = plus.push.getClientInfo().clientid;
        deviceToken = plus.push.getClientInfo().token;
      } else {
        cid = "";
        deviceToken = "";
      }
      this.checkForm();
      if (!this.errors.length) {
        let param = {
          mobile: this.tel,
          captcha: this.mess,
          cid: cid,
          deviceToken: deviceToken
        };
        this.$ajax
          .get("api/login", param)
          .then(res => {
            // debugger
            res = res.data;
            console.log(res.data);
            if (res.status === 200) {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("tel", this.tel);
              this.$axios.defaults.headers.common["token"] = res.data.token;

              // 缓存个人信息
              this.$ajax
                .get("api/personal/me")
                .then(res => {
                  res = res.data;
                  if (res.status === 200) {
                    localStorage.setItem(
                      "userMessage",
                      JSON.stringify(res.data)
                    );
                    // 缓存当前用户的id,为下次进入进入广告页提供id
                    localStorage.setItem(
                      "userMessageId",
                      JSON.stringify(res.data.id)
                    );
                  }
                })
                .catch(err => {
                  this._catchMess(err);
                });

              this.$router.push("/home");
            } else {
              // this._catchMess(res.message)
              this._verifyMess(res.message);
            }
          })
          .catch(err => {
            this._catchMess(err);
          });
      }
    },
    checkForm() {
      this.errors = [];

      if (!this.tel) {
        this._verifyMess("请输入手机号码!");
        return false;
      }
      if (!this._validTel(this.tel)) {
        this._verifyMess("手机号码格式有误!");
        return false;
      }
      //是否更变手机号
      if (this.copytel) {
        if (this.tel !== this.copytel) {
          this._verifyMess("请输入正确的验证码!");
          return false;
        }
      }
    },
    //发送语音
    sendVoice() {
      this.comfirmlayer = !this.comfirmlayer;
    },
    //发送验证码
    sendMess() {
      this.checkForm();
      let param = { mobile: this.tel };
      this._getCaptcha(param);
    },
    sendVMess() {
      this.checkForm();
      let param = {
        mobile: this.tel,
        useVoice: true
      };
      this._getCaptcha(param);
    },
    _validTel(num) {
      var re = /^[1][0-9]{10}$/;
      return re.test(num);
    },
    _verifyMess(text) {
      this.errors.push(text);
      this.$vux.toast.text(text, "middle");
    },
    _toastMess(text) {
      this.$vux.toast.text(text, "middle");
    },
    _catchMess(err) {
      this.$vux.toast.text(this.$error[err.response.status], "middle");
    },
    _getCaptcha(param) {
      this.$ajax
        .get("api/captcha", param)
        .then(res => {
          // res = res.data
          if (res.data.status == 200) {
            this.send_show = false;
            this.sendtime = TIME;
            let mtime = setInterval(() => {
              this.sendtime--;
              if (this.sendtime <= 0) {
                this.send_show = true;
                this.sendtime = TIME;
                clearInterval(mtime);
              }
            }, 1000);
            this.copytel = param.mobile;
            // this.mess = res.message //dev
            this._toastMess("验证码已发送，请耐心等待接收!");
          } else {
            console.log("11111111111");
            this._verifyMess(res.data.message);
          }
        })
        .catch(err => {
          this._catchMess(err);
        });
    }
  },
  watch: {
    mess(s) {
      let btn = this.$refs.loginbtn;
      !s ? (btn.disabled = true) : (btn.disabled = false);
      !this.mess
        ? (this.mess_clear_show = false)
        : (this.mess_clear_show = true);
    },
    tel(num) {
      this._validTel(num)
        ? (this.send_disabled = false)
        : (this.send_disabled = true);
      !this.tel ? (this.tel_clear_show = false) : (this.tel_clear_show = true);
    }
  }
};
null;
</script>

<style lang="less" scoped>
@import "~@/assets/CSS/config";
.container {
  background: @bg-ff;
  .login {
    padding-top: 160px;
    .login-brand {
      width: 338px;
      height: 86px;
      text-align: center;
      margin: auto;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .input-box {
      width: 570px;
      margin: 160px auto 72px auto;
      overflow: hidden;
      .tel,
      .mess {
        margin-top: 40px;
        .text {
          font-size: 28px;
          color: @color-minor;
          display: block;
          margin-bottom: 20px;
        }
      }
      .yzm {
        margin-top: 20px;
        .send-voice {
          display: block;
          text-align: right;
          color: #517ba8;
          font-size: 24px;
          &.disabled {
            color: @color-assist;
          }
        }
      }
      .input-tel,
      .input-mess {
        height: 40px;
        line-height: 40px;
        padding: 25px 0;
        width: 100%;
        border: 0;
        border-radius: 10px;
        text-indent: 20px;
        font-size: 30px;
        color: @color-assist;
        background-color: #efefef;
        outline: none;
      }
      .itembox {
        position: relative;
        .icon-clear,
        .send-btn,
        .send-time {
          position: absolute;
          right: 20px;
          top: 0;
          display: inline-block;
          height: 100%;
          display: -webkit-flex;
          display: flex;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
        }
        .icon-clear {
          &:before {
            content: "\e60d";
            font-size: 40px;
            color: @color-assist;
          }
          &-mess {
            right: 300px;
          }
        }
        .send-btn {
          font-size: 28px;
          color: @color-green;
          &.disabled {
            color: @color-assist;
          }
        }
        .send-time {
          font-size: 16px;
          color: @color-assist;
        }
      }
    }
    .login-btn {
      width: 570px;
      height: 80px;
      line-height: 80px;
      border: 0;
      color: @color-white;
      font-size: 30px;
      background-color: #5ca52a;
      border-radius: 10px;
      display: block;
      text-align: center;
      margin: auto;
      outline: none;
      &:disabled {
        background-color: @bg-99;
      }
    }
  }
}
.banner {
  position: relative;
  img {
    width: 100vw;
    height: 100vh;
    position: absolute;
  }
  span {
    position: absolute;
    top: 5vw;
    right: 5vw;
    width: 18vw;
    height: 6vw;
    line-height: 6vw;
    text-align: center;
    color: #fff;
    border-radius: 8vw;
    background-color: rgba(0, 0, 0, 0.3);
  }
}

.guide-page {
  height: 100%;
}
.weui-icon_toast {
  display: block !important;
}
</style>
