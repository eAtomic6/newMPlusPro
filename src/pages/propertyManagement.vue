<template>
  <div>
    <topbar :title="title" :back="getBack" v-on:goBack="goBack"></topbar>
 <div v-if="scrollList.length>0">
    <c-scroll
      ref="bScroll"
      :data="scrollList"
      :total="total"
      :listenScroll="true"
      class="content"
      @scroll="moreData('refresh')"
      @scrollToEnd="moreData('more')"
    >
      <div>
        <p class="list-num">
          共
          <span>{{total}}</span>条记录
        </p>
        <building
          :house="scrollList"
          :title="title"
          @draggable="draggable"
        ></building>
      </div>
    </c-scroll>
    </div>

    <div v-else class="no_data">
      <img src="../assets/img/abnormal-noTask.png" alt>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import building from "@/components/building";
import { debuglog } from "util";
export default {
  mixins: [MIXINS, FILTERS],
  data() {
    return {
      getBack: true,
      title: "项目管理",

      scrollList: [],
      total: 0,
      currentPage: 1,
      param: {}
    };
  },
  created() {
    // 第一次进入
    this.getHouse(true);
  },

  methods: {
    draggable(val) {
      if (val) {
        this.$refs.bScroll.disable();
      } else {
        this.$refs.bScroll.enable();
      }
    },

    /**
     * 获取项目列表（默认强推）
     */
    getHouse(init) {
      // init && isBack == true为第一次进来
      if (init) {
        this.total = 0;
        this.scrollList = [];
        this.currentPage = 1;
      }
      this.param.pageNum = this.currentPage;
      this.param.pageSize = 10;
      this.param.id = localStorage.getItem("userMessageId");
      this.$ajax
        .get("/api/projectManagement", this.param)
        .then(res => {
          if (res.data.status == 200) {
            this.total = res.data.data.total;

            if (this.total === this.scrollList.length) {
              return;
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
        this.getHouse(false);
      } else {
        this.getHouse(true);
      }
    }
  },

  components: {
    draggable,
    topbar,
    building
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.no_data {
  img {
    display: inline-block;
    width: 30%;
    height: 30%;
    margin: 25vw 35vw;
  }
}
.list-group {
  margin-top: 11.5vw;
  .draggable {
    position: relative;
  }

  .production_list {
    margin-bottom: 10px;
    background: white;
    height: 22vw;
    position: relative;
    .fa {
      position: absolute;
      right: 5vw;
      top: 2vw;
      display: inline-block;
      width: 12vw;
      height: 12vw;
      background: url("../assets/img/about_us.png") no-repeat 100% 100%;
      background-size: 12vw;
      z-index: 111;
    }
    .delete_item {
      position: absolute;
      top: 0;
      right: -16vw;
      width: 16vw;
      line-height: 22vw;
      font-family: PingFangSC-Regular;
      font-size: 4vw;
      text-align: center;
      color: white;
      background: #ff7ea9;
    }
  }
}
.content {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 13vw;
  bottom: 0;
  left: 0;
  right: 0;
}

.list-num {
  padding: 10px 30px;
  > span {
    @font-size-h3();
    color: @color-orange;
  }
}
</style>
