<template>
  <div class="container">
    <topbar
      :title="getTitle"
      :back="toBack"
      :search="toSearch"
      :my="toSelect"
      v-on:goBack="goHome"
      v-on:find="toFind"
      v-on:whose="goSelect"
      v-on:selectMy="selectMy"
      :path="myPath"
    ></topbar>
    <div class="main" @click="modal=false">
      <!-- <dropdown :slider="getSlider" :tab="tab" :modal="modal" v-on:getTab="getTab" v-on:getParam="getDropdownParam"></dropdown> -->
      <!-- 1.6版新改弹框 B -->
      <popup v-model="showPopup" position="right">
        <keep-alive>
          <newDropdown
            style="width:86vw;"
            @ContoryshowPopup="ContoryshowPopup"
            @Contoryshow="Contoryshow"
            :slider="selector"
          ></newDropdown>
        </keep-alive>
      </popup>
      <div class="showPopup">
        <div>
          <span>{{showPopupContent.followPurposeValue_qin?showPopupContent.followPurposeValue_qin:"不限"}}</span>
          <span>{{showPopupContent.followTypeValue_qin?showPopupContent.followTypeValue_qin:"不限"}}</span>
          <span
            v-if="showPopupContent.startTime"
          >{{showPopupContent.startTime.split(' 00:00:00')[0]}} - {{showPopupContent.endTime.split(' 23:59:59')[0]}}</span>
          <span v-else>不限</span>
          <span v-if="showPopupContent.proName">{{showPopupContent.proName}}</span>
        </div>
        <button @click="buttonClick">
          筛选
          <img src="../assets/img/filter.png" alt>
        </button>
      </div>
      <!-- 1.6版新改弹框 E  -->
      <c-scroll
        ref="bScroll"
        class="content"
        :data="scrollList"
        :total="total"
        :listenScroll="true"
        @scroll="getData(newPage)"
        @scrollToEnd="getData(newPage,0)"
      >
        <div>
          <p class="list-num">
            共
            <span>{{total}}</span>条记录
          </p>
          <record-list :list="scrollList" :card="getTitle" @getDetails="userDetails" @getEl="getEl"></record-list>
        </div>
      </c-scroll>
    </div>
  </div>
</template>

<script>
import { MIXINS } from "@/assets/JS/mixins";
// import {SCROLL} from "@/assets/JS/scroll"

import topbar from "@/components/topbar";
import newDropdown from "@/components/newDropdown";
import { mapMutations } from "vuex";
import { Popup } from "vux";
// import dropdown from "@/components/dropdown";
import recordList from "@/components/recordList";

const tabInit = [
  {
    index: 1,
    name: "报备类型",
    param: "checkType"
  },
  {
    index: 2,
    name: "楼盘性质",
    param: "buildingProperty"
  }
];

