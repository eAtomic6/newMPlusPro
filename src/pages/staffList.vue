<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack">
      <span slot="topbar-right" class="topbar-right edit" v-if="finish" @click="finish1">完成</span>
    </topbar>
    <div class="content" :class="{bottom_0:type==='edit'}">
      <div class="data-list">
        <div class="top">
          <ul>
            <li>
              <span class="required iconfont">姓名</span><input type="text" v-model="list.name" maxlength="12" placeholder="请输入真实姓名" @blur="verifyName" ref="name">
            </li>
            <li>
              <span>性别</span>
              <span class="radio iconfont" @click="active(1)" :class="{active:sex===1}">男</span>
              <span class="radio iconfont" @click="active(2)" :class="{active:sex===2}">女</span>
            </li>
            <li>
              <span class="required iconfont">身份证号</span><input type="text" v-model="list.idcard" maxlength="18" placeholder="请输入身份证号" @blur="verifyIdcard" ref="idcard">
            </li>
            <li @click="showTime('birthday')" class="select iconfont">
              <span>出生日期</span>
              <span class="placehold">{{list.birthday?list.birthday:'设置出生日期'}}</span>
              <!-- <input type="text" disabled v-model="birthday" placeholder="设置出生日期"> -->
            </li>
            <li>
              <span class="required iconfont">手机号</span><input type="tel" maxlength="11" v-model="list.mobile" @input="codeShow" @blur="verifyMobile" ref="mobile">
            </li>
            <li class="code" v-if="type==='add'||isShow==true">
              <span class="required iconfont">验证码</span><input type="tel" maxlength="4" v-model="list.captcha" placeholder="请输入验证码" @blur="verifyCode" ref="code">
              <span v-show="sendAuthCode" class="auth_text" @click="getAuthCode">获取验证码</span>
              <span v-show="!sendAuthCode" class="auth_text forbid">重新获取({{auth_time}}s)</span>
            </li>
          </ul>
        </div>
        <div class="mind">
          <ul>
            <li>
              <span class="required iconfont">状态</span>
              <span class="radio iconfont" @click="active1(1)" :class="{active:status===1}">正式</span>
              <span class="radio iconfont" @click="active1(2)" :class="{active:status===2}">注销</span>
            </li>
            <li class="select iconfont" @click="selectDepart">
              <span class="required iconfont">所属部门</span><span class="departName">{{list.depName}}</span>
            </li>
          </ul>
          <div class="right">
            <span class="s_left iconfont">权限</span>
            <div class="rightList">
              <span v-for='item in allRightList' :key="item.roleId" :class="[ownRight.indexOf(item.roleId)>-1?'owner':'',activeRight.indexOf(item.roleId)>-1?'right_active':'']" @click="selectRight(item.roleId)">{{item.roleName}}</span>
            </div>
          </div>
        </div>
        <div class="bottom">
          <ul>
            <li class="select iconfont" @click="showTime">
              <span class="required iconfont">入职日期</span>
              <span class="placehold">{{list.joinTime?list.joinTime:'设置入职日期'}}</span>
            </li>
            <li class="select iconfont" @click="showPop" v-if="companyType===3">
              <span class="required iconfont">管辖门店</span>
              <p class="shop">
                <span v-for="(item,index) in activeShop" :key="index">{{item.DeptName}}
                  <i v-if="index!=activeShop.length-1">、</i>
                </span>
              </p>
            </li>
            <li>
              <span>职务</span><input type="text" v-model="list.title" placeholder="设置用户职务">
            </li>
          </ul>
        </div>
        <popup v-model="pop">
          <topbar :title="popTitle">
            <span slot="topbar-left" class="topbar-left cancel" @click="initPicker">取消</span>
            <span slot="topbar-right" class="topbar-right msg" @click="enter">确定</span>
          </topbar>
          <div class="picker">
            <div class="picker-location">
              <label>已选</label>
              <span class="iconfont icon-delete allDel" @click="allDel"></span>
              <div class="shopList">
                <span class="shopName" v-for="item in activeShop" :key="item.DepartOnlyCode">{{item.DeptName}}
                  <i class="iconfont icon-remove" @click="delOne(item)"></i>
                </span>
              </div>
            </div>
            <div class="picker-city">
              <p class="picker-city-chose">
                <span v-if="areaName.length!=0" v-for="(item,index) in areaName" :key="index" @click="tab(index)">{{item.DeptName}}</span>
                <span class="active">请选择</span>
              </p>
              <ul class="city-list">
                <li v-for="item in getSQ" :key="item.id" @click="choseCity(item)" :class="{dis:banArea.indexOf(item.DepartOnlyCode) != -1}">
                  <span class="mask" v-if="item.SubDepart.length===0 && banArea.indexOf(item.DepartOnlyCode) != -1"></span>
                  <span class="iconfont icon-mult_select" v-if="item.SubDepart.length===0" :class="{selected:activeShopId.indexOf(item.DepartOnlyCode.toString())>-1}"></span>
                  {{item.DeptName}}
                </li>
              </ul>
            </div>
          </div>
        </popup>
      </div>
    </div>
    <div class="footer" v-if="type==='check'">
      <div class="noPass" @click="isPass(false)">不通过</div>
      <div class="pass" @click="isPass(true)">审核通过</div>
    </div>
    <div class="confirm" @click="done" v-if="type==='add'">完成</div>
    <Confirm title="提示" v-model='isConfirm' :content='tipWord'></Confirm>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS, TIME } from "@/assets/JS/mixins";
