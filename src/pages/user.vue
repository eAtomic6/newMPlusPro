<template>
  <div class="main" @click="closeModal">
    <topbar>
      <div slot="topbar-left" v-show="this.activeLink == 'my'">
        <span class="topbar-left staff-btn iconfont icon-staff" @click="goSelect">{{owner|maxLen}}</span>
      </div>
      <div slot="topbar-content" class="topbar-content">
        <span class="topbar-title" v-if="toUserType==2">我的私客</span>
        <template v-else-if="toUserType==1||toUserType==-1">
          <span
            class="tab-btn left"
            :class="{'active':activeLink==='my'}"
            @click="clickTabBtn('my')"
          >私客</span>
          <span
            class="tab-btn right"
            :class="{'active':activeLink==='public'}"
            @click="clickTabBtn('public')"
          >公客</span>
        </template>
        <template v-else-if="toUserType==3 || toUserType==4">
          <span
            class="tab-btn left short"
            :class="{'active':activeLink==='my'}"
            @click="clickTabBtn('my')"
          >私客</span>
          <span
            class="tab-btn short"
            :class="{'active':activeLink==='public'}"
            @click="clickTabBtn('public')"
          >公客</span>
          <span
            class="tab-btn right short"
            :class="{'active':activeLink==='link'}"
            @click="clickTabBtn('link')"
          >联动</span>
        </template>
      </div>
      <div slot="topbar-right">
        <span class="iconfont icon-search topbar-right with" @click="find"></span>
        <span class="iconfont icon-added topbar-right" @click="create"></span>
      </div>
    </topbar>
    <dropdown
      ref="dropDown"
      :tab="toTab"
      :slider="getSlider"
      @getTab="getTabItem"
      :showTab="showTab"
      @getParam="getItemParam"
      :modal="modal"
      :fatherName="toName"
    ></dropdown>
    <template v-if="total">
      <c-scroll
        ref="bScroll"
        :data="scrollList"
        :total="total"
        :isLastPage="isLastPage"
        class="content"
        :class="modal?'ban-scroll':''"
        @scrollToEnd="pullupMore"
        :listenScroll="listenScroll"
        @scroll="pullDownRefresh"
      >
        <div>
          <p class="list-num">
            共
            <span>{{total}}</span> 条记录
          </p>
          <client-list :list="scrollList" @selectItem="toDetails" @getEl="getEl"></client-list>
        </div>
      </c-scroll>
    </template>
    <abnormal v-else></abnormal>
  </div>
</template>

