<template>
  <div id="marketingMaterial">
    <topbar
      :title="title"
      :back="toBack"
      :rightTool="rightTool"
      v-on:goBack="goBack"
      class="topbar"
    >
      <template slot="topbar-right">
        <div class="share">详情</div>
      </template>
    </topbar>
    <!-- 上面的taber -->
    <div class="taber" :class="ifHouseDet?'taber_fixed':''" v-if="ifHouseDet">
      <tab :line-width="1" :custom-bar-width="getBarWidth">
        <tab-item
          :selected="index == defaultSelected"
          v-for="(item,index) in titleData"
          @on-item-click="handler(index)"
        >{{item}}</tab-item>
      </tab>
    </div>
    <!-- 左边切 -->
    <div v-if="defaultSelected==0" :class="!ifHouseDet?'taber_nofixed':''">
      <div class="left_tab fl">
        <div
          v-for="(item,index) in leftData"
          @click="handlerLeft(index)"
          :class="index==defaultSelectedLeft?'left_active':''"
        >{{item}}</div>
      </div>
      <div class="fl ad_page">
        <!-- 置业顾问 -->
        <div v-if="defaultSelectedLeft == 0">
          <span v-for="item in defaultZhiye" @click="goPics(item.name)">
            <img :src="item.src" alt>
            <p>{{item.name}}</p>
          </span>
          </span>
        </div>
        <!-- 项目 -->
        <div v-if="defaultSelectedLeft == 1">
           <span v-for="item in defaultPro" @click="goPics(item.name)">
            <img :src="item.src" alt>
            <p>{{item.name}}</p>
          </span>
          </span>
        </div>
      </div>
    </div>
    <!-- 朋友圈 -->
    <div class="friendCircle" v-if="defaultSelected==1">
      <div v-for="item in friendCircle">
        <div v-html="item.conent"></div>
        <div class="clearfix">
          <span class="fl">已分享11次</span>
          <span class="fr" @click="share(item.conent)">
            <img src="../assets/img/0.png" alt> 分享
          </span>
        </div>
      </div>
    </div>
    <!-- 底部弹框组件 -->
    <x-dialog v-model="showActionsheet" class="dialog-demo">
      <div class="dialog">
        <p
          v-clipboard:copy="copyContent"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          @click="sharePics"
        >为文案配图片分享</p>
        <p
          v-clipboard:copy="copyContent"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          @click="shareDirect"
        >文案直接分享</p>
        <p @click="shareCancel">取消</p>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Tab, TabItem, XDialog } from "vux";
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
let shares = null;
export default {
  mixins: [MIXINS],
  data() {
    return {
      title: "营销素材",
      toBack: true,
      rightTool: false,
      getBarWidth: function(index) {
        console.log(index);
        return (index + 1) * 22 + "px";
      },
      ifHouseDet: true, //false是从项目详情进来的，
      titleData: ["营销海报", "朋友圈发什么"],
      defaultSelected: 0, //头部选择选中的值
      leftData: ["置业顾问", "项目", "朋友圈"],
      defaultSelectedLeft: 0, //选择右边的切换选中的值
      defaultZhiye: [
        { src: require("../assets/img/jjrcc_sg.png"), name: "传承" },
        { src: require("../assets/img/jjrkj_sg.png"), name: "简洁风格" },
        { src: require("../assets/img/jjrgs_sg.jpg"), name: "光速看房" },
        { src: require("../assets/img/jjrhr_sg.jpg"), name: "红日" },
        { src: require("../assets/img/jyfg2.jpg"), name: "卡券" },
        { src: require("../assets/img/jjrnl_sg.jpg"), name: "奶酪" }
      ],//默认置业
      defaultPro:[
        { src: require("../assets/img/fycr_sg1.jpg"), name: "春日" }
      ],//默认项目
      friendCircle: [
        {
          conent:
            "谷歌商店上架的应用有着非常多的政策方面的限制，一不留神就是来自谷歌的邮件警告，三次警告或严重者直接下架处理或者封掉开发者账号。三次警告或严重者直接下架处理或者封掉开发者账号。谷歌商店上架的应用有着非常多的政策方面的限制，一不留神就是来自谷歌的邮件警告，三次警告或严重者直接下架处理或者封掉开发者账号。三次警告或严重者直接下架处理。",
          size: "111"
        },
        {
          conent:
            "辅导费鬼地方规范好北化股份纪念馆好久没那好搞的观点发而非官方个很反感过的",
          size: "222"
        }
      ],
      showActionsheet: false, //控制底部弹出层的显示和隐藏
      copyContent: "" //分享的内容
    };
  },
  created() {
    //  this.$route.query.id存在是从项目详情进来
    if (this.$route.query.id) {
      this.ifHouseDet = false;
      this.leftData = ["项目"];
      this.title = "速效海报";
      this.defaultSelectedLeft =1;
    }
    this.updateSerivces(); //打开页面就获得分享服务100);
  },
  methods: {
    // 选择头部切换
    handler(val) {
      this.defaultSelected = val;
    },
    // 选择右边的切换
    handlerLeft(val) {
      this.defaultSelectedLeft = val;
    },
    // 点击分享的时候
    share(val) {
      this.copyContent = val; //把需要复制的内容赋值给copyContent
      this.showActionsheet = true;
    },
    //点击“为文案配图片分享”
    sharePics() {
      this.showActionsheet = false;
    },
    //点击“文案直接分享”
    shareDirect() {
      this.shareHref(); //调用分享的方法
      this.showActionsheet = false;
    },
    shareCancel() {
      this.showActionsheet = false;
    },
    onCopy: function(e) {
      this.$vux.toast.text("成功复制", "middle");
    },
    onError: function(e) {
      this.$vux.toast.text("复制失败", "middle");
    },
    // 点击图片进入相应的页面
    goPics(val){
      console.log(val);
      this.$router.push({path:"adComponent",query:{goName:val}})
    },
    /**
     * 分享开始
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
      let _this = this;
      var msg = {
        type: "text",
        content: _this.copyContent,
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
      let _this = this;
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
      plus.nativeUI.actionSheet(
        {
          cancel: "取消",
          buttons: bts
        },
        function(e) {
          var i = e.index;
          if (i > 0) {
            _this.shareAction(ids[i - 1].id, ids[i - 1].ex);
          }
        }
      );
    }
  },
// beforeRouteLeave(to, from, next) {
// //  当进入adComponent页需要缓存页面
//   if (to.path == "/adComponent") {
//     this.$route.meta.keepAlive= false;
//     console.log("我是进入adComponent:"+this.$route.meta.keepAlive);
//   }else{
//     this.$route.meta.keepAlive= true;
//      console.log("我是进入其他页面:"+this.$route.meta.keepAlive);
//   }
//   next()
// },
  components: {
    topbar,
    Tab,
    TabItem,
    XDialog
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/CSS/config";
#marketingMaterial {
  .topbar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 11vw;
    .share {
      position: absolute;
      top: 2vw;
      right: 2vw;
      color: #04be02;
    }
  }
  .taber_fixed {
    position: fixed;
    left: 0;
    top: 11vw;
  }
  .taber_nofixed {
    > div {
      margin-top: 12vw;
      top: 0vh;
      >div {
        background-color: #fff;
      }
    }
  }
  .taber {
    width: 100vw;
    height: 11vw;
    border-top: 0.3vw solid #f5f5f5;
    /deep/ .vux-tab-container {
      height: 10vw;
      .vux-tab {
        height: 10vw;
        .vux-tab-item {
          line-height: 10vw;
          font-size: 4vw;
        }
      }
    }
  }
    .left_tab {
        position: fixed;
        top: 12vh;
        left: 0;
        display: inline-block;
        width: 25vw;
        height: 85vh;
        text-align: center;
        background-color: #f5f5f5;
        > div {
          padding: 3.5vw 0;
        }
        .left_active {
          background-color: #fff;
          font-size: 4vw;
          font-weight: 600;
        }
      }
  
  .ad_page {
    margin-left: 25vw;
    margin-top: 12vh;
    background-color: #fff;
    width: 75vw;
    min-height: 87.9vh;
    > div {
      > span {
        float: left;
        margin-top: 2vw;
        text-align: center;
        margin-left: 2vw;
        &:nth-of-type(2n) {
          margin-left: 4vw;
        }
        img {
          display: inline-block;
          width: 32vw;
          height: 32vh;
        }
      }
    }
     
  }
  .friendCircle {
    margin-top: 22vw;
    > div {
      background-color: #fff;
      padding: 4vw 5vw 2vw;
      margin-top: 2vw;
      &:nth-of-type(1) {
        margin-top: 0;
      }
      > .clearfix {
        width: 100%;
        margin-top: 2vw;
        span {
          color: #9d9d9d;
          &:nth-of-type(2) {
            color: #04be02;
          }
          img {
            display: inline-block;
            width: 4.5vw;
            height: 4.5vw;
            vertical-align: middle;
          }
        }
      }
    }
  }
  /deep/.weui-dialog {
    bottom: 5vw;
    top: auto;
    width: 100vw;
    background-color: transparent;
    .dialog {
      > p {
        font-size: 4vw;
        height: 10vw;
        line-height: 10vw;
        background-color: #fff;
        &:nth-last-of-type(1) {
          margin-top: 2vw;
        }
        &:nth-of-type(1) {
          border-bottom: 0.2vw solid #f5f5f5;
        }
      }
    }
  }
}
</style>

