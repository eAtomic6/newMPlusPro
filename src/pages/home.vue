<template>
  <div class="main">
    <topbar class="home-topbar-info" :title="title">
      <span slot="topbar-left" class="iconfont icon-scan topbar-left" @click="getCode"></span>
      <img slot="topbar-content" :src="logo" alt style="height: 80%;" v-if="logo">
      <span
        slot="topbar-right"
        class="iconfont icon-message topbar-right"
        :class="[msgState?'have-msg':'']"
        @click="goMsg"
      ></span>
    </topbar>
    <c-scroll
      :data="scrollList"
      :total="total"
      :listenScroll="true"
      class="content"
      @scroll="getHouse('refresh')"
      @scrollToEnd="getHouse('more')"
    >
      <div>
        <swiper
          :options="getSwiperOption"
          ref="mySwiper"
          v-if="banner.length"
          @click="getSwiperItem"
        >
          <swiper-slide class="banner-item" v-for="(item,index) in banner" :key="index">
            <img :src="item.url" alt :title="JSON.stringify(item)">
          </swiper-slide>

          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <ul class="tips">
          <li v-for="item in tips" @click="go(item.path)" :key="item.name">
            <p>
              <img :src="getImg(item.src)" alt>
            </p>
            <span>{{item.name}}</span>
          </li>
        </ul>
        <div class="message">
          <p>
            <img :src="getImg('home_topline.png')" alt>
          </p>
          <swiper
            class="message-swiper"
            :options="swiperOption1"
            ref="mySwiper1"
            v-if="messages.length"
          >
            <!-- slides -->
            <swiper-slide v-for="(item,index) in messages" :key="index">
              <p>{{item|messageFormatter}}</p>
            </swiper-slide>
          </swiper>
        </div>
        <div class="artice task">
          <p class="artice-title" @click="go('task')">
            <span>今日任务</span>
            <router-link class="more-btn iconfont" tag="span" to="/task">全部</router-link>
          </p>
          <ul class="artice-content artice-content-task">
            <li v-for="item in tasks" :key="item.id">
              <span>{{item.name}}</span>
              <p>
                <span>{{item.count}}</span>/
                <span>{{item.task}}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="artice">
          <div class="artice-title">
            <span>精选房源</span>
          </div>
          <!--<building :house="house"></building>-->
          <ul class="artice-content artice-content-house">
            <li v-for="item in scrollList" @click="toDetails(item)" :key="item.id">
              <div class="house-window">
                <img :src="!item.coverPhoto?getImg('house-info.png'):item.coverPhoto" alt>
                <p class="float-state">{{item.projectStatusString}}</p>
                <p class="float-type">{{item.effectiveTypeOfProjectString}}</p>
              </div>
              <div class="house-desc">
                <p>{{item.name}}</p>
                <section>
                  <span>{{item.buildingPropertyString}}</span>
                  <p>
                    <i class="iconfont icon-location"></i>
                    <span>{{item.city}}{{item.area}}</span>
                  </p>
                </section>
                <p>
                  均价
                  <span>{{item.buildingPrice}}</span> 元/m²
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </c-scroll>
  </div>
</template>

<script>
import { api } from "@/assets/JS/ajax";
// import {SCROLL} from "@/assets/JS/scroll"
import { MIXINS, TIME } from "@/assets/JS/mixins";
import { noNull } from "@/assets/JS/common";

