<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="topbar-right edit" @click="finish1">完成</span>
    </topbar>
    <div class="fill">
      <div>
        <span class="left">部门名称</span><input type="text" :value="departmentMsg.name" maxlength="20" @blur="setName" ref="name">
      </div>
        <div class="iconfont satrap" @click="goSatrap">
          <span class="left bmzg">部门主管</span>
          <p>
            <span class="right" v-if="zhuguanList.length!=0" v-for="(item,index) in zhuguanList" :key="index">{{item.name}}
              <span v-if="zhuguanList.length>1 && index!=zhuguanList.length-1">、</span>
            </span>
          </p>
        </div>
        <div class="iconfont" @click="superior">
          <span class="left">上级部门</span>
          <span class="right">{{parentName}}</span>
        </div>
      </div>
      <div class="del" @click="del">
        删除部门
      </div>
      <Confirm v-model='value' content='请确认是否删除' @on-confirm="confirm"></Confirm>
    </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import { mapMutations, mapState } from "vuex";
import { debug } from "util";
import { Confirm } from "vux";
// let id;
// let parentName = "";
// let arr1 = [];
// var digui = function(arr, id) {
//   for (let j = 0; j < arr.length; j++) {
//     if (arr[j].id == id) {
//       parentName = arr[j].name;
//     } else {
//       arr1 = arr[j].child;
//       digui(arr1, id);
//     }
//   }
//   return parentName;
// };
export default {
  mixins: [MIXINS],
  components: {
    topbar,
    Confirm
  },
  data() {
    return {
      title: "部门设置",
      getBack: true,
      value: false,
      isName: true
    };
  },
  methods: {
    goSatrap() {
      this.setOnce(false);
      this.$router.push({
        path: "/selectSatrap",
        query: {
          depId: this.depId
        }
      });
    },
    setName() {
      this.isName = false;
      let name = this.$refs.name.value.replace(/\s/g, "");
      if (name) {
        this.isName = true;
        let msg = this.departmentMsg;
        //localStorage.setItem("departmentMsg", JSON.stringify(this.list));
        msg.name = name;
        this.setDepartmentMsg(msg);
      } else {
        this.$vux.toast.text("部门名称不能为空", "middle");
        return;
      }
    },
    del() {
      this.value = true;
    },
    confirm() {
      let param = {
        id: this.depId
      };
      this.$ajax.delete("/api/department", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.$vux.toast.text("删除成功", "middle");
          setTimeout(() => {
            this.$router.push("/organization");
          }, 2000);
        } else {
          this.$vux.toast.text(res.message, "middle");
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    finish1() {
      if (this.isName) {
        let departmentMsg = this.departmentMsg;
        departmentMsg.masterIds = this.satrapIDs;
        
        if(departmentMsg.masterIds.length!==0){
          this.$ajax
          .put("/api/department/withMaster", departmentMsg)
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.$vux.toast.text("设置成功", "middle");
              setTimeout(() => {
                this.$router.push("/organization");
              }, 2000);
            } else {
              this.$vux.toast.text(res.message, "middle");
            }
          }).catch(err => {
              this.$vux.toast.text(this.$error[err.response.status], "middle");
            });
        }else{
          this.$vux.toast.text("请设置部门主管", "middle");
        }
        
      } else {
        this.$vux.toast.text("部门名称不能为空", "middle");
      }
    },
    superior() {
      this.setOnce(false);
      this.$router.push({
        path: "/moveDepart",
        query: {
          type: "sectorSet"
        }
      });
    },
    //获取部门信息
    getDepartment(param) {
      this.$ajax.get("/api/department", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let list = Object.assign({}, this.list, res.data);
          let satrapIDs = list.depMasterIds;
          let parentName = res.data.pname
          //localStorage.setItem("satrapIDs", JSON.stringify(this.satrapIDs));
          //localStorage.setItem("departmentMsg", JSON.stringify(this.list));
          if (this.once) {
            this.setDepartmentMsg(list);
            this.setSatrapIDs(satrapIDs);
            this.setParentName(parentName);
          }
          return true;
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    //获取员工列表
    getStaffList() {
      let param = {
        depId: this.depId,
        pageNum: 1,
        pageSize: 100,
        status:1
      };
      this.$ajax.get("/api/employee/list", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let list = res.data.list;
          let zhuguanList = [];
          list.forEach(element => {
            if (element.isDepMaster) {
              //this.satrapNames.push(element.name);
              zhuguanList.push(element);
            }
          });
          //localStorage.setItem("satrapNames", JSON.stringify(this.satrapNames));
          //localStorage.setItem("zhuguanList", JSON.stringify(this.zhuguanList));//1
          if (this.once) {
            this.setZhuGuanList(zhuguanList);
          }
          return true;
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    //获取部门列表
    // getRootList() {
    //   let param = {
    //     isRoot: false
    //   };
    //   this.$ajax.get("/api/department/list", param).then(res => {
    //     res = res.data;
    //     if (res.status === 200) {
    //       let arr = res.data.child;
    //       let parentName = digui(arr, this.pid);
    //       if (parentName) {
    //         parentName = parentName;
    //       } else if (this.departmentMsg.name == res.data.name) {
    //         parentName = this.departmentMsg.pname;
    //       } else {
    //         parentName = res.data.name;
    //       }
    //       //localStorage.setItem("parentName", JSON.stringify(this.parentName));
    //       if (this.once) {
    //         this.setParentName(parentName);
    //         // let _once = false
    //         // this.setOnce(_once)
    //       }
    //       return true;
    //     }
    //   }).catch(err => {
    //       this.$vux.toast.text(this.$error[err.response.status], "middle");
    //     });
    // },
    ...mapMutations([
      "setParentName",
      "setZhuGuanList",
      "setDepartmentMsg",
      "setDepId",
      "setSatrapIDs",
      "setOnce"
    ])
  },
  computed: {
    ...mapState([
      "parentName",
      "departmentMsg",
      "zhuguanList",
      "satrapIDs",
      "depId",
      "once"
    ])
  },
  created() {
    this.setDepId(this.$route.query.depId);
    let param = {
      id: this.depId
    };
    this.getDepartment(param);
    this.getStaffList();
    // this.getRootList();
    // this.depId=this.$route.query.depId
    // //this.satrapNames = JSON.parse(localStorage.getItem("satrapNames"));
    // this.satrapIDs = JSON.parse(localStorage.getItem("satrapIDs"));
    // this.list = JSON.parse(localStorage.getItem("departmentMsg"));
    // //this.parentName = JSON.parse(localStorage.getItem("parentName"));
    // this.parentId = JSON.parse(localStorage.getItem("parentId"));
    // this.zhuguanList = JSON.parse(localStorage.getItem("zhuguanList"));
    // let data = this.$route.query.satraps;
    // if (data) {
    //   let idsmaster = []
    //   let masterNames = []
    //   data.forEach(element => {
    //       idsmaster.push(element.id)
    //       masterNames.push(element.name)
    //   });
    //   this.satrapIDs = idsmaster
    //   this.satrapNames = masterNames
    //   localStorage.setItem("satrapNames", JSON.stringify(this.satrapNames));
    //   localStorage.setItem("satrapIDs", JSON.stringify(this.satrapIDs));
    // }
    // }else if(this.$route.query.type === "moveDep"){
    //   this.satrapNames = JSON.parse(localStorage.getItem("satrapNames"));
    //   this.list = JSON.parse(localStorage.getItem("departmentMsg"));
    //   if(this.$route.query.msg){
    //     this.parentName = this.$route.query.msg.depName
    //     this.parentId = this.$route.query.msg.id
    //     localStorage.setItem("parentName", JSON.stringify(this.parentName));
    //     localStorage.setItem("parentId", JSON.stringify(this.parentId));
    //   }
    // }else{
    //   debugger
    //   let zg = localStorage.getItem("zhuguanList")
    //   if(zg){
    //   this.zhuguanList=JSON.parse(zg)
    // }
   }
  // destroyed(){
  //   this.setZhuGuanList([])
  //   this.setSatrapIDs([])
  // }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main {
  .fill {
    padding: 0 30px;
    border-top: 1px solid @border-eb;
    background: @bg-ff;
    > div {
      display: flex;
      padding: 30px 0;
      border-bottom: 1px solid @border-eb;
      & + div {
        position: relative;
        padding-right: 50px;
        &:before {
          content: "\e625";
          position: absolute;
          color: @color-minor;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          font-size: @font-size-icon;
        }
      }
      &:last-of-type {
        border-bottom: none;
      }
      input {
        outline: none;
        border: none;
        width: 500px;
        color: @color-main;
        font-size: @font-size-m;
        margin: 0;
        padding: 0;
      }
      .left {
        width: 172px;
        display: inline-block;
        color: @color-minor;
        font-size: @font-size-m;
      }
      .right {
        font-size: @font-size-m;
        color: @color-main;
      }
    }
    .satrap {
      p{
        width: 470px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .del {
    height: 100px;
    text-align: center;
    width: 750px;
    line-height: 100px;
    font-size: @font-size-xl;
    color: @color-green;
    position: absolute;
    bottom: 0;
    background-color: @bg-ff;
  }
}
</style>