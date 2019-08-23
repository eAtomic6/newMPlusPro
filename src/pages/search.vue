<template>
  <div class="container">
    <div class="search-bar">
      <p class="iconfont">
        <input
          type="text"
          placeholder="请输入内容"
          v-model="inputVal"
          @keyup.enter="getResult('input')"
          ref="search"
        >
      </p>
      <span @click="goBack">取消</span>
    </div>
    <ul class="search-history" v-if="showHistory||history.length===0">
      <li v-if="total===0">
        历史搜索
        <span class="iconfont icon-delete" @click="clearHistory"></span>
      </li>
      <li
        class="iconfont"
        v-for="item in history"
        :key="item.index"
        @click="getResult(item)"
      >{{item.name}}</li>
    </ul>
    <c-scroll
      :data="scrollList"
      :total="total"
      :listenScroll="true"
      @scrollToEnd="moreData"
      @scroll="scrollUpData"
      class="content"
      v-show="!showHistory"
    >
      <div style="min-height: 100%;">
        <span class="no-data" v-if="total===0">没有搜索到有效信息</span>
        <template v-else>
          <follow-list
            :list="scrollList"
            :nowrap="true"
            v-if="getTitle==='我的跟进'"
            @getDetails="goDetails"
          >
            <p class="float-left-logo" slot="li-left" slot-scope="slotProps">
              <span>{{slotProps.li.c_name|nameFormatter}}</span>
            </p>
            <template slot="li-right-title" slot-scope="slotProps">
              <span>{{slotProps.li.c_name}}</span>
              <span>{{slotProps.li.phone | phoneFormatter}}</span>
              <span>{{slotProps.li.follow_type}}-{{slotProps.li.reason_type}}</span>
            </template>
            <template slot="li-right-content" slot-scope="slotProps">{{slotProps.li.follow_reason}}</template>
            <template slot="li-right-footer" slot-scope="slotProps">
              <span
                class="desc-footer-left"
              >跟进人：{{slotProps.li.pc_name}}-{{slotProps.li.pc_dep_name}}</span>
              <span class="desc-footer-right">{{slotProps.li.create_time|timeFormatter}}</span>
            </template>
          </follow-list>
          <follow-list :list="scrollList" v-if="getTitle==='服务记录'" @getDetails="goDetails">
            <p class="name" slot="li-left" slot-scope="slotProps">
              <span>{{slotProps.li.c_name|nameFormatter}}</span>
            </p>
            <template slot="li-right-title" slot-scope="slotProps">
              <span class="t-name">{{slotProps.li.c_name}}</span>
              <span class="t-phone">{{slotProps.li.phone|phoneFormatter}}</span>
              <span class="t-type">{{slotProps.li.type}}</span>
            </template>
            <template
              slot="li-right-content"
              slot-scope="slotProps"
              class="t-item"
            >意向：{{getIntent(slotProps.li)}}</template>
            <template slot="li-right-footer" slot-scope="slotProps">
              <span class="desc-footer-left">
                <span class="t-day">{{slotProps.li.not_follow_day}}</span>天未跟进
              </span>
              <span class="t-time">{{slotProps.li.create_time|timeFormatter}}</span>
            </template>
          </follow-list>
          <record-list
            :list="scrollList"
            :card="getTitle"
            v-if="getTitle==='我的报备'||getTitle==='我的带看'"
            @getDetails="goDetails"
          ></record-list>
          <template v-if="title==='客户搜索'">
            <div class="user-list" v-if="userNames.length">
              <div
                v-for="item in userNames"
                :key="item.index"
                @click="selected(item)"
                :class="{active:activeName==item.value}"
              >{{item.value}}({{item.tatal}})</div>
            </div>
            <div class="scroll-content">
              <client-list :list="scrollList" @selectItem="goDetails"></client-list>
            </div>
          </template>
          <building :house="scrollList" v-if="title==='新房项目'"></building>
          <building :house="scrollList" :boObject="true" v-if="title==='意向项目'"></building>

          <follow-list
            class="notice-list"
            v-if="title==='公告'"
            :list="scrollList"
            @getDetails="goDetail"
          >
            <template slot="li-left" slot-scope="slotProps">
              <img v-if="slotProps.li.type===0" :src="getImg('pro.png')" class="message-img">
              <img v-if="slotProps.li.type===1" :src="getImg('sys.png')" class="message-img">
              <img
                v-if="slotProps.li.type===4 || slotProps.li.type===5"
                :src="slotProps.li.head_img?slotProps.li.head_img:getImg('default.png')"
                class="message-img"
              >
            </template>
            <template slot="li-right-title" slot-scope="slotProps">
              <span>{{slotProps.li.title}}</span>
              <span class="unread" :class="{read:slotProps.li.isRead}"></span>
            </template>
            <template slot="li-right-content" slot-scope="slotProps">
              <span>{{slotProps.li.context_abstract}}</span>
            </template>
            <template slot="li-right-footer" slot-scope="slotProps">
              <span class="desc-footer-left">发布人：{{slotProps.li.create_by}}</span>
              <span class="desc-footer-right">{{slotProps.li.create_time}}</span>
            </template>
          </follow-list>

          <member-list
            v-if="title==='组织架构'"
            :search="search"
            :staffList="scrollList"
            :fromPath="$route.query.path"
          ></member-list>
        </template>
      </div>
    </c-scroll>
  </div>
