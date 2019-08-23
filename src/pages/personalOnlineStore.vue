<template>
  <div :class="scroll_show?'scrollShow':''">
    <div class="header">
      <topbar :title="title" :back="getBack" v-on:goBack="goBack">
        <template slot="topbar-right">
          <div class="share" @click="shareHref">分享</div>
        </template>
      </topbar>
    </div>
    <!-- 头部个人信息 -->
    <div class="header_info">
      <div class="info iconfont" @click="goPreson">
        <img :src="personInfo.headImg" alt v-if="personInfo.headImg">
        <img src="../assets/img/customer-default.png" alt v-else>
        <span>
          <p>{{personInfo.name}}的网店</p>
          <p v-if="personInfo.depName">{{personInfo.depName}}</p>
          <p v-else>--</p>
        </span>
      </div>
    </div>
    <div class="listing">
      <div class="number">
        <div>
          <p>{{personInfo.ssrfk}}</p>
          <p>30日访客</p>
        </div>
        <div>
          <p>{{personInfo.ssrld}}</p>
          <p>30日来电</p>
        </div>
        <div>
          <p>{{personInfo.ljfwrs}}</p>
          <p>粉丝数</p>
        </div>
      </div>
      <div @click="goPath('propertyManagement')" class="listing_house iconfont">
        项目管理
        <badge :text="badge_text"></badge>
      </div>
    </div>
    <!-- 访客分析 -->
    <div class="visitorAnalysis">
      <p>访客分析</p>
      <div class="clearfix">
        <div>
          <p>{{personInfo.ljfwrs}}</p>
          <p>累计访客人数</p>
        </div>
        <div>
          <p>
            <span>今日新增</span>
            <span>{{personInfo.jrxz}}</span>
            <span
              :class="personInfo.jssrxz == 0?'noClient':''"
              class="todayData"
              :style="'width:'+(personInfo.jrxz*30/personInfo.jssrxz) +'vw'"
            ></span>
            <span></span>
          </p>
          <p>
            <span>近7日新增</span>
            <span>{{personInfo.jqrxz}}</span>
            <span
              :class="personInfo.jssrxz == 0?'noClient':''"
              class="noClient weekData"
              :style="'width:'+(personInfo.jqrxz*30/personInfo.jssrxz)+'vw'"
            ></span>
          </p>
          <p>
            <span>近30日新增</span>
            <span>{{personInfo.jssrxz}}</span>
            <span
              v-if
              :class="personInfo.jssrxz == 0?'noClient':'hasMonthClient'"
              style="width:30vw;"
            ></span>
          </p>
        </div>
      </div>
      <div
        class="clearfix clientLog iconfont"
        @click="goPath('currentVisitor')"
        v-if="visitImg.length>0"
      >
        最近来访记录
        <img v-for="item in visitImg" :src="item" alt>
        <i v-if="visitImgTotal>3"></i>
      </div>
      <div
        v-if="browseImg.length>0"
        class="clearfix clientLog iconfont"
        @click="goPath('maxVisitors')"
      >
        浏览最多的访客
        <img v-for="item in browseImg" :src="item" alt>
        <i v-if="browseTotal>3"></i>
      </div>
    </div>
    <!-- 房源/店铺分析 -->
    <div class="visitorAnalysis Shop">
      <p>项目/店铺分析</p>
      <div class="clearfix">
        <div>
          <p>{{personInfo.ljlll}}</p>
          <p>累计浏览量</p>
        </div>
        <div>
          <p>
            <span>项目浏览数</span>
            <span>{{personInfo.fyllcs}}</span>
            <span :class="personInfo.fyllcs==0?'noClient':'shopBrowse'" style="width:30vw;"></span>
          </p>
          <p>
            <span>店铺浏览数</span>
            <span>{{personInfo.dpllcs}}</span>
            <span :class="personInfo.dpllcs == 0?'noClient':'houseBrowse'" style="width:30vw;"></span>
          </p>
        </div>
      </div>
      <div class="clearfix clientLog iconfont" @click="goPath('maxVisitedHouse')">访问最多的项目</div>
      <div class="clearfix clientLog iconfont" @click="goPath('maxTransmitHouse')">被转发最多的项目</div>
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import { Badge } from "vux";
import { setTimeout } from "timers";
let shares = null;

