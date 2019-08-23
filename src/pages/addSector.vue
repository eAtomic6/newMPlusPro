<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="topbar-right edit" @click="finish1">完成</span>
    </topbar>
    <div class="fill">
      <div>
        <span class="left">部门名称</span><input type="text" :value="newDepName" maxlength="20" placeholder="必填" @blur="verifyDepName" ref="depName">
      </div>
      <div class="iconfont" @click="superior">
        <span class="left">上级部门</span>
        <span class="right">{{parentName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";

export default {
  mixins: [MIXINS],
  components: {
    topbar
  },
  data() {
    return {
      title: "添加子部门",
      getBack: true,
      finish: true,
      parentName: "",
      parentID: "",
      newDepName: "",
      setPost: true
    };
  },
  methods: {
    finish1() {
      let param = {
        isCompany: false
      };
      if (this.newDepName) {
        param.name = this.newDepName;
      } else {
        this.$vux.toast.text("部门名称不能为空", "middle");
        return;
      }
      param.pid = this.parentID;
      console.log(param);
      if (this.setPost) {
        this.setPost = false;
        this.$ajax.post("/api/department", param).then(res => {
            this.setPost = true;
            res = res.data;
            if (res.status === 200) {
              this.$vux.toast.text("添加成功", "middle");
              setTimeout(() => {
                this.$router.push("/organization");
              }, 2000);
            }else{
              this.$vux.toast.text(res.message, "middle");
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      } else {
        this.$vux.toast.text("请求已发送，请稍后重试", "middle");
      }

      //this.$router.push("/organization");
    },
    superior() {
      if (this.newDepName) {
        localStorage.setItem("newDepName", JSON.stringify(this.newDepName));
      }
      this.$router.push({
        path: "/moveDepart",
        query: {
          type: "addSector"
        }
      });
    },
    //部门名称不能为空
    verifyDepName() {
      let depName = this.$refs.depName.value.replace(/\s/g, "");
      if (depName) {
        this.newDepName = depName;
      } else {
        this.$vux.toast.text("部门名称不能为空", "middle");
      }
    }
  },
  created() {
    if (this.$route.query.type === "org") {
      let mineMsg = JSON.parse(localStorage.getItem("userMessage"));
      this.parentName = mineMsg.depName;
      this.parentID = mineMsg.depId;
      localStorage.setItem("parentName", JSON.stringify(this.parentName));
      localStorage.setItem("parentID", JSON.stringify(this.parentID));
    } else if (this.$route.query.type === "moveDep") {
      let data = this.$route.query.msg;
      let newDepName = JSON.parse(localStorage.getItem("newDepName"));
      if (data) {
        this.parentID = data.id;
        this.parentName = data.depName;
      } else {
        this.parentName = JSON.parse(localStorage.getItem("parentName"));
        this.parentID = JSON.parse(localStorage.getItem("parentID"));
      }
      if (newDepName) {
        this.newDepName = newDepName;
      }
    }
  }
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
      align-items: center;
      padding: 30px 0;
      border-bottom: 1px solid @border-eb;
      & + div {
        position: relative;
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
        /*height: 30px;*/
        flex: 1;
        color: @color-main;
        font-size: @font-size-m;
        &::-webkit-input-placeholder {
          font-size: @font-size-m;
        }
        margin: 0;
        padding: 0;
      }
      .left {
        width: 172px;
        color: @color-minor;
        font-size: @font-size-m;
      }
      .right {
        font-size: @font-size-m;
        color: @color-main;
        flex: 1;
      }
    }
  }
}
</style>