export default {
  name: "tip-record",
  mixins: [MIXINS],
  components: {
    topbar,
    Popup,
    newDropdown,
    // dropdown,
    recordList
  },
  data() {
    return {
      showPopup: false, //右侧的弹出窗
      showPopupContent: {}, //右侧的弹出窗选择后的值
      title: "我的报备",
      toBack: true,
      toSearch: true,
      toSelect: true,
      tab: [
        {
          index: 1,
          name: "报备类型",
          param: "checkType"
        },
        {
          index: 2,
          name: "楼盘性质",
          param: "buildingProperty"
        }
      ],
      tabIds: [276, 208],
      selector: {},
      modal: false,
      num: 16,
      total: 0,
      currentPage: 1,
      scrollList: [],
      slider: 1,
      dropdownPayload: {}, //筛选条件
      type: 1, //区分报备、带看
      listRequest: "/api/records/my",
      loadingState: false,
      pageNum: "",
      myPath: ""
    };
  },

  methods: {
    ...mapMutations(["changeStoreCType", "changeStorePID"]),
    // 关闭右侧弹窗
    ContoryshowPopup(val) {
      this.showPopup = val;
    },
    // 点击确定按钮后的弹窗层
    Contoryshow(val, ifShow) {
      this.switchType(); //判断是从报备进的还是带看进的
      this.showPopup = ifShow;
      this.showPopupContent = val;
      this.dropdownPayload = val;
      this.getData(this.newPage);
    },

    // 打开选择弹窗
    buttonClick() {
      this.showPopup = true;
    },
    /**
     * 获取下拉筛选数据
     */
    getDropdownData: function() {
      let param = {
        ids: this.tabIds.join(",")
      };
      this.$ajax
        .get("/api/dictionary/list", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            res.data[208].children.unshift({ value: "不限", key: "" });
            res.data[276].children.unshift({ value: "不限", key: "" });
            this.selector = {
              followPurpose: res.data[208].children,
              followType: res.data[276].children
            };
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 获取列表数据
     * @param payload
     */
    getData: function(param, init = 1, isBack) {
      if (init) {
        this.currentPage = 1;
        this.total = 0;
        this.scrollList = [];
        param.pageNum = 1;
      }
      if (this.$route.query.id) {
        param.eId = this.$route.query.id;
      } else {
        param.eId = "";
      }
      this.loadingState = true;
      this.$ajax
        .get("/api/records/my", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.loadingState = false;
            this.total = res.data.total;
            if (this.total === this.scrollList.length) {
              return;
            } else if (isBack) {
              this.scrollList.splice(
                (param.pageNum - 1) * 10,
                res.data.list.length,
                ...res.data.list
              );
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
    getTab: function(payload) {
      this.modal = this.slider === payload.index && this.modal ? false : true;
      this.slider = payload.index;
    },
    toFind: function() {
      this.getEl(this.newPage.pageNum - 1);
      this.$router.push({
        path: "search",
        query: {
          title: this.getTitle,
          type: this.type
        }
      });
    },
    getDropdownParam: function(payload, tabActive, value) {
      // debugger
      this.tab.forEach((item, index) => {
        if (item.param === tabActive) {
          item.name = !value ? tabInit[index].name : value;
        }
      });
      this.modal = false;
      this.dropdownPayload = payload;
      this.getData(this.newPage);
    },
    /**
     * 跳转客户详情页
     * @param payload
     */
    userDetails: function(payload) {
      // debugger
      this.$router.push({
        path: "customerInfoComplete",
        query: {
          c_id: payload.c_id
        }
      });
    },
    // 根据路由切换type
    switchType() {
      if (this.$route.path === "/tipRecord") {
        this.type = 1;
        this.myPath = "/tipRecord";
      } else if (this.$route.path === "/tipService") {
        this.type = 2;
        this.myPath = "/tipService";
      }
    },
    // 根据员工id筛选列表
    selectMy() {
      this.scrollList = [];
      let param = {
        type: this.type,
        pageNum: 1,
        pageSize: 10,
        eId: this.$route.query.id
      };
      param = Object.assign({}, param, this.dropdownPayload);
      this.getData(param);
    }
  },
  computed: {
    getTitle: function() {
      if (this.$route.path === "/tipRecord") {
        // this.tab[0].name = '报备类型'
        return "我的报备";
      } else {
        // this.tab[0].name = '带看类型'
        return "我的带看";
      }
    },
    newPage: function() {
      let param = {
        type: this.type,
        pageNum: this.currentPage,
        pageSize: 10
      };
      // debugger
      param = Object.assign({}, param, this.dropdownPayload);
      // console.log(param)
      return param;
    }
  },
  activated() {
    // 通过/home的vuex为1，isShowpopup ==3是通过详情页进来的
    if (this.$store.state.isShowpopup == 1) {
      this.showPopupContent = {}; //从首页进来，清空原来滑动的值
      this.changeStorePID(""); //情况项目id
      this.showPopup = false; //弹框关闭
    } else if (this.$store.state.isShowpopup == 3) {
      console.log(3);
      this.showPopup = false;
    } else if (this.$store.state.isShowpopup == 2) {
      console.log(2);
      this.showPopup = true;
    }
    this.switchType();
    // 阻止后面函数的执行
    if (this.$store.state.stopActivate) {
      setTimeout(() => {
        this.$store.commit("changeStop");
      }, 0);
      return;
    }
    // 返回时局部刷新页面并调到指定位置
    if (this.$store.state.isBack) {
      let param = {
        type: this.type,
        pageNum: this.pageNum,
        pageSize: 10
      };
      param = Object.assign({}, param, this.dropdownPayload);

      this.getData(param, false, true);
      // 调用mixins中的方法
      this.goOldEl();
    } else {
      // 不是返回则刷新页面
      this.tab[0].name =
        this.$route.path === "/tipRecord" ? "报备类型" : "带看类型";
      let param = {
        type: this.type,
        pageNum: 1,
        pageSize: 10
      };

      //  如果是从意向项目中进来则不进行刷新请求数据
      if (this.$store.state.isShowpopup == 2 && this.dropdownPayload) {
        param = Object.assign(param, param, this.dropdownPayload);
      }
      this.scrollList = [];
      // param = Object.assign({}, param, this.dropdownPayload)
      //  如果是从意向项目中进来则不进行刷新
      if (this.$store.state.isShowpopup == 2) this.getData(param);
      this.getDropdownData();
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

.main {
  background-color: @bg-f5;
  position: relative;
}

.content {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 170px;
  bottom: 0;
  left: 0;
  right: 0;
  .list-num {
    padding: 10px 30px;
    > span {
      @font-size-h3();
      color: @color-green;
    }
  }
}
.showPopup {
  height: 12vw;
  line-height: 12vw;
  display: flex;
  background-color: #fff;
  border-top: 0.2vw solid #ebebeb;
  > div {
    width: 80vw;
    height: 12vw;
    line-height: 12vw;
    overflow-x: scroll;
    white-space: nowrap;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      height: 0 !important;
    }
    span {
      padding: 1vw 4vw;
      color: #333;
      background-color: #ededed;
      border-radius: 7.3333vw;
    }
  }
  button {
    width: 20vw;
    border: 0;
    outline: none;
    color: #5ca52a;
    box-shadow: -1vw 0 2vw #ebebeb;
    background-color: #fff;

    img {
      display: inline-block;
      width: 4vw;
      height: 3.466vw;
      vertical-align: middle;
    }
  }
}
</style>
