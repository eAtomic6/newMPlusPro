<template>
    <div class="customer">
        <div class="customer-top">{{dataReported.name}} {{setPhone}}</div>
        <!-- 1 -->
        <div class="customer-content" v-if="getTypeCustomer === 'reported'">
            <ul class="customer-ul">
                <li>
                    <div class="left">{{setTitle}}</div>
                    <div class="pr" @click="linkProjectFn">
                        <div :class="comProjectValue?'cl999':''">{{bNameFn(dataProject.b_name)}}</div>
                        <span class="iconfont icon-right_arrow"></span>
                    </div>
                </li>
                <li v-if="dataProject.reporting_type == 2">
                  <div class="left">定点保护期</div>
                  <div>{{this.pointTime}}</div>
                </li>
                <li class="li-bd" v-else>
                  <div class="left">报备保护期</div>
                  <div>{{day(dataProject.pro_time_agent_report)}}</div>
                </li>
                <li>
                    <div class="left">驻场电话</div>
                    <div>{{dataProject.mobile}}</div>
                </li>
            </ul>
            <ul class="customer-ul">
                <li>
                    <div class="left">报备规则</div>
                    <div>{{dataProject.b_id?dataProject.report_rule||'暂无':''}}</div>
                </li>
            </ul>
            <div class="customer-label" :class="changeSeeTimeFn(seeTime)?'':'cl333'" @click="showRange">
                <group>
                    <!--  :start-date="datTime" -->
                    <datetime title="预计带看时间" format="HH:mm" v-model="seeTime"></datetime>
                </group>
                <span class="iconfont icon-right_arrow"></span>
            </div>
            <ul class="customer-ul mt-20">
                <li>
                    <div class="left">客户情况</div>
                    <div class="flollow-textarea">
                        <textarea v-model="customerValue" class="input-info" placeholder="到访时间客户说明" @input="customerValueFn" maxlength="400"></textarea>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 2 -->
        <div class="customer-content" v-else-if="getTypeCustomer === 'see'">
            <ul class="customer-ul">
                <li>
                    <div class="left">{{setTitle}}</div>
                    <div class="pr" @click="linkProjectFn">
                        <div :class="comProjectValue?'cl999':''">{{bNameFn(dataProject.b_name)}}</div>
                        <span class="iconfont icon-right_arrow"></span>
                    </div>
                </li>
                <li class="li-bd">
                    <div class="left">带看保护期</div>
                    <div>{{day(dataProject.pro_time_agent_look)}}</div>
                </li>
                <li>
                    <div class="left">驻场电话</div>
                    <div>{{dataProject.mobile}}</div>
                </li>
            </ul>
            <div class="customer-label" :class="changeSeeTimeFn(seeTime)?'':'cl333'">
                <group>
                    <!--  :start-date="datTime" -->
                    <datetime title="带看时间" format="YYYY-MM-DD HH:mm" v-model="seeTime"></datetime>
                </group>
                <span class="iconfont icon-right_arrow"></span>
            </div>
            <ul class="customer-ul pa-ri">
                <li class="li-pl">
                    <div class="left">带看确认单</div>
                    <div class="customer-upload-box">
                        <div class="customer-li-img" v-for="(item,index) in imgArrUrl" :key="item.id">
                            <img :src="item.url">
                            <span class="customer-delate" @click="delateFn(index)"></span>
                        </div>
                        <div class="customer-upload" @click="imgClickFn">
                            <span class="iconfont icon-added_photo"></span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 3 -->
        <div class="customer-content" v-else>
            <ul class="customer-ul">
                <li>
                    <div class="left">{{setTitle}}</div>
                    <div class="pr" @click="clickItemFn">
                        <div>{{getLayerValue}}</div>
                        <span class="iconfont icon-right_arrow"></span>
                    </div>
                </li>
                <li class="li">
                    <div class="left">{{followList.value}}</div>
                    <ul class="follow-ul">
                        <li v-for="(item,index) in followList.children" :key="item.id" :class="followList.index === index? 'on':''" @click="clickLiFn(index)">{{item.value}}</li>
                    </ul>
                </li>
                <li>
                    <div class="left">目的描述</div>
                    <div class="flollow-textarea">
                        <textarea class="input-info" placeholder="请输入不少于10个字的目的描述" v-model="customerValue" @input="customerValueFn" maxlength="400"></textarea>
                    </div>
                </li>
            </ul>
        </div>
        <div class="btn" @click="btnTrueFn">确定</div>
        <popup-pick :pickList="layerList" :showPopup="layerList.showPopup" :title="setTitle" :isCustomer="layerList.is" :showIndex="layerList.index" @clickMask="pickCloseFn" @cancel="pickCloseFn" @confirm="pickSelectFn"></popup-pick>
        <Actionsheet v-model='imgList.value' :show-cancel='true' :menus='imgList.menus' @on-click-menu="imgListFn"></Actionsheet>
        <!-- 加载中 -->
        <loading :show="loadingBoolean" text="加载中" class="customer-loading"></loading>
        <!-- 提示层 -->
        <toast v-model="layerToast.show" type="text" class="layerToast" :time="layerToast.time" :position="layerToast.position" :width="layerToast.width" @on-hide="toastOnHide">{{layerToast.txt}}</toast>
    </div>
