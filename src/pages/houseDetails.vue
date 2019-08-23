<template>
  <div>
    <div class="container" :class="[modal?'modal':'']" v-show="show">
      <topbar :title="title" :back="toBack" :rightTool="rightTool" v-on:goBack="goBack"></topbar>
      <div class="house_video" @click="clickVideo" v-if="ifVideo">项目视频</div>
      <div class="main" :class="[overflowY?'':'main-overflow']">
        <div class="banner" :class="[imageList.length===0?'no-data':'']">
          <swiper
            :options="swiperOption"
            ref="mySwiper"
            @slideChangeTransitionStart="end"
            v-if="imageList.length>0"
          >
            <!-- slides -->
            <swiper-slide v-for="(item,index) in imageList" :key="index">
              <img :src="item.img_url" alt preview="1" width="100%" :height="swiperHeight">
            </swiper-slide>
          </swiper>
          <img :src="getImg('house-info.png')" alt v-if="imageList.length===0" width="100%">
          <p class="page">{{imageList.length===0?0:pagination}}/{{imageList.length}}</p>
          <p class="float-state">{{message.projectStatusString}}</p>
        </div>
        <div class="content">
          <div class="house-introduce">
            <p>
              <span>{{message.name}}</span>
              <span>{{message.effectiveTypeOfProjectString}}</span>
            </p>
            <ul class="tips">
              <li v-for="(item,index) in tips" :key="index">{{item}}</li>
            </ul>
            <p>
              <label class="text-style">均价</label>
              <span>
                <span>{{message.buildingPrice}}</span>元/平米
              </span>
            </p>
            <p>
              <label class="text-style">佣金</label>
              <span>{{message.moneyUnit|nullFormatter}}</span>
            </p>
            <p>
              <label class="text-style">性质</label>
              <span>{{message.buildingPropertyString|nullFormatter}}</span>
            </p>
            <p style="position: relative;">
              <label class="text-style">地址</label>
              <span>
                {{message.address|nullFormatter}}
                <i
                  @click="opera('位置')"
                  class="iconfont icon-location"
                  style="position:absolute;font-size:6vw;margin-top: -2vw;"
                ></i>
              </span>
            </p>
            <p>
              <label class="text-style">归属</label>
              <span>{{message.projectAgentString|nullFormatter}}</span>
            </p>
          </div>
          <div class="house-details artice-title">
            <p
              class="iconfont"
              @click="showContext"
              :class="[houseDetail?'active':'']"
              title="基本信息"
            >基本信息</p>
            <div class="context" v-show="houseDetail">
              <p>
                <label class="text-style">项目编号</label>
                <span>{{message.projectNumber|nullFormatter}}</span>
              </p>
              <p>
                <label class="text-style">区域范围</label>
                <span>{{message.province}}-{{message.city}}-{{message.area}}</span>
              </p>
              <p>
                <label class="text-style">项目类型</label>
                <span>{{message.projectTypeString|nullFormatter}}</span>
              </p>
              <p>
                <label class="text-style">开发商</label>
                <span>{{message.developer|nullFormatter}}</span>
              </p>
              <p>
                <label class="text-style">投资商</label>
                <span>{{message.investors|nullFormatter}}</span>
              </p>
              <p v-if="message.specificOpeningTime">
                <label class="text-style">开盘时间</label>
                <span>{{message.specificOpeningTime|nullFormatter}}</span>
              </p>
              <p>
                <label class="text-style">物业公司</label>
                <span>{{message.propertyCompany|nullFormatter}}</span>
              </p>
              <p>
                <label class="text-style">联系电话</label>
                <span>{{message.linkman}}{{message.salesPhone|nullFormatter}}</span>
              </p>
              <p>
                <label class="text-style">楼栋数</label>
                <span>{{message.numberOfFloor}}</span>
              </p>
            </div>
          </div>
          <div class="house-summary artice-title">
            <p
              class="iconfont"
              @click="showContext"
              :class="[houseSummary?'active':'']"
              title="项目简介"
            >项目简介</p>
            <div
              class="context"
              v-show="houseSummary"
              v-html="$options.filters.nullFormatter(message.projectProfile)"
            ></div>
          </div>
        </div>
      </div>
      <ul class="tool">
        <li v-for="(item,index) in tool" :key="index" @click="opera(item)">
          <i
            class="iconfont"
            :class="[item==='项目须知'?'icon-notice':item==='电话'?'icon-contact':item==='营销'?'icon-market':'']"
          ></i>
          <span>{{item}}</span>
        </li>
      </ul>
      <div class="slider" v-show="modal">
        <p class="slider-title">
          <span>项目须知</span>
          <i class="iconfont icon-remove" @click.stop="modal=false"></i>
        </p>
        <div class="context">
          <p class="rule" v-if="message.reportingType == 2">
            <label class="text-style">定点保护期</label>
            <span
              class="rule-text"
            >{{message.fixedPointProtectionPeriod.split(':').splice(0,2).join(':')}}</span>
          </p>
          <p class="rule" v-else>
            <label class="text-style">报备保护期</label>
            <span class="rule-text">{{message.proTimeAgentReport}}小时</span>
          </p>
          <p class="rule">
            <label class="text-style">报备规则</label>
            <span class="rule-text">{{message.reportRule || '暂无'}}</span>
          </p>
          <p class="rule">
            <label class="text-style">带看保护期</label>
            <span class="rule-text">{{message.proTimeAgentLook}}小时</span>
          </p>
          <p class="rule">
            <label class="text-style">下定保护期</label>
            <span class="rule-text">{{message.proTimeDownPayment}}小时</span>
          </p>
          <p class="rule">
            <label class="text-style">佣金规则</label>
            <span class="rule-text">{{message.moneyDes || '暂无'}}</span>
          </p>
        </div>
      </div>
      <a :href="getMobile" ref="phone" style="position: absolute;bottom:-100px;"></a>
      <!-- 控制项目驻场的电话 -->
      <actionsheet
        :menus="callList"
        v-model="callState"
        show-cancel
        @on-click-menu="callPhone"
        @on-click-mask="overflowY=true"
      >
        <p slot="header" class="actionsheet-title">选择驻场电话</p>
      </actionsheet>
      <!-- 控制营销的底部弹出层 -->
      <actionsheet
        :menus="callList"
        v-model="marketing"
        show-cancel
        @on-click-mask="overflowY=true"
        id="marketing"
      >
        <div slot="header">
          <h3>营销分享</h3>
          <div class="marketing">
            <span @click="shareAd">
              <img src="../assets/img/shareAd.png" alt>
              <p>速销海报</p>
            </span>
            <span @click="shareLink">
              <img src="../assets/img/sharelink .png" alt>
              <p>分享链接</p>
            </span>
            <span @click="shopShelf">
              <img src="../assets/img/shopShelf.png" alt>
              <p>{{isJion}}</p>
            </span>
          </div>
        </div>
      </actionsheet>

      <!-- 分享链接的弹层 -->
      <actionsheet
        :menus="callList"
        v-model="share_link"
        show-cancel
        @on-click-mask="overflowY=true"
        id="marketing"
      >
        <div slot="header">
          <h3>营销分享</h3>
          <div class="marketing">
            <span @click="shareWxfriend">
              <img src="../assets/img/weixinhaoyou.png" alt>
              <p>分享好友</p>
            </span>
            <span @click="shareWxFrienDring">
              <img src="../assets/img/pengyouquan.png" alt>
              <p>分享朋友圈</p>
            </span>
          </div>
        </div>
      </actionsheet>
      <!-- 2s后消失的弹框 -->
      <toast v-model="showToast" type="text" position="middle" width="38vw">{{toastTxt}}</toast>
    </div>
    <videoList v-show="!show" :bId="id" ref="child1" @status="showStatus"></videoList>
  </div>