import { Popup, Confirm} from "vux";
import { setTimeout } from "timers";

// '"DepartOnlyCode":'+id+'\\.0,"DeptName":"(.*)"'
var digui = function(arr,id){
  for(let i=0;i<arr.length-1;i++){
    
  }
  
}

export default {
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    Popup,Confirm
  },
  data() {
    return {
      isConfirm: false,
      tipWord: '',
      type: this.$route.query.type,
      title: "员工审核",
      getBack: true,
      finish: false,
      sex: 1,
      status: 1,
      sendAuthCode: true,
      auth_time: 0,
      pop: false,
      popTitle: "管辖门店",
      cancelLeft: true,
      confirm: true,
      map: [],
      activeShop: [],
      activeShopId: [],
      activeShop_:[],
      list: {
        title: "无",
        isDepMaster: false,
        sex: 1,
        status: 1,
        birthday: ""
      },
      dataTime: {},
      //编辑人权限列表
      rightList: [],
      //编辑人权限id
      ownRight: [],
      //被编辑人权限列表
      ownRightList: [],
      //被编辑人权限id
      activeRight: [],
      //两人权限和
      allRightList: [],
      locationRecord: [],
      isShow: false,
      activeSQ: {},
      areaName: [],
      areaList: {},
      companyType: "",
      birthday: "",
      joinTime: "",
      captcha: "",
      setPost: true,
      banArea: '' // 禁选门店id数组
    };
  },
  created() {
    let mineMsg = JSON.parse(localStorage.getItem("userMessage"));
    this.rightList = mineMsg.roleList;

   // 编辑人的权限
    for (let i = 0; i < this.rightList.length; i++) {
      this.ownRight.push(this.rightList[i].roleId);
    }
    let param={
      companyId:this.$route.query.companyId
    }
    // 改版后的权限
    this.$ajax.get("/api/func/my", param).then(res => {
        this.allRightList = res.data.data;
    })
    if (this.type === "add") {
      this.title = "请完善用户信息";
      if (JSON.parse(localStorage.getItem("staffMsg"))) {
        this.list = JSON.parse(localStorage.getItem("staffMsg"));
        this.birthday = this.list.birthday;
        this.joinTime = this.list.joinTime;
        this.status = this.list.status;
        this.sex = this.list.sex;
        // this.allRightList = mineMsg.roleList;
        if (JSON.parse(localStorage.getItem("activeRight"))) {
          this.activeRight = JSON.parse(localStorage.getItem("activeRight"));
        }

        //this.captcha = this.list.captcha;
      } else {
        // this.allRightList = mineMsg.roleList;
      }
    } else if (this.type === "edit") {
      this.title = "信息编辑";
      this.finish = true;
      if (JSON.parse(localStorage.getItem("staffMsg"))) {
        this.list = JSON.parse(localStorage.getItem("staffMsg"));
        this.birthday = this.list.birthday;
        this.joinTime = this.list.joinTime;
        this.status = this.list.status;
        this.sex = this.list.sex;
        // this.allRightList = JSON.parse(localStorage.getItem("allRightList"));
        this.activeRight = JSON.parse(localStorage.getItem("activeRight"));
        //this.captcha = this.list.captcha;
      } else {
        let id = this.$route.query.id;
        this.getStaffMsg(id);
        //this.activeRight=this.list.roleIds
        //this.captcha = this.list.captcha;
        // if (this.list.sex != "") {
        //   this.sex = this.list.sex;
        // }
        // if (this.list.status != "") {
        //   this.status = this.list.status;
        // }
      }
    } else if (this.type === "check") {
      if (JSON.parse(localStorage.getItem("staffMsg"))) {
        this.list = JSON.parse(localStorage.getItem("staffMsg"));
        this.birthday = this.list.birthday;
        this.joinTime = this.list.joinTime;
        this.status = this.list.status;
        this.sex = this.list.sex;
        // this.allRightList = JSON.parse(localStorage.getItem("allRightList"));
        this.activeRight = JSON.parse(localStorage.getItem("activeRight"));
      } else {
        let id = this.$route.query.id;
        this.getStaffMsg(id);
      }
    } else {
      this.list = JSON.parse(localStorage.getItem("staffMsg"));
    }

    this.companyType = mineMsg.companyType;
    if (this.companyType === 3) {
      // 获取禁选门店
      let cityId = mineMsg.cityId;
      setTimeout(() => {
        this.getSlectedArea()
        this.getShop(cityId);
      }, 500);
    }
  },
  methods: {
    showTime(value) {
      var value_;
      if (value === "birthday") {
        value_ = this.list.birthday;
      } else {
        value_ = this.list.joinTime;
      }
      this.$vux.datetime.show({
        value: value_,
        format: "YYYY-MM-DD",
        minYear: "1950",
        // maxYear: "2018",
        confirmText: "确定",
        cancelText: "取消",
        onConfirm: val => {
          if (value === "birthday") {
            this.$set(this.list, "birthday", val);
            // this.list.birthday = val;
            //this.birthday = val;
            //this.dataTime.birthday = `${val.split("-")[0]}年${val.split("-")[1]}月${val.split("-")[2]}号`;
          } else {
            //this.list.joinTime = val;
            this.$set(this.list, "joinTime", val);
            //this.joinTime = val;
            //this.dataTime.joinTime = `${val.split("-")[0]}年${val.split("-")[1]}月${val.split("-")[2]}号`;
          }
        }
      });
    },
    // 被编辑人现有的权限
    getStaffMsg(id) {
      let param = {
        id: id
      };
      this.$ajax.get("/api/employee", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if (res.data.birthday) {
            res.data.birthday = res.data.birthday.substr(0, 10);
          }
          res.data.joinTime = !res.data.joinTime
            ? ""
            : res.data.joinTime.substr(0, 10);
          this.list = res.data;
          this.birthday = res.data.birthday;
          this.joinTime = res.data.joinTime;
          this.ownRightList = res.data.roleList;
          for (let i = 0; i < this.ownRightList.length; i++) {
            this.activeRight.push(this.ownRightList[i].roleId);
          }
          localStorage.setItem("activeRight", JSON.stringify(this.activeRight));
          if (this.list.sex != "") {
            this.sex = this.list.sex;
          }
          if (this.list.status != "") {
            this.status = this.list.status;
          }
          let RightList1 = JSON.parse(JSON.stringify(this.rightList));
          let RightList2 = JSON.parse(JSON.stringify(this.ownRightList));
          let allList = RightList1.concat(RightList2);
          var allRightList = [];
          for (var i = 0; i < allList.length; i++) {
            var flag = true;
            for (var j = 0; j < allRightList.length; j++) {
              if (allList[i].roleId == allRightList[j].roleId) {
                flag = false;
              }
            }
            if (flag) {
              allRightList.push(allList[i]);
            }
          }
          // this.allRightList = allRightList;
          localStorage.setItem("allRightList", JSON.stringify(allRightList));
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    active(value) {
      this.sex = value;
    },
    active1(value) {
      this.status = value;
    },
    getAuthCode() {
      let reg = /^1[0-9]{10}$/;
      if (reg.test(this.list.mobile)) {
        let param = {
          mobile: this.list.mobile,
          type: 1,
          useVoice: false
        };
        this.$ajax.get("/api/captcha", param).then(res => {
          res = res.data;
          if(res.status!==200){
            this.$vux.toast.text(res.message, "middle");
          }
        }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
        this.sendAuthCode = false;
        this.auth_time = 60;
        var auth_timetimer = setInterval(() => {
          this.auth_time--;
          if (this.auth_time <= 0) {
            this.sendAuthCode = true;
            clearInterval(auth_timetimer);
          }
        }, 1000);
      } else {
        this.$vux.toast.text("请输入正确手机号", "middle");
      }
    },
    selectDepart() {
      this.list.sex = this.sex;
      this.list.status = this.status;
      localStorage.setItem("staffMsg", JSON.stringify(this.list));
      this.$router.push({
        path: "/moveDepart",
        query: {
          type: this.type
        }
      });
    },
    getShop(cityId) {
      let param = {
        cityID: cityId
      };
      this.$ajax.get("/api/resource/uplusDepart", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          if (this.list.majorArea) {
            var majorAreaList = this.list.majorArea.split(",")
            for(var i=0;i<majorAreaList.length-1;i++){
              if(majorAreaList[i]){
                var id = majorAreaList[i]
                var myRe = new RegExp('"DepartOnlyCode":'+id+'\\.0,"DeptName":"(.*?)"')
                var myArray = myRe.exec(res.data);
                let item = {DepartOnlyCode:id,DeptName:myArray[1]}
                this.activeShop.push(item)
                this.activeShop_.push(item)
                this.activeShopId.push(item.DepartOnlyCode)
              }
           }
          }
          this.$set(this.activeSQ, "SubDepart", JSON.parse(res.data));
          this.areaList = this.activeSQ;
        }
      }).catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    showPop() {
      this.pop = true;
    },
    initPicker: function() {
      this.pop = false;
      this.cityList = this.areaList;
      this.activeShop = this.activeShop_;
    },
    enter() {
      this.pop = false;
      let majorArea = [];
      this.activeShop.forEach(item => {
        majorArea.push(item.DepartOnlyCode);
      });
      majorArea = majorArea.join(",");
      this.list.majorArea = majorArea;
    },
    choseCity: function(item) {
      if (this.banArea.indexOf(item.DepartOnlyCode) != -1) {
        return
      }
      if (item.SubDepart.length === 0) {
        let index = this.activeShopId.indexOf(item.DepartOnlyCode.toString());
        if (index == -1) {
          //delete item.SubDepart
          this.activeShopId.push(item.DepartOnlyCode.toString())
          this.activeShop.push(item);
        } else {
          this.activeShopId.splice(index,1)
          this.activeShop.splice(index, 1);
        }
      } else {
        this.areaName.push(item);
        this.activeSQ = Object.assign({}, this.activeSQ, item);
      }
    },
    delOne(item) {
      let index = this.activeShopId.indexOf(item.DepartOnlyCode.toString());
      if (index != -1) {
        this.activeShop.splice(index, 1);
        this.activeShopId.splice(index,1)
      }
    },
    allDel() {
      this.activeShop = [];
      this.activeShopId = []
    },
    //验证必填消息是否为空
    allNeed() {
      if (this.companyType === 3) {
        if (this.type === "add") {
          if (
            this.list.name &&
            this.list.idcard &&
            this.list.mobile &&
            this.list.captcha &&
            this.list.status &&
            this.list.depId &&
            this.list.roleBits &&
            this.list.joinTime &&
            this.list.majorArea
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          if (this.isShow) {
            if (
              this.list.name &&
              this.list.idcard &&
              this.list.mobile &&
              this.list.captcha &&
              this.list.status &&
              this.list.depId &&
              this.list.roleBits &&
              this.list.joinTime &&
              this.list.majorArea
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            if (
              this.list.name &&
              this.list.idcard &&
              this.list.mobile &&
              this.list.status &&
              this.list.depId &&
              this.list.roleBits &&
              this.list.joinTime &&
              this.list.majorArea
            ) {
              return true;
            } else {
              return false;
            }
          }
        }
      } else {
        if (this.type === "add") {
          if (
            this.list.name &&
            this.list.idcard &&
            this.list.mobile &&
            this.list.captcha &&
            this.list.status &&
            this.list.depId &&
            this.list.roleBits &&
            this.list.joinTime
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          if (this.isShow) {
            if (
              this.list.name &&
              this.list.idcard &&
              this.list.mobile &&
              this.list.captcha &&
              this.list.status &&
              this.list.depId &&
              this.list.roleBits &&
              this.list.joinTime
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            if (
              this.list.name &&
              this.list.idcard &&
              this.list.mobile &&
              this.list.status &&
              this.list.depId &&
              this.list.roleBits &&
              this.list.joinTime
            ) {
              return true;
            } else {
              return false;
            }
          }
        }
      }
    },
    //添加员工
    done() {
      if (this.allNeed()) {
        let param = this.list;
        param.status = this.status;
        param.sex = this.sex;
        delete param.depName;

        if (this.verifyName()) {
          if (this.verifyIdcard()) {
            if (this.verifyMobile()) {
              if (this.setPost) {
                this.setPost = false;
                this.$ajax.post("/api/employee", param).then(res => {
                  this.setPost = true;
                  res = res.data;
                  if (res.status === 200) {
                    this.$vux.toast.text("添加成功", "middle");
                    localStorage.removeItem("staffMsg");
                    localStorage.removeItem("activeRight");
                    localStorage.removeItem("allRightList");
                    setTimeout(() => {
                      this.$router.push("/organization");
                    }, 2000);
                  } else {
                    this.$vux.toast.text(res.message, "middle");
                  }
                }).catch(err => {
                    this.$vux.toast.text(this.$error[err.response.status], "middle");
                  });
              } else {
                this.$vux.toast.text("请求已发送，请稍后重试", "middle");
              }
            }
          } else {
            this.$vux.toast.text("请输入正确身份证号", "middle");
          }
        } else {
          this.$vux.toast.text("请输入正确姓名", "middle");
        }
      } else {
        this.$vux.toast.text("请完善信息", "middle");
      }
    },
    //编辑员工
    finish1() {
      if (this.allNeed()) {
        let param = this.list;
        param.status = this.status;
        param.sex = this.sex;
        if (!param.birthday) {
          param.birthday = "";
        }
        delete param.roleIds;
        delete param.roleList;
        delete param.roleStr;
        if (this.status === 2) {
          param.leaveTime = TIME(new Date());
        } else {
          delete param.leaveTime;
        }
        if (this.verifyName()) {
          if (this.verifyIdcard()) {
            if (this.verifyMobile()) {
              if(param.status===2){
                let id = this.$route.query.id;
                this.$ajax.get("/api/employee/custCount",{id:id}).then(res => {
                  if (res.data.status == 200) {
                    localStorage.setItem("staffMsg", JSON.stringify(param));
                    this.$router.push({
                      path: "/customerHeir",
                      query: {
                        type: 'edit',
                        param:param,
                        id:param.id
                      }
                    });
                  }else if (res.data.status == 400) {
                    this.isConfirm = true;
                    this.tipWord = res.data.message;
                  }
                }).catch(err => {
                  this.$vux.toast.text(this.$error[err.response.status], "middle");
                }) 
              }else if(param.status===1){
                if (this.setPost) {
                this.setPost = false;
                this.$ajax.put("/api/employee", param).then(res => {
                  this.setPost = true;
                  res = res.data;
                  if (res.status === 200) {
                    this.$vux.toast.text("修改成功", "middle");
                    localStorage.removeItem("staffMsg");
                    localStorage.removeItem("activeRight");
                    localStorage.removeItem("allRightList");
                    setTimeout(() => {
                      this.$router.push("/organization");
                    }, 2000);
                  } else {
                    this.$vux.toast.text(res.message, "middle");
                  }
                }).catch(err => {
                    this.$vux.toast.text(this.$error[err.response.status], "middle");
                  });
              } else {
                this.$vux.toast.text("请求已发送，请稍后重试", "middle");
              }
              }
            }
          } else {
            this.$vux.toast.text("请输入正确身份证号", "middle");
          }
        } else {
          this.$vux.toast.text("请输入正确姓名", "middle");
        }
      } else {
        this.$vux.toast.text("请完善信息", "middle");
      }
    },
    //审核
    isPass(value) {
      if (this.allNeed()) {
        let param = this.list;
        param.status = this.status;
        param.sex = this.sex;
        param.pass = value;
        if (this.verifyName()) {
          if (this.verifyIdcard()) {
            if (this.verifyMobile()) {
              if (this.setPost) {
                this.setPost=false
                this.$ajax.put("/api/employee/check", param).then(res => {
                  this.setPost=true
                  res = res.data;
                  if (res.status === 200) {
                    this.$vux.toast.text("审核成功", "middle");
                    localStorage.removeItem("staffMsg");
                    localStorage.removeItem("activeRight");
                    localStorage.removeItem("allRightList");
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
                this.$vux.toast.text("请求已发送，请稍后重试", "middle");
              }
            }
          } else {
            this.$vux.toast.text("请输入正确身份证号", "middle");
          }
        } else {
          this.$vux.toast.text("请输入正确姓名", "middle");
        }
      } else {
        this.$vux.toast.text("请完善信息", "middle");
      }
    },
    // 点击权限的时候
    selectRight(rightId) {
      let index = this.activeRight.indexOf(rightId);//被编辑人权限
      let index1 = this.ownRight.indexOf(rightId);//编辑人的权限
      // if (index == -1 && index1 != -1) {
        if (index == -1 ) {
         // 给被编辑人增加权限
        this.activeRight.push(rightId);
      } else {
         // 给被编辑人删除权限
        this.activeRight.splice(index, 1);
      }
      localStorage.setItem("activeRight", JSON.stringify(this.activeRight));
      var rb = 0;
      this.activeRight.forEach(item => {
        rb += 1 << (item - 1);
      });
      this.list.roleBits = rb;
    },
    codeShow() {
      this.isShow = true;
    },
    tab(index) {
      if (index === 0) {
        this.activeSQ = this.areaList;
        this.areaName.splice(0);
        this.activeShop = [];
        return;
      }
      this.activeSQ = this.areaName[index - 1];
      this.areaName.splice(index);
      this.activeShop = [];
    },
    // 验证用户名
    verifyName() {
      let name = this.$refs.name.value.replace(/\s/g, "");
      if (name) {
        this.list.name = name;
        return true;
      } else {
        this.$vux.toast.text("请输入正确姓名", "middle");
        return false;
      }
    },
    //验证身份证
    verifyIdcard() {
      let idcard = this.$refs.idcard.value;
      let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
      if (reg.test(idcard)) {
        this.list.idcard = idcard;
        return true;
      } else {
        this.$vux.toast.text("请输入正确身份证号码", "middle");
        return false;
      }
    },
    //手机号验证
    verifyMobile() {
      let mobile = this.$refs.mobile.value;
      //let reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      let reg = /^1[0-9]{10}$/;
      if (reg.test(mobile)) {
        this.list.mobile = mobile;
        return true;
      } else {
        this.$vux.toast.text("请输入正确手机号", "middle");
        return false;
      }
    },
    //验证码验证
    verifyCode() {
      let code = this.$refs.code.value;
      let reg = /^\d{4}$/;
      if (reg.test(code)) {
        this.list.captcha = code;
        this.captcha = code;
      } else {
        this.$vux.toast.text("请输入验证码", "middle");
      }
    },
    goBack() {
      localStorage.removeItem("staffMsg");
      localStorage.removeItem("activeRight");
      localStorage.removeItem("allRightList");
      this.$router.push("/organization");
    },
    // 获取已选门店
    getSlectedArea() {
      this.$ajax.get('/api/employee/find/area',{except:this.list.majorArea || ',,'}).then(res => {
        res = res.data
        if (res.status === 200) {
          this.banArea = res.data
        }
      })
    }
  },
  computed: {
    getSQ: function() {
      if (!this.activeSQ.SubDepart) {
        return [];
      } else {
        if (this.activeSQ.SubDepart.length === 0) {
          return [];
        } else {
          return this.activeSQ.SubDepart;
        }
      }
    }
  },
  destroyed() {
    this.$vux.datetime.hide();
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.main {
  box-sizing: border-box;
  position: relative;
  .content {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 100px;
    overflow-y: scroll;
    //-webkit-overflow-scrolling: touch;
    .data-list {
      padding-top: 20px;
      box-sizing: border-box;
      ul {
        li {
          display: flex;
          height: 100px;
          line-height: 100px;
          border-bottom: 1px solid @border-eb;
          > span {
            color: @color-minor;
            font-size: @font-size-m;
            display: inline-block;
            width: 172px;
            padding-left: 30px;
          }
          .required {
            position: relative;
            &:before {
              content: "\e62f";
              position: absolute;
              color: @color-require;
              top: 0;
              left: -20px;
              font-size: @font-size-icon;
            }
          }
          .radio {
            width: 70px;
            padding-left: 40px;
            position: relative;
            color: @color-main;
            font-size: @font-size-m;
            &:last-of-type {
              margin-left: 30px;
            }
            &:before {
              content: "\e611";
              position: absolute;
              color: @color-b0;
              top: 0;
              left: -5px;
              font-size: @font-size-icon-m;
            }
          }
          .active {
            color: @color-green;
            &:before {
              color: @color-green;
            }
          }
          input {
            outline: none;
            border: none;
            width: 400px;
            font-size: @font-size-m;
            color: @color-main;
            &::-webkit-input-placeholder {
              color: @color-assist;
              font-size: @font-size-m;
            }
          }
          p {
            display: inline-block;
            font-size: @font-size-m;
            color: @color-b0;
          }
        }
        .code {
          input {
            width: 200px;
          }
          .auth_text {
            width: 250px;
            text-align: right;
            font-size: @font-size-m;
            color: @color-green;
            float: right;
          }
          .forbid {
            color: @color-assist;
          }
        }
        .select {
          position: relative;
          .placehold {
            padding-left: 0;
            color: @color-assist;
          }
          .departName {
            width: 400px;
            overflow: hidden;
          }
          &:before {
            content: "\e625";
            position: absolute;
            color: @color-b0;
            top: 0;
            right: 0;
            font-size: @font-size-icon-m;
          }
        }
      }
      .top {
        background: @bg-ff;
        box-sizing: border-box;
        padding: 0 30px;
      }
      .mind {
        margin-top: 20px;
        background: @bg-ff;
        box-sizing: border-box;
        padding: 0 30px;
        .right {
          display: flex;
          padding-bottom: 30px;
          overflow: hidden;
          .s_left {
            color: @color-minor;
            font-size: @font-size-m;
            display: inline-block;
            min-width: 150px;
            padding-top: 30px;
            padding-left: 30px;
            position: relative;
            &:before {
              content: "\e62f";
              position: absolute;
              color: @color-require;
              top: 15px;
              left: -20px;
              font-size: @font-size-icon;
            }
          }
          .rightList {
            // width: 518px;
            // float: right;
            span {
              width: 146px;
              margin-top: 30px;
              margin-right: 20px;
              //height: 66px;
              padding: 10px 5px;
              display: inline-block;
              //line-height: 66px;
              text-align: center;
              box-sizing: border-box;
              border-radius: 6px;
              font-size: @font-size-m;
              color: @color-assist;
              background: @bg-E3;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .owner {
              color: @color-main;
              background: @bg-f5;
            }
            .right_active {
              border: 2px solid @color-green;
              background: @bg-ff;
              color: @color-green;
              box-sizing: border-box;
              //line-height: 62px;
            }
          }
        }
      }
      .bottom {
        margin-top: 20px;
        background: @bg-ff;
        box-sizing: border-box;
        padding: 0 30px;
        .shop {
          width: 400px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          > span {
            padding-left: 0;
            display: inline-block;
            font-size: @font-size-m;
            color: @color-main;
          }
        }
      }
      .picker {
        margin-top: 80px;
        background-color: @bg-ff;
        font-size: @font-size-m;
        &-location {
          height: 90px;
          display: flex;
          align-items: center;
          padding: 0 90px;
          position: relative;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          background-color: @bg-f5;
          .allDel {
            position: absolute;
            color: @color-b0;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            font-size: @font-size-icon;
          }
          > label {
            color: @color-assist;
            position: absolute;
            left: 30px;
          }
          .shopList {
            margin-left: 20px;
            padding: 0;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            overflow-x: auto;
            overflow-y: hidden;
            .shopName {
              flex: 1 0 auto;
              line-height: 56px;
              padding: 0 50px 0 20px;
              margin-left: 20px;
              border-radius: 6px;
              font-size: @font-size-m;
              color: @color-main;
              background: @bg-ff;
              position: relative;
              i {
                font-size: @font-size-icon;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0;
              }
            }
          }
        }
        &-city {
          padding: 40px 30px 0px;
          &-chose {
            margin-bottom: 12px;
            width: 100%;
            overflow-x: scroll;
            overflow-y: hidden;
            white-space: nowrap;
            > span {
              display: inline-block;
              margin-right: 40px;
              padding-bottom: 8px;
              &.active {
                color: @color-green;
                position: relative;
                &:after {
                  content: "";
                  width: 42px;
                  border-top: 4px solid @color-green;
                  position: absolute;
                  left: 50%;
                  bottom: 0;
                  transform: translateX(-50%);
                }
              }
            }
          }
          .city-list {
            height: 540px;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            > li {
              position: relative;
              height: 90px;
              display: flex;
              align-items: center;
              border-top: 1px solid @border-eb;
              border-bottom: none;
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              box-sizing: border-box;
              &.dis {
                color: #ccc;
                // display: none;
              }
              span {
                width: 50px;
                font-size: 50px;
                &.mask {
                  width: 30px;
                  height: 30px;
                  padding: 0;
                  position: absolute;
                  top: 28px;
                  left: 40px;
                  background-color: #ccc;
                }
              }
              .selected {
                color: @color-green;
              }
              &.active {
                color: @color-green;
              }
            }
          }
        }
      }
    }
  }
  .bottom_0 {
    bottom: 0;
  }
  .footer {
    width: 750px;
    height: 100px;
    display: flex;
    color: @bg-ff;
    position: absolute;
    left: 0;
    bottom: 0;
    > div {
      line-height: 110px;
      text-align: center;
      width: 50%;
      height: 110px;
      font-size: @font-size-xl;
    }
    .pass {
      background: @color-orange;
    }
    .noPass {
      background: @color-green;
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
  }
}
</style>