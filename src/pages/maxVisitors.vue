<template>
  <div>
    <div class="header">
      <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    </div>
    <div v-if="scrollList.length>0">
      <c-scroll
        ref="bScroll"
        :data="scrollList"
        :total="total"
        :listenScroll="true"
        class="content container"
        @scroll="moreData('refresh')"
        @scrollToEnd="moreData('more')"
      >
        <li
          class="iconfont"
          v-for="item in scrollList"
          @click="goWxPerson(item.union_id,item.head_img,item.nickname,item.count,item.storeCount,item.buildingCount)"
          v-if="item.nickname"
        >
          <p class="left">
            <img :src="item.head_img">
          </p>
          <p class="right">
            <span>{{item.nickname}}</span>
            <span>{{item.count}}次访问（店铺{{item.storeCount}}|项目{{item.buildingCount}}）</span>
          </p>
        </li>
      </c-scroll>
    </div>
    <div v-else class="no_data">
      <img src="../assets/img/abnormal-noTask.png" alt>
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
export default {
  name: "maxVisitors",
  mixins: [MIXINS, FILTERS],
  data() {
    return {
      title: "浏览最多的访客",
      getBack: true,

      scrollList: [],
      total: 0,
      currentPage: 1,
      param: {}
    };
  },
  created() {
    this.getData(true);
  },
  methods: {
    /**
     * 获取项目列表（默认强推）
     */
    getData(init) {
      // init && isBack == true为第一次进来
      if (init) {
        this.total = 0;
        this.scrollList = [];
        this.currentPage = 1;
      }
      this.param.pageNum = this.currentPage;
      this.param.pageSize = 10;
      this.$ajax
        .get("/api/onlineStore/visitCustRanking", this.param)
        .then(res => {
          if (res.data.status == 200) {
            this.total = res.data.data.total;

            if (this.total === this.scrollList.length) {
              return;
            } else {
              this.currentPage += 1;
              this.scrollList = this.scrollList.concat(res.data.data.list);
            }
            console.log(this.scrollList );
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
        this.getData(false);
      } else {
        this.getData(true);
      }
    },
    // 跳转到浏览个人页面
    goWxPerson(val, head_img, nickname, count, storeCount, buildingCount) {
      console.log(val);
      this.$router.push({
        path: "goWxPerson",
        query: {
          unionId: val,
          head_img: head_img,
          nickname: nickname,
          count: count,
          storeCount: storeCount,
          buildingCount: buildingCount
        }
      });
    }
  },

  components: {
    topbar
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/CSS/config";
/deep/ .header {
  .topbar {
    font-weight: normal;
    position: fixed;
  }
}
.no_data {
  img {
    display: inline-block;
    width: 30%;
    height: 30%;
    margin: 25vw 35vw;
  }
}
.container {
  margin-top: 12vw;
  li {
    height: 20vw;
    width: 100%;
    background-color: #fff;
    // border-bottom: 1px solid #eeeeee;
    padding: 4vw 0 0 4vw;
    display: flex;
    box-sizing: border-box;
    position: relative;
    &:before {
      content: "\e60f";
      position: absolute;
      top: 50%;
      right: 4vw;
      transform: rotate(180deg);
      font-size: 7vw;
      color: @color-minor;
      margin-top: -5vw;
    }
    &:first-of-type {
      margin-top: 10vw;
    }
    > p:first-of-type {
      flex: 1;
      text-align: right;
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
      border-bottom: 1px solid #eee;
      //  background-color: green;
      span {
        display: block;
        &:first-of-type {
          font-weight: bold;
        }
        &:nth-of-type(2) {
          margin-top: 1vw;
          font-size: 3vw;
          color: #ccc;
        }
      }
    }
  }
}
</style>
