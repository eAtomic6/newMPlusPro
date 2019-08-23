<template>
  <div id="app" class="has-topbar has-bottombar">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- 掉公提醒弹框 -->
    <Confirm
      title
      v-model="isConfirm"
      @on-confirm="onConfirm"
      @on-cancel="goCheck"
      :close-on-confirm="false"
      confirm-text="知道了"
      cancel-text="立即查看"
    >
      <span class="iconfont icon-window_notice iconfontShow_notice"></span>
      <p>{{tipWord}}</p>
    </Confirm>
  </div>
</template>

<script>
import "./assets/font/iconfont.css";
import { Confirm } from "vux";
export default {
  name: "App",
  components: {
    Confirm
  },
  data() {
    return {
      tipWord: "", //弹出框的内容
      checkId: "", //当前的id
      isConfirm: false, //控制弹出框的显示和隐藏
      messageArr: [] //储存弹框的信息
    };
  },
  methods: {
    // 判断弹框
    toTip() {
      if (this.messageArr.length == 0) {
        this.isConfirm = false;
        return false;
      }
      this.tipWord = this.messageArr[0].text;
      this.checkId = this.messageArr[0].id;
      this.isConfirm = true;
    },

    onConfirm() {
      this.messageArr.shift();
      this.toTip();
    },
    goCheck() {
      this.$store.commit("changeCheck", true);
      this.messageArr.shift();
      this.$router.push({
        path: "customerInfoComplete",
        query: {
          c_id: this.checkId
        }
      });
    }
  },
  watch: {
    $route() {
      if (!this.$store.state.isChecking) this.toTip(); // 判断是否在查看详情,不是就继续弹框
    }
  },
  created() {
    let url = this.$HTTP;
    // console.log(`我是socket的url地址：${url}`);

    // let socket = io.connect(
    //   url + "?token=" + localStorage.getItem("token"),
    //   url == "http://s224.360fdc.com:18088" ? "" : { path: "/ws/socket.io" }
    // );
    // let _this = this;
    // socket.on("sendCustomerMessage", function(data) {
    //   console.log(data, "掉公提醒消息");
    //   _this.messageArr.push(data); //后台单条推，push到数组里
    //   _this.toTip(); //推一条弹一个框
    // });
  }
};
</script>

<style lang="less">
@import "~@/assets/CSS/config";

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: @font-size-l;
  background: @bg-f5;
  font-family: "microsoft yahei", Verdana, Arial, Helvetica, sans-serif;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-appearance: none;
  overflow: hidden;
  overflow-y: scroll;
}
.add_bg {
  background: @bg-ff;
}
.iconfontShow_notice {
  color: #333;
  font-size: 10vw!important;
}
a {
  font-family: "MicrosoftYaHei";
}

.container {
  width: 100%;
  height: 100%;
  position: absolute;
}

.main {
  width: 100%;
  height: 100%;
  padding-top: 80px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.weui-dialog__btn_default {
  color: #3cc51f;
}
.weui-dialog__btn_primary {
  color: #353535;
}

.modal {
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.6);
  }
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

p {
  margin: 0;
}

h4 {
  margin: 0;
  padding: 0;
}

img {
  content: normal !important;
}

.unselect {
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.text-style {
  text-align: justify;
  text-justify: distribute-all-lines;
  /*ie6-8*/
  text-align-last: justify;
  /* ie9*/
  -moz-text-align-last: justify;
  /*ff*/
  -webkit-text-align-last: justify;
  /*chrome 20+*/
}

.input-info {
  border: 0px;
  outline: none;
  display: inline-block;
  padding: 0;
  box-shadow: none;
  resize: none;
  font-family: MicrosoftYaHei;

  &::-webkit-input-placeholder {
    color: #b0b0b0;
  }
}

.icon-back-rotate {
  position: relative;

  &::before {
    content: "\e60f";
    font-size: @font-size-icon;
    display: inline-block;
    transform: translateY(-50%) rotate(180deg);
    position: absolute;
    top: 50%;
    right: 0;
  }
}

.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
}

/*@media screen and (-webkit-min-device-pixel-ratio:0){!* chrome*!
    .text-style:after{
      content:".";
      display: inline-block;
      width:100%;
      overflow:hidden;
      height:0;
    }
  }*/

