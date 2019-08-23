<!--  -->
<template>
 <div class="main">
  <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
  <div class="border"></div>
  <c-scroll class="content" :data="staffList" :total="total" :listenScroll="true" @scrollToEnd="getStaffList">
    <member-list :satrap="satrap" :staffList="staffList" @memberList="satrapIds"></member-list>
  </c-scroll>
  <div class="confirm" @click="confirm">确定</div>
 </div>
</template>

<script>
import topbar from "@/components/topbar";
import memberList from "@/components/memberLIst";
import { MIXINS } from "@/assets/JS/mixins";
import { mapMutations, mapState } from 'vuex'

export default {
  mixins: [MIXINS],
  components: {
    topbar,
    memberList
  },
  data() {
    return {
      title: "请选择成员",
      getBack: true,
      satrap: true,
      staffList:[],
      satraps:[],
      satrapids:[],
      isSelect:false,
      currentPage:1,
      total:0
    };
  },
  methods: {
    confirm(){
      if(this.isSelect){
        if(this.satrapids.length){
          this.setZhuGuanList(this.satraps)
          this.setSatrapIDs(this.satrapids)
          this.$router.go(-1)
        }else{
          this.$vux.toast.text("请选择成员", "middle");
        }
      }else{
        if(this.satrapIDs.length){
          this.$router.go(-1)
        }else{
          this.$vux.toast.text("请选择成员", "middle");
        }
      }
      
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
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    satrapIds(data){
      this.satraps = data.zg
      this.satrapids=data.ids
      this.isSelect=true
      //localStorage.setItem("zhuguanList", JSON.stringify(data));//2重写
    },
    ...mapMutations([
      'setZhuGuanList','setSatrapIDs'
    ])
  },
  computed:{
    ...mapState([
      'depId','satrapIDs'
    ])
  },
  created(){
    this.getStaffList()
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main{
  position: relative;
}
.border {
  width: 750px;
  border-top: 1px solid @border-ea;
}
.content{
  position: absolute;
    top: 80px;
    bottom: 100px;
    left: 0;
    right: 0;
    overflow-y: scroll;
}
.confirm {
  width: 750px;
  height: 90px;
  line-height: 90px;
  text-align: center;
  color: @bg-ff;
  font-size: @font-size-l;
  background: @color-green;
  position: absolute;
  bottom: 0;
}
</style>