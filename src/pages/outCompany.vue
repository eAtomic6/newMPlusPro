<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    <div class="hint">
      <p>您的账号绑定手机号是 {{mobile.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")}} ，请点击“获取验 证码”：</p>
    </div>
    <div class="code">
      <input type="number" placeholder="请输入验证码" ref="code">
      <span v-show="sendAuthCode" class="auth_text" @click="getAuthCode">获取验证码</span>
      <span v-show="!sendAuthCode" class="auth_text forbid">重新获取({{auth_time}}s)</span>
    </div>
    <div class="next" @click="next">退出该企业</div>
    <!-- <Confirm v-model='value' @on-confirm="confirm" title="退出该企业" content='退出企业后，您的账号将不可登录，您账号名下的用户将掉入公盘，请确认是否退出企业！'></Confirm> -->
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import { Confirm } from "vux";

export default {
  mixins: [MIXINS],
  components: {
    topbar,
    Confirm
  },
  data() {
    return {
      getBack: true,
      title: "退出该企业",
      // value: false,
      sendAuthCode: true,
      auth_time: 0,
      mobile: this.$route.query.mobile,
      id: "",
      captcha: ""
    };
  },
  created() {
    this.id = JSON.parse(localStorage.getItem("userMessage")).id;
  },
  methods: {
    next() {
      this.captcha = this.$refs.code.value;
      let reg = /^\d{4}$/;
      if (!reg.test(this.captcha)) {
        this.$vux.toast.text("请输入正确的验证码", "middle");
        return;
      }
      // this.value = !this.value;
      this.$router.push({
        path: "/customerHeir",
        query: {
          type: "outCompany",
          id: this.id,
          captcha: this.captcha
        }
      });
    },
    getAuthCode() {
      let param = {
        mobile: this.mobile,
        type: 2,
        useVoice: false
      };
      this.$ajax
        .get("/api/captcha", param)
        .then(res => {
          res = res.data;
          if (res.status !== 200) {
            this.$vux.toast.text(res.message, "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
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
    },
    confirm() {
      // let param = {
      //   captcha:this.captcha
      // }
      // this.$ajax.delete('/api/personal/leaving',param).then(res=>{
      //   res=res.data
      //   if(res.status!=200){
      //     this.$vux.toast.text(res.message, 'middle')
      //   }else{
      //     localStorage.clear()
      //     localStorage.setItem('guide',true)
      //     this.$router.push('/login')
      //   }
      // }).catch(err => {
      //     this.$vux.toast.text(this.$error[err.response.status], "middle");
      //   });
      // this.$router.push({
      //   path: "/customerHeir",
      //   query: {
      //     type: "outCompany",
      //     id: this.id,
      //     captcha: this.captcha
      //   }
      // });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main {
  .hint {
    width: 750px;
    height: 167px;
    vertical-align: middle;
    display: table-cell;
    padding: 0 30px 0 30px;
    font-size: @font-size-m;
    box-sizing: border-box;
    color: @color-minor;
  }
  .code {
    width: 750px;
    background-color: @bg-ff;
    padding: 0 30px 0 28px;
    box-sizing: border-box;
    position: relative;
    input {
      outline: none;
      border: none;
      width: 500px;
      font-size: @font-size-m;
      padding: 40px 0;
      &::-webkit-input-placeholder {
        color: #d1d1d1;
        font-size: @font-size-m;
      }
    }
    .auth_text {
      text-align: right;
      font-size: @font-size-m;
      color: @color-green;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 30px;
    }
    .forbid {
      color: @color-assist;
    }
  }
  .next {
    width: 690px;
    height: 90px;
    line-height: 90px;
    text-align: center;
    color: #fff;
    font-size: @font-size-l;
    background: @color-green;
    border-radius: 6px;
    margin: 57px 30px;
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