<template>
  <div class="container">
    <topbar
      :title="title"
      :back="toBack"
      :search="toSearch"
      :my="toSelect"
      v-on:goBack="goHome"
      v-on:find="toFind"
      v-on:whose="goSelect"
      v-on:selectMy="selectMy"
      :path="myPath"
    >
      <!-- <div slot="whose">
        <span class="topbar-left staff-btn iconfont icon-staff" @click="goOrg"> {{owner|maxLen}}</span>
      </div>-->
    </topbar>
    <div class="main" @click="closeModal">
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
        class="content wrapper"
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
          <follow-list :list="scrollList" :nowrap="true" @getDetails="userDetails" @getEl="getEl">
            <p class="float-left-logo" slot="li-left" slot-scope="slotProps">
              <span>{{slotProps.li.c_name|nameFormatter}}</span>
            </p>
            <template slot="li-right-title" slot-scope="slotProps">
              <span>{{slotProps.li.c_name|maxLen(5)}}</span>
              <span class="list-title-phone">{{slotProps.li.phone | phoneFormatter}}</span>
              <span>{{slotProps.li.follow_type}}-{{slotProps.li.reason_type}}</span>
            </template>
            <template slot="li-right-content" slot-scope="slotProps">{{slotProps.li.follow_reason}}</template>
            <template slot="li-right-footer" slot-scope="slotProps">
              <span
                class="desc-footer-left"
              >跟进人：{{slotProps.li.pc_name}}-{{slotProps.li.pc_dep_name}}</span>
              <span class="desc-footer-right">{{slotProps.li.create_time}}</span>
            </template>
          </follow-list>
        </div>
      </c-scroll>
    </div>
  </div>
</template>

<script>
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
// import {SCROLL} from "@/assets/JS/scroll"
import { Popup } from "vux";
import topbar from "@/components/topbar";
import newDropdown from "@/components/newDropdown";
// import dropdown from "@/components/dropdown";
import followList from "@/components/followList";
import scroll from "@/components/scroll";
import { setTimeout } from "timers";
import { mapMutations } from "vuex";
const tabInit = [
  {
    index: 1,
    name: "跟进类型",
    param: "followType"
  },
  {
    index: 2,
    name: "跟进目的",
    param: "reasonType"
  }
];

export default {
  name: "tip-follow",
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    // dropdown,
    followList,
    Popup,
    newDropdown
  },
  data() {
    return {
      showPopup: false, //右侧的弹出窗
      showPopupContent: {}, //右侧的弹出窗选择后的值
      title: "我的跟进",
      toBack: true,
      toSearch: true,
      toSelect: true,
      tab: [],
      tabIds: [303, 311],
      selector: {}, //筛选下拉列表
      modal: false,
      num: 16,
      total: 0,
      currentPage: 1,
      scrollList: [],
      slider: 1,
      dropdownPayload: {}, //筛选条件
      pageNum: "",
      myPath: "/tipFollow"
    };
  },
  created() {
    this.getDropdownData();
  },

  methods: {
    ...mapMutations(["changeStoreCType", "changeStorePID"]),
    // 关闭右侧弹窗
    ContoryshowPopup(val) {
      this.showPopup = val;
    },
    // 点击确定按钮后的弹窗层
    Contoryshow(val, ifShow) {
      this.showPopup = ifShow; //关闭弹窗
      this.showPopupContent = val; //右侧的弹出窗选择后的值

      this.dropdownPayload = val;
      console.log(444);
      this.getData(this.newPage);
    },

    // 打开选择弹窗
    buttonClick() {
      this.showPopup = true;
    },
    // 跳转到员工选择页面
    goOrg() {
      this.$store.commit("changeStop");
      this.goSelect();
    },
    closeModal: function() {
      this.modal = false;
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
            res.data[303].children.unshift({ value: "不限", key: "" });
            res.data[311].children.unshift({ value: "不限", key: "" });
            this.selector = {
              followPurpose: res.data[303].children,
              followType: res.data[311].children
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
      this.$ajax
        .get("/api/records/my", param)
        .then(res => {
          // debugger
          res = res.data;
          if (res.status === 200) {
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
              // debugger
              this.currentPage += 1;
              this.scrollList = this.scrollList.concat(res.data.list);
            }
            // console.log(this.list)
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
    // 旧版本筛选：
    // getDropdownParam: function(payload, tabActive, value) {
    //   // debugger
    //   this.tab.forEach((item, index) => {
    //     if (item.param === tabActive) {
    //       item.name = !value ? tabInit[index].name : value;
    //     }
    //   });
    //   this.modal = false;
    //   this.dropdownPayload = payload;
    //   this.getData(this.newPage);
    // },
    toFind: function() {
      this.getEl(this.newPage.pageNum - 1);
      this.$router.push({
        path: "search",
        query: {
          title: "跟进"
        }
      });
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
    // 根据员工id筛选列表
    selectMy() {
      this.scrollList = [];
      let param = {
        type: 0,
        pageNum: 1,
        pageSize: 10,
        eId: this.$route.query.id
      };
      param = Object.assign({}, param, this.dropdownPayload);
      this.getData(param);
    }
  },
  computed: {
    newPage: function() {
      let param = {
        type: 0,
        pageNum: this.currentPage,
        pageSize: 10
      };
      // debugger
      param = Object.assign({}, param, this.dropdownPayload);
      return param;
    }
  },

  activated() {
    console.log(`我是从上一页进来的`);
    // 通过/home的vuex为1，isShowpopup ==3是通过详情页进来的,2为意向项目进来的
    if (this.$store.state.isShowpopup == 1) {
      this.changeStorePID(""); //情况项目id
      this.showPopupContent = {}; //从首页进来，清空原来滑动的值
      this.showPopup = false; //弹框关闭
    } else if (this.$store.state.isShowpopup == 3) {
      this.showPopup = false;
    } else {
      this.showPopup = true;
    }
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
        type: 0,
        pageNum: this.pageNum,
        pageSize: 10
      };
      param = Object.assign({}, param, this.dropdownPayload);
      this.getData(param, false, true);
      // 调用mixins中的方法
      this.goOldEl();
    } else {
      // 不是返回则刷新页面
      this.scrollList = [];
      let param = {
        type: 0,
        pageNum: 1,
        pageSize: 10
      };
      if (this.$store.state.isShowpopup == 2 && this.dropdownPayload) {
        console.log("我是从项目进来的");
        param = Object.assign({}, param, this.dropdownPayload);
      }
      // param = Object.assign({}, param, this.dropdownPayload)
      this.tab = [
        {
          index: 1,
          name: "跟进类型",
          param: "followType"
        },
        {
          index: 2,
          name: "跟进目的",
          param: "reasonType"
        }
      ];
  console.log(2);
      
      //  如果是从意向项目中进来则不进行刷新
      if (this.$store.state.isShowpopup == 2)this.getData(param);
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