</template>

<script>
import popupPick from "@/components/popupPick";
import { Datetime, Group, Actionsheet, Loading, dateFormat,Toast} from "vux";
// import "@/assets/JS/commonH5";
import { mapMutations, mapState} from "vuex";
import ImageCompressor from "image-compressor.js";
import { setTimeout } from 'timers';

export default {
  name: "customerComponent",
  components: {
    popupPick,
    Datetime,
    Group,
    Actionsheet,
    Loading,
    Toast
  },
  props: {
    typeCustomer: {
      type: String,
      /**
       * follow       客户跟进
       * rob          抢入客户
       * reported     客户报备
       * see          客户带看
       */
      default: "follow"
    }
  },
  data() {
    return {
      // 弹层
      layerList: {
        value: "客户来源",
        children: [
          {
            value: "来电1",
            index: 1
          },
          {
            value: "来电2",
            index: 2
          },
          {
            value: "来电3",
            index: 3
          },
          {
            value: "来电4",
            index: 4
          }
        ],
        showPopup: false,
        index: 0,
        is: true
      },
      followList: {
        children: [
          {
            id: 0,
            value: ""
          }
        ],
        index: 0
      },
      seeTime: "请选择带看时间",
      // 相册弹层
      imgList: {
        menus: { menu1: "拍照", menu2: "从相册中获取" },
        value: false
      },
      // 报备数据
      dataReported: {
        name: "暂无数据",
        phone: ""
      },
      // 项目数据
      dataProject: {
        b_name: ""
      },
      // 输入框文字
      customerValue: "",
      // 预览图片
      imgArrUrl: [],
      // 上传图片
      imgArrSrc: [],
      // loading
      loadingBoolean: false,
      // 是否可以点击
      btnClickBool:true,
      // 弹层toast
      layerToast:{
        show:false,
        time:1200,
        txt:'',
        position:'middle',
        width:'auto'
      },
      timer: '',
      nowTime: new Date().getTime() + 1800000
    };
  },
  computed: {
    // 去掉秒
    pointTime() {
      if (this.dataProject.fixed_point_protection_period) {
        return this.dataProject.fixed_point_protection_period.split(':').splice(0,2).join(':')
      }else {
        return ''
      }
    },
    // 判断是否是明天
    endTimeStr() {
      let endTime = new Date(dateFormat(new Date(), "YYYY-MM-DD")+` ${this.pointTime}`).getTime()
      if (this.nowTime > endTime) {
        return  this.pointTime+'(明天)'
      }else {
        return this.pointTime
      }
    },
    // 当前时间
    datTime() {
      this.timer = setInterval(() => {
        this.nowTime = new Date().getTime() + 1800000
      },1000)
      return dateFormat(new Date(this.nowTime), "HH:mm")
    },
    getTypeCustomer() {
      return this.typeCustomer;
    },
    getLayerValue() {
      return this.layerList.children[this.layerList.index].value;
    },
    // 判断显示 文字颜色
    comProjectValue() {
      if (this.getTypeCustomer === "reported") {
        if (this.bNameFn(this.dataProject.b_name) === "请选择报备楼盘") {
          return true;
        }
        return false;
      } else {
        if (this.bNameFn(this.dataProject.b_name) === "请选择带看楼盘") {
          return true;
        }
        return false;
      }
    },
    // 手机号处理
    setPhone() {
      let p = `${this.dataReported.phone}`;
      return `${p.slice(0, 3)}****${p.slice(-4)}`;
    },
    // 获取客户id
    cID() {
      return this.c_id;
    },
    // 获取项目id
    pID() {
      return this.p_id;
    },
    setTitle() {
      let txt = "";
      switch (this.getTypeCustomer) {
        case "reported":
          txt = "报备楼盘";
          break;
        case "see":
          txt = "带看项目";
          break;
        default:
          txt = this.layerList.value;
      }
      this.layerList.value = txt;
      return txt;
    },
    ...mapState(["c_id", "p_id", "c_type"])
  },
  methods: {
    // 字符
    bNameFn(txt) {
      if (txt == "") {
        if (this.getTypeCustomer === "reported") {
          return "请选择报备楼盘";
        } else {
          return "请选择带看楼盘";
        }
      }
      return txt;
    },
    customerValueFn() {
      let v = this.customerValue;
      // let reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
      let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\ud83d[\ude80-\udeff]/g;
      if (v.match(reg)) {
        this.tips("不支持表情输入");
        this.customerValue = v.replace(reg, "");
      }
    },
    // 显示天数
    day(t) {
      if (!!t) {
        t = `${t}小时`;
      } else {
        t = "";
      }
      return t;
    },
    // 点击控件
    clickItemFn() {
      this.layerList.showPopup = true;
    },
    // 确定
    pickSelectFn(index) {
      this.layerList.showPopup = false;
      this.layerList.index = index;
    },
    //取消
    pickCloseFn() {
      this.layerList.showPopup = false;
    },
    // 单选
    clickLiFn(index) {
      this.followList.index = index;
    },
    // 删除图片
    delateFn(index) {
      this.imgArrUrl.splice(index, 1);
    },
    // 相册弹出
    imgClickFn() {
      if (this.imgArrUrl.length > 2) {
        this.tips("最多只能上传三张");
        return false;
      }
      // 弹出选择
      this.imgList.value = true;
    },
    // 相册选取
    imgListFn(i, e) {
      const that = this;
      //压缩图片
      function compressImage(url, filename) {
        var name = "_doc/upload/" + filename;
        plus.zip.compressImage(
          {
            src: url, //src: (String 类型 )压缩转换原始图片的路径
            dst: name, //压缩转换目标图片的路径
            quality: 10, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件
          },
          function(zip) {
            let maxSize = 1 * 1024 * 1024;
            let minSize = 3 * 1024;
            if (zip.size < minSize) {
              that.loadingBoolean = false;
              that.tips("上传图片请大于 3kb");
              return false;
            } else if (zip.size > maxSize) {
              that.loadingBoolean = false;
              that.tips("上传图片请小于 1Mb");
              return false;
            } else {
              //页面显示图片
              showPics(zip.target, name);
            }
          },
          function(error) {
            that.tips("压缩图片失败，请稍候再试");
          }
        );
      }
      //图片显示
      function showPics(url, name) {
        //根据路径读取到文件
        plus.io.resolveLocalFileSystemURL(url, function(entry) {
          entry.file(function(file) {
            var fileReader = new plus.io.FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = function(e) {
              var picUrl = e.target.result.toString();
              var fileVar = dataURLtoFile(picUrl);
              const form = new FormData();
              form.append("watermark", false);
              form.append("file", fileVar, file.name);
              that.$axios
                .post("/img/upload", form)
                .then(res => {
                  that.loadingBoolean = false;
                  let imgUrl = res.data.images[0];
                  that.imgArrUrl.unshift({
                    id: imgUrl.md5,
                    name: imgUrl.name,
                    url: imgUrl.src
                  });
                })
                .catch(err => {
                  that.loadingBoolean = false;
                  that.tips(err);
                });


              /**
               * base 64  转换为图片
               * dataurl 64为图片
               * filename 图片名字
               * return 返回图片
               */
              function dataURLtoFile(urlData) {
                var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte

                //处理异常,将ascii码小于0的转换为大于0
                var ab = new ArrayBuffer(bytes.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < bytes.length; i++) {
                  ia[i] = bytes.charCodeAt(i);
                }

                return new Blob([ab], { type: "image/png" });
              }
            };
          });
        });
      }
      // 拍照
      if (i === "menu1") {
        var cmr = plus.camera.getCamera();
        cmr.captureImage(
          function(path) {
          that.loadingBoolean = true;
            plus.gallery.save(
              path,
              function() {
                let name = path.substr(path.lastIndexOf("/") + 1);
                compressImage(path, name);
              },
              function(e) {
                that.loadingBoolean = false;
                that.tips("保存失败: " + JSON.stringify(e));
              }
            );
          },
          function(e) {
            that.loadingBoolean = false;
            // outSet('取消拍照');
          },
          { filename: "_doc/gallery/", index: 1 }
        );
        return false;
      }
      // 相册选取
      if (i === "menu2") {
        // 从相册中选择图片
        plus.gallery.pick(
          function(e) {
            that.loadingBoolean = true;
            let name = e.substr(e.lastIndexOf("/") + 1);
            compressImage(e, name);
          },
          function(e) {
            that.loadingBoolean = false;
            // outSet('取消选择图片');
          },
          {
            filter: "image"
          }
        );
        return false;
      }
    },
    // 预计带看时间范围提示
    showRange() {
      // let endTime = new Date(dateFormat(new Date(), "YYYY-MM-DD")+` ${this.pointTime}`).getTime()
      // let endTimeStr = this.pointTime
      // if (this.nowTime > endTime) {
      //   endTimeStr = endTimeStr+'(明天)'
      // }
      this.layerToast.time = 2000;
      this.tips(`请在${this.datTime}-${this.dataProject.reporting_type == 2?this.endTimeStr:'23:59'}之间选择`);
      setTimeout(() => {
        this.layerToast.time = 1200;
      },0)
    },
    // 修改颜色显示
    changeSeeTimeFn(item) {
      const txt = "请选择带看时间";
      if (item === txt) {
        return true;
      }
      return false;
    },
    // 提示弹层
    tips(txt) {
      // this.$vux.toast.text(txt, "middle");
      Object.assign(this.layerToast,{
        show:true,
        txt
      });
    },
    // 隐藏提示层
    toastOnHide(){
      this.btnClickBool = true;
    },
    // 点击确定
    btnTrueFn() {
      if(this.btnClickBool){
        this.btnClickBool = false
          switch (this.getTypeCustomer) {
          //客户报备
          case "reported":
            this._postReportedFn();
            break;
          //客户带看
          case "see":
            this._postSeedFn();
            break;
          //客户跟进 和 抢入客户 合并
          default:
            this._psoFollowFn();
        }
      }
    },
    // 数据转换
    setDataIndex(t) {
      return this[t].children[this[t].index].key;
    },
    // 跳转意向项目
    linkProjectFn() {
      let localStorageData = {
        customerValue: this.customerValue,
        seeTime: this.seeTime,
        imgArrUrl: this.imgArrUrl
      };
      localStorage.localStorageData = JSON.stringify(localStorageData);
      this.$router.push({ path: "intentProject" });
    },
    // 获取数据
    getData() {
      // 获取客户姓名和手机号
      this.$ajax
        .get("/api/prc/customer", {
          customerId: this.cID
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.dataReported = res.data;
          }
        });
      // 客户报备
      if (this.pID !== "") {
        this.$ajax
          .get("/api/itemDetailsTelephoneNumber", {
            id: this.pID
          })
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              this.dataProject = res.data[0];
            }
          });
      }
      // 客户带看 客户抢入 数据获取
      if (this.getTypeCustomer === "follow" || this.getTypeCustomer === "rob") {
        this.$ajax
          .get("/api/dictionary/list", {
            ids: "303,311"
          })
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              Object.assign(this.layerList, res.data[303]);
              Object.assign(this.followList, res.data[311]);
            }
          });
      }
    },
    _setData() {
      let localStorageData = {
        customerValue: "",
        seeTime: "请选择带看时间",
        imgArrUrl: []
      };
      if (this.c_type > 0) {
        try {
          let t = JSON.parse(localStorage.localStorageData);
          if (t.customerValue) {
            localStorageData.customerValue = t.customerValue;
          }
          if (t.seeTime) {
            localStorageData.seeTime = t.seeTime;
          }
          if (t.imgArrUrl) {
            localStorageData.imgArrUrl = t.imgArrUrl;
          }
        } catch (e) {
          this.tips(e);
        }
      } else {
        localStorage.localStorageData = JSON.stringify(localStorageData);
      }
      this.customerValue = localStorageData.customerValue;
      this.seeTime = localStorageData.seeTime;
      this.imgArrUrl = localStorageData.imgArrUrl;
      this.changeStoreCType(0);
    },
    _pushSuccess(txt, index) {
      this.tips(txt);
      setTimeout(() => {
        this.$vux.toast.hide();
        this.$router.go(-1);
      }, 1000);
    },
    //客户跟进 和 抢入客户 合并  提交数据
    _psoFollowFn() {
      if (this.customerValue.length < 10) {
        this.tips("请输入不少于10字的目的描述");
        return false;
      }
      // 加载中
      this.loadingBoolean = true;
      // 提交数据
      let pos = new FormData();
      pos.append("customerId", this.cID);
      pos.append("reasonType", this.setDataIndex("followList"));
      pos.append("followType", this.setDataIndex("layerList"));
      pos.append("followReason", this.customerValue);

      let url = "";
      let txt = "";
      if (this.getTypeCustomer === "follow") {
        url = "/api/follows";
        txt = "客户跟进成功";
      } else {
        url = "/api/customer/lock";
        txt = "抢入客户成功";
      }
      this.$axios
        .post(url, pos)
        .then(res => {
          // 隐藏加载中
          this.loadingBoolean = false;
          if (res.data.status === 200) {
            this._pushSuccess(txt, 1);
            return false;
          }
          this.tips(res.data.message);
        })
        .catch(err => {
           this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // 客户报备 提交数据
    _postReportedFn() {
      if (this.comProjectValue) {
        this.tips("请选择报备楼盘。");
        return false;
      }
      if (this.changeSeeTimeFn(this.seeTime)) {
        this.tips("请选择预计带看时间。");
        return false;
      }
      // 加载中
      this.loadingBoolean = true;
      // 提交数据
      let pos = new FormData();
      pos.append("customerId", this.cID);
      pos.append("buildingId", this.pID);
      pos.append("details", this.customerValue);
      pos.append("expectLookTime", this.seeTime)

      
      this.$axios
        .post("/api/reports", pos)
        .then(res => {
          console.log(res);
          // 隐藏加载中
          this.loadingBoolean = false;
          if (res.data.status === 200) {
            this._pushSuccess("客户报备成功", 1);
            return false;
          }else if (res.data.status === 2222) {
            this.layerToast.time = 5000;
            setTimeout(() => {
              this.layerToast.time = 1200;
            },0)
          }
          this.tips(res.data.message);
        })
        .catch(err => {
          this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // 客户带看 提交数据
    _postSeedFn() {
      if (this.comProjectValue) {
        this.tips("请选择报备楼盘。");
        return false;
      }
      if (this.changeSeeTimeFn(this.seeTime)) {
        this.tips("请选择带看时间。");
        return false;
      }
      if (this.imgArrUrl.length < 1) {
        this.tips("请上传带看确认单。");
        return false;
      }
      // 加载中
      this.loadingBoolean = true;
      this.imgArrUrl.forEach(e => {
        if (e.url != undefined && e.url != "") {
          this.imgArrSrc.unshift(e.url);
        }
      });
      // 发送post 请求
      let pos = new FormData();
      pos.append("customerId", this.cID);
      pos.append("buildingId", this.pID);
      pos.append("lookTime", this.seeTime);
      pos.append("lookVoucher", this.imgArrSrc.join(","));
      // 发送post 请求
      this.$axios
        .post("/api/looks", pos)
        .then(res => {
          // 隐藏加载中
          this.loadingBoolean = false;
          if (res.data.status === 200) {
            this._pushSuccess("客户带看成功", 1);
            return false;
          }
          this.tips(res.data.message);
        })
        .catch(err => {
          this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // map
    ...mapMutations(["changeStoreCType"])
  },
  mounted() {
    this.getData();
    var screenHeight;
    if (window.innerHeight){
        screenHeight = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)){
        screenHeight = document.body.clientHeight;
    }
    // console.log(screenHeight);
    document.body.style.height = screenHeight+'px';
  },
  created() {
    this._setData();
  },
  beforeDestroy () {
    if(this.timer) {
    clearInterval(this.timer);//在vue实例销毁钱，清除我们的定时器
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";
.customer {
  margin-bottom: 13vw;
  .customer-top {
    line-height: 100px;
    padding: 0 30px;
    font-size: @font-size-m;
    color: @color-minor;
  }

  .customer-ul {
    background-color: @bg-ff;
    padding: 0 30px;

    > li {
      position: relative;
      padding-left: 172px;
      min-height: 100px;
      line-height: 100px;
      font-size: @font-size-m;
      border-bottom: 1px solid @border-eb;

      > .left {
        position: absolute;
        left: 0;
        color: @color-minor;
      }

      .icon-right_arrow {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        font-size: 50px;
        color: @color-minor;
      }

      &:last-child {
        border-bottom: 0;
      }

    }

    .li-pl {
      padding-left: 150px;
    }

    .li {
      padding-left: 132px;
    }

    .li-bd {
      border-bottom: 0;
    }
  }

  .pa-ri {
    padding-right: 0;
  }

  .follow-ul {
    overflow: hidden;
    padding: 20px 0;

    > li {
      float: left;
      width: 142px;
      line-height: 62px;
      border: 2px solid @bg-f5;
      border-radius: 6px;
      background-color: @bg-f5;
      font-size: @font-size-m;
      text-align: center;
      margin: 15px 0 15px 40px;
    }

    .on {
      background-color: @bg-ff;
      border-color: @color-green;
      color: @color-green;
    }
  }

  .flollow-textarea {
    box-sizing: border-box;
    padding: 25px 0;

    .input-info {
      display: block;
      width: 100%;
      font-size: @font-size-m;
      line-height: 50px;
      height: 150px;
    }
  }

  .btn {
    line-height: 100px;
    height: 100px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: @color-green;
    color: @color-white;
    text-align: center;
    font-size: @font-size-xl;
    z-index: 99;
  }

  .customer-upload-box {
    overflow: hidden;
    padding-bottom: 38px;
    padding-top: 18px;

    .customer-upload {
      width: 158px;
      height: 158px;
      background-color: @bg-f5;
      border-radius: 6px;
      margin-top: 20px;
      margin-left: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      float: left;

      > .iconfont {
        font-size: 100px;
        color: @color-b0;
      }

      .customer-input {
        display: none;
      }
    }

    .customer-li-img {
      width: 158px;
      height: 158px;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 22px;
      margin-top: 20px;
      background-color: @bg-f5;
      position: relative;
      border-radius: 6px;

      > img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .customer-delate {
      position: absolute;
      right: -12px;
      top: -18px;
      width: 36px;
      height: 36px;
      background: url("../assets/img/icon-delate.png") no-repeat center center;
      background-size: 36px auto;
    }
  }

  // 相册弹层样式
  /deep/.weui-mask {
    background: rgba(0, 0, 0, 0.48);
  }

  /deep/.weui-actionsheet {
    width: 710px;
    left: 20px;
    background: rgba(0, 0, 0, 0);

    .weui-actionsheet__menu {
      background: rgba(255, 255, 255, 1);
      border-radius: 6px;

      .weui-actionsheet__cell {
        font-size: 30px;
        color: @color-black;
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

  /deep/.weui-dialog {
    border-radius: 6px;

    .weui-dialog__bd {
      color: @color-black;
    }

    .weui-dialog__ft {
      .weui-dialog__btn_primary {
        color: @color-green;
      }
    }
  }
}

// 日期弹层
.customer-label {
  position: relative;
  background-color: #fff;

  &.cl333 {
    /deep/.vux-cell-value {
      color: @color-main;
    }
  }

  > div {
    position: relative;
    z-index: 1;
  }

  /deep/.vux-no-group-title {
    margin-top: 0;
    padding: 0 30px;
    line-height: 100px;
    font-size: @font-size-m;
    color: @color-minor;
  }

  /deep/.weui-cell {
    padding: 0;
    text-decoration: none;

    > div:first-child {
      width: 172px;
    }

    &:hover {
      background-color: transparent;
    }
  }

  /deep/.weui-cell__ft {
    text-align: left;

    &::after {
      border-color: #fff;
    }
  }

  /deep/.weui-cells {
    background-color: transparent;
  }

  .icon-right_arrow {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 50px;
    color: @color-minor;
  }
}

/deep/.weui-toast {
  z-index: 10001;
}

.break-all {
  word-break: break-all;
  word-wrap: break-word;
}

.pr {
  position: relative;
}

.mt-20 {
  margin-top: 20px;
}

.cl999 {
  color: @color-assist;
}

@media only screen and (device-width: 375px) and (device-height: 812px) and
(-webkit-device-pixel-ratio: 3){
  .customer .btn{
    bottom: 34px;
  }
}
</style>