export default {
  mixins: [MIXINS, FILTERS],
  data() {
    return {
      getBack: true,
      title: "我的网店",
      title_show: "",
      // 滚动
      scroll_show: false,
      badge_text: "", //项目管理数量
      personInfo: {}, //个人信息的
      visitImg: [], //最近来访记录的头像
      browseImg: [], //浏览最多记录的头像
      browseTotal: "",
      visitImgTotal: ""
    };
  },
  created() {
   
    // 从缓存中取得个人信息
    this.getData();
    this.getVisitImg();
    this.getBrowerNum(); //浏览最多访客
    this.updateSerivces(); //打开页面就获得分享服务100);
  },
  mounted() {
    // 滚动
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    // 获得个人信息的接口
    getData() {
      this.$ajax
        .get("/api/onlineStore/overview")
        .then(res => {
          if (res.status == 200) {
            this.personInfo = res.data.data;
            let storageInfo = JSON.parse(localStorage.getItem("userMessage"));
            this.personInfo.name = storageInfo.name;
            this.personInfo.depName = storageInfo.companyName;
            this.personInfo.headImg =
              storageInfo.headImg ||
              "http://img1.jjdc.net/display/44867a61c1d29132ad9e01c16aec63f8.jpg";
            this.badge_text = res.data.data.xmsl;
            this.title_show = res.data.data.name;
          } else {
            this.$vux.toast.text(res.data.message, "middle");
          }
        })
        .catch(error => {
          if (error.response.status == 403) {
           this.$vux.toast.text(error, "middle");
          }
        });
    },
    // 获得访问记录的前三个
    getVisitImg() {
      this.$ajax
        .get("/api/onlineStore/visitRecord", {
          pageNum: 1,
          pageSize: 3
        })
        .then(res => {
          if (res.status == 200) {
            //判断有没有返回信息
            if (res.data.data.list.length > 0) {
              this.visitImgTotal = res.data.data.total;
              res.data.data.list.forEach(element => {
                // 且head_img还存在
                if (element.head_img) {
                  this.visitImg.push(element.head_img);
                }
              });
            }
          } else {
            this.$vux.toast.text(res.data.message, "middle");
          }
        });
    },
    // 浏览最多访客
    getBrowerNum() {
      this.$ajax
        .get("/api/onlineStore/visitCustRanking", {
          pageNum: 1,
          pageSize: 3
        })
        .then(res => {
          if (res.status == 200) {
            //判断有没有返回信息
            this.browseTotal = res.data.data.total;
            if (res.data.data.list.length > 0) {
              res.data.data.list.forEach(element => {
                // 且head_img还存在
                if (element.head_img) {
                  this.browseImg.push(element.head_img);
                }
              });
            }
          } else {
            this.$vux.toast.text(res.data.message, "middle");
          }
        });
    },
    goPath(path) {
      this.$router.push({ path: `/${path}` });
    },
    // 跳转到个人链接
    goPreson() {
      console.log("我是个人ID");
      console.log(this.brokerId);
      window.location.href =
        this.$ipconfig +
        "public/agent-index.html?type=1&&brokerId=" +
        this.brokerId;
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
        href:
          this.$ipconfig +
          "public/agent-index.html?brokerId=" +
          this.brokerId +
          "%26type=1",
        title: _this.personInfo.name + "的网店",
        content: _this.personInfo.depName,
        thumbs: [_this.personInfo.headImg + "?w=220&h=160&m=crop"], //分享消息的缩略图:图片小于20K
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
    },
    //自定义滚动事件
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 70) {
        this.scroll_show = true;
        this.title = this.title_show;
      } else {
        this.scroll_show = false;
        this.title = "我的网店";
      }
    }
  },
  computed: {
    brokerId() {
      return localStorage.getItem("userMessageId");
    }
  },
  components: {
    topbar,
    Badge
  }
};
</script>

<style lang="less" scoped>
.scrollShow {
  .topbar {
    background-color: #202020 !important;
  }
}
.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 10.6667vw;
  color: #fff;
  z-index: 2;
  .topbar {
    background-color: transparent;
  }
  .share {
    position: absolute;
    top: 3vw;
    right: 5vw;
    z-index: 99;
  }
}
.header_info {
  background: url(/static/img/customer-info-bj.0c388ad.png) no-repeat 0 -6.667vw;
  background-size: cover;
  height: 42.667vw;
  color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
  text-align: center;
  padding: 18.667vw 4vw 0;
  > .info {
    width: 100%;
    position: relative;
    &:before {
      content: "\e60f";
      position: absolute;
      top: 4vw;
      right: 2vw;
      transform: rotate(180deg);
      font-size: 7vw;
    }
    img {
      float: left;
      width: 16.8vw;
      height: 16.8vw;
      border-radius: 50%;
    }
    > span {
      float: left;
      margin-top: 2.2667vw;
      > p {
        color: #fff;
        margin-left: 4vw;
        text-align: left;
        &:nth-of-type(1) {
          font-size: 4vw;
          font-weight: 600;
        }
        &:nth-of-type(2) {
          font-size: 3.2vw;
          margin-top: 1.866vw;
        }
      }
    }
  }
  > .number {
    margin-top: 4.5vw;
    display: flex;
    > div {
      flex: 1;
      > span {
        display: block;
      }
    }
  }
}

