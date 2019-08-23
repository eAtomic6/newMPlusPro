<!--  -->
<template>
  <div class="container">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="topbar-right msg" @click="cancelRight">取消</span>
    </topbar>
    <div class="main">
      <c-scroll class="content" :data="staffList" :total="total" :listenScroll="true" @scroll="resetStaffList" @scrollToEnd="getStaffList">
        <member-list :batch="batch" v-on:memberList="getMember" :staffList="staffList"></member-list>
      </c-scroll>
    </div>

    <div class="confirm" @click="confirm">确定</div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import memberList from "@/components/memberLIst";
import { MIXINS } from "@/assets/JS/mixins";

export default {
  mixins: [MIXINS],
  components: {
    topbar,
    memberList
  },
  data() {
    return {
      batch: true,
      title: "请选择成员",
      getBack: true,
      staffList: [],
      list: [],
      move: true,
      depId: this.$route.query.depId,
      total: 0,
      currentPage: 1
    };
  },
  created() {
    let mineMsg = JSON.parse(localStorage.getItem("userMessage"));

    this.getStaffList();
  },
  methods: {
    cancelRight() {
      this.$router.push("/organization");
    },
    confirm() {
      if (this.list.length != 0) {
        this.$router.push({
          path: "/moveDepart",
          query: {
            eids: this.list,
            type: "batch"
          }
        });
      } else {
        this.$vux.toast.text("请选择成员", "middle");
      }
    },
    getMember(msg) {
      let ids = [];
      msg.forEach(element => {
        ids.push(element.id);
      });
      this.list = ids;
    },
    getStaffList() {
      let param = {
        depId: this.depId,
        status:1
      };
      param.pageNum = this.currentPage;
      param.pageSize = 20;
      this.$ajax.get("/api/employee/list", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.total = res.data.total;
          //this.staffList = res.data.list;
          if (this.total === this.staffList.length) {
            return;
          } else {
            this.currentPage += 1;
            this.staffList = this.staffList.concat(res.data.list);
          }
        }
      }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        });
    },
    resetStaffList() {
      let param = {
        depId: this.depId,
        status:1
      };
      param.pageNum = 1;
      param.pageSize = 20;
      this.$ajax.get("/api/employee/list", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.total = res.data.total;
          this.staffList = res.data.list;
        }
      }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        });
    }
  },
  filters: {
    getName: function(name) {
      if (name.length > 2) {
        return name.substr(-2, 2);
      } else {
        return name;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.container {
  position: relative;
  .confirm {
    width: 750px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: #fff;
    font-size: @font-size-l;
    background: @color-green;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .content {
    position: absolute;
    top: 80px;
    bottom: 100px;
    left: 0;
    right: 0;
    overflow-y: scroll;
  }
}
</style>