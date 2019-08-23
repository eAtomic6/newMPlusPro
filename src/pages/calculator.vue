<template>
  <div class="container">
    <topbar :back="headerBack" :title="headerTitle" v-on:goBack="goBack"></topbar>
    <div class="main">
      <div class="calculator-views">
        <ul class="calculator-types">
          <li
            :class="[currentView===item.id?'active':'']"
            v-for="item in calculator"
            :key="item.id"
            @click="choseCalculator(item)"
          >{{item.name}}</li>
        </ul>
        <div class="calculator-context">
          <div class="input-group" v-show="currentView===1">
            <label>贷款总额</label>
            <p>
              <input class="input-info" type="number" placeholder="0" v-model="obj.val1">万
            </p>
          </div>
          <div class="input-group" v-show="currentView===3">
            <label>公积金贷款</label>
            <p>
              <input class="input-info" type="number" placeholder="0" v-model="obj.val2">万
            </p>
          </div>
          <div class="input-group" v-show="currentView===2||currentView===3" @click="getPop(2)">
            <label>公积金利率</label>
            <p>
              <span>{{publicReserveLoan}}</span>
              <i class="iconfont icon-bottom_arrow"></i>
            </p>
          </div>
          <div class="input-group" v-show="currentView===2||currentView===3">
            <label>商业贷款</label>
            <p>
              <input class="input-info" type="number" placeholder="0" v-model="obj.val4">万
            </p>
          </div>
          <div class="input-group" v-show="currentView===1||currentView===3" @click="getPop(1)">
            <label>商贷利率</label>
            <p>
              <span>{{commercialLoan}}</span>
              <i class="iconfont icon-bottom_arrow"></i>
            </p>
          </div>
          <div class="input-group" @click="getPop(3)">
            <label>贷款年限</label>
            <p>
              <span>{{yearText}}</span>
              <i class="iconfont icon-bottom_arrow"></i>
            </p>
          </div>
          <p class="submit-btn" @click="getReportData">提交</p>
        </div>
        <div class="calculator-result">
          <ul class="calculator-types">
            <li
              :class="[resultView===item.tip?'active':'']"
              v-for="item in resultTab"
              :key="item.id"
              @click="choseCalculator(item,'result')"
            >{{item.name}}</li>
          </ul>
          <div class="result-chart">
            <v-chart prevent-render @on-render="renderChart" class="coor">
              <div class="chart-guide">
                <span>月供</span>
                <span>{{money}}元</span>
              </div>
            </v-chart>
            <div class="chart-legend">
              <ul class="legend-list">
                <li v-for="item in data" :key="item.id">
                  <span>{{item.name}}:</span>
                  <span>{{item.money}}{{item.id===4?'元':'万'}}</span>
                </li>
                <li>首月后每月递减{{monthPayReduce|cutFormatter}}元</li>
              </ul>
            </div>
          </div>
          <p>*以上结果仅供参考</p>
        </div>
      </div>
    </div>
    <popup class="rate-modal" height="100%" v-show="modal">
      <topbar :title="modalTitle">
        <span slot="topbar-left" class="topbar-left cancel" @click="modal=false">取消</span>
        <span slot="topbar-right" class="topbar-right msg" @click="getInputRate">确定</span>
      </topbar>
      <div class="main">
        <div class="content" :class="[selectorType!==3?'':'input-defined-hidden']">
          <ul class="rate-list">
            <li v-for="item in getSelector" :key="item.id" @click="getLiData(item)">{{item.Text}}</li>
          </ul>
        </div>
        <p class="input-defined" v-if="selectorType!==3">
          <label>自定义利率</label>
          <input class="input-info" type="number" placeholder="0.00" v-model="rateInfo">%
        </p>
      </div>
    </popup>
  </div>
</template>

<script>
import {
  Popup,
  VChart,
  VLine,
  VArea,
  VTooltip,
  VLegend,
  VBar,
  VPie,
  VGuide,
  VScale
} from "vux";
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";

const colorMap = {
  贷款总额: "#FF9600",
  支付利息: "#FF5400",
  还款总额: "#D2D2D2",
  月均还款: "#D2D2D2"
};

