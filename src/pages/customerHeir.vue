<template>
  <div class="container">
    <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    <div class="main">
      <div class="hint">请选择您的客户交接人 :</div>
      <member-list :heir="heir" @heirId="getHeirId" :staffList="staffList"></member-list>
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
  data(){
    return{
      title:'选择客户交接人',
      getBack: true,
      heir:true,
      staffList:[],
      msg:this.$route.query,
      masterId:'',
      ownId: ''
    }
  },
  methods:{
    confirm(){
      if(this.masterId){
        if(this.msg.type==='outCompany'){
          let param = {
            captcha:this.msg.captcha,
            masterId:this.masterId
            }
          this.$ajax.delete('/api/personal/leaving',param).then(res=>{
            res=res.data
            if(res.status!=200){
              this.$vux.toast.text(res.message, 'middle')
            }else{
              localStorage.clear()
              localStorage.setItem('guide',true)
              this.$router.push('/login')
            }
          }).catch(err => {
              this.$vux.toast.text(this.$error[err.response.status], "middle");
            });
        }else if(this.msg.type==='edit'){
          let param = this.msg.param
          param.masterId=this.masterId
          this.$ajax.put("/api/employee", param).then(res => {
            res=res.data
            if(res.status===200){
              this.$vux.toast.text("修改成功", "middle");
              localStorage.removeItem("staffMsg");
              localStorage.removeItem("activeRight");
              localStorage.removeItem("allRightList");
              setTimeout(() => {
                if(this.msg.id == this.ownId) {
                  this.$router.push("/login");
                }else {
                  this.$router.push("/organization");
                }
              }, 2000);
            }else{
              this.$vux.toast.text(res.message, "middle");
            }
          }).catch(err => {
              this.$vux.toast.text(this.$error[err.response.status], "middle");
            });
        }
      }else{
        this.$vux.toast.text("请选择客户交接人", "middle");
      }
    },
    getHeirId(msg){
      this.masterId=msg
      console.log(this.masterId)
    },
    getMasterList(){
      let param = {
        id:this.msg.id
      }
      this.$ajax.get("/api/employee/find/master",param,'pt').then(res=>{
        res=res.data
        if(res.status===200){
          this.staffList=res.data
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    }
  },
  created(){
    //console.log(this.$route.query)
    this.ownId = JSON.parse(localStorage.getItem('userMessage')).id
    // console.log(this.ownId,777);
    this.getMasterList()
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.container {
  position: relative;
  .main{
    overflow-y: scroll;
    padding-bottom: 100px;
    .hint{
      padding: 10px 30px 10px 30px;
      font-size: @font-size-m;
      color: @color-minor;
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