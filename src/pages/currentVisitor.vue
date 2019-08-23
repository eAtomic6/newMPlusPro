<template>
  <div>
    <div class="header">
      <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    </div>
    <c-scroll
      ref="bScroll"
      :data="scrollList"
      :total="total"
      :isLastPage="isLastPage"
      :listenScroll="true"
      class="content container"
      @scroll="moreData('refresh')"
      @scrollToEnd="moreData('more')"
    >
      <li v-for="(item,key) in scrollList" @click="toOnlineStore">
        <p class="left">
          <img :src="item.head_img" v-if="item.head_img">
          <img src="../assets/img/customer-default.png" alt v-else>
        </p>
        <p class="right">
          <span>{{item.nickname}}</span>
          <span>微信-{{item.obj3_id == 1?"单聊":(item.obj3_id == 3)?"群聊":(item.obj3_id == 2)?"朋友圈":""}}</span>
          <span class="mallLogo">
            <img :src="getCurrentImg" v-if="getCurrentImg">
            <img src="../assets/img/customer-default.png" alt v-else>
            <b>{{getCurrentName}}的网店</b>
          </span>
          <span>{{item.create_time}}</span>
        </p>
      </li>
    </c-scroll>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
export default {
  name: "currentVisitor",
  mixins: [MIXINS, FILTERS],
  components: {
    topbar
  },
  data() {
    return {
      title: "最近来访记录",
      getBack: true,
      getCurrentImg: "", //当前人的头像
      getCurrentName: "", //当前人的名字
      scrollList: [],
      total: 0,
      currentPage: 1,
      param: {},
      isLastPage: ""
    };
  },
  created() {
    this.getData(true, true);
    // 从缓存里拿当前这个人的信息
    this.getCurrentName = JSON.parse(localStorage.getItem("userMessage")).name;
    this.getCurrentImg = JSON.parse(
      localStorage.getItem("userMessage")
    ).headImg;
  },
  methods: {
    toOnlineStore() {
      let brokerId = localStorage.getItem("userMessageId");
      console.log(1);
      console.log(brokerId);
      window.location.href =
        this.$ipconfig + "public/agent-index.html?brokerId=" + brokerId;
    },

    /**
     * 获取项目列表（默认强推）
     */
    getData(init, isBack) {
      // init && isBack == true为第一次进来
      if (init) {
        this.currentPage = 1;
        this.scrollList = [];
      }
      this.param.pageNum = this.currentPage;
      this.param.pageSize = 10;
      this.$ajax
        .get("/api/onlineStore/visitRecord", this.param)
        .then(res => {
          if (res.data.status == 200) {
            this.total = res.data.data.total;
            if (this.total === this.scrollList.length) {
              return;
            } else if (isBack) {
              this.scrollList = res.data.data.list;
            } else {
              this.currentPage += 1;
              this.scrollList = this.scrollList.concat(res.data.data.list);
            }
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err], "middle");
        });
    },
    /**
     * 加载
     */
    moreData(type = "more") {
      if (type === "more") {
        this.getData(false, false);
      } else {
        this.getData(true, true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .header {
  .topbar {
    background-color: #222 !important;
    color: #fff;
    font-weight: normal;
    position: fixed;
  }
}
.container {
  margin-top: 12vw;
  li {
    height: 40vw;
    width: 100%;
    background-color: #fff;
    padding: 4vw 0 4vw 0;
    display: flex;
    box-sizing: border-box;
    &:first-of-type {
      margin-top: 10vw;
    }
    > p:first-of-type {
      flex: 1;
      text-align: right;
      border-bottom: 1px solid #eeeeee;
      margin-left: 4vw;
      img {
        width: 10vw;
        height: 10vw;
        border-radius: 50%;
      }
    }
    > p:nth-of-type(2) {
      flex: 9;
      padding-left: 4vw;
      box-sizing: border-box;
      border-bottom: 1px solid #eeeeee;
      padding-right: 4vw;
      span {
        display: block;
      }
      span:first-of-type {
        margin-top: 1vw;
      }
      span:nth-of-type(2) {
        margin-top: 1vw;
        font-size: 3vw;
        color: #ccc;
      }
      .mallLogo {
        height: 12vw;
        width: 100%;
        background-color: #eee;
        overflow: hidden;
        margin-top: 1vw;
        padding-top: 1vw;
        box-sizing: border-box;
        padding-left: 2vw;
        img {
          width: 10vw;
          height: 10vw;
          border-radius: 50%;
          float: left;
        }
        b {
          font-weight: normal;
          font-size: 3vw;
          margin-top: 3vw;
          padding-left: 15vw;
          display: block;
        }
      }
      span:nth-of-type(4) {
        margin-top: 1vw;
      }
    }
  }
}
</style>