<script>
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import topbar from "@/components/topbar";
import dropdown from "@/components/dropdown";
import clientList from "@/components/clientList";
import abnormal from "@/components/abnormal";
import { setTimeout } from "timers";
const CLIENT_MY_TAB = [
  {
    index: 1,
    name: "客户进展",
    param: "followState"
  },
  {
    index: 2,
    name: "锁定状态",
    param: "isLock"
  },
  {
    index: 3,
    name: "排序日期",
    param: "sortRule"
  },
  {
    index: 4,
    name: "客户级别",
    param: "level"
  }
];
const CLIENT_PUB_TAB = [
  {
    index: 1,
    name: "客户进展",
    param: "followState"
  },
  {
    index: 2,
    name: "排序日期",
    param: "sortRule"
  },
  {
    index: 3,
    name: "客户级别",
    param: "level"
  },
  {
    index: 5,
    name: "公客池",
    param: "maleGuestType"
  }
];
const CLIENT_LINK_TAB = [
  {
    index: 1,
    name: "客户进展",
    param: "followState"
  },
  {
    index: 2,
    name: "排序日期",
    param: "sortRule"
  },
  {
    index: 3,
    name: "客户级别",
    param: "level"
  }
];
export default {
  name: "user",
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    dropdown,
    clientList,
    abnormal
  },
  data() {
    return {
      toUserType: "", //模拟数据，2为分销，1和-1为直销，3为联动
      activeLink: "my", //默认显示私客
      total: 0,
      userData: {}, //存储用户数据
      //初始化列表请求参数
      showTab: true,
      tabIds: [], //客户进展  是否锁定  排序规则  客户等级
      selector: null,
      dropdownPayload: {}, //缓存列表请求参数
      pageNum: 1, //页号
      modal: false,
      pullup: true, //上拉加载更多
      listenScroll: true, //下拉刷新
      toTab: [],
      slider: 1,
      scrollList: [], //缓存用户列表,
      modal: false,
      toName: "", //传递给dropdown
      lastPage: "",
      isLastPage: "",
      oldEl: "",
      savedY: "",
      myPath: "/user"
    };
  },
  methods: {
    /**
     * 重置toTab
     */
    resetToTab() {
      if (this.toUserType == 2) {
        //分销
        // this.toTab = JSON.parse(JSON.stringify(CLIENT_PUB_TAB))//这种会重置
        this.toName = "userMy";
        this.toTab = CLIENT_PUB_TAB; //不会重置，对象指向同一个存储空间
        this.tabIds = [264, 341, 211]; //分销
      } else {
        //直销联动
        if (this.activeLink === "my") {
          //私客
          //   this.toTab = JSON.parse(JSON.stringify(CLIENT_MY_TAB))
          this.toName = "userMy";
          this.toTab = CLIENT_MY_TAB;
          this.tabIds = [264, 346, 341, 211];
        } else if (this.activeLink === "public") {
          //公客
          //   this.toTab = JSON.parse(JSON.stringify(CLIENT_PUB_TAB))
          this.toName = "userPub";
          this.toTab = CLIENT_PUB_TAB;
          this.tabIds = [264, 386, 211];
        } else if (this.activeLink === "link") {
          //联动
          //   this.toTab = JSON.parse(JSON.stringify(CLIENT_PUB_TAB))
          this.toName = "userLink";
          this.toTab = CLIENT_LINK_TAB;
          this.tabIds = [264, 391, 211];
        }
      }
    },
    /**
     * 点击筛选tab栏
     */
    getTabItem(payload) {
      this.showTab = true;
      this.$set(this, "showTab", true);
      this.modal = this.slider === payload.index && this.modal ? false : true;
      this.slider = payload.index;
    },
    /**
     * 点击筛选 选项
     */
    getItemParam(payload, tabActive, value) {
      if (!value) {
        value = this.getOldName(tabActive);
      }
      this.changeTabValue(this.toTab, "param", tabActive, "name", value);

      this.modal = false;
      this.pageNum = 1;

      let param = {
        pageNum: this.pageNum //重新从第一页开始显示
      };
      param = Object.assign({}, param, payload);
      this.dropdownPayload = param;
      this.userAjax(param);
    },
    /**
     * 选择不限  返回原本的name
     */
    getOldName(param) {
      switch (param) {
        case "followState":
          return "客户进展";
          break;
        case "isLock":
          return "锁定状态";
          break;
        case "sortRule":
          return "排序日期";
          break;
        case "level":
          return "客户级别";
          break;
        case "maleGuestType":
          return "公客池";
          break;
      }
    },
    /**
     * 根据数组中的属性名，属性值
     * @arr           数组
     * @attr          检查的属性名
     * @oldValue      检查属性名，对应的属性值
     * @otherAttr     目标属性名
     * @newValue      给目标属性名设置的属性值
     */
    changeTabValue(arr, attr, oldValue, otherAttr, newValue) {
      arr.forEach(item => {
        if (item[attr] === oldValue) {
          item[otherAttr] = newValue;
        }
      });
    },
    /**
     * 获取下拉筛选数据
     */
    getDropdownData() {
      let param = {
        ids: this.tabIds.join(",")
      };
      this.$ajax
        .get("/api/dictionary/list", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.selector = res.data;
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 用户列表数据
     */
    userAjax(param, isMore, isBack) {
      if (!isBack) {
        sessionStorage.setItem("userAjaxParam", JSON.stringify(param));
      }
      let url = "/api/customers/";
      //判断客户类型
      if (this.toUserType === 2) {
        //分销
        url = url + "distribution";
      } else {
        //直销或联动
        url = url + this.activeLink;
      }
      if (this.$route.query.id && this.activeLink == "my") {
        param.eId = this.$route.query.id;
      } else {
        param.eId = "";
      }
      this.$ajax
        .get(url, param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            //console.log(res)
            this.total = res.data.total;
            this.lastPage = res.data.lastPage;
            this.isLastPage = res.data.isLastPage;
            if (isMore) {
              //加载更多
              this.scrollList = this.scrollList.concat(res.data.list);
            } else if (isBack) {
              this.scrollList.splice(
                (param.pageNum - 1) * 10,
                res.data.list.length,
                ...res.data.list
              );
            } else {
              this.scrollList = res.data.list;

              if (this.total) {
                setTimeout(() => {
                  this.$refs.bScroll.scrollToElement(this.$refs.dropDown.$el);
                }, 100);
              }
            }
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 点击顶部 切换客户类型
     * 可以切换用户类型，肯定不是分销
     * 只有私客、公客、联动
     */
    clickTabBtn(str) {
      //   debugger
      if (this.activeLink === str) {
        return;
      }
      // 切换时清空数组
      this.scrollList = [];
      this.total = 0;
      this.modal = false;
      this.slider = 1;
      this.showTab = false;
      this.activeLink = str;
      sessionStorage.setItem("activeLink", str);
      this.pageNum = 1;
      //   this.$refs.bScroll.scrollToElement(this.$refs.dropDown.$el)
      let param = {};
      this.dropdownParam = JSON.parse(sessionStorage.getItem("dropdownParam"));
      if (this.dropdownParam) {
        if (str === "my" && this.dropdownParam.userMy) {
          param = this.dropdownParam.userMy;
        } else if (str === "public" && this.dropdownParam.userPub) {
          param = this.dropdownParam.userPub;
        } else if (str === "link" && this.dropdownParam.userLink) {
          param = this.dropdownParam.userLink;
        }
      }

      param = Object.assign({}, param, {
        pageNum: this.pageNum //从新从第一页开始显示
      });
      this.resetToTab();
      this.userAjax(param);
      this.getDropdownData();
    },
    /**
     * 上拉加载更多
     */
    pullupMore() {
      if (this.isLastPage) {
        return;
      }
      let userAjaxParam = JSON.parse(sessionStorage.getItem("userAjaxParam"));
      userAjaxParam.pageNum++;
      let param = {
        pageNum: userAjaxParam.pageNum
      };
      param = Object.assign({}, userAjaxParam, param);
      this.userAjax(param, true);
    },
    /**
     * 下拉刷新
     */
    pullDownRefresh() {
      this.pageNum = 1;
      let param = this.returnParam();
      param = Object.assign({}, this.dropdownPayload, param, {
        pageNum: this.pageNum
      });
      this.userAjax(param);
    },
    /*
      进入选择员工界面 
    */
    goSelect() {
      this.getEl(JSON.parse(sessionStorage.getItem("userAjaxParam")).pageNum);
      this.$router.push({
        path: "/organization",
        query: {
          // depId: this.userData.depId,
          // depName: this.userData.depName,
          isSelect: "选择",
          path: this.myPath
        }
      });
    },
    /**
     * 跳转客户搜索
     */
    find: function() {
      this.getEl(JSON.parse(sessionStorage.getItem("userAjaxParam")).pageNum);
      this.$router.push({
        path: "search",
        query: {
          title: "客户搜索"
        }
      });
    },
    /**
     * 跳转新增客户页面
     */
    create() {
      this.getEl(JSON.parse(sessionStorage.getItem("userAjaxParam")).pageNum);
      this.$router.push({
        path: "addCus",
        query: {
          title: "新增客户"
        }
      });
    },
    /**
     * 跳转详情页
     */
    toDetails(item) {
      this.$router.push({
        path: "customerInfoComplete",
        query: {
          c_id: item.id
        }
      });
    },
    closeModal() {
      this.modal = false;
    },
    /**
     * 读取 存储在sessionStorage中的param
     */
    returnParam() {
      let param = {
        pageNum: this.pageNum
      };
      let userAjaxParam = sessionStorage.getItem("userAjaxParam");
      if (userAjaxParam && userAjaxParam != "undefined") {
        param = JSON.parse(sessionStorage.getItem("userAjaxParam"));
      }
      return param;
    },
    /**
     * 处理请求出错
     * $error 错误请求参数
     */
    handleError(error) {
      this.$vux.toast.text(this.$error[error.response.status], "middle");
    },
    // 根据员工id筛选私客
    selectMy() {
      let param = this.returnParam();
      param.pageNum = 1;
      param.eId = this.$route.query.id;
      this.userAjax(param);
    }
  },
  computed: {
    owner() {
      if (this.$route.path != "/user") return;
      let isSelected = sessionStorage.getItem("isSelected");
      if (isSelected == "1") {
        this.selectMy();
        sessionStorage.isSelected = 0;
      }
      return this.$route.query.name || "全部";
    },
    getSlider() {
      // debugger
      if (!this.selector) {
        return [];
      } else {
        switch (this.slider) {
          case 1:
            return this.selector[this.tabIds[0]].children;
            break;
          case 2:
            return this.selector[this.tabIds[1]].children;
            break;
          case 3:
            return this.selector[this.tabIds[2]].children;
            break;
          case 4:
            return this.selector[this.tabIds[3]].children;
            break;

          case 5:
            let maleGuestType = [
              { value: "公司公客池", id: 1, key: 1 },
              { value: "部门公客池", id: 2, key: 2 }
            ];
            return maleGuestType;
            break;
        }
      }
    }
  },
  created() {
    this.userData = JSON.parse(localStorage.getItem("userMessage"));

    this.dropdownParam = JSON.parse(sessionStorage.getItem("dropdownParam"));
    this.activeLink = sessionStorage.getItem("activeLink") || "my";
    this.toUserType = this.userData.companyType;
    this.resetToTab();
    let param = this.returnParam();
    param.pageNum = 1;
    this.userAjax(param);
    this.getDropdownData();
  },
  activated() {
    // 返回时局部刷新页面并调到指定位置
    if (this.$store.state.isBack) {
      let param = this.returnParam();
      param.pageNum = this.pageNum;
      console.log(param);
      this.userAjax(param, false, true);

      setTimeout(() => {
        // 调用mixins中的方法
        this.goOldEl();
      }, 300);
    } else {
      this.resetToTab();
      let param = this.returnParam();
      param.pageNum = 1;
      this.userAjax(param);
      this.getDropdownData();
    }
  }
};
</script>

<style scoped  lang="less">
@import "~@/assets/CSS/config";

.main {
  .topbar-content {
    font-size: 0;
  }
  .staff-btn {
    margin-left: 0px !important;
  }
  /deep/ .tab {
    > p {
      position: relative;
      padding-right: 30px;
      line-height: 90px;
      flex: 1;
      display: block;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      -moz-text-overflow: ellipsis;
      &.active {
        color: @color-green;
        > i {
          color: @color-green;
        }
      }
      > span {
        display: inline-block;
      }
      > i {
        position: absolute;
        right: 10px;
        color: @color-assist;
      }
    }
  }
  .content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 170px;
    bottom: 80px;
    left: 0;
    right: 0;
    &.ban-scroll {
      overflow: hidden;
    }
    .list-num {
      padding: 10px 30px;
      > span {
        @font-size-h3();
        color: @color-green;
      }
    }
  }
}
</style>
