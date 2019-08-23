<template>
  <div id="newDropdown">
    <!-- 跟进类型 -->
    <div>
      <h2>{{titleCode}}类型</h2>
      <div class="clearfix">
        <span
          v-for="item in followType"
          @click="followTypeMethods(item.value,item.key)"
          :class="item.value===followTypeValue?'active':''"
        >{{item.value}}</span>
      </div>
    </div>
    <!-- 跟进目的 -->
    <div v-show="titleCode == '跟进'">
      <h2>{{titleCode}}目的</h2>
      <div class="clearfix">
        <span
          v-for="item in followPurpose"
          @click="followPurposeMethods(item.value,item.key)"
          :class="item.value===followPurposeValue?'active':''"
        >{{item.value}}</span>
      </div>
    </div>
    <!-- 楼盘性质 -->
    <div v-show="titleCode != '跟进'">
      <h2>楼盘性质</h2>
      <div class="clearfix">
        <span
          v-for="item in followPurpose"
          @click="followPurposeMethods(item.value,item.key)"
          :class="item.value===followPurposeValue?'active':''"
        >{{item.value}}</span>
      </div>
    </div>
    <!-- 跟进时间 -->
    <div>
      <h2>{{titleCode}}时间</h2>
      <div class="clearfix flow_time">
        <span @click="showPlugin('起始时间')">{{startTime}}</span>
        <span>——</span>
        <span @click="showPlugin('结束时间')">{{endTime}}</span>
      </div>
    </div>

    <!-- 跟进项目 -->
    <div v-show="titleCode != '跟进'">
      <!-- <div> -->
      <h2>{{titleCode}}项目</h2>
      <div class="clearfix">
        <div class="proChose" @click="clickPro">{{proName | limit}}</div>
        <icon type="cancel" @click.native="clearPro"></icon>
      </div>
    </div>
    <!-- 底部按钮 -->
    <footer>
      <span @click="reset">重置</span>
      <span @click="submit">确定</span>
    </footer>
    <div style="display:none;">{{titleName}}</div>
  </div>
</template>