</template>

<script>
import { Actionsheet, Toast } from "vux";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import videoList from "@/pages/video";

let CALL = [];
let shares = null;
export default {
  name: "house-details",
  mixins: [MIXINS],
  data() {
    return {
      show: true,
      id: "",
      title: "项目详情",
      toBack: true,
      rightTool: false,
      swiperOption: {
        initialSlide: 0,
        autoHeight: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true //修改swiper的父元素时，自动初始化swiper
      },
      swiperHeight: 0,
      pagination: 1,
      imageList: [],
      //简介
      tips: [],
      //基本信息
      message: {},
      //底部工具栏
      tool: ["项目须知", "电话", "营销", "项目客户"],
      modal: false, //弹框
      mobile: "", //联系电话
      //正文显示隐藏
      houseDetail: true,
      houseSummary: true,
      //顾问电话
      callList: {},
      callState: false,
      overflowY: true,
      showToast: false, //提示框
      toastTxt: "", //提示框内容
      ifVideo: "",
      marketing: false, //用于展示营销的底部弹出层
      isJion: "", //用于展示网店的状态
      isJoinShop: "", //用于网店状态的id
      share_link: false //分享链接
    };
  },
  created() {
    let buildID = this.$route.query.id;
    this.id = buildID;
    this.getData(buildID);
    this.getPhoneNumber(buildID);
    this.getHouseImages(buildID);
    this.updateSerivces(); //打开页面就获得分享服务100);
  },
  mounted() {
    let _width = document.querySelector(".banner").clientWidth;
    this.swiperHeight = `${(_width * 3) / 4}`;
  },
  methods: {
    // 播放视频
    clickVideo() {
      this.$refs.child1.goPlayer();
      this.show = false;
    },
    // 关闭视频页
    showStatus(val) {
      this.show = val;
    },
    end: function() {
      this.pagination = this.swiper.activeIndex + 1;
    },
    opera(item) {
      switch (item) {
        case "项目须知":
          this.showModal();
          break;
        case "电话":
          // this.callPhone()
          this.overflowY = false;
          if (CALL.length > 1) {
            this.callState = true;
            this.getCallMenus(CALL);
          } else {
            this.callPhone("one");
          }
          break;
        case "位置":
          this.$router.push({
            path: "buildingMap",
            query: {
              lng: this.message.longitude,
              lat: this.message.latitude
            }
          });
          break;
        case "项目客户":
          this.$router.push({
            path: "customerRecord",
            query: {
              buildingId: this.$route.query.id
            }
          });
        case "营销":
          this.marketing = true;
          break;
      }
    },
    showModal: function() {
      this.modal = true;
    },
    /**
     * 拼接callList特定数据格式
     */
    getCallMenus: function(arr) {
      let obj = {};
      arr.forEach(item => {
        obj[`menu${item.id}`] = `${item.name}:${item.mobile}`;
      });
      this.callList = Object.assign({}, obj);
    },
    /**
     * 拨打电话
     */
    callPhone: function(key) {
      // debugger
      if (key === "cancel") {
        this.overflowY = true;
        return;
      }
      if (key !== "one") {
        CALL.find(item => {
          if (item.id.toString() === key.split("menu")[1]) {
            // debugger
            this.mobile = item.mobile;
            return;
          }
        });
      } else {
        if (CALL.length) {
          this.mobile = CALL[0].mobile;
        } else {
          this.showToast = true;
          this.toastTxt = "项目没有分配驻场无法电话联系";
          return false;
        }
      }
      let _that = this;
      this.$vux.confirm.show({
        title: "是否呼叫项目驻场",
        content: `<span id="call-number" style="font-weight: bold;color: #333333;">${
          this.mobile
        }</span>`,
        confirmText: "立即呼叫",
        onConfirm: () => {
          // debugger
          this.overflowY = true;
          _that.$refs.phone.click();
        },
        onCancel: () => {
          this.overflowY = true;
        }
      });
    },
    showContext: function(event) {
      if (event.currentTarget.title === "基本信息") {
        this.houseDetail = !this.houseDetail;
      } else {
        this.houseSummary = !this.houseSummary;
      }
    },
    /**
     * 获取
     */
    getHouseImages: function(id) {
      let param = {
        id: id
      };
      this.$ajax
        .get("/api/projectPicture", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.imageList = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取项目详情
     */
    getData: function(id) {
      let param = {
        id: id
      };
      this.$ajax
        .get("/api/buildingById", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            let tipArrOne = [];
            let tipArrTwo = [];
            this.message = Object.assign({}, res.data);
            // 判断是否已经加入网店
            this.isJoinShop = res.data.isJoinShop;
            if (this.isJoinShop) {
              this.isJion = "网店下架";
            } else {
              this.isJion = "加入网店";
            }
            if (res.data.projectVideoId) {
              this.ifVideo = true;
            } else {
              this.ifVideo = false;
            }
            if (res.data.infrastructureString) {
              tipArrOne = res.data.infrastructureString.split(",");
            }
            if (res.data.featuresString) {
              tipArrTwo = res.data.featuresString.split(",");
            }
            this.tips = [...tipArrOne, ...tipArrTwo];
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取联系人电话
     */
    getPhoneNumber: function(id) {
      let param = {
        id: id
      };
      this.$ajax
        .get("/api/itemMemberByBuildingId", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            CALL = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    // 网店下架
    shopShelf() {
      if (this.isJion == "加入网店") {
        // 如果是在下架状态，则上架
        this.$ajax
          .post("/api/joinShop", { bId: this.$route.query.id })
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.isJoinShop = res.data;
              this.isJion = "网店下架";
              this.$vux.toast.text("已加入网店", "middle");
            } else {
              this.$vux.toast.text(res.message, "middle");
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      } else if (this.isJion == "网店下架") {
        // 如果是在上架状态，则下架
        this.$ajax
          .put("/api/managementProjectDeletion", {
            id: this.isJoinShop
          })
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.isJion = "加入网店";
              this.$vux.toast.text("网店已下架", "middle");
            } else {
              this.$vux.toast.text(res.message, "middle");
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      }
      this.marketing = false;
    },
    // 速效海报
    shareAd() {
      let wechatUrl = JSON.parse(localStorage.getItem("userMessage")).employee
        .wechatUrl;
      if (!wechatUrl) {
        this.$vux.toast.text("请在 我的--微信二维码 处上传二维码", "middle");
      } else {
        this.$router.push({
          name: "marketingMaterial",
          query: { id: this.$route.query.id }
        });
      }
    },
    // 分享链接
    shareLink() {
      // this.$vux.toast.text("功能暂未开放", "middle");
      this.share_link = true;
    },
    // 分享好友
    shareWxfriend() {
      this.shareAction("weixin", "WXSceneSession"); /*微信好友*/
    },
    shareWxFrienDring() {
      this.shareAction("weixin", "WXSceneTimeline"); /*微信朋友圈*/
    },
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
      let _this = this;
      var s = null;
      if (!id || !(s = shares[id])) {
        _this.$vux.toast.text("无效的分享服务！", "middle");
        return;
      }
      if (s.authenticated) {
        // _this.$vux.toast.text("已授权", "middle");
        _this.shareMessage(s, ex);
      } else {
        // that.$vux.toast.text("未授权", "middle");
        s.authorize(
          function() {
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
      let brokerId = localStorage.getItem("userMessageId");
      let img =
        _this.imageList.length > 1
          ? _this.imageList[0].img_url.split("?")[0]
          : "http://img1.jjdc.net/display/b16ee1e6264aa25170890b27e3401e96.jpg";
      var msg = {
        // href: "http://" + _this.$location + "/public/newhouse-detail.html?type=1&&brokerId=" + brokerId+"&&proId="+_this.id,
        href:
          this.$ipconfig +
          "public/newhouse-detail.html?type=2%26brokerId=" +
          brokerId +
          "%26proId=" +
          _this.id,
        title: _this.message.name,
        content:
          _this.message.buildingPrice + "元/平方米" + _this.message.address,
        thumbs: [img + "?w=120&h=60&m=crop"], //分享消息的缩略图:图片小于20K
        extra: {
          scene: ex
        }
      };
      // 发送分享
      s.send(
        msg,
        function(res) {
          // _this.$vux.toast.text("分享成功", "middle");
          _this.share_link = false;
        },
        function(e) {
          _this.$vux.toast.text("分享失败", "middle");
          _this.share_link = false;
        }
      );
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    getMobile: function() {
      return `tel://${this.mobile}`;
    }
  },
  filters: {
    nullFormatter: function(val) {
      if (!val) {
        return "未知";
      } else {
        return val;
      }
    }
  },
  components: {
    swiper,
    swiperSlide,
    Actionsheet,
    topbar,
    Toast,
    videoList
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";
// 项目视频
.house_video {
  padding: 1vw 2vw;
  position: absolute;
  z-index: 100;
  right: 5vw;
  top: 2.5vw;
  background-color: #5ca52a;
  color: #fff;
  border-radius: 1vw;
  font-size: 3.2vw;
}
#marketing {
  /deep/ .weui-actionsheet__menu {
    height: 40vw;
    .weui-actionsheet__cell {
      > div {
        width: 100%;
        height: 100%;
        .marketing {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 5vw;
          > span {
            flex: 1;
            img {
              display: inline-block;
              width: 12.5vw;
              height: 12.5vw;
            }
          }
        }
      }
    }
  }
}
.icon-market {
  font-size: 5.5vw !important;
  margin: 1.5vw 0;
  color: #333;
}
.main {
  padding-bottom: 110px;
  background-color: @bg-f5;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  &-overflow {
    overflow-y: hidden;
  }
}
.modal {
  position: absolute;
  &:after {
    z-index: 99;
  }
  .main {
    overflow-y: hidden;
  }
}

/deep/ .swiper-container {
  width: 100%;
  min-height: 300px;
  background-color: @bg-ff;
  img {
    /*width: 100%;*/
    &.ignore {
      /*height: 333px;*/
    }
    vertical-align: bottom;
  }
}

.banner {
  position: relative;
  &.no-data {
    /*height: 400px;*/
    > img {
      vertical-align: bottom;
    }
  }
  .page {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background-color: #ffffff;
    padding: 6px 15px;
    z-index: 9;
  }
  .float-state {
    width: 120px;
    padding: 10px 0;
    text-align: center;
    background-color: @color-orange;
    color: @color-white;
    font-style: italic;
    letter-spacing: 10px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    position: absolute;
    top: 30px;
    left: 0;
    z-index: 9;
  }
}

.content {
  /*position: absolute;
    top: 380px;
    bottom: 80px;
    left: 0;
    right: 0;
    background-color: #cccccc;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;*/
}

.house-introduce {
  padding: 30px;
  background-color: @bg-ff;
  > p {
    margin-top: 20px;
    line-height: 1.8;
    &:first-of-type {
      margin-top: 0px;
      > span {
        border: 1px solid @color-orange;
        color: @color-orange;
        padding: 0 10px;
        font-size: @font-size-xs;
        &:first-of-type {
          @font-size-h1();
          color: @color-base;
          margin-right: 10px;
          border: 0;
          padding: 0;
        }
      }
    }
    &:nth-of-type(n + 2) {
      display: flex;
      > span {
        flex: 1;
        word-break: break-all;
      }
    }
    &:nth-of-type(n + 3) {
      > span {
        color: @color-main;
      }
    }
    > label {
      color: @color-minor;
      display: inline-block;
      min-width: 120px;
      margin-right: 20px;
      & + span {
        color: @color-orange;
        > span {
          @font-size-h3();
        }
      }
    }
  }
  .tips {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    > li {
      min-width: 50px;
      border: 1px solid #c9c9c9;
      border-radius: 6px;
      padding: 0 8px;
      text-align: center;
      margin-right: 10px;
      margin-top: 8px;
      font-size: @font-size-xs;
      &:nth-of-type(4n) {
        border-color: @color-green;
        background-color: @bg-E7;
        color: @color-green;
      }
      &:nth-of-type(4n + 1) {
        border-color: @color-orange;
        background-color: @bg-FB;
        color: @color-orange;
      }
      &:nth-of-type(4n + 2) {
        border-color: @color-blue;
        background-color: @bg-EC;
        color: @color-blue;
      }
      &:nth-of-type(4n + 3) {
        border-color: @color-sky-blue;
        background-color: @bg-EA;
        color: @color-sky-blue;
      }
    }
  }
}

.house-details {
  > .context {
    > p {
      margin-top: 20px;
      line-height: 1.8;
      display: flex;
      > label {
        color: @color-minor;
        display: inline-block;
        min-width: 120px;
        margin-right: 20px;
      }
      > span {
        flex: 1;
        word-break: break-all;
      }
    }
  }
}

.house-summary {
  .context {
    margin-top: 20px;
    line-height: 1.8;
    /deep/ img {
      max-width: 100%;
    }
  }
}

.artice-title {
  margin-top: 20px;
  padding: 30px;
  background-color: @bg-ff;
  > p {
    @font-size-h1();
    font-size: @font-size-xxl;
    position: relative;
    &:after {
      content: "\e628";
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      font-size: @font-size-icon;
      color: @color-assist;
    }
    &.active {
      border-bottom: 1px solid @border-eb;
      padding-bottom: 30px;
      &:after {
        content: "\e627";
        margin-top: -15px;
      }
    }
  }
}

.tool {
  height: 100px;
  display: flex;
  background-color: @bg-ff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1px solid @border-eb;
  > li {
    flex: 1;
    display: inherit;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &:last-of-type {
      flex: 2;
      background-color: @color-green;
      color: #ffffff;
      > span {
        font-size: @font-size-xl;
        margin: 0;
      }
    }
    > i {
      font-size: @font-size-icon;
    }
    > span {
      font-size: @font-size-s;
      margin-top: -8px;
    }
  }
}

.slider {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: @bg-ff;
  > p {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 0;
    left: 0;
    z-index: 9;
    background-color: @bg-ff;
    > i {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      font-size: @font-size-icon;
      z-index: 100;
    }
  }
  > .context {
    padding: 80px 30px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-top: 1px solid @border-eb;
    max-height: 600px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    > p {
      margin-bottom: 20px;
      line-height: 1.8;
      &:first-of-type {
        margin-top: 20px;
      }
      &.rule {
        display: flex;
        .rule-text {
          flex: 1;
        }
      }
      > label {
        color: #666666;
        display: inline-block;
        min-width: 150px;
        margin-right: 30px;
      }
    }
  }
}

.confirm-mobile {
  margin-top: 40px;
  color: @color-main;
}

.highlight-red {
  color: red !important;
}

/deep/.weui-actionsheet {
  /*width: 710px;*/
  padding: 20px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0);
  .weui-actionsheet__menu {
    max-height: 400px;
    overflow-y: scroll;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    padding-top: 100px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    .weui-actionsheet__cell {
      font-size: 30px;
      color: @color-black;
      height: 100px;
      border-top: 1px solid @border-ea;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &:first-of-type {
        position: absolute;
        top: 20px;
        right: 20px;
        left: 20px;
        background-color: @bg-ff;
        z-index: 9;
      }
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
    &:before {
      border: none;
    }
    .weui-actionsheet__cell {
      font-size: 30px;
      color: @color-black;
      padding: 0;
    }
  }
  .actionsheet-title {
    @font-size-h1();
    font-size: @font-size-xxl;
  }
}
</style>
