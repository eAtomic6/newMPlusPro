<!--  -->
<template>
  <div class="container">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="topbar-right msg" @click="allRead">全部已读</span>
    </topbar>
    <div class="main">
      <div class="search iconfont">
        <span class="search_txt" @click="goSearch">请输入搜索关键字</span>
      </div>
      <!-- <div class="list">
        <div v-for="item in messageNames" :key="item.type" @click="selected(item)" :class="{active:activeName==item.value}">
          {{item.value}}
          <span v-if="item.type==2">({{notReadCount}})</span>
          <span v-if="item.type==0">({{notReadProCount}})</span>
          <span v-if="item.type==1">({{notReadSysCount}})</span>
        </div>
      </div> -->
      <c-scroll class="content" :data="list" :total="total" :listenScroll="true" @scroll="getMsg" @scrollToEnd="getMsg">
        <follow-list :nowrap="nowrap" :list="list" @getDetails="goDetail">
          <!-- <img slot="li-left" slot-scope="slotProps" :src="slotProps.li.type==0?getImg('pro.png'):getImg('sys.png')" class="message-img"> -->
          <template slot="li-left" slot-scope="slotProps">
            <img v-if="slotProps.li.type===0" :src="getImg('pro.png')" class="message-img">
            <img v-if="slotProps.li.type===1" :src="getImg('sys.png')" class="message-img">
            <img v-if="slotProps.li.type===4||slotProps.li.type===5" :src="slotProps.li.head_img?slotProps.li.head_img:getImg('default.png')" class="message-img">
          </template>
          <template slot="li-right-title" slot-scope="slotProps">
            <span class="title_m">{{slotProps.li.title}}</span>
            <span class="unread" :class="{read:slotProps.li.isRead}"></span>
          </template>
          <template slot="li-right-content" slot-scope="slotProps"><span class="context">{{slotProps.li.context_abstract}}</span></template>
          <template slot="li-right-footer" slot-scope="slotProps">
            <span class="desc-footer-left">发布人：{{slotProps.li.create_by}}</span>
            <span class="desc-footer-right">{{slotProps.li.create_time}}</span>
          </template>
        </follow-list>
      </c-scroll>
    </div>
  </div>

</template>

<script>
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import topbar from "@/components/topbar";
import followList from "@/components/followList";

export default {
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    followList
  },
  data() {
    return {
      title: "消息",
      getBack: true,
      nowrap: true,
      card: "message",
      activeName: "全部消息",
      messageNames: [
        { value: "全部消息", type: 2 },
        { value: "项目公告", type: 0 },
        { value: "系统公告", type: 1 }
      ],
      notReadCount: "", //所有公告的未读数量
      notReadProCount: "", //项目公告的未读数量
      notReadSysCount: "", //系统公告的未读数量
      total: 0,
      currentPage: 1,
      msgType: 2,
      list: [],
      hasNoRead: false
    };
  },
  methods: {
    selected(item) {
      this.activeName = item.value;
      this.list = [];
      this.currentPage = 1;
      this.msgType = item.type;
      this.getMsg();
    },
    goSearch() {
      this.$router.push({
        path: "/search",
        query: {
          title: "公告"
        }
      });
    },
    getMsg() {
      let param = {
        type: this.msgType,
        pageNum: this.currentPage,
        pageSize: 10
      };
      this.$ajax
        .get("/api/notice/list", param, "pt")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.notReadCount = res.data.notReadCount;
            this.notReadProCount = res.data.notReadProCount;
            this.notReadSysCount = res.data.notReadSysCount;
            this.total = res.data.count;
            if (this.total === this.list.length) {
              return;
            } else {
              this.currentPage += 1;
              this.list = this.list.concat(res.data.noticeList);
            }
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    //下拉重置
    resetMsg() {
      let param = {
        type: this.msgType,
        pageNum: 1,
        pageSize: 10
      };
      this.$ajax
        .get("/api/notice/list", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.notReadCount = res.data.notReadCount;
            this.notReadProCount = res.data.notReadProCount;
            this.notReadSysCount = res.data.notReadSysCount;
            this.total = res.data.count;
            this.list = res.data.noticeList;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    allRead() {
      this.list.forEach(item => {
        if (!item.isRead) {
          this.hasNoRead = true;
          return;
        }
      });
      if (this.hasNoRead) {
        let param = {
          type: this.msgType
        };
        this.$ajax
          .post("/api/notice/read/all", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.list = [];
              this.currentPage = 1;
              this.getMsg();
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      } else {
        this.$vux.toast.text("没有未读消息", "middle");
      }
    },
    goDetail(item) {
      console.log(item);
      if (item.type === 4 || item.type == 5) {
        let param = {
          noticeId: item.id
        };
        this.$ajax.get("/api/notice", param, "pt")
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              let c_id = JSON.parse(res.data.context).id;
              this.$router.push({
                path: "customerInfoComplete",
                query: {
                  c_id: c_id
                }
              });
            } else {
              this.$vux.toast.text(res.message, "middle");
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      } else {
        this.$router.push({
          path: "/messageDetail",
          query: {
            type: item.type,
            id: item.id
          }
        });
      }
    }
  },
  created() {
    this.getMsg();
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.container {
  background: @bg-ff;
  .main {
    position: relative;
  }
  .search {
    height: 108px;
    z-index: 10;
    position: absolute;
    top: 100px;
    left: 0;
    .search_txt {
      position: relative;
      width: 690px;
      margin-left: 30px;
      display: inline-block;
      box-sizing: border-box;
      background: @bg-f0;
      color: @color-assist;
      padding-left: 70px;
      padding-top: 15px;
      padding-bottom: 15px;
      border-radius: 10px;
      font-size: @font-size-m;
      &:before {
        content: "\e60b";
        position: absolute;
        color: @color-assist;
        top: 0;
        left: 5px;
        font-size: @font-size-icon;
      }
    }
  }
  .list {
    width: 690px;
    height: 99px;
    margin-left: 30px;
    margin-top: 100px;
    border-bottom: 1px solid @border-ea;
    line-height: 100px;
    padding: 0 30px;
    box-sizing: border-box;
    color: @color-main;
    font-size: @font-size-m;
    text-align: center;
    display: flex;
    div {
      width: 33.33%;
    }
    .active {
      color: @color-green;
    }
  }
  .content {
    position: absolute;
    //top: 280px;
    top: 170px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    .title_p {
      width: 200px;
      .title_m {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    /deep/.data-list > li .list-item-desc > p.desc-title {
      width: 400px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /deep/.data-list > li .list-item-desc > p:nth-of-type(2) {
      margin-top: 0;
      display: -webkit-box;
      //此处注释不要删除！！！！！！！
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
      white-space: initial;
    }
    -webkit-overflow-scrolling: touch;
    /deep/.data-list {
      > li {
        .list-item-desc {
          p:nth-of-type(2) {
            font-size: @font-size-m;
            color: @color-minor;
          }
        }
      }
    }
    /deep/.list-item-desc {
      position: relative;
    }
    .unread {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 50%;
      background: @color-f0;
    }
    .read {
      width: 0;
    }
  }
}
</style>
