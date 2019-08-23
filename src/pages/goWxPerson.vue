<template>
  <div>
    <div class="header">
      <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    </div>
    <div class="wx_info clearfix">
      <div class="fl">
        <p>{{$route.query.nickname}}</p>
        <p>{{$route.query.count}}次访问(店铺{{$route.query.storeCount}}/项目{{$route.query.buildingCount}})</p>
      </div>
      <img :src="$route.query.head_img" alt class="fr">
    </div>
    <c-scroll
      ref="bScroll"
      :data="scrollList1"
      :total="total"
      :listenScroll="true"
      :isLastPage="isLastPage"
      class="content container"
      @scroll="moreData('refresh')"
      @scrollToEnd="moreData('more')"
    >
      <div v-for="(item,key) in scrollList" :key="key">
        <p class="time">{{item.time}}</p>
        <building :house="item.obj" :title="title"></building>
      </div>
    </c-scroll>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import building from "@/components/building";
import { all } from "q";
export default {
  name: "maxVisitorsLog",
  mixins: [MIXINS, FILTERS],
  data() {
    return {
      title: "浏览最多的访客记录",
      getBack: true,

      scrollList: [],
      scrollList1: [],
      total: 0,
      currentPage: 1,
      param: {},
      dataLength: "",
      isLastPage: false
    };
  },
  created() {
    this.getData(true);
  },
  methods: {
    /**
     * 获取项目列表（默认强推）
     */
    getData(init, params) {
      // init && isBack == true为第一次进来
      if (init) {
        this.currentPage = 1;
        this.total = 0;
        this.scrollList = [];
        this.scrollList1 = [];
      }
      this.param.pageNum = this.currentPage;
      this.param.pageSize = 10;
      this.param.unionId = this.$route.query.unionId;
      this.$ajax
        .get("/api/onlineStore/visitBuildingRecord", this.param)
        .then(res => {
          if (res.data.status == 200) {
            this.total = res.data.data.total;
            // console.log("11111沙发上的");
            // console.log(this.total);
            // console.log(this.scrollList1.length);
            // console.log(this.total <= this.scrollList1.length);
            if (this.total <= this.scrollList1.length) {
              this.isLastPage = true;
              return;
            } else {
              console.log(333);
              this.currentPage += 1;
              console.log(this.fistTime);
              console.log(res.data.data.list[0]);
              this.fistTime == res.data.data.list[0].time
                ? (res.data.data.list[0].time = null)
                : (this.fistTime =
                    res.data.data.list[res.data.data.list.length - 1].time);
            }
            console.log(this.fistTime);
            res.data.data.list.forEach((element, index) => {
              this.scrollList.push(element);
              // this.scrollList = this.scrollList.push(element)
              this.scrollList1 = this.scrollList1.concat(element.obj);
            });
            // if (params == 1) {
       

            // }
            // this.scrollList.forEach((element, index) => {
            //   this.scrollList1 = this.scrollList1.concat(element.obj);
            // });
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
        console.log(222);
        this.getData(false);
      } else {
        this.isLastPage = false;
        this.getData(true);
      }
    }
  },
  components: {
    topbar,
    building
  }
};
</script>

<style lang="less" scoped>
@import "~@/assets/CSS/config";
.wx_info {
  border-top: 0.3vw solid #ebebeb;
  border-bottom: 0.3vw solid #ebebeb;
  margin-top: 10.5vw;
  padding: 4vw;
  width: 100vw;
  background-color: #fff;
  box-sizing: border-box;
  position: absolute;
  z-index: 99;
  > div {
    > p {
      font-size: 4vw;
      &:nth-of-type(2) {
        color: #999;
        margin-top: 1vw;
        font-size: 3.2vw;
      }
    }
  }
  > img {
    width: 12vw;
    height: 12vw;
    display: inline-block;
    border-radius: 50%;
  }
}
.container {
  // margin-top: 32vw;
  /deep/ .content {
    padding-top: 32vw;
  }
  .time {
    padding-left: 5vw;
  }
}
</style>