.listing {
  margin-top: 2.6667vw;
  padding: 0 4vw;
  background-color: #fff;
  .number {
    display: flex;
    padding: 4.666vw 0;
    text-align: center;
    border-bottom: 0.2vw solid #ebebeb;
    > div {
      flex: 1;
      > p {
        &:nth-of-type(1) {
          color: #333;
          font-size: 7.4667vw;
        }
        &:nth-of-type(2) {
          color: #999;
        }
      }
    }
  }
  .listing_house {
    padding: 4.6667vw 0;
    font-size: 4vw;
    position: relative;
    &:before {
      content: "\e60f";
      position: absolute;
      top: 3.5vw;
      right: 2vw;
      transform: rotate(180deg);
      font-size: 7vw;
    }
    .vux-badge {
      position: absolute;
      top: 5vw;
      right: 10vw;
      font-size: 3.2vw;
      height: 4.266vw;
      line-height: 4.266vw;
      border-radius: 2.2vw;
      padding: 0 1.6vw;
    }
  }
}
// 访客分析
.visitorAnalysis {
  margin: 2.6667vw 0;
  padding: 0 4vw;
  background-color: #fff;
  > p {
    font-size: 4.8vw;
    font-weight: 600;
    padding: 2.6667vw 0;
    border-bottom: 0.2vw solid #ebebeb;
  }
  > .clearfix {
    width: 100%;
    padding: 4.5vw 0;
    border-bottom: 0.2vw solid #ebebeb;
    > div {
      &:nth-of-type(1) {
        float: left;
        margin-left: 2vw;
        > p {
          text-align: center;
          margin-top: 1vw;
          &:nth-of-type(1) {
            font-size: 5.6vw;
            color: #333;
            font-weight: 600;
          }
          &:nth-of-type(2) {
            color: #999;
            font-size: 3.2vw;
          }
        }
      }
      &:nth-of-type(2) {
        float: right;
        > p {
          > span {
            display: inline-block;
            font-size: 3.2vw;
            margin: 0.5vw 0 0.5vw 1vw;
            &:nth-of-type(1) {
              color: #999;
              width: 17vw;
              text-align: right;
            }
            &:nth-of-type(2) {
              color: #333;
              font-weight: 600;
              width: 14vw;
              text-align: center;
            }
            &:nth-of-type(3) {
              height: 3.2vw;
            }
          }
          // 判断访客的条形
          // 没有访客
          .noClient {
            background-color: #f5f5f5;
          }
          // 今日的
          .todayData {
            background-color: #ff7b78;
          }
          // 7天的
          .weekData {
            background-color: #789eff;
          }
          // 30天的
          .hasMonthClient {
            background-color: #ffab78;
          }
          .shopBrowse {
            background-color: #a178ff;
          }
          .houseBrowse {
            background-color: #78bbff;
          }
        }
      }
    }
  }
  > .clientLog {
    position: relative;
    &:before {
      content: "\e60f";
      position: absolute;
      top: 4vw;
      right: 2vw;
      transform: rotate(180deg);
      font-size: 7vw;
    }
    > img {
      position: absolute;
      top: 3.5vw;
      width: 8vw;
      height: 8vw;
      border-radius: 50%;
      &:nth-of-type(3) {
        right: 20vw;
      }
      &:nth-of-type(2) {
        right: 15vw;
      }
      &:nth-of-type(1) {
        right: 10vw;
      }
    }
    > i {
      position: absolute;
      top: 3vw;
      right: 9vw;
      width: 3vw;
      height: 3vw;
      background-color: #fd424b;
      border-radius: 50%;
    }
  }
}
// 房源/店铺分析
.Shop {
  margin-bottom: 0;
  > p {
    border-bottom: 0;
  }
}
</style>

