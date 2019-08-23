<!--  -->
<template>
  <div class="container">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="topbar-right msg" @click="goBatch" v-if="!isSelect">批量操作</span>
    </topbar>
    <div class="main">
      <div class="search iconfont">
        <!-- <input type="text" placeholder="请输入员工姓名或手机号"  @click="goSearch"> -->
        <span class="search_txt" @click="goSearch">请输入员工姓名或手机号</span>
      </div>
      <div class="crumbs" v-if="routeArr.length>1">
        <div class="ul" ref="ul">
          <div v-for="(item,index) in routeArr" :key="index">
            {{item.depName}}
            <span v-if="routeArr.length!==1 && index!==routeArr.length-1">></span>
          </div>
        </div>
      </div>
      <c-scroll
        class="content"
        :class="{mt248:routeArr.length>1,clearBot:isSelect}"
        :data="staffList"
        :total="total"
        @scroll="resetStaffList"
        :listenScroll="true"
        @scrollToEnd="getStaffList(true)"
      >
        <div>
          <div v-if="isSelect" class="all" @click="checkAll()">不限</div>
          <div class="interval" v-if="departmentList.length!=0"></div>
          <div class="city" v-if="departmentList.length!=0">
            <ul class="list city-list">
              <li>组织机构</li>
              <li v-for="item in departmentList" :key="item.id" @click="choseDepartment(item)">
                <span>{{item.depName}}</span>
                <p>
                  {{item.count}}
                  <i class="iconfont icon-right_arrow"></i>
                </p>
              </li>
            </ul>
          </div>
          <div class="interval" v-if="departmentList.length!=0"></div>
          <div class="title">公司员工</div>
          <member-list :organization="organization" :staffList="staffList" :fromPath="fromPath"></member-list>
        </div>
      </c-scroll>
    </div>

    <!-- </div> -->
    <div class="footer" v-if="!isSelect">
      <div @click="add">添加员工</div>
      <div @click="addSector">添加子部门</div>
      <div @click="setSector">部门设置</div>
    </div>

    <Actionsheet v-model="value1" :show-cancel="true" :menus="menus" @on-click-menu="invite"></Actionsheet>
    <div class="mask" @click="closeMask" v-if="isShow"></div>
    <div class="invite" v-if="isShow">
      <div class="top">
        <div class="text">邀请同事加入本部门</div>
        <div class="classify">
          <!-- <div @click="gofx">
              <span class="iconfont icon-qq qq"></span>
              <p>邀请QQ好友</p>
            </div>
            <div>
              <span class="iconfont icon-wechat wechat"></span>
              <p>微信邀请</p>
          </div>-->
          <div class="address" id="copy_text">{{address}}</div>
          <div
            class="copy"
            v-clipboard:copy="address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制链接</div>
        </div>
      </div>
      <div class="btn" @click="cancel">取消</div>
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import memberList from "@/components/memberLIst";
import { MIXINS } from "@/assets/JS/mixins";
import { Actionsheet } from "vux";
import { mapMutations } from "vuex";