</template>

<script>
import { dateFormat } from "vux";
import followList from "@/components/followList";
import clientList from "@/components/clientList";
import recordList from "@/components/recordList";
import building from "@/components/building";
import memberList from "@/components/memberLIst";
import { SEARCH } from "@/assets/JS/search";
import { FILTERS, TIME, MIXINS } from "@/assets/JS/mixins";
import { mapMutations } from "vuex";

export default {
  name: "search",
  mixins: [FILTERS, MIXINS, SEARCH],
  components: {
    clientList,
    recordList,
    followList,
    building,
    memberList
  },
  data() {
    return {
      title: "",
      activeName: "私客",
      history: [],
      showHistory: true,
      total: 0, //搜索列表总数
      scrollList: [], //加载数据列表
      logs: [],
      pageParam: {
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        type: null
      },
      userNames: [],
      inputVal: "", //搜索栏输入内容
      type: 0, //区分我的跟进、报备、带看
      search: true //memberLIst组件参数
    };
  },
  created() {
    // debugger
    this.title = this.$route.query.title;
    let param2type = this.$route.query.type;
    if (param2type) {
      this.type = param2type;
    }

    //获取搜索记录
    if (localStorage["tel"] !== undefined) {
      this.tel = localStorage["tel"];
      if (!localStorage[this.tel]) {
        localStorage.setItem(this.tel, this.logs);
      } else {
        this.logs = JSON.parse(localStorage[this.tel]);
        this.history = this.logs;
      }
    }

    //根据客户状态判断 客户分类控件
    if (this.title === "客户搜索") {
      let toUserType = JSON.parse(localStorage.getItem("userMessage"))
        .companyType;
      //console.log(toUserType) //2为分销，1和-1为直销，3为联动
      if (toUserType === 2) {
        this.userNames = [];
      } else if (toUserType === 3) {
        this.userNames = [
          { value: "私客", index: 0, tatal: "0" },
          { value: "公客", index: 1, tatal: "0" },
          { value: "联动", index: 2, tatal: "0" }
        ];
      } else {
        this.userNames = [
          { value: "私客", index: 0, tatal: "0" },
          { value: "公客", index: 1, tatal: "0" }
        ];
      }
    }
  },
  methods: {
    clearHistory() {
      this.logs = [];
      this.history = this.logs;
      localStorage.setItem(this.tel, this.logs);
    },
    /**
     * 搜索列表
     */
    getResult: function(item) {
      // debugger
      // he code
      this.$refs.search.blur();
      let str = this.inputVal.trim();
      this.pageParam.keyword = item === "input" ? str : item.name;
      this.scrollList = [];
      if (!this.pageParam.keyword) {
        return;
      } else {
        //xuneng code
        this.showHistory = false;
        if (
          this.title === "跟进" ||
          this.title === "我的报备" ||
          this.title === "我的带看"
        ) {
          // debugger
          this.pageParam.type = this.type;
          this.followSearch(this.pageParam);
        } else if (this.title === "服务记录") {
          // debugger
          this.ServicesSearch(this.pageParam);
        } else if (this.title === "客户搜索") {
          // debugger
          this.CustomersSearch(this.pageParam);
        } else if (this.title === "新房项目") {
          // debugger
          this.houseSearch(this.pageParam);
        } else if (this.title === "公告") {
          // debugger
          this.pageParam.type = 2;
          this.NoticeSearch(this.pageParam);
        } else if (this.title === "意向项目") {
          // debugger
          this.IntentionalProjectSearch(this.pageParam);
        } else if (this.title === "组织架构") {
          // debugger
          this.WorkMateSearch(this.pageParam);
        } else {
          return;
        }
        // 当用户输入时记录搜索历史
        let historyLi = {
          name: ""
        };
        if (item === "input") {
          historyLi.name = str;
        } else if (typeof item === "object") {
          historyLi.name = item.name;
          this.inputVal = item.name;
        } else {
          return;
        }
        this.logs.forEach((tip, index) => {
          if (tip.name === str || tip.name === item.name) {
            this.logs.splice(index, 1);
          }
        });
        this.logs.unshift(historyLi);
        if (this.logs.length > 10) {
          this.logs.pop();
        }
        localStorage.setItem(this.tel, JSON.stringify(this.logs));
      }
      // he code end
    },
    /**
     * 加载更多
     */
    moreData: function() {
      if (this.total !== this.scrollList.length) {
        switch (this.title) {
          case "跟进":
            this.pageParam.pageNum += 1;
            this.followSearch(this.pageParam);
            break;
          case "我的报备":
            this.pageParam.pageNum += 1;
            this.followSearch(this.pageParam);
            break;
          case "我的带看":
            this.pageParam.pageNum += 1;
            this.followSearch(this.pageParam);
            break;
          case "服务记录":
            this.pageParam.pageNum += 1;
            this.ServicesSearch(this.pageParam);
            break;
          case "客户搜索":
            this.pageParam.pageNum += 1;
            this.CustomersSearch(this.pageParam);
            break;
          case "新房项目":
            this.pageParam.pageNum += 1;
            this.houseSearch(this.pageParam);
            break;
          case "意向项目":
            this.pageParam.pageNum += 1;
            this.IntentionalProjectSearch(this.pageParam);
            break;
          case "组织架构":
            this.pageParam.pageNum += 1;
            this.WorkMateSearch(this.pageParam);
            break;
          default:
            return;
        }
      }
    },
    scrollUpData: function() {
      switch (this.title) {
        case "跟进":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.followSearch(this.pageParam);
          break;
        case "我的报备":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.followSearch(this.pageParam);
          break;
        case "我的带看":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.followSearch(this.pageParam);
          break;
        case "服务记录":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.ServicesSearch(this.pageParam);
          break;
        case "客户搜索":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.CustomersSearch(this.pageParam);
          break;
        case "新房项目":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.houseSearch(this.pageParam);
          break;
        case "意向项目":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.IntentionalProjectSearch(this.pageParam);
          break;
        case "组织架构":
          this.scrollList = [];
          this.pageParam.pageNum = 1;
          this.WorkMateSearch(this.pageParam);
          break;
        default:
          return;
      }
    },
    /**
     * 跟进跳转
     */
    goDetails(item) {
      this.changeStoreShowpopup(1);
      // debugger
      let query = {};
      if (this.title === "服务记录") {
        query = {
          c_id: item.c_id,
          c_phone: 1
        };
      } else if (this.title === "客户搜索") {
        query = {
          c_id: item.id
        };
      } else {
        query = {
          c_id: item.c_id
        };
      }
      this.$router.push({
        path: "customerInfoComplete",
        query: query
      });
    },
    ...mapMutations(["changeStoreShowpopup"]),
    goBack: function() {
      this.changeStoreShowpopup(1);
      this.$router.go(-1);
    },
    selected(item) {
      this.activeName = item.value;
      this.getMsg(item.index);
      this.getResult("input");
    },
    getMsg(msgType) {},
    getIntent(item) {
      let str = "";
      if (
        item.intent_item ||
        item.house_price ||
        item.house_acreage ||
        item.house_type ||
        item.house_intent ||
        item.house_reason
      ) {
        str =
          this.getStr(item.intent_item) +
          " " +
          this.getStr(item.house_price) +
          " " +
          this.getStr(item.house_acreage) +
          " " +
          this.getStr(item.house_type) +
          " " +
          this.getStr(item.house_intent) +
          " " +
          this.getStr(item.house_reason) +
          " " +
          this.getStr(item.b_name) +
          "-有意向";
      } else {
        str = "暂无需求";
      }
      return str;
    },
    getStr(str) {
      return str || "";
    },
    goDetail(item) {
      if (item.type === 4 || item.type === 5) {
        let param = {
          noticeId: item.id
        };
        this.$ajax
          .get("/api/notice", param, "pt")
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
  computed: {
    getTitle: function() {
      switch (this.title) {
        case "跟进":
          return "我的跟进";
          break;
        case "我的报备":
          return "我的报备";
          break;
        case "我的带看":
          return "我的带看";
        case "服务记录":
          return "服务记录";
      }
    }
  },
  filters: {
    timeFormatter(time) {
      return dateFormat(time, "YYYY-MM-DD 登记");
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

.container {
  background-color: @bg-ff;
}

.search-bar {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid @border-eb;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  > p {
    flex: 1;
    display: inherit;
    height: 70px;
    margin-left: 30px;
    padding: 0 20px 0 60px;
    background-color: @bg-f0;
    border-radius: @border-radiaus;
    position: relative;

    &:before {
      content: "\e60b";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      font-size: @font-size-icon;
      color: @color-assist;
    }

    > input {
      display: inline-block;
      width: 100%;
      border: 0px;
      width: 100%;
      background-color: @bg-f0;
      align-self: center;
      font-size: @font-size-m;

      &:focus {
        outline: none;
      }
      &::-webkit-input-placeholder {
        font-size: @font-size-m;
      }
    }
  }

  > span {
    padding: 0 30px;
  }
}

.search-history {
  > li {
    height: 80px;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:after {
      content: "\e60f";
      font-size: @font-size-icon;
      transform: rotate(180deg);
    }

    &:first-of-type {
      &:after {
        content: "";
      }
      @font-size-h3();
      position: relative;
      > span {
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translateY(-50%);
        font-size: @font-size-icon;
        font-weight: initial;
      }
    }
  }
}

.content {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;

  .no-data {
    @font-size-h3();
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .user-list {
    width: 690px;
    height: 99px;
    margin-left: 30px;
    border-bottom: 1px solid #eaeaea;
    line-height: 100px;
    padding: 0 30px;
    box-sizing: border-box;
    color: @color-main;
    font-size: @font-size-m;
    text-align: center;
    display: flex;
    background: #fff;

    div {
      width: 33.33%;
    }

    .active {
      position: relative;

      color: @color-green;

      &::after {
        display: inline-block;
        position: absolute;
        left: 50%;
        margin-left: -25px;
        content: "";
        width: 50px;
        height: 6px;
        bottom: 16px;
        background: @color-green;
        border-radius: 3px;
      }
    }
  }

  .scroll-content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;

    /deep/ .data-list {
      > li {
        .list-item-desc {
          p:nth-of-type(2) {
            font-size: @font-size-m;
            color: @color-minor;
          }
        }
      }
    }
  }

  .data-list {
    .t-time {
      float: right;
    }

    .name {
      width: 94px;
      height: 94px;
      border: 1px solid @color-green;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      color: @color-green;
      background-color: #eef6e9;
      display: inherit;
      justify-content: center;
      align-items: center;
      @font-size-h2();
    }

    .desc-footer-left {
      .t-day {
        font-weight: bold;
        color: @color-orange;
      }

      .t-time {
        float: right;
      }
    }
  }
  /deep/ .notice-list {
    > li {
      .list-item-desc {
        position: relative;
        > p.desc-title {
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        > p:nth-of-type(2) {
          margin-top: 0;
          display: -webkit-box;
          /*! autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          white-space: initial;
        }
      }
    }
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
</style>
