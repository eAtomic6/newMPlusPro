<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" v-on:goBack="goBack">
      <span slot="topbar-right" class="topbar-right msg" @click="cancel">取消</span>
    </topbar>
    <div class="content">
      <div class="crumbs">
        <div class="ul" ref="ul">
          <div>
            <span v-if="companyName">{{companyName}}</span>
            <span v-else>首页</span>
            <span v-if="hierarchy.length>0">></span>
          </div>
          <div v-for="(item,index) in hierarchy" :key="index">
            {{item}}
            <span v-if="hierarchy.length!=1 && index!=hierarchy.length-1">></span>
          </div>
        </div>
      </div>
      <div class="list">
        <ul>
          <li v-for="item in departmentList" :key="item.id">
            <span
              class="left iconfont"
              @click="select(item)"
              :class="{active:active.id==item.id}"
            >{{item.depName | limit}}</span>
            <span class="right iconfont" @click="choseDepartment(item)">下级部门</span>
          </li>
        </ul>
      </div>
      <div class="add" v-if="departmentList.length===0" @click="newAdd">
        <span class="iconfont">新建部门</span>
      </div>
      <div class="confirm" @click="transfer">确定</div>
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import { mapMutations, mapState } from "vuex";

let currentDep = null;

export default {
  mixins: [MIXINS],
  components: {
    topbar
  },
  data() {
    return {
      title: "请选择要转移的部门",
      getBack: true,
      move: true,
      active: {},
      departmentList: [],
      routeArr: [],
      hierarchy: [],
      eids: this.$route.query.eids,
      type: this.$route.query.type,
      companyName: ""
    };
  },
  methods: {
    cancel() {
       this.$router.go(-1)
      // this.$router.push("/organization");
    },
    select(value) {
      if (this.active.id) {
        this.active = {};
      } else {
        this.active = value;
      }
    },
    next() {
      this.$router.push("/subdivision");
    },
    getData(param) {
      this.$ajax
        .get("/api/employee/countByDepartment", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.departmentList = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    choseDepartment(item) {
      let param = {
        id: item.id
      };
      this.getData(param);
      this.routeArr.push(item);
      this.hierarchy.push(item.depName);
    },
    goBack() {
      // debugger
      this.hierarchy.pop();
      let length = this.routeArr.length;
      if (length === 0) {
        localStorage.removeItem("firstItem");
        this.$router.go(-1);
      } else if (length === 1) {
        this.departmentList = [];
        this.routeArr = [];
        this.departmentList.push(currentDep);
      } else {
        this.routeArr.pop();
        let param = {
          id: this.routeArr[this.routeArr.length - 1].id
        };
        this.getData(param);
      }
    },
    transfer() {
      if (this.active.id) {
        if (this.type === "add") {
          let list = JSON.parse(localStorage.getItem("staffMsg"));
          list.depId = this.active.id;
          list.depName = this.active.depName;
          localStorage.setItem("staffMsg", JSON.stringify(list));
          this.$router.push({
            path: "/staffList",
            query: {
              type: "add"
            }
          });
        } else if (this.type === "edit") {
          let list = JSON.parse(localStorage.getItem("staffMsg"));
          list.depId = this.active.id;
          list.depName = this.active.depName;
          localStorage.setItem("staffMsg", JSON.stringify(list));
          this.$router.push({
            path: "/staffList",
            query: {
              type: "edit"
            }
          });
        } else if (this.type === "check") {
          let list = JSON.parse(localStorage.getItem("staffMsg"));
          list.depId = this.active.id;
          list.depName = this.active.depName;
          localStorage.setItem("staffMsg", JSON.stringify(list));
          this.$router.push({
            path: "/staffList",
            query: {
              type: "check"
            }
          });
        } else if (this.type === "batch") {
          let param = {
            desDepId: this.active.id,
            eids: this.eids
          };
          this.$ajax
            .put("/api/employee/transfer", param)
            .then(res => {
              res = res.data;
              if (res.status === 200) {
                this.$vux.toast.text("操作成功", "middle");
                setTimeout(() => {
                  this.$router.push("/organization");
                }, 2000);
              } else {
                this.$vux.toast.text(res.message, "middle");
              }
            })
            .catch(err => {
              this.$vux.toast.text(this.$error[err.response.status], "middle");
            });
        } else if (this.type === "sectorSet") {
          // this.$router.push({
          //   path: "/sectorSet",
          //   query: {
          //     msg: this.active,
          //     type: "moveDep"
          //   }
          // });
          let _list = this.departmentMsg;
          _list.pid = this.active.id;
          //this.setDepartmentMsg(_list)
          this.setParentName(this.active.depName);
          this.$router.go(-1);
        } else if (this.type === "addSector") {
          this.$router.push({
            path: "/addSector",
            query: {
              msg: this.active,
              type: "moveDep"
            }
          });
        }
      } else {
        this.$vux.toast.text("请选择要转移的部门", "middle");
      }
    },
    newAdd() {
      this.$vux.toast.text("当前功能暂时关闭", "middle");
      // this.$router.push({
      //   path: "/addSector",
      //   query: {
      //     type: "org"
      //   }
      // });
    },
    ...mapMutations([
      "setParentId",
      "setParentName",
      "setDepartmentMsg",
      "setDepartmentMsg"
    ])
  },
  created() {
    let mineMsg = JSON.parse(localStorage.getItem("userMessage"));
    let firstItem_l = JSON.parse(localStorage.getItem("firstItem"));
    this.companyName = mineMsg.companyName;
    let firstItem = {
      id: mineMsg.depId,
      depName: mineMsg.depName
    };
    if (firstItem_l) {
      // this.routeArr.push(firstItem_l);
      currentDep = firstItem_l;
      this.departmentList.push(firstItem_l);
    } else {
      currentDep = firstItem;
      // this.routeArr.push(firstItem);
      this.departmentList.push(firstItem);
    }
  },
  computed: {
    ...mapState(["departmentMsg"])
  },
  filters: {
    limit: function(str) {
      if (str) {
        return str.length > 16 ? str.slice(0, 16) + "..." : str;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main {
  .content {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    .crumbs {
      height: 100px;
      line-height: 100px;
      width: 750px;
      background: @bg-f5;
      font-size: @font-size-m;
      padding: 0 30px;
      box-sizing: border-box;
      .ul {
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;
        > div {
          display: inline-block;
          color: @color-assist;
          &:last-of-type {
            color: @color-main;
          }
          span {
            display: inline-block;
            //width: 30px;
            text-align: center;
          }
        }
      }
    }
    .list {
      padding: 0 30px;
      background: @bg-ff;
      ul {
        li {
          height: 107px;
          line-height: 107px;
          border-bottom: 1px solid @border-ea;
          position: relative;
          .left {
            font-size: @font-size-m;
            padding-left: 56px;
            color: #222;
            &:before {
              content: "\e611";
              position: absolute;
              color: @border-e0;
              top: 0;
              left: -5px;
              font-size: 50px;
            }
          }
          .active {
            &:before {
              color: @color-green;
            }
          }
          .right {
            float: right;
            height: 107px;
            padding-right: 35px;
            line-height: 107px;
            font-size: @font-size-m;
            color: @color-assist;
            &:before {
              content: "\e625";
              position: absolute;
              color: @color-assist;
              top: 0;
              right: -20px;
              font-size: 50px;
            }
          }
        }
      }
    }
    .add {
      width: 750px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: @font-size-m;
      color: @color-main;
      background: @bg-ff;
      > span {
        padding-left: 50px;
        position: relative;
        &:before {
          content: "\e610";
          position: absolute;
          color: @color-main;
          top: 50%;
          transform: translateY(-50%);
          left: -5px;
          font-size: @font-size-icon;
        }
      }
    }
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
  }
}
</style>