export default {
  mixins: [MIXINS],
  components: {
    topbar,
    memberList,
    Actionsheet
  },
  data() {
    return {
      value: "",
      value1: false,
      menus: { menu1: "手动添加员工", menu2: "邀请同事加入本部门" },
      title: "",
      depId: "",
      getBack: true,
      organization: true,
      isShow: false,
      departmentList: [],
      staffList: [],
      routeArr: [],
      total: 0,
      currentPage: 1,
      address: "",
      isOk: false,
      isSelect: this.$route.query.isSelect,
      isDepMaster: "",
      fromPath: this.$route.query.path,
      mineMsg: {} // 用户信息
    };
  },
  methods: {
    // 根据员工筛选操作
    checkAll() {
      sessionStorage.isSelected = 1;
      this.$router.push(this.fromPath);
    },
    gofx() {
      this.$router.push("/wxfx");
    },
    add() {
      this.value1 = !this.value1;
      this.getInviteCode();
    },
    invite(menuKey) {
      if (menuKey == "menu2") {
        if (this.isOk) {
          this.isShow = !this.isShow;
        } else {
          this.$vux.toast.text("权限不足", "middle");
        }
      }
      if (menuKey == "menu1") {
        this.$ajax
          .post("/api/employee/can")
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.$router.push({
                path: "/staffList",
                query: {
                  type: "add"
                }
              });
            } else {
              this.$vux.toast.text("权限不足", "middle");
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      }
    },
    cancel() {
      this.isShow = false;
    },
    setSector() {
       this.$vux.toast.text("当前功能暂时关闭", "middle");
      // if (this.depId !== 1) {
      //   this.$ajax
      //     .put("/api/department/can")
      //     .then(res => {
      //       res = res.data;
      //       if (res.status === 200) {
      //         this.$router.push({
      //           path: "/sectorSet",
      //           query: {
      //             type: "org",
      //             depId: this.depId
      //           }
      //         });
      //       } else {
      //         this.$vux.toast.text("权限不足", "middle");
      //       }
      //     })
      //     .catch(err => {
      //       this.$vux.toast.text(this.$error[err.response.status], "middle");
      //     });
      // } else {
      //   this.$vux.toast.text("当前部门不可设置", "middle");
      // }
    },
    addSector() {
      this.$vux.toast.text("当前功能暂时关闭", "middle");
      // this.$ajax
      //   .post("/api/department/can")
      //   .then(res => {
      //     res = res.data;
      //     if (res.status === 200) {
      //       this.$router.push({
      //         path: "/addSector",
      //         query: {
      //           type: "org"
      //         }
      //       });
      //     } else {
      //       this.$vux.toast.text("权限不足", "middle");
      //     }
      //   })
      //   .catch(err => {
      //     this.$vux.toast.text(this.$error[err.response.status], "middle");
      //   });
    },
    goBatch() {
      this.$vux.toast.text("当前功能暂时关闭", "middle");
      // this.$ajax
      //   .put("/api/employee/transfer/can")
      //   .then(res => {
      //     res = res.data;
      //     if (res.status === 200) {
      //       this.$router.push({
      //         path: "/batch",
      //         query: {
      //           depId: this.depId
      //         }
      //       });
      //     } else {
      //       this.$vux.toast.text("权限不足", "middle");
      //     }
      //   })
      //   .catch(err => {
      //     this.$vux.toast.text(this.$error[err.response.status], "middle");
      //   });
    },
    //搜索同事
    goSearch() {
      this.$router.push({
        path: "/search",
        query: {
          isSelect: this.$route.query.isSelect ? "选择" : "",
          title: "组织架构",
          path: this.fromPath
        }
      });
    },
    /**
     * 获取部门列表
     */
    getData: function(param) {
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
    /**
     * 获取部门员工列表
     */
    getStaffList: function(isPull) {
      let length = this.routeArr.length;
      if (this.isSelect && !this.isDepMaster && length == 1 && isPull) return;
      let param = {
        depId: this.depId,
        pageNum: this.currentPage,
        pageSize: 10,
        status: 1
      };
      this.$ajax
        .get("/api/employee/list", param, "pt")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.total = res.data.total;
            if (this.total === this.staffList.length) {
              return;
            } else {
              this.currentPage += 1;
              this.staffList = this.staffList.concat(res.data.list);
            }
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    //下拉重置
    resetStaffList: function() {
      let length = this.routeArr.length;
      if (!this.isSelect || this.isDepMaster || length !== 1) {
        let param = {
          depId: this.depId,
          pageNum: 1,
          pageSize: 10,
          status: 1
        };
        this.$ajax
          .get("/api/employee/list", param)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.total = res.data.total;
              this.staffList = res.data.list;
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      } else {
        this.getMe();
        this.staffList.splice(0, 1, this.mineMsg);
      }
    },
    /**
     * 选择组织部门
     */
    choseDepartment: function(item) {
      this.currentPage = 1;
      this.staffList = [];
      this.depId = item.id;
      this.depName = item.depName;
      let firstItem = {
        id: item.id,
        depName: item.depName
      };
      localStorage.setItem("firstItem", JSON.stringify(firstItem));
      let param = {
        id: item.id
      };
      this.getData(param);
      this.getStaffList();
      this.routeArr.push(item);
      this.title = item.depName;
    },
    /**
     * 返回
     */
    goBack: function() {
      this.changeStoreShowpopup(3);
      let length = this.routeArr.length;
      if (length === 1) {
        if (this.$route.query.isSelect) {
          this.$router.go(-1);
          return;
        }
        this.$router.push("/mine");
      } else {
        this.routeArr.pop();
        this.title = this.routeArr[this.routeArr.length - 1].depName;
        this.depId = this.routeArr[this.routeArr.length - 1].id;
        let param = {
          id: this.routeArr[this.routeArr.length - 1].id
        };
        this.currentPage = 1;
        this.staffList = [];
        this.getData(param);
        if (!this.isSelect || this.isDepMaster || length !== 2) {
          this.getStaffList();
        } else {
          this.staffList.push(this.mineMsg);
        }
      }
    },
    //复制
    onCopy: function(e) {
      this.isShow = !this.isShow;
      this.$vux.toast.text("复制成功", "middle");
    },
    onError: function(e) {
      this.isShow = !this.isShow;
      this.$vux.toast.text("复制失败", "middle");
    },
    closeMask() {
      this.isShow = !this.isShow;
    },
    //获取邀请码
    getInviteCode() {
      this.$ajax
        .get("/api/employee/inviteCode")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.isOk = true;
            let address = location.href;
            let del = address.substring(
              address.indexOf("#") + 2,
              address.length
            );
            let add_ = "invite/?inviteId=" + res.data;
            this.address = address.replace(del, add_);
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    getMe() {
      //此接口调用是为了刷新本地存储的个人信息，如pc端修改了所拥有的权限，app端要及时更新
      this.$ajax
        .get("api/personal/me")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            localStorage.setItem("userMessage", JSON.stringify(res.data));
          }
        })
        .catch(err => {
          localStorage.setItem("userMessage", JSON.stringify({}));
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    ...mapMutations([
      "setZhuGuanList",
      "setSatrapIDs",
      "setOnce",
      "changeStoreShowpopup"
    ])
  },
  // mounted() {
  //   this.$refs.ul.scrollLeft = 1000;
  // },
  created() {
    this.getMe();
  },
  beforeMount() {
    this.mineMsg = JSON.parse(localStorage.getItem("userMessage"));
    this.title = this.mineMsg.depName;
    this.depId = this.mineMsg.depId;
    this.isDepMaster = this.mineMsg.isDepMaster;
    let param = {
      id: this.mineMsg.depId,
      depName: this.mineMsg.depName
    };
    if (param.id) {
      this.getData(param);
      if (!this.isSelect || this.isDepMaster) {
        this.getStaffList();
      } else {
        this.staffList.push(this.mineMsg);
      }
      this.routeArr.push(param);
    }
    // console.log(this.$route.query.isSelect,7777);
    // this.address=location.href
    // let aaa = this.address.substring(this.address.indexOf('#'),this.address.length)
    // console.log(aaa)
  },
  destroyed() {
    this.setZhuGuanList([]);
    this.setSatrapIDs([]);
    this.setOnce(true);
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.content {
  position: absolute;
  top: 208px;
  left: 0;
  right: 0;
  bottom: 100px;
}
.clearBot {
  bottom: 0;
}
.mt248 {
  top: 248px;
}
.main {
  background-color: @bg-f5;
  position: relative;
  height: 100%;
  padding-bottom: 100px;
  overflow-y: hidden;
  .search {
    z-index: 10;
    width: 750px;
    height: 110px;
    position: absolute;
    left: 0;
    right: 0;
    top: 80px;
    //text-align: center;
    background: @bg-ff;
    .search_txt {
      position: relative;
      width: 690px;
      margin-left: 30px;
      display: inline-block;
      box-sizing: border-box;
      background: @bg-f0;
      color: @color-assist;
      padding-left: 70px;
      padding-top: 15px;
      padding-bottom: 15px;
      border-radius: 10px;
      font-size: @font-size-m;
      &:before {
        content: "\e60b";
        position: absolute;
        color: @color-assist;
        top: 0;
        left: 5px;
        font-size: @font-size-icon;
      }
    }
  }
  .crumbs {
    position: absolute;
    top: 170px;
    z-index: 10;
    height: 60px;
    width: 750px;
    background: @bg-ff;
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
          width: 30px;
          text-align: center;
        }
      }
    }
  }
  .content {
    .all {
      padding: 0 30px;
      background-color: @bg-ff;
      line-height: 100px;
      @font-size-h3();
      font-size: @font-size-xl;
    }
    .city {
      //margin-top: 20px;
      > p {
        height: 100px;
        background-color: @bg-f5;
        padding: 0 30px;
        display: flex;
        align-items: center;
        color: @color-green;
      }
      &-list {
        padding: 0 30px;
        background-color: @bg-ff;
        > li {
          padding: 35px 0;
          border-bottom: 1px solid @border-eb;
          &:first-of-type {
            @font-size-h3();
            font-size: @font-size-xl;
            border: 0px;
            padding-bottom: 10px;
          }
          &:nth-of-type(n + 1) {
            display: flex;
            justify-content: space-between;
            > p {
              color: @color-assist;
              display: inherit;
              align-items: center;
              .iconfont {
                font-size: @font-size-icon-m;
                margin-left: 20px;
              }
            }
          }
          &:last-of-type {
            border: 0px;
          }
        }
      }
    }
    .interval {
      height: 20px;
    }
    .title {
      height: 108px;
      line-height: 108px;
      padding-left: 28px;
      @font-size-h3();
      font-size: @font-size-xl;
      background: @bg-ff;
    }
  }
}
/deep/.weui-mask {
  background: rgba(0, 0, 0, 0.48);
}
/deep/.weui-actionsheet {
  width: 710px;
  left: 20px;
  background: rgba(0, 0, 0, 0);
  .weui-actionsheet__menu {
    height: 200px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    .weui-actionsheet__cell {
      font-size: 30px;
      color: #222;
      height: 100px;
      line-height: 100px;
      padding: 0;
      &:before {
        border: none;
      }
    }
  }
  .weui-actionsheet__action {
    height: 100px;
    border-radius: 6px;
    line-height: 100px;
    margin-top: 20px;
    margin-bottom: 20px;
    &:before {
      border: none;
    }
    .weui-actionsheet__cell {
      font-size: 30px;
      color: @color-black;
      padding: 0;
    }
  }
}
.footer {
  display: flex;
  width: 750px;
  height: 100px;
  position: absolute;
  background: @bg-ff;
  box-shadow: 0px -1px 13px 0px rgba(40, 40, 40, 0.11);
  bottom: 0;
  left: 0;
  div {
    //width: 33.3%;
    flex: 1;
    text-align: center;
    height: 100px;
    line-height: 100px;
    font-size: 28px;
    color: @color-green;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.48);
}
.invite {
  width: 710px;
  //height: 454px;
  height: 370px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 1001;
  border-radius: 6px;
  .top {
    border-radius: 6px;
    background: @bg-ff;
  }
  .text {
    //height: 136px;
    height: 106px;
    line-height: 136px;
    text-align: center;
    font-size: @font-size-s;
    color: @color-assist;
  }
  .classify {
    //height: 198px;
    height: 140px;
    padding: 0 30px;
    .address {
      height: 60px;
      max-width: 690px;
      text-align: center;
      color: @color-green;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .copy {
      height: 60px;
      text-align: center;
    }
    //display: flex;
    //padding: 0 170px;
    // div {
    //   width: 50%;
    //   text-align: center;
    //   span {
    //     display: inline-block;
    //     width: 100px;
    //     height: 100px;
    //     line-height: 100px;
    //     font-size: 80px;
    //     color: @bg-ff;
    //     background: @bg-wechat;
    //     border-radius: 50%;
    //     margin-bottom: 19px;
    //   }
    //   .qq {
    //     background: @bg-qq;
    //   }
    //   p {
    //     font-size: @font-size-xs;
    //     color: @color-assist;
    //     line-height: 0;
    //   }
    // }
  }
  .btn {
    height: 100px;
    margin-top: 20px;
    line-height: 100px;
    border-radius: 6px;
    background: @bg-ff;
    text-align: center;
    font-size: @font-size-l;
    color: @color-black;
  }
}
</style>
