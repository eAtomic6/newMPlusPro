<template>
  <div class="main">
    <div class="top">
      <div class="person" @click="goRouter('/personalData')">
        <div class="photo">
          <img v-if="mine.headImg" :src="mine.headImg">
          <img v-else src="../assets/img/default.png">
        </div>
        <div class="msg iconfont">
          <p>{{mine.name?mine.name:''}}-{{mine.title}}</p>
          <p>{{mine.depName | limit}}</p>
          <p>{{mine.companyName | limit}}</p>
        </div>
      </div>
      <div class="performance">
        <div class="num" @click="goRouter('/dealList')">
          <span>{{count.totalDeal?count.totalDeal:0}}</span>
          <p>总成交单数</p>
        </div>
        <div class="num" @click="goRouter('/commissionList')">
          <span>{{count.totalCommission?count.totalCommission:0}}</span>
          <p>总成交佣金(元)</p>
        </div>
      </div>
      <div class="menu">
        <div class="mn" @click="goRouter('/servicelog')">
          <img src="../assets/img/service_record.png">
          <span>服务记录</span>
        </div>
        <!-- <div class="mn" @click="goTeamReport">
                    <img src="../assets/img/team_report.png">
                    <span>团队报表</span>
        </div>-->
        <div class="mn" @click="goRouter('/organization')">
          <img src="../assets/img/organ1.png">
          <span>组织架构</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <!-- B 4/24删除 -->
      <!-- <div class="list iconfont" @click="goRouter('/teamReport')">
        <img
          src="../assets/img/team_report.png"
          style="width: 7.067vw;height: 7.8vw;margin:3.5vw 2.667vw 0 3vw;"
        >
        <p>团队报表</p>
      </div> -->
      <!-- E 4/24删除 -->
      <div class="list iconfont" @click="goRouter('/uploadQR')">
        <img src="../assets/img/organ.png">
        <p>微信二维码</p>
      </div>
      <div class="list iconfont" @click="goRouter('/about')">
        <img src="../assets/img/about_us.png">
        <p>关于我们</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mine",
  data() {
    return {
      mine: {},
      count: {}
    };
  },
  methods: {
    //     goTeamReport(){
    //   this.$router.push('/teamReport')
    // },

    goRouter(path) {
      console.log(1234);
      console.log(path);
      switch (path) {
        // 跳转到个人信息
        case "/personalData":
          this.$router.push("/personalData");
          break;
        // 跳转到组织架构
        case "/organization":
          this.$router.push({
            path: "/organization",
            query: {
              depId: this.mine.depId,
              depName: this.mine.depName
            }
          });
          break;
        // 跳转到关于我们
        case "/about":
          this.$router.push("/about");
          break;
        // 跳转到服务记录
        case "/servicelog":
          this.$router.push("/servicelog");
          break;
        // 总成交单数
        case "/dealList":
          this.$router.push("/dealList");
          break;
        //总成交佣金
        case "/commissionList":
          this.$router.push("/commissionList");
          break;
        //微信二维码
        case "/uploadQR":
          this.$router.push("/uploadQR");
          break;
        //微信二维码
        case "/teamReport":
          this.$router.push("/teamReport");
          break;
      }
    },
    getCount() {
      this.$ajax
        .get("/api/personal/count")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.count = res.data;
            if (this.count.totalCommission) {
              this.count.totalCommission = this.count.totalCommission.toFixed(
                2
              );
            } else {
              this.count.totalCommission = 0;
            }
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    //此接口调用是为了刷新本地存储的个人信息，如pc端修改了所拥有的权限，app端要及时更新
    getMe() {
      this.$ajax
        .get("api/personal/me")
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.mine = res.data;
            localStorage.setItem("userMessage", JSON.stringify(res.data));
          }
        })
        .catch(err => {
          localStorage.setItem("userMessage", JSON.stringify({}));
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    }
  },
  created() {
    //this.mine = JSON.parse(localStorage.getItem('userMessage'))
    this.getCount();
    this.getMe();
  },
  filters: {
    limit: function(str) {
      if (str) {
        return str.length > 16 ? str.slice(0, 16) + "..." : str;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";
.main {
  padding: 0;
  background: @bg-ff;
  .top {
    //background: @bg-ff;
    padding-top: 59px;
    .person {
      width: 750px;
      height: 128px;
      //background-color: @bg-ff;
      .photo {
        float: left;
        width: 128px;
        height: 128px;
        border-radius: 50%;
        margin-left: 29px;
        margin-right: 37px;
        //background-color: skyblue;
        img {
          width: 128px;
          height: 128px;
          border-radius: 50%;
        }
      }
      .msg {
        position: relative;
        &:before {
          content: "\e60f";
          position: absolute;
          top: 30px;
          right: 30px;
          transform: rotate(180deg);
          font-size: @font-size-icon;
          color: @color-black;
        }
        p {
          height: 38px;
          line-height: 38px;
          font-size: 24px;
          color: @color-assist;
          &:first-child {
            height: 52px;
            line-height: 52px;
            font-size: 36px;
            color: @color-black;
            font-weight: bold;
          }
        }
      }
    }
    .performance {
      width: 690px;
      height: 180px;
      margin-top: 55px;
      margin-left: 30px;
      border-radius: 12px;
      display: flex;
      box-shadow: 0px 1px 8px 0px rgba(182, 182, 182, 0.46);
      .num {
        width: 345px;
        height: 180px;
        padding-top: 40px;
        text-align: center;
        //background-color: @bg-ff;
        box-sizing: border-box;
        span {
          color: @color-black;
          font-size: @font-size-xxl;
          font-weight: bold;
        }
        p {
          font-size: 26px;
          line-height: 51px;
          color: @color-minor;
        }
      }
    }
    .menu {
      margin-top: 53px;
      display: flex;
      width: 750px;
      height: 153px;
      border-top: 1px solid @border-ea;
      //background-color: @bg-ff;
      align-items: center;
      .mn {
        width: 50%;
        height: 73px;
        line-height: 73px;
        text-align: center;
        position: relative;
        &:last-child {
          border-left: 1px solid @border-ea;
        }
        span {
          font-size: @font-size-l;
          color: @color-black;
        }
        img {
          width: 75px;
          height: 75px;
          position: absolute;
          top: 50%;
          left: 30px;
          transform: translateY(-50%);
        }
      }
    }
  }
  .footer {
    margin-top: 20px;
    padding-left: 30px;
    padding-right: 30px;
    position: relative;
    &:before {
      content: "";
      width: 750px;
      height: 20px;
      background: @bg-f5;
      position: absolute;
      top: -20px;
      left: 0;
    }
    .list {
      height: 112px;
      line-height: 112px;
      border-bottom: 1px solid @border-ea;
      position: relative;
      &:before {
        content: "\e60f";
        position: absolute;
        top: 10px;
        right: -10px;
        transform: rotate(180deg);
        font-size: @font-size-xxl;
        color: @color-minor;
      }
      img {
        float: left;
        width: 38px;
        height: 36px;
        margin: 38px 20px 0 30px;
      }
      p {
        font-size: @font-size-m;
        //line-height: 100px;
      }
    }
  }
}
</style>