import { swiper, swiperSlide } from "vue-awesome-swiper";
import topbar from "@/components/topbar";
import guide from "@/pages/guide";
import building from "@/components/building";
import { mapMutations } from "vuex";
export default {
  name: "home",
  mixins: [MIXINS],
  components: {
    topbar,
    guide,
    swiper,
    swiperSlide,
    building
  },
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        initialSlide: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        autoplay: true,
        // loop: true,
        pagination: {
          el: ".swiper-pagination",
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "bullet-active"
        }
      },
      swiperOption1: {
        notNextTick: true,
        initialSlide: 0,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        autoplay: true,
        loop: true,
        direction: "vertical"
      },
      title: "",
      logo: "",
      msgState: false, //是否有未读消息
      code: true,
      banner: [],
      tips: [
        {
          name: "跟进管理",
          path: "tipFollow",
          src: "tip_follow.png"
        },
        {
          name: "报备管理",
          path: "tipRecord",
          src: "tip_report.png"
        },
        {
          name: "带看管理",
          path: "tipService",
          src: "tip_see.png"
        },
        {
          name: "房贷计算器",
          path: "calculator",
          src: "tip_calculator.png"
        },
        // 2.0 新加
        {
          name: "个人网店",
          path: "personalOnlineStore",
          src: "gerenwangdian.png"
        },
        {
          name: "电子名片",
          path: "eleCard",
          src: "dianzimingp.png"
        },
        {
          name: "营销素材",
          path: "marketingMaterial",
          src: "yingxiaosucai.png"
        },
        {
          name: "团队报表",
          path: "teamReport",
          src: "tanduibaobiao.png"
        }
      ],
      messages: [],
      tasks: [
        {
          id: 1,
          name: "新客",
          done: 5,
          num: 10
        },
        {
          id: 2,
          name: "跟进",
          done: 12,
          num: 20
        },
        {
          id: 3,
          name: "报备",
          done: 1,
          num: 2
        },
        {
          id: 4,
          name: "带看",
          done: 6,
          num: 10
        }
      ],
      scrollList: [],
      total: 0,
      currentPage: 1
    };
  },
  created() {
    // topbar筛选项设置判断字段
    sessionStorage.setItem("isSelected", 0);
    this.getTask();
    this.getHouse();
    this.getMessage();
    this.getBanner();
    this.getMsgState();
    // 判断进入广告页
  },
  mounted() {
    setTimeout(() => {
      this.getLogo()
        .then(res => {
          console.log(res);
          if (!res.companyLogo) {
            this.$ajax
              .get("api/logo", {}, "pt")
              .then(res => {
                res = res.data;
                if (res.status === 200) {
                  this.logo = res.data;
                }
              })
              .catch(err => {
                this.$vux.toast.text(
                  this.$error[err.response.status],
                  "middle"
                );
              });
          } else {
            this.logo = res.companyLogo;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  },
  methods: {
    async getLogo() {
      let logoUrl = await JSON.parse(localStorage.getItem("userMessage"));
      return logoUrl;
    },
    getSwiperItem: function(e) {
      let obj = JSON.parse(e.target.getAttribute("title"));
      if (!!obj) {
        if (obj.type === 0) {
          this.linkDetails(obj);
        } else if (obj.type === 1 && obj.links) {
          window.location.href = obj.links;
        } else if (obj.type === 2) {
          // 跳转到广告页
          this.$router.push("/adPage?goId=2");
        }
      }
    },
    /**
     * 获取Banner列表
     */
    getBanner: function() {
      this.$ajax
        .get("/api/banner/url/list")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.banner = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取房头条
     */
    getMessage: function() {
      this.$ajax
        .get("/api/notice/houseHeadLine")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.messages = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取今日任务
     */
    getTask: function() {
      this.$ajax
        .get("/api/task")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.tasks = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取是否有未读消息
     */
    getMsgState: function() {
      this.$ajax
        .get("/api/notice/count")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.msgState = res.data.count > 0 ? true : false;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取精选房源
     */
    getHouse: function(type = "more") {
      if (type !== "more") {
        this.currentPage = 1;
        this.scrollList = [];
      }
      let param = {
        projectState: 5, //强推
        pageNum: this.currentPage,
        pageSize: 10
      };
      this.$ajax
        .get("/api/appProjectList", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.total = res.data.total;
            if (this.total === this.scrollList.length) {
              return;
            } else {
              this.currentPage += 1;
              this.scrollList = this.scrollList.concat(res.data.list);
            }
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    linkDetails: function(item) {
      // debugger
      if (item.type === 0) {
        this.$router.push({
          path: `houseDetails`,
          query: {
            id: item.buildId
          }
        });
      }
    },

    ...mapMutations(["changeStoreShowpopup"]),
    go(path) {
      this.changeStoreShowpopup(1); //用于跟进，报备，带看管理等进入页的判断
      if (path == "personalOnlineStore") {
        this.$ajax
          .get("/api/onlineStore/overview/can")
          .then(res => {
            console.log(1111);
            console.log(res);
            if (res.data.status == 200) {
              this.$router.push({
                path: `/${path}`
              });
            }
          })
          .catch(err => {
            this.$vux.toast.text("无权限查看", "middle");
          });
      } 
      // else if (path == "eleCard") {
      //   this.$vux.toast.text("功能暂未开放", "middle");
      // } 
      // else if (path == "marketingMaterial") {
      //   this.$vux.toast.text("功能暂未开放", "middle");
      // } 
      else {
        this.$router.push({
          path: `/${path}`
        });
      }
    },
    getCode: function() {
      this.$router.push({
        path: "barCode"
      });
    },
    toDetails: function(item) {
      this.$router.push({
        path: "houseDetails",
        query: {
          id: item.id
        }
      });
    },
    goMsg() {
      this.$router.push("/message");
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    getSwiperOption() {
      if (this.banner.length > 1) {
        this.$set(this.swiperOption, "loop", true);
      }
      return this.swiperOption;
    }
  },
  filters: {
    taskFormatter: function(val) {
      switch (val) {
        case "follow":
          return "跟进";
          break;

        case "lookHouse":
          return "带看";
          break;
        case "newCustomer":
          return "新客";
          break;
        case "report":
          return "报备";
          break;
        default:
          return "--";
      }
    },
    areaFormatter: function(val) {
      if (!val) {
        return "--";
      } else {
        return `${val.split("区")[0]}区`;
      }
    },
    messageFormatter: function(val) {
      if (!val) {
        return "";
      } else {
        if (val.noticeType === 0) {
          return `${TIME(val.time, 2)}${val.departmentName}${val.employeeName}${
            val.dealType
          }${val.buildingName}，${val.houseArea}平米`;
        } else {
          return `${TIME(val.time, 2)}${val.departmentName}${
            val.employeeName
          }带看了${val.buildingName}`;
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

/deep/ .swiper-container {
  width: 100%;
  height: 350px;
  background-color: grey;
  .banner-item {
    img {
      width: 100%;
      height: 100%;
    }
  }
}
/deep/ .swiper-pagination-bullet {
  opacity: 0.6;
  &.bullet-active {
    background-color: @color-green;
    opacity: 1;
  }
}

.content {
  width: 100%;
  height: 100%;
  background-color: @bg-f5;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.have-msg {
  /*position: relative;*/
  &:after {
    content: "";
    width: 14px;
    height: 14px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background-color: @color-f0;
    position: absolute;
    top: 0;
    right: 0;
  }
}

.tips {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid @border-eb;
  background-color: @bg-ff;
  padding: 1vw 0 2vw;
  > li {
    display: inline-block;
    width: 24%;
    text-align: center;
    margin-top: 2vw;
    > p {
      > img {
        max-width: 80px;
      }
    }
    > span {
      font-size: @font-size-m;
    }
  }
}

.message {
  height: 90px;
  display: flex;
  align-items: center;
  position: relative;
  background-color: @bg-ff;
  /*构造伪元素防止消息轮播滑动*/
  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 11;
  }
  > p {
    flex: 1;
    font-size: 20px;
    color: orange;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      max-width: 134px;
    }
  }
  > .message-swiper {
    flex: 3;
    height: 100%;
    background-color: #ffffff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /deep/ .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      > p {
        padding-right: 30px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-size: @font-size-s;
      }
    }
  }
}

.artice {
  margin-top: 30px;
  background-color: @bg-ff;
  &-title {
    height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 30px;
    border-bottom: 1px solid @border-eb;
    > span:first-of-type {
      @font-size-h1();
    }
    .more-btn {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      font-size: @font-size-m;
      color: @color-assist;
      padding-right: 50px;
      &:after {
        content: "\e625";
        font-size: @font-size-icon;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
    }
  }
  &-content {
    &-task {
      display: flex;
      > li {
        flex: 1;
        display: inherit;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        > p {
          > span {
            @font-size-h1();
            &:first-of-type {
              color: @color-orange;
              font-size: @font-size-xxl;
            }
            &:last-of-type {
              font-size: @font-size-s;
            }
          }
        }
      }
    }
    &-house {
      margin: 0 30px;
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 30px;
      > li {
        width: 50%;
        margin-top: 30px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        &:nth-of-type(even) {
          padding-left: 15px;
        }
        &:nth-of-type(odd) {
          padding-right: 15px;
        }
        .house-window {
          width: 100%;
          /*height: 33vw;*/
          margin-bottom: 15px;
          background-color: @bg-f5;
          position: relative;
          > img {
            width: 100%;
            border-radius: @border-radiaus;
            vertical-align: bottom;
            /*height: 100%;*/
          }
        }
        .house-desc {
          > p {
            &:first-of-type {
              @font-size-h3();
            }
            &:last-of-type {
              color: @color-orange;
              > span {
                @font-size-h3();
              }
            }
          }
          > section {
            display: flex;
            justify-content: space-between;
            /*margin: 10px 0;*/
            color: @color-assist;
            font-size: @font-size-s;
            > p {
              display: inherit;
              align-items: center;
            }
          }
        }
      }
    }
  }
}

.bar-code {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: #ffffff;
}
.float-state {
  /*width: 100px;*/
  padding: 6px 10px 6px 6px;
  text-align: center;
  background-color: @color-orange;
  color: @color-white;
  font-style: italic;
  font-size: @font-size-s;
  letter-spacing: 4px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  position: absolute;
  top: 15px;
  left: 0;
  z-index: 9;
}
.float-type {
  text-align: center;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: @color-white;
  font-size: @font-size-xs;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  border-bottom-left-radius: @border-radiaus;
  border-bottom-right-radius: @border-radiaus;
}
.home-topbar-info {
  .topbar-left,
  .topbar-right {
    font-size: 9vw;
  }
}
</style>