<script>
import { Datetime, Icon } from "vux";
import { mapMutations, mapState } from "vuex";
let currentTime = new Date();
export default {
  props: ["slider"],
  data() {
    return {
      titleCode: "",
      followPurpose: [],
      followPurposeValue: "",
      followPurposeId: "", //选择跟进目的的id
      followType: [],
      followTypeValue: "",
      followTypeId: "", //选择跟进类型的id
      startTime: "起始时间",
      endTime: "结束时间",
      proName: "点击选择项目", //项目名称
      ifShowClear: false //是否隐藏清除按钮
    };
  },

  methods: {
    followTypeMethods(name, type) {
      this.followTypeValue = name;
      this.followTypeId = type;
    },
    followPurposeMethods(name, type) {
      this.followPurposeValue = name;
      this.followPurposeId = type;
    },
    change() {},
    onConfirm(val) {
    },
    showPlugin(sbj) {
      let _this = this;
      let year = currentTime.getFullYear();
      let month = currentTime.getMonth() + 1;
      let getDate = currentTime.getDate();
      let current = year + "-" + month + "-" + getDate;
      this.$vux.datetime.show({
        cancelText: "取消",
        confirmText: "确定",
        format: "YYYY-MM-DD",
        value: current,
        // 点击确定
        onConfirm(val) {
          switch (sbj) {
            case "起始时间":
              _this.startTime = val;
              break;
            case "结束时间":
              if (_this.startTime == "起始时间") {
                _this.$vux.toast.text("请选择起始时间", "middle");
              } else {
                if (_this.CompareDate(val, _this.startTime)) {
                  _this.endTime = val;
                } else {
                  _this.$vux.toast.text("结束时间请大于起始时间", "middle");
                }
              }

              break;
          }
        }
      });
    },
    // 点击项目 -- 进入意向项目
    clickPro() {
      this.$router.push({ path: "intentProject" });
    },
    // 点击按钮清除
    ...mapMutations(["changeStorePID", "changeStoreCNmae"]),
    clearPro() {
      this.changeStoreCNmae("");
      this.changeStorePID(""); //让项目id为空
      this.proName = "";
    },
    //
    getData() {
      this.proName = this.c_name;
      this.$emit("ContoryshowPopup", true); //从选择项目的页面返回，需要弹框继续打开
    },
    // 重置
    reset() {
      this.changeStoreCNmae("");
      this.changeStorePID(""); //让项目id为空
      this.followPurposeValue = "";
      this.followTypeValue = "";
      this.followTypeMethods();
      this.followPurposeMethods();
      this.startTime = "起始时间";
      this.endTime = "结束时间";
      this.proName = "";
      let params = {
        followPurposeValue_qin: this.followPurposeValue,
        followTypeValue_qin: this.followTypeValue,
        startTime:
          this.startTime == "起始时间" ? "" : this.startTime + " 00:00:00",
        endTime: this.endTime == "结束时间" ? "" : this.endTime + " 23:59:59",
        proName: "",
        projectId: ""
      };
      this.$emit("Contoryshow", params, true);
    },
    // 确定
    submit() {
      if (
        (this.startTime != "起始时间" && this.endTime == "结束时间") ||
        (this.startTime == "起始时间" && this.endTime != "结束时间")
      ) {
        this.$vux.toast.text("时间选择有误", "middle");
        return false;
      }
      let params = {
        followPurposeValue_qin: this.followPurposeValue,
        followTypeValue_qin: this.followTypeValue,
        startTime:
          this.startTime == "起始时间" ? "" : this.startTime + " 00:00:00",
        endTime: this.endTime == "结束时间" ? "" : this.endTime + " 23:59:59",
        proName: this.proName,
        projectId: this.p_id
      };
      if (this.titleCode == "跟进") {
        params.followType = this.followTypeId;
        params.reasonType = this.followPurposeId;
      }
      if (this.titleCode == "报备" || this.titleCode == "带看") {
        params.checkType = this.followTypeId;
        params.buildingProperty = this.followPurposeId;
      }
      this.$emit("Contoryshow", params);
    },
    // 封装两个日期比较大小
    CompareDate(d1, d2) {
      return new Date(d1.replace(/-/g, "/")) >= new Date(d2.replace(/-/g, "/"));
    }
  },
  //   该弹框做的有缓存 --- 当选择项目后改变
  activated() {
    if (this.c_type > 0) {
      this.getData();
    }

    //   首页进来，需要清空原来选择
    if (this.$store.state.isShowpopup == 1) {
      this.reset();
    }
  },
   filters: {
    limit: function(str) {
      return str.length > 9 ? str.slice(0, 9) + "..." : str;
    }
  },
  computed: {
    ...mapState(["c_id", "p_id", "c_type", "c_name"]),
    titleName() {
      switch (this.$route.path) {
        //   我的跟进
        case "/tipFollow":
          this.titleCode = "跟进";
          this.followPurpose = this.slider.followType;
          this.followType = this.slider.followPurpose;
          break;
        //   我的报备
        case "/tipRecord":
          this.titleCode = "报备";
          this.followPurpose = this.slider.followPurpose;
          this.followType = this.slider.followType;

          break;
        case "/tipService":
          this.titleCode = "带看";
          this.followPurpose = this.slider.followPurpose;
          this.followType = this.slider.followType;
          break;
      }
      return;
    }
  },
  components: {
    Datetime,
    Icon
  }
};
</script>

<style lang="less" scoped>
#newDropdown {
  background-color: #fff;
  height: 100vh;
  padding: 2vw 5vw;
  box-sizing: border-box;
  position: relative;
  > div {
    margin-top: 6vw;
    h2 {
      margin: 0;
    }
    > div {
      position: relative;
      > span {
        float: left;
        margin-top: 5vw;
        padding: 1.5vw 3.5vw;
        background-color: #ededed;
        margin-left: 2vw;
        border-radius: 4.2667vw;
        color: #333;
      }
      > .active {
        color: #5ca52a;
        background: rgba(92, 165, 42, 0.1);
      }
      > .proChose {
        display: inline-block;
        height: 5.5vw;
        width: 45vw;
        margin-top: 5vw;
        padding: 1.5vw 2vw;
        outline: none;
        border: 0.3vw solid #ccc;
        border-radius: 1vw;
        font-size: 4vw;
        margin-left: 5vw;
      }
      .weui-icon-cancel {
        position: absolute;
        top: 6.5vw;
        right: -10vw;
        font-size: 6vw;
        color: #ccc;
      }
    }
    .flow_time {
      > span {
        padding: 0;
        width: 31.3333vw;
        height: 8vw;
        text-align: center;
        line-height: 8vw;
        color: #ccc;
        margin-left: 0;
        &:nth-of-type(2) {
          width: 9vw;
          background-color: #fff;
          margin: 5vw 2vw 0;
        }
      }
    }
  }
  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 13vw;
    line-height: 13vw;
    display: flex;
    > span {
      flex: 1;
      color: #333;
      text-align: center;
      font-size: 4vw;
      background-color: #f0f0f0;
      &:nth-of-type(2) {
        background-color: #5ca52a;
        color: #fff;
      }
    }
  }
}
</style>

