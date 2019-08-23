<!--  -->
<template>
  <div class="data-list">
    <div class="staff">
      <ul class="list staff-list">
        <li class="iconfont" v-for="item in getList" :key="item.id" @click="goStaffDetail(item)">
          <span class="border"></span>
          <p class="list-item-index" v-if="item.headImg">
            <img :src="item.headImg">
          </p>
          <p class="list-item-index" v-else>{{item.name|getName}}</p>
          <div class="list-item manager">
            <template v-if="getOrganization">
              <p>
                {{item.name}}
                <span v-if="item.isDepMaster">主管</span>
              </p>
              <p v-if="item.title">{{item.title}}</p>
              <span class="check" v-if="item.isChecked==false" @click.stop="goCheck(item)">审核</span>
              <span
                class="edit iconfont icon-edit_client"
                v-if="item.status==1&&item.isChecked!=false&&!$route.query.isSelect"
                @click.stop="goEdit(item)"
              ></span>
            </template>
            <template v-if="getBatch">
              <p>
                {{item.name}}
                <span v-if="item.isDepMaster">主管</span>
              </p>
              <p v-if="item.title">{{item.title}}</p>
              <span
                class="select iconfont"
                :class="{'active':active.indexOf(item.id)!=-1}"
                @click="select(item)"
              ></span>
            </template>
            <template v-if="getHeir">
              <p>
                {{item.name}}
                <span v-if="item.isDepMaster">主管</span>
              </p>
              <p v-if="item.title">{{item.title}}</p>
              <span
                class="select iconfont"
                :class="{'active':activeHeirId===item.id}"
                @click="selectHeir(item)"
              ></span>
            </template>
            <template v-if="getSatrap">
              <p>{{item.name}}</p>
              <p v-if="item.title">{{item.title}}</p>
              <span
                class="select iconfont"
                :class="{'active':ids.indexOf(item.id)!=-1}"
                @click="selectSatrap(item)"
              ></span>
            </template>
            <template v-if="getSearch">
              <p>
                {{item.name}}
                <span v-if="item.isDepMaster">主管</span>
              </p>
              <p v-if="item.title">{{item.title}}</p>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "member-list",
  props: {
    organization: {
      type: Boolean,
      default: false
    },
    batch: {
      type: Boolean,
      default: false
    },
    satrap: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    heir: {
      type: Boolean,
      default: false
    },
    staffList: {
      type: Array,
      default: () => []
    },
    // 记录从哪个页面进来的
    fromPath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      title: "请选择成员",
      getBack: true,
      active: [],
      activeStaff: [],
      ids: [],
      zgl: [],
      // satrapIDs: [],
      // zhuguanList:[],
      getImg: false,
      activeHeirId: ""
    };
  },
  computed: {
    getList() {
      return this.staffList;
    },
    getOrganization() {
      return this.organization;
    },
    getBatch() {
      return this.batch;
    },
    getSatrap() {
      return this.satrap;
    },
    getSearch() {
      return this.search;
    },
    getHeir() {
      return this.heir;
    },
    ...mapState(["zhuguanList", "satrapIDs"])
  },
  methods: {
    select(item) {
      let index = this.active.indexOf(item.id);
      if (index > -1) {
        this.active.splice(index, 1);
        this.activeStaff.splice(index, 1);
      } else {
        this.active.push(item.id);
        this.activeStaff.push(item);
      }
      this.$emit("memberList", this.activeStaff);
    },
    selectHeir(item) {
      if (this.activeHeirId === item.id) {
        this.activeHeirId = "";
      } else {
        this.activeHeirId = item.id;
      }
      this.$emit("heirId", this.activeHeirId);
    },
    selectSatrap(item) {
      // debugger
      // for (let i = 0; i < this.satrapIDs.length; i++) {
      //   this.ids.push(this.satrapIDs[i]);
      // }
      let index = this.ids.indexOf(item.id);

      //let zgl = [];
      // for (let i = 0; i < this.zhuguanList.length - 1; i++) {
      //   zgl.push(this.zhuguanList[i]);
      // }
      //let zgl = this.zhuguanList
      if (index > -1) {
        this.ids.splice(index, 1);
        this.zgl.splice(index, 1);
      } else {
        this.ids.push(item.id);
        this.zgl.push(item);
      }
      this.$emit("memberList", { zg: this.zgl, ids: this.ids });
    },
    goCheck(item) {
      this.$ajax
        .put("/api/employee/check/can")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            let param = {
              id: item.id
            };
            this.$ajax.get("/api/employee", param).then(res => {
              res = res.data;
              if (res.status === 200) {
                this.$router.push({
                  path: "/staffList",
                  query: {
                    type: "check",
                    id: item.id
                  }
                });
              } else {
                this.$vux.toast.text("您没有审核该员工的权限", "middle");
              }
            });
          } else {
            this.$vux.toast.text("权限不足", "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text("权限不足", "middle");
        });
    },
    goEdit(item) {
      this.$ajax
        .put("/api/employee/can")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.$router.push({
              path: "/staffList",
              query: {
                type: "edit",
                id: item.id,
                companyId: item.companyId
              }
            });
          } else {
            this.$vux.toast.text("权限不足", "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text("权限不足", "middle");
        });
    },
    ...mapMutations(["changeStoreShowpopup"]),
    goStaffDetail(item) {
      this.changeStoreShowpopup(3);
      // 根据员工筛选操作
      if (this.$route.query.isSelect) {
        sessionStorage.isSelected = 1;
        this.$router.push({
          path: this.fromPath,
          query: {
            name: item.name,
            id: item.id
          }
        });
        return;
      }
      if (this.organization || this.search) {
        this.$router.push({
          path: "/staffDetail",
          query: {
            msg: item
          }
        });
      }
    }
  },
  created() {
    // if(this.satrap){
    //   this.satrapIDs = this.satrapIDs;
    //   this.zhuguanList = this.zhuguanList;
    // }
    for (let i = 0; i < this.satrapIDs.length; i++) {
      this.ids.push(this.satrapIDs[i]);
    }

    for (let i = 0; i < this.zhuguanList.length; i++) {
      this.zgl.push(this.zhuguanList[i]);
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
.data-list {
  .staff {
    .list {
      padding: 0 30px;
      background-color: @bg-ff;
      > li {
        .border {
          display: block;
          width: 583px;
          height: 1px;
          box-sizing: border-box;
          border-top: 1px solid @border-ea;
          position: absolute;
          bottom: -1px;
          right: 0;
        }
        padding: 17px 0;
        position: relative;
        // &:last-of-type {
        //   .border {
        //     border: none;
        //   }
        // }
      }
    }
    &-list {
      > li:nth-of-type(n + 1) {
        display: flex;
        .list-item {
          flex: 1;
          display: inherit;
          position: relative;
          .select {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            color: @border-e0;
            width: 32px;
            height: 32px;
            font-size: @font-size-icon;
            &:before {
              content: "\e62e";
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          .active {
            color: @color-green;
          }
          .check {
            display: inline-block;
            width: 92px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            border-radius: 6px;
            color: @bg-ff;
            background: @color-green;
            font-size: @font-size-sm;
            position: absolute;
            right: 0;
            top: 15px;
          }
          .edit {
            display: inline-block;
            line-height: 48px;
            text-align: center;
            border-radius: 6px;
            color: @color-main;
            font-size: @font-size-icon;
            position: absolute;
            right: 0;
            top: 15px;
          }
          > p {
            &:first-of-type {
              align-self: center;
              font-size: 4vw;
              > span {
                border: 1px solid @color-grey;
                display: inline-block;
                color: @color-grey;
                margin-left: 10px;
                padding: 0 5px;
                border-radius: 6px;
                font-size: @font-size-xs;
                margin-top: 1vw;
              }
            }
          }
          &.manager {
            display: flex;
            flex-direction: column;
            > p {
              &:first-of-type {
                align-self: initial;
              }
              &:nth-of-type(2) {
                color: @color-assist;
                font-size: @font-size-s;
              }
            }
          }
          &-index {
            width: 74px;
            height: 74px;
            background-color: @bg-4a;
            color: @color-white;
            border-radius: 50%;
            display: inherit;
            justify-content: center;
            align-items: center;
            font-size: @font-size-xs;
            margin-right: 25px;
            > img {
              width: 74px;
              height: 74px;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
}
</style>