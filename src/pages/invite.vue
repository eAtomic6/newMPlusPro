<!--  -->
<template>
  <div class="main">
    <div class="invite">
      <div class="inviter">
        <div class="left">
          <img v-if="msg.headImg" :src="msg.headImg">
          <span class="text" v-else>{{msg.name|getName}}</span>
        </div>
        <span class="name">{{msg.name}}</span><span>邀请你加入</span>
      </div>
      <div class="department">
        <p>{{msg.companyName}}</p>
        <p>{{msg.depName}}</p>
      </div>
      <div class="msg">
        <ul>
          <li><input placeholder="电话号码" type="tel" maxlength="11" @blur="verifyMobile" ref="mobile"></li>
          <li><input type="text" placeholder="真实姓名" @blur="verifyName" ref="name"></li>
          <li><input type="text" placeholder="身份证号" maxlength="18" @blur="verifyIdcard" ref="idcard"></li>
          <li>
            <input type="text" placeholder="验证码" @blur="verifyCode" ref="code">
            <span v-show="sendAuthCode" class="auth_text" @click="getAuthCode">获取验证码</span>
            <span v-show="!sendAuthCode" class="auth_text forbid">重新获取({{auth_time}}s)</span>
          </li>
        </ul>
      </div>
      <div class="join" @click="join">加入</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      sendAuthCode: true,
      auth_time: 0,
      inviteId: "",
      msg: {},
      list: {}
    };
  },
  created() {
    let address = location.href;
    let del = address.substring(address.indexOf("#") + 2, address.length);
    if (del.indexOf("?") != -1) {
      //判断是否有参数
      var str = del.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
      let strs = str.split("&"); //用等号进行分隔 （因为知道只有一个参数 所以直接用等号进分隔 如果有多个参数 要用&号分隔 再用等号进行分隔）
      let lastStr = strs[0].split("=")
      this.inviteId = lastStr[1]; //直接弹出第一个参数 （如果有多个参数 还要进行循环的）
    }
    this.getInviterMsg();
  },
  methods: {
    getAuthCode() {
      if (this.list.mobile) {
        let param = {
          mobile: this.list.mobile,
          type: 3,
          useVoice: false
        };
        this.$ajax.get("/api/captcha", param).then(res => {
          res = res.data;
          if (res.status != 200) {
            this.$vux.toast.text(res.message, "top");
          }
        }).catch((err) => {
            this.$vux.toast.text(this.$error[err.response.status], 'middle')
          });
        this.sendAuthCode = false;
        this.auth_time = 60;
        var auth_timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimer);
          }
        }, 1000);
      } else {
        this.$vux.toast.text("手机号码错误", "top");
      }
    },
    join() {
      if (
        this.list.mobile && this.list.name && this.list.idcard && this.list.captcha) {
        let param = this.list;
        param.depId = this.msg.depId;
        param.inviteBy = this.msg.id;
        this.$ajax.post("/api/employee/registe", param).then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$router.push("/appDownload");
          }else{
             this.$vux.toast.text(res.message, "top");
          }
        }).catch((err) => {
            this.$vux.toast.text(this.$error[err.response.status], 'middle')
          });
      } else {
        if (!this.list.mobile) {
          this.$vux.toast.text("请输入正确手机号", "top");
        } else if (!this.list.name) {
          this.$vux.toast.text("请输入正确姓名", "top");
        } else if (!this.list.idcard) {
          this.$vux.toast.text("请输入正确身份证号", "top");
        } else if (!this.list.captcha) {
          this.$vux.toast.text("请输验证码", "top");
        }
      }
    },
    //获取邀请人信息
    getInviterMsg() {
      let param = {
        captcha: this.inviteId
      };
      this.$ajax.get("/api/employee/inviteInfo", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.msg = Object.assign({}, this.msg, res.data);
        }
      }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        });
    },
    //电话号码验证
    verifyMobile() {
      let mobile = this.$refs.mobile.value;
      let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      if (reg.test(mobile)) {
        this.list.mobile = mobile;
        return true;
      } else {
        this.$vux.toast.text("请输入正确手机号", "top");
        return false;
      }
    },
    //姓名
    verifyName() {
      let name = this.$refs.name.value.replace(/\s/g, "");
      if (name) {
        this.list.name = name;
        return true;
      } else {
        this.$vux.toast.text("请输入正确姓名", "top");
        return false;
      }
    },
    //验证身份证
    verifyIdcard() {
      let idcard = this.$refs.idcard.value;
      let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
      if (reg.test(idcard)) {
        this.list.idcard = idcard;
        return true;
      } else {
        this.$vux.toast.text("请输入正确身份证号码", "top");
        return false;
      }
    },
    //验证码验证
    verifyCode() {
      let code = this.$refs.code.value;
      let reg = /^\d{4}$/;
      if (reg.test(code)) {
        this.list.captcha = code;
        this.captcha = code;
      } else {
        this.$vux.toast.text("请输入正确验证码", "top");
      }
    }
  },
  filters: {
    getName: function(value) {
      if (!value) {
        return;
      }
      if (value.length > 2) {
        return value.substr(-2, 2);
      } else {
        return value;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main{
  padding-top: 20px;
}
.invite {
  background: @bg-ff;
  height: 1127px;
  width: 660px;
  margin: 30px auto;
  .inviter {
    height: 112px;
    width: 660px;
    border-bottom: 1px solid @border-eb;
    .left {
      float: left;
      width: 64px;
      height: 64px;
      margin-left: 50px;
      margin-top: 24px;
      img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: inline-block;
      }
      .text {
        width: 64px;
        height: 64px;
        display: inline-block;
        text-align: center;
        font-size: @font-size-xs;
        line-height: 64px;
        background-color: @color-green;
        color: @color-white;
        border-radius: 50%;
      }
    }

    .name {
      margin-top: 40px;
      display: inline-block;
      color: @color-main;
      font-size: @font-size-sm;
      font-weight: bold;
      padding-left: 24px;
      padding-right: 24px;
    }
    > span {
      font-size: @font-size-sm;
      color: @color-assist;
    }
  }
  .department {
    padding: 50px;
    text-align: center;
    > p {
      font-size: @font-size-icon-m;
      color: @color-main;
      font-weight: bold;
      line-height: 60px;
    }
  }
  .msg {
    padding: 0 50px;
    ul {
      li {
        height: 80px;
        line-height: 80px;
        box-sizing: border-box;
        margin-top: 20px;
        border-bottom: 1px solid @border-eb;
        input {
          height: 50px;
          width: 500px;
          border: none;
          outline: none;
          font-size: @font-size-m;
          color: @color-main;
          &::-webkit-input-placeholder {
            color: @color-assist;
            font-size: @font-size-m;
          }
        }
        &:last-of-type {
          input {
            width: 300px;
          }
          .auth_text {
            font-size: @font-size-m;
            color: @color-green;
            float: right;
          }
          .forbid {
            color: @color-assist;
          }
        }
      }
    }
  }
  .join {
    width: 560px;
    height: 90px;
    margin: 40px 50px;
    line-height: 90px;
    text-align: center;
    border-radius: 10px;
    color: @bg-ff;
    font-size: @font-size-xl;
    background: @color-green;
  }
}
</style>