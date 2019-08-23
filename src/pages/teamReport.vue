<template>
  <div class="container">
    <topbar>
      <p slot="topbar-left" class="topbar-left">
        <span class="iconfont icon-back" @click="toBack"></span>
        <span class="iconfont icon-remove" @click="toBack(1)"></span>
      </p>
      <p class="topbar-opera-btn" slot="topbar-content">
        <datetime format="YYYY-MM-DD" v-model="seeTime1" @on-change="watchTime1"></datetime>~
        <datetime format="YYYY-MM-DD" v-model="seeTime2" @on-change="watchTime2"></datetime>
      </p>
    </topbar>
    <div class="content">
      <div class="tab-head" v-if="this.departmentTotal">
        <div
          class="tab-head-item"
          :class="activeTab===0?'active':''"
          @click="clickTab(0)"
        >部门排名（{{departmentTotal}}）</div>
        <div
          class="tab-head-item"
          :class="activeTab===1?'active':''"
          @click="clickTab(1)"
        >置业顾问排名（{{reportTotal}}）</div>
      </div>
      <abnormal iconName="noClient" v-if="isNull"></abnormal>
      <div class="tab-main" v-else>
        <div class="tab-main-item" :class="this.departmentTotal&&activeTab===0?'active':''">
          <div class="link">
            <span>首页 ></span>
            <span class="last">{{departmentArr[departmentArr.length-1].depName}}</span>
          </div>
          <div class="form" v-for="item in departmentList">
            <div class="form-title" @click="clickTitle(item)">
              <span class="head-img">
                <img class="head-pic" :src="item.logo?item.logo:getImg('logo.png')" alt>
              </span>
              {{item.companyName}}
              <span class="iconfont icon-right_arrow"></span>
            </div>
            <div class="form-row">
              <div class="form-item">
                <span class="client-type">新增客户</span>
                <span class="client-num">{{item.customerCount}}</span>
              </div>
              <div class="form-item">
                <span class="client-type">跟进总数</span>
                <span class="client-num">{{item.followCount}}</span>
              </div>
              <div class="form-item">
                <span class="client-type">报备总数</span>
                <span class="client-num">{{item.reportCount}}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-item">
                <span class="client-type">带看总数</span>
                <span class="client-num">{{item.lookCount}}</span>
              </div>
              <div class="form-item">
                <span class="client-type">成交总数</span>
                <span class="client-num">{{item.dealCount}}</span>
              </div>
              <div class="form-item">
                <span class="client-type">结佣金额</span>
                <span class="client-num orange">{{item.commissionSum}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-main-item" :class="!this.departmentTotal||activeTab===1?'active':''">
          <div class="rank" v-for="item in reportList">
            <div class="form-title">
              <span class="head-img">
                <img class="head-pic" :src="item.headImg?item.headImg:getImg('default.png')" alt>
              </span>
              <span class="pc-name">{{item.depName}}</span>
              -{{item.employeeName}}
            </div>
            <div class="rank-box">
              <div class="rank-item">
                <span class="client-type">新增客户</span>
                <span class="client-num">{{item.customerCount}}</span>
              </div>
              <div class="rank-item">
                <span class="client-type">跟进总数</span>
                <span class="client-num">{{item.followCount}}</span>
              </div>
              <div class="rank-item">
                <span class="client-type">报备总数</span>
                <span class="client-num">{{item.reportCount}}</span>
              </div>
              <div class="rank-item">
                <span class="client-type">带看总数</span>
                <span class="client-num">{{item.lookCount}}</span>
              </div>
              <div class="rank-item">
                <span class="client-type">成交总数</span>
                <span class="client-num">{{item.dealCount}}</span>
              </div>
              <div class="rank-item">
                <span class="client-type">结佣金额</span>
                <span class="client-num orange">{{item.commissionSum}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topbar from "@/components/topbar";
import abnormal from "@/components/abnormal";
import { MIXINS, FILTERS, TIME } from "@/assets/JS/mixins";
import { Datetime } from "vux";
let DATA = new Date(),
  DATA2 = TIME(DATA, 1),
  DATA1 = TIME(DATA.setDate(DATA.getDate() - 7), 1);
export default {
  name: "teamReport",
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    abnormal,
    Datetime
  },
  data() {
    return {
      title: "黄晓明-武汉商圈",
      isNull: false,
      seeTime1: DATA1,
      seeTime2: DATA2,
      activeTab: 0,
      departmentParam: {},
      reportTotal: 0,
      reportList: [],
      departmentTotal: 0,
      departmentList: [],
      departmentArr: []
    };
  },
  created() {
    let userData = JSON.parse(localStorage.getItem("userMessage"));
    this.departmentArr.push({
      depName: userData.depName
      //   depId: userData.depId
    });
    // this.departmentParam = {
    //   departmentId: userData.depId
    // }
    this.getDepartmentAjax();
    // this.getReportAjax()
  },
  methods: {
    /**
     * 点击tab栏切换
     */
    clickTab(index) {
      this.activeTab = index;
    },
    /**
     * 监控开始时间
     */
    watchTime1(newVal) {
      //   console.log(newVal)
      if (!this.compare(newVal, this.seeTime2)) {
        this.useToast("不能大于结束日期");
        setTimeout(() => {
          this.seeTime1 = this.seeTime2;
        }, 20);
      }
      this.getDepartmentAjax();
      // this.getReportAjax()
    },
    /**
     * 监控结束时间
     */
    watchTime2(newVal) {
      if (!this.compare(newVal, DATA2)) {
        this.useToast("不能选择今天以后的日期");
        setTimeout(() => {
          this.seeTime2 = DATA2;
        }, 20);
      }
      if (!this.compare(this.seeTime1, newVal)) {
        this.useToast("不能小于开始日期");
        setTimeout(() => {
          this.seeTime2 = this.seeTime1;
        }, 20);
      }
      this.getDepartmentAjax();
      // this.getReportAjax()
    },
    /**
     * 比较时间大小方法
     */
    compare(beginDate, endDate) {
      var d1 = new Date(beginDate.replace(/\-/g, "/"));
      var d2 = new Date(endDate.replace(/\-/g, "/"));
      //   console.log(d1)
      //   console.log(d2)
      if (beginDate != "" && endDate != "" && d1 > d2) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 点击部门标题
     */
    clickTitle(item) {
      this.departmentArr.push({
        depName: item.companyName,
        depId: item.departmentId
      });
      //   console.log(this.departmentArr)
      this.departmentParam = Object.assign({}, this.departmentParam, {
        departmentId: item.departmentId
      });
      this.getDepartmentAjax();
      // this.getReportAjax()
    },
    /**
     * 返回上一页/刷新数据
     */
    toBack(num) {
      if (num === 1) {
        this.$router.go(-1);
        return;
      }
      let length = this.departmentArr.length;
      if (length === 1) {
        this.$router.go(-1);
        return;
      }
      this.departmentArr = this.departmentArr.slice(0, length - 1);
      //   console.log(this.departmentArr)
      let currentId = this.departmentArr[length - 2].depId;
      this.departmentParam = Object.assign({}, this.departmentParam, {
        departmentId: currentId
      });
      this.getDepartmentAjax();
      // this.getReportAjax()
    },
    /**
     * 获取部门排名数据
     */
    getDepartmentAjax() {
      //   console.log(this.departmentParam)
      this.departmentParam = Object.assign({}, this.departmentParam, {
        startTime: this.seeTime1,
        endTime: this.seeTime2
      });
      this.$ajax
        .get("/api/report/teamReport", this.departmentParam)
        .then(res => {
          res = res.data;
          console.log(res);
          if (res.status === 200) {
            let data = res.data;
            console.log(data);
            this.departmentTotal = data.sum;
            this.departmentList = data.resultList;

            this.getReportAjax();
            console.log(this.departmentList);
          } else if (res.status === 403) {
            this.useToast(res.message);
            this.isNull = true;
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     *   获取置业顾问排名数据
     */
    getReportAjax() {
      this.departmentParam = Object.assign({}, this.departmentParam, {
        startTime: this.seeTime1,
        endTime: this.seeTime2
      });
      this.$ajax
        .get("/api/report/pcReport", this.departmentParam)
        .then(res => {
          res = res.data;
          console.log(res);
          if (res.status === 200) {
            let data = res.data;
            // console.log(data)
            this.reportTotal = data.sum;
            this.reportList = data.resultList;
          } else if (res.status === 403) {
            this.useToast(res.message);
            this.isNull = true;
          }
        })
        .catch(error => {
          //   console.log('====================')
          //     console.log(error)
          this.handleError(error);
        });
    },
    /**
     * 处理请求出错
     * $error 错误请求参数
     */
    handleError(error) {
      if (error.response.data.message) {
        this.useToast(error.response.data.message);
      } else {
        this.useToast("请求出错了");
      }
    },
    /**
     * 使用toast提示
     */
    useToast(word, width) {
      this.$vux.toast.show({
        text: word,
        type: "text",
        position: "middle",
        width: width || "160px"
      });
    }
  }
};
</script>
<style scoped lang="less">
@import "~@/assets/CSS/config";
.topbar-left {
  font-size: 0 !important;
}
.icon-back {
  font-size: 60px;
}
.icon-remove {
  font-size: 60px;
}
.topbar-opera-btn {
  border: 1px solid @color-orange;
  padding: 0 28px;
  height: 60px;
  line-height: 60px;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
  color: @color-orange;
  background-color: @bg-FB;
  font-size: @font-size-l;
  line-height: 1.6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.content {
  position: absolute;
  top: 80px;
  left: 0;
  bottom: 0;
  right: 0;
  background: #f5f5f5;
  .tab-head {
    display: flex;
    background: #fff;
    height: 99px;
    line-height: 99px;
    border-top: 1px solid #ebebeb;
    font-size: 28px;
    .tab-head-item {
      flex: 1;
      text-align: center;
      position: relative;

      &.active {
        color: #ff6a03;
        &::after {
          content: "";
          display: block;
          position: absolute;
          bottom: 16px;
          width: 50px;
          height: 6px;
          border-radius: 3px;
          background: #ff6a03;
          left: 44%;
          margin-left: -25px;
        }
      }
    }
  }
  .tab-main {
    height: 500px;
    .tab-main-item {
      display: none;
      &.active {
        display: block;
      }
      .link {
        height: 94px;
        line-height: 94px;
        padding-left: 30px;
        font-size: 28px;
        color: #999;
        .last {
          color: #333;
        }
      }
      .form {
        margin-bottom: 20px;
        .form-row {
          display: flex;
          border-top: 1px solid #ebebeb;

          background: #fff;
          .form-item {
            flex: 1;
            text-align: center;
            padding: 20px 0;
            &::last-child {
              border-right: none;
            }
            .client-type {
              display: block;
              height: 44px;
              line-height: 44px;
              font-size: 24px;
              color: #999;
            }
            .client-num {
              display: block;
              height: 46px;
              line-height: 46px;
              font-size: 26px;
              color: #333;
              &.orange {
                color: #ff6a03;
              }
            }
          }
        }
      }
      .rank {
        margin-top: 20px;
        background: #fff;
        .rank-box {
          margin-bottom: 20px;
          display: flex;
          .rank-item {
            flex: 1;
            padding: 20px 0;
            text-align: center;
            &:last-child {
              border-right: none;
            }
            .client-type {
              display: block;
              height: 44px;
              line-height: 44px;
              font-size: 24px;
              color: #999;
            }
            .client-num {
              display: block;
              height: 46px;
              line-height: 46px;
              font-size: 26px;
              color: #333;
              &.orange {
                color: #ff6a03;
              }
            }
          }
        }
      }
      .form-title {
        position: relative;
        display: flex;
        height: 105px;
        padding: 0 30px;
        line-height: 105px;
        background: #fff;
        align-items: center;
        font-size: 28px;
        color: #333;
        font-weight: bold;

        .pc-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 60%;
        }

        .head-img {
          display: inline-block;
          flex: 0 0 56px;
          width: 56px;
          height: 56px;
          //   background: pink;
          margin-right: 28px;
          border-radius: 50%;
          overflow: hidden;
          .head-pic {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .icon-right_arrow {
          position: absolute;
          right: 10px;
          font-size: 45px;
          color: #666;
        }
      }
    }
  }
}

// 日期弹层 start
a:-webkit-any-link {
  //   color: transparent;
  display: inline-block;
  padding: 0;
  line-height: 60px;
  font-size: 30px;
  color: #ff6a03;
  text-decoration: none;
  font-weight: bold;
}
/deep/.vux-cell-value {
  color: #ff6a03 !important;
}
/deep/.weui-cell_access .weui-cell__ft:after {
  display: none !important;
}
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

  /deep/.vux-cell-primary {
    display: inline-block;
  }
  /deep/.vux-no-group-title {
    margin-top: 0;
    padding: 0 30px;
    line-height: 100px;
    font-size: @font-size-m;
    color: @color-minor;
  }

  /deep/.weui-cell {
    // display: inline-block;
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
// 日期弹层 end
</style>