export default {
  name: "calculator",
  mixins: [MIXINS],
  components: {
    topbar,
    Popup,
    VChart,
    VLine,
    VArea,
    VTooltip,
    VLegend,
    VBar,
    VPie,
    VGuide,
    VScale
  },
  data() {
    return {
      headerBack: true,
      cancelLeft: true,
      confirm: true,
      headerTitle: "房贷计算器",
      modalTitle: "商贷利率",
      calculator: [
        {
          id: 1,
          name: "商业贷款"
        },
        {
          id: 2,
          name: "公积金贷款"
        },
        {
          id: 3,
          name: "组合贷款"
        }
      ],
      resultTab: [
        {
          id: 1,
          name: "等额本息",
          tip: "Interest"
        },
        {
          id: 2,
          name: "等额本金",
          tip: "Money"
        }
      ],
      currentView: 1,
      resultView: "Interest",
      resultData: null,
      obj: {
        val1: "",
        val2: "",
        val3: "",
        val4: "",
        val5: "",
        val6: ""
      },
      rateInfo: 0,
      commercialLoan: "",
      publicReserveLoan: "",
      yearText: "",
      modal: false,
      rateList: null, //利率及年限选择汇总对象
      selectorType: 1, //1.商贷利率 2.公积金利率 3.贷款年限
      money: 0,
      gride: null,
      data: [
        { id: 1, name: "贷款总额", proportion: 0.6, a: "1", money: 0 },
        { id: 2, name: "支付利息", proportion: 0.4, a: "1", money: 0 },
        { id: 3, name: "还款总额", proportion: 0, a: "1", money: 0 },
        { id: 4, name: "月均还款", proportion: 0, a: "1", money: 0 }
      ],
      monthPayReduce: 0
    };
  },
  created() {
    this.getRateList();
  },
  methods: {
    renderChart({ chart }) {
      this.gride = chart;
      chart.source(this.data);
      chart.legend(false);
      chart.coord("polar", {
        transposed: true,
        // radius: 0.7,
        innerRadius: 0.7
      });
      chart.axis(false);
      chart
        .interval()
        .position("a*proportion")
        .color("name", function(val) {
          return colorMap[val];
        })
        .adjust("stack");

      chart.render();
    },
    choseCalculator: function(item, view = "form") {
      if (view === "result") {
        this.resultView = item.tip;
        if (!this.resultData) {
          return;
        }
        //重绘gride
        this.money = this.resultData[this.resultView].MonthlyMortgagePayment;
        this.monthPayReduce = this.resultData[this.resultView].MothlyDegression;
        this.data[0].money = `${
          this.resultData[this.resultView].LoanMoneyTotal
        }`;
        this.data[1].money = `${
          this.resultData[this.resultView].InterestTotal
        }`;
        this.data[2].money = `${
          this.resultData[this.resultView].PayMentTotalMoney
        }`;
        this.data[3].money = `${
          this.resultData[this.resultView].MonthlyMortgagePayment
        }`;
      } else {
        this.currentView = item.id;
        //重置表单数据
        for (let item in this.obj) {
          this.obj[item] = "";
        }
        this.commercialLoan = "";
        this.publicReserveLoan = "";
        this.yearText = "";
      }
    },
    getRate: function() {
      this.modal = false;
    },
    /**
     * 获取筛选信息
     */
    getPop: function(type) {
      this.modal = true;
      this.selectorType = type;
    },
    /**
     * 选择筛选项
     */
    getLiData: function(item) {
      if (this.selectorType === 1) {
        this.obj.val5 = item.Value;
        this.commercialLoan = item.Text;
      } else if (this.selectorType === 2) {
        this.obj.val3 = item.Value;
        this.publicReserveLoan = item.Text;
      } else if (this.selectorType === 3) {
        this.obj.val6 = item.Value;
        this.yearText = item.Text;
      }
      this.rateInfo = 0;
      this.modal = false;
    },
    /**
     * 获取下拉筛选列表
     */
    getRateList: function() {
      let param = {
        CityID: 1
      };
      param.md = this.getMD5(this.paramJoin(param));
      this.$ajax
        .post("/calculator/erp/Market/GetInterestRateList", param, "md")
        .then(res => {
          // debugger
          res = res.data;
          if (res.Code === 2000) {
            this.rateList = Object.assign({}, this.rateList, res.Data);
          }
        });
    },
    /**
     * 获取自定义利率
     */
    getInputRate: function() {
      this.modal = false;
      if (!this.rateInfo) {
        return;
      } else {
        if (this.selectorType === 1) {
          this.obj.val5 = this.rateInfo / 100;
          this.commercialLoan = `${this.rateInfo}%`;
        } else if (this.selectorType === 2) {
          this.obj.val3 = this.rateInfo / 100;
          this.publicReserveLoan = `${this.rateInfo}%`;
        }
      }
    },
    /**
     * 计算器结果
     */
    getReportData: function() {
      let param = {
        CityID: 1
      };
      if (this.currentView === 1 || this.currentView === 2) {
        param.LoanMoney = this.obj[this.currentView === 1 ? "val1" : "val4"];
        param.Rate = this.obj[this.currentView === 1 ? "val5" : "val3"];
        param.Year = this.obj.val6;
      } else {
        console.log(2);
        param.FundLoanMoney = this.obj.val2;
        param.FundRate = this.obj.val3;
        param.BusinessRate = this.obj.val5;
        param.BusinessLoanMoney = this.obj.val4;
        param.Year = this.obj.val6;
      }
      param.md = this.getMD5(this.paramJoin(param));
      this.noNull(param)
        .then(res => {
          this.$ajax
            .post(
              this.currentView === 3
                ? "/calculator/erp/Market/BusinessCombinationFund"
                : "/calculator/erp/Market/InterestDetail",
              param,
              "md"
            )
            .then(res => {
              res = res.data;
              if (res.Code === 2000) {
                this.resultData = res.Data;
                this.money = this.resultData[
                  this.resultView
                ].MonthlyMortgagePayment;
                this.monthPayReduce = this.resultData[
                  this.resultView
                ].MothlyDegression;
                this.data[0].money = `${
                  this.resultData[this.resultView].LoanMoneyTotal
                }`;
                this.data[1].money = `${
                  this.resultData[this.resultView].InterestTotal
                }`;
                this.data[2].money = `${
                  this.resultData[this.resultView].PayMentTotalMoney
                }`;
                this.data[3].money = `${
                  this.resultData[this.resultView].MonthlyMortgagePayment
                }`;
              }
            });
        })
        .catch(error => {
          this.$vux.toast.text("请填写完整信息", "middle");
        });
    },
    /**
     * 参数拼接
     */
    paramJoin: function(param) {
      let str = "";
      for (let item in param) {
        str += `${item}=${param[item]}&`;
      }
      let arr = str.split("&");
      arr.splice(arr.length - 1, 1);
      return arr.join("&");
    },
    /**
     * 数据加密
     */
    getMD5: function(str) {
      let paramStr = `data${str}secretE10ADC3949BA59ABBE56E057F20F883Z`;
      let secret = hex_md5(paramStr);
      return secret;
    }
  },
  computed: {
    getSelector: function() {
      if (!this.rateList) {
        return [];
      } else {
        switch (this.selectorType) {
          case 1:
            return this.rateList.CommercialInterestRateList;
            break;
          case 2:
            return this.rateList.AccumulationInterestRateList;
            break;
          case 3:
            return this.rateList.YearLoanEnumList;
            break;
        }
      }
    }
  },
  filters: {
    cutFormatter: function(val) {
      if (!val) {
        return 0;
      } else {
        debugger;
        let arr = val.toString().split(".");
        if (arr.length > 1 && arr[1].length > 2) {
          return `${arr[0]}.${arr[1].substr(0, 2)}`;
        } else {
          return val;
        }
      }
    }
  }
};
</script>