#app {
  width: 100%;
  height: 100%;
  /*overflow-y: scroll;
  -webkit-overflow-scrolling: touch;*/
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  /*增加头部适配层*/
  /*.has-topbar {
    height: 100%;
    box-sizing: border-box;
    padding-top: 44px;
    &:before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 44px;
      background-color: #000000;
      z-index: 9998;
    }
  }*/

  /*增加底部适配层*/
  // .has-bottombar {
  //   height: 100%;
  //   box-sizing: border-box;
  //   padding-bottom: 34px;
  //   &:after {
  //     content: "";
  //     z-index: 9998;
  //     position: fixed;
  //     left: 0;
  //     bottom: 0;
  //     width: 100%;
  //     height: 34px;
  //     background: #ffffff;
  //   }
  // }

  /*导航操作栏上移*/
  // .bottom-menu-fixed {
  //   bottom: 34px;
  // }
}

// vux 弹层 确定取消 按钮 样式修改
.dp-header .dp-item {
  &.dp-left {
    color: @color-main;
    padding-left: 4vw;
    font-size: 4vw;

    &:hover {
      background-color: transparent;
    }
  }

  &.dp-right {
    .dp-left;
    padding-left: 0;
    color: @color-green;
    padding-right: 4vw;
  }
}

// 二维码弹层
.dialog-ewm {
  /deep/.weui-dialog {
    background-color: transparent;
  }

  /deep/.dialog-bj {
    background-color: @bg-ff;

    .p1 {
      font-size: 36px;
      padding-top: 60px;
    }

    .p2 {
      font-size: 28px;
      padding-top: 24px;
    }

    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 340px;
      padding-bottom: 30px;

      > img {
        width: 340px;
        height: 340px;
        display: block;
      }
    }
  }

  /deep/.dialog-icon {
    padding-top: 40px;

    .icon-exit {
      font-size: 80px;
      color: @color-white;
    }
  }
}

// 确定取消弹层
.dialog-confirm {
  /deep/.weui-dialog {
    .weui-dialog__title {
      font-size: 4vw;
      font-weight: bold;
    }

    .weui-dialog__hd {
      padding: 6.667vw 4vw 4vw;
    }

    .weui-dialog__bd {
      font-size: 3.733vw;
      padding: 0 4vw 5.333vw;
      text-align: left;
      color: @color-main;
      line-height: 5.6vw;
    }

    .weui-dialog__ft {
      font-size: 3.733vw;
      line-height: 11.467vw;
    }

    .weui-dialog__btn_primary {
      color: @color-green;
    }
  }
}

//toast提示
.weui-toast {
  border-radius: 35px;
  background: rgba(0, 0, 0, 0.6);
}

.weui-toast_text .weui-toast__content {
  width: auto;
  max-width: 500px;
  padding: 0 35px;
  line-height: 70px;
  font-size: 28px;
  box-sizing: border-box;
}

// 加载中状态
.customer-loading {
  /deep/.weui-toast {
    min-height: 17vw;
    margin-top: -8.5vw;
    top: 50%;
  }
}

@media screen and (max-height: 382px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/1/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/1/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/1/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/1/04.png);
  }
}
@media screen and (min-height: 382px) and (max-height: 481px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/2/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/2/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/2/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/2/04.png);
  }
}
@media screen and (min-height: 481px) and (max-height: 569px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/3/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/3/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/3/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/3/04.png);
  }
}
@media screen and (min-height: 569px) and (max-height: 622px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/4/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/4/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/4/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/4/04.png);
  }
}
@media screen and (min-height: 622px) and (max-height: 668px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/5/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/5/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/5/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/5/04.png);
  }
}
@media screen and (min-height: 668px) and (max-height: 942px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/6/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/6/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/6/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/6/04.png);
  }
}
@media screen and (min-height: 942px) and (max-height: 1105px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/7/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/7/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/7/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/7/04.png);
  }
}
@media screen and (min-height: 1105px) {
  .guide-img-bj1 {
    background-image: url(./assets/img/guide/8/01.png);
  }
  .guide-img-bj2 {
    background-image: url(./assets/img/guide/8/02.png);
  }
  .guide-img-bj3 {
    background-image: url(./assets/img/guide/8/03.png);
  }
  .guide-img-bj4 {
    background-image: url(./assets/img/guide/8/04.png);
  }
}
</style>