<style lang="less">
@import "~@/assets/CSS/config";

.calculator-views {
  background-color: @bg-ff;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.calculator-types {
  display: flex;
  border-bottom: 1px solid @border-eb;
  > li {
    flex: 1;
    padding: 32px 0px;
    text-align: center;
    &.active {
      position: relative;
      color: @color-green;
      &:after {
        content: "";
        width: 50px;
        border-top: 6px solid @color-green;
        position: absolute;
        left: 50%;
        bottom: 16px;
        transform: translateX(-50%);
      }
    }
  }
}

.calculator-context {
  padding: 0 30px 218px;
  .input-group {
    height: 100px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid @border-eb;
    position: relative;
    > p {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      color: @color-assist;
      @font-size-h3();
      > input {
        @font-size-h3();
        text-align: right;
        color: @color-main;
      }
      > span {
        color: @color-main;
      }
      > i {
        font-size: @font-size-icon-m;
      }
    }
  }
  .submit-btn {
    background-color: @color-green;
    border-radius: @border-radiaus;
    font-size: @font-size-xl;
    color: @color-white;
    text-align: center;
    padding: 29px 0;
    margin-top: 40px;
  }
}

.calculator-result {
  position: relative;
  &:before {
    content: "";
    width: 100%;
    height: 20px;
    background-color: @bg-f5;
    display: block;
  }
  .result-chart {
    display: flex;
    align-items: center;
    .coor {
      flex: 1;
      max-width: 400px;
      position: relative;
      > canvas {
        width: 100% !important;
        height: 100% !important;
      }
      .chart-guide {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
    .chart-legend {
      .legend-list {
        > li {
          display: flex;
          align-items: center;
          &:before {
            content: "";
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: @bg-D2;
            margin-right: 20px;
          }
          &:first-of-type {
            &:before {
              background-color: @color-orange;
            }
          }
          &:nth-of-type(2) {
            &:before {
              background-color: @color-grey;
            }
          }
          &:last-of-type {
            color: @color-assist;
            &:before {
              background-color: transparent;
            }
          }
          > span {
            &:last-of-type {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
  > p {
    text-align: center;
    color: @color-assist;
    font-size: @font-size-s;
  }
}

.rate-modal {
  .main {
    background-color: @bg-ff;
    position: relative;
  }
  .content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 120px;
  }
  .rate-list {
    padding: 0 30px;
    > li {
      height: 90px;
      border-bottom: 1px solid @border-eb;
      display: flex;
      align-items: center;
    }
  }
  .input-defined {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 120px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    > input {
      display: block;
      margin: 0 12px 0 20px;
      background-color: @bg-f5;
      padding: 20px 30px;
    }
  }
  .input-defined-hidden {
    bottom: 0;
  }
}
</style>
