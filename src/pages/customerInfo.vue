<template>
  <div class="info container" :class="infoClass ?'info-class':''">
    <topbar :back="back" :title="title" @goBack="goBack" ref="topRef">
      <template slot="topbar-right">
        <span class="topbar-right" v-if="getTypeInfo">
          <span
            class="iconfont"
            v-if="getTypeLock"
            :class="data.lock_state ? 'icon-locking':'icon-unlocking'"
            @click="lockFn"
          ></span>
          <span class="iconfont icon-qr_code" @click="codeRightFn"></span>
        </span>
      </template>
    </topbar>
    <div class="info-record info-record-fixed" v-show="showTab">
      <ul class="info-tab-tit">
        <li
          :class="tabRecordIndex === 0 ?'on':''"
          @click="tabRecordFn(0)"
        >跟进记录({{dataList.follows.total}})</li>
        <li
          :class="tabRecordIndex === 1 ?'on':''"
          @click="tabRecordFn(1)"
        >报备记录({{dataList.reports.total}})</li>
        <li
          :class="tabRecordIndex === 2 ?'on':''"
          @click="tabRecordFn(2)"
        >带看记录({{dataList.looks.total}})</li>
      </ul>
    </div>
    <div :class="getBottomBoolean?'info-scroll':'info-scroll-com'" ref="wrapper">
      <div>
        <div class="top-bj">
          <div class="top-tip iconfont icon-detail_notice" v-if="data.flag">
            客户{{data.name|maxLen(5)}}（{{topSetPhone}}）将在
            <span class="rest-time">{{data.hour}}h</span>后掉公
          </div>
          <div class="info-top-box">
            <div class="info-top-left">{{surname}}</div>
            <div class="info-centent">
              <p class="p1">{{data.name | limit}}</p>
              <p class="p2">{{data.c_no}}</p>
            </div>
            <div
              class="info-top-right"
              v-if="getTypeLock"
              :class="data.lock_state?'':'info-top-right-bj'"
              @click="lockFn"
            >
              <span class="iconfont" :class="data.lock_state?'icon-locking':'icon-unlocking'"></span>
              {{data.lock_state?"已锁定":"已解锁"}}
            </div>
          </div>
        </div>
        <div class="info-bj" ref="centerChangeRef">
          <ul class="info-nav">
            <li>
              <p class="p1">{{data.level}}</p>
              <p class="p2">级别</p>
            </li>
            <li>
              <p class="p1">{{data.state}}</p>
              <p class="p2">状态</p>
            </li>
            <li>
              <p class="p1">{{data.source}}</p>
              <p class="p2">来源</p>
            </li>
          </ul>
          <ul class="info-explain">
            <li class="info-explain-li">
              <span class="info-explain-tit">意向项目:</span>
              {{getNoDataFn(data.b_name)}}
            </li>
            <li>
              <span class="info-explain-tit">价格区间:</span>
              {{getNoDataFn(data.house_price)}}
            </li>
            <li>
              <span class="info-explain-tit">面积区间:</span>
              {{getNoDataFn(data.house_acreage)}}
            </li>
            <li>
              <span class="info-explain-tit">意向户型:</span>
              {{getNoDataFn(data.house_type)}}
            </li>
            <li>
              <span class="info-explain-tit">所属片区:</span>
              {{getNoDataFn(data.district_name)}}
            </li>
            <li>
              <span class="info-explain-tit">购房意愿:</span>
              {{getNoDataFn(data.house_intent)}}
            </li>
            <li>
              <span class="info-explain-tit">购房目的:</span>
              {{getNoDataFn(data.house_reason)}}
            </li>
            <li>
              <span class="info-explain-tit">居住人数:</span>
              {{getNoDataFn(data.people_count)}}
            </li>
            <li class="info-explain-li break">
              <span class="info-explain-tit">客户备注:</span>
              {{getNoDataFn(data.remark)}}
            </li>
          </ul>
        </div>
        <div class="info-bj mt-20">
          <p class="info-tit">联系方式</p>
          <ul class="info-phone-ul">
            <li v-for="(item,index) in data.mobiles" :key="item.linkman_name + index">
              <div>
                <p class="p1">{{item.linkman_name}}（{{item.relation_id}}）</p>
                <p class="p2">
                  {{setPhone(item.linkman_phone,index)}}
                  <span
                    class="iconfont icon-eye"
                    :class="infoPhoneListFn(index) ? 'icon-eye_invisible' : 'icon-eye_visible'"
                    v-if="customerPhone"
                    @click="showPhoneFn(index)"
                  ></span>
                </p>
              </div>
              <div class="info-phone-call" v-if="customerPhone" @click="callPhoneFn(item)">
                <span class="iconfont icon-phone"></span>拨打电话
              </div>
            </li>
          </ul>
        </div>
        <div class="info-bj mt-20">
          <ul class="info-tab-tit">
            <li
              v-for="(item,index) in tabList.tit"
              :class="tabList.index === index?'on':''"
              :key="item"
              @click="tabClickFn(index,'tabList')"
            >{{item}}</li>
          </ul>
          <ul
            class="info-tab-explain"
            v-for="(items,index) in tabList.explain"
            :key="index"
            v-show="tabList.index === index"
          >
            <li v-for="(item,index) in items" :key="index">
              <p class="p1">{{item.name}}</p>
              <p class="p2">{{item.time}}</p>
            </li>
          </ul>
        </div>
        <div class="info-bj mt-20">
          <p class="info-tit">跟进进度</p>
          <ul class="info-progress-bar">
            <li
              v-for="item in progressBarList"
              :key="item.name"
              :class="progressClassFn(item.number)"
            >
              <div class="round"></div>
              <div class="line"></div>
              <p class="p1">{{item.name}}</p>
            </li>
          </ul>
          <div class="info-record" ref="bottomChangeRef">
            <ul class="info-tab-tit">
              <li
                :class="tabRecordIndex === 0 ?'on':''"
                @click="tabRecordFn(0)"
              >跟进记录({{dataList.follows.total}})</li>
              <li
                :class="tabRecordIndex === 1 ?'on':''"
                @click="tabRecordFn(1)"
              >报备记录({{dataList.reports.total}})</li>
              <li
                :class="tabRecordIndex === 2 ?'on':''"
                @click="tabRecordFn(2)"
              >带看记录({{dataList.looks.total}})</li>
            </ul>
          </div>
          <ul class="record-follow">
            <li v-show="tabRecordIndex === 0">
              <!-- dataList.follows.list -->
              <template v-if="dataList.follows.total > 0">
                <follow-list :list="dataList.follows.list">
                  <template slot="li-left" slot-scope="item">
                    <img :src="getImgUrl(item.li.head_img)" class="follow-img">
                  </template>
                  <template slot="li-right-title" slot-scope="item">
                    <span class="pc-name">{{item.li.pc_name}}({{item.li.pc_dep_name}})</span>
                    <span>{{item.li.type == 1?'跟进':'抢客'}}-{{item.li.follow_type}}—{{item.li.reason_type}}</span>
                  </template>
                  <template slot="li-right-content" slot-scope="item">
                    <p class="word">{{item.li.follow_reason}}</p>
                  </template>
                  <template slot="li-right-footer" slot-scope="item">
                    <span class="desc-footer-right">{{item.li.create_time}}</span>
                  </template>
                </follow-list>
                <div class="bottom-tip" v-if="dataList.follows.total > toal">
                  <span class="loading-hook">{{dataList.bottomTxt[0]}}</span>
                </div>
              </template>
              <div class="no-data" v-else>
                <span>暂无跟进记录</span>
              </div>
            </li>
            <li v-show="tabRecordIndex === 1">
              <template v-if="dataList.reports.total > 0">
                <customer-info-list :list="dataList.reports.list"></customer-info-list>
                <div class="bottom-tip" v-if="dataList.reports.total > toal">
                  <span class="loading-hook">{{dataList.bottomTxt[1]}}</span>
                </div>
              </template>
              <div class="no-data" v-else>
                <span>暂无报备记录</span>
              </div>
            </li>
            <li v-show="tabRecordIndex === 2">
              <template v-if="dataList.looks.total > 0">
                <customer-info-list :list="dataList.looks.list" txtprops="带看"></customer-info-list>
                <div class="bottom-tip" v-if="dataList.looks.total > toal">
                  <span class="loading-hook">{{dataList.bottomTxt[2]}}</span>
                </div>
              </template>
              <div class="no-data" v-else>
                <span>暂无带看记录</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template v-if="getBottomBoolean">
      <div class="own-fixed" v-if="getTypeInfo">
        <ul class="ul">
          <li @click="addRouterPushFn" v-if="isEdit">
            <p>
              <span class="iconfont icon-edit_client"></span>
            </p>
            <p class="po-r">编辑</p>
          </li>
          <li @click="routerPushFn('customerWidthSee')">
            <p>
              <span class="iconfont icon-guide_client"></span>
            </p>
            <p class="po-r">带看</p>
          </li>
          <li @click="routerPushFn('customerReported')">
            <p>
              <span class="iconfont icon-record_client"></span>
            </p>
            <p class="po-r">报备</p>
          </li>
        </ul>
        <div class="right" @click="routerPushFn('customerFollowUp')">写跟进</div>
      </div>
      <ul class="com-fixed" v-else>
        <li @click="routerPushFn('customerFollowUp')">写跟进</li>
        <li @click="routerPushFn('customerRob')">抢入名下</li>
      </ul>
    </template>
    <x-dialog v-model="layerEWM" class="dialog-ewm">
      <div class="dialog-bj">
        <p class="p1">{{data.name}}</p>
        <p class="p2">{{topSetPhone}}</p>
        <div class="img">
          <img :src="layerCodeUrl">
        </div>
      </div>
      <div class="dialog-icon" @click="layerEWM=false">
        <span class="iconfont icon-exit"></span>
      </div>
    </x-dialog>
    <!-- 确定取消弹层 -->
    <confirm v-model="layerLock" title="解除锁定" class="dialog-confirm" @on-confirm="layerLockFn">
      <p>您确定要解除该客户的锁定吗！解锁后其他置业顾问可以抢入名下哦！</p>
    </confirm>
    <!-- 确定取消弹层 -->
    <confirm
      v-model="layerPhone.show"
      :title="layerPhone.tit"
      confirm-text="立即拨号"
      class="dialog-confirm layer-phone"
      @on-confirm="layerPhoneFn"
    >
      <p>{{layerPhone.name}}</p>
    </confirm>
    <!-- 加载中 -->
    <loading :show="loadingBoolean" text="加载中" class="customer-loading"></loading>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import { SCROLL } from "@/assets/JS/scroll";
import followList from "@/components/followList";
import customerInfoList from "@/pages/customerInfoList";
import { XDialog, Confirm, Loading } from "vux";
import QRCode from "qrcode";
import { mapMutations } from "vuex";

const imgUrl = require("@/assets/img/customer-default.png");

export default {
  name: "ownCustomerList",
  mixins: [MIXINS, SCROLL, FILTERS],
  components: {
    topbar,
    followList,
    customerInfoList,
    XDialog,
    Confirm,
    Loading
  },
  data() {
    return {
      // 头部导航
      back: true,
      title: "客户详情",
      rightTool: true,
      codeRight: true,
      // 数据
      infoPhoneList: [],
      tabList: {
        tit: [],
        explain: [],
        index: 0
      },
      progressBarList: [
        {
          name: "暂无数据",
          number: 0
        }
      ],
      tabRecordIndex: 0,
      // 二维码弹层
      layerEWM: false,
      layerCodeUrl: "",
      // 确定取消弹层
      layerLock: false,
      // 滚动
      infoClass: false,
      showTab: false,
      // 数据
      data: {
        customer_type: 2
      },
      // 列表数据
      dataList: {
        follows: {
          total: 0,
          list: []
        },
        looks: {
          total: 0,
          list: []
        },
        reports: {
          total: 0,
          list: []
        },
        bottomTxt: ["查看更多", "查看更多", "查看更多"]
      },
      // 加载中
      loadingBoolean: false,
      toal: 20,
      // 拨打电话弹层
      layerPhone: {
        show: false,
        tit: "",
        name: "",
        phone: ""
      }
    };
  },
  computed: {
    // 保留姓氏
    surname() {
      let name = `${this.data.name}`.slice(0, 1);
      return name;
    },
    // id
    cID() {
      const id = "";
      const cid = this.$route.query.c_id;
      if (!!cid) {
        return cid;
      }
      return id;
    },
    // 是否显示编辑按钮
    isEdit() {
      if (this.data.type == 3) {
        return false;
      } else {
        return true;
      }
    },
    // 是否从服务记录进入
    cPhone() {
      const cid = this.$route.query.c_phone;
      if (!!cid) {
        return cid;
      }
      return 0;
    },
    customerPhone() {
      if (this.data.mobiles_islook) {
        return true;
      } else {
        return false;
      }
    },
    getBottomBoolean() {
      if (this.data.customer_type === 2) {
        return false;
      }
      return true;
    },
    getTypeInfo() {
      if (this.data.customer_type === 1) {
        return true;
      }
      return false;
    },
    getTypeLock() {
      if (this.getTypeInfo && this.data.type == 1) {
        return true;
      } else {
        return false;
      }
    },
    setScrollTop() {
      let b = this.$refs.centerChangeRef.offsetTop;
      let c = this.$refs.bottomChangeRef.offsetTop;
      let hei = this.$refs.topRef.$el.clientHeight;
      return [hei, b, c];
    },
    // 设置电话
    topSetPhone() {
      let p = `${this.data.phone}`;
      return `${p.slice(0, 3)}****${p.slice(-4)}`;
    }
  },
  methods: {
    ...mapMutations(["changeStoreShowpopup"]),
    goBack() {
      this.changeStoreShowpopup(3);
      this.$store.commit("changeCheck", false);
      this.$router.go(-1);
    },
    // 二维码
    codeRightFn() {
      this.layerEWM = true;
      // 生成二维码url
      QRCode.toDataURL(
        `https://newhousesys.jjw.com/download/index.html?id=${this.cID}`
      )
        .then(url => {
          this.layerCodeUrl = url;
        })
        .catch(err => {
          this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // 锁定切换
    lockFn() {
      if (this.data.lock_state) {
        // 锁定状态
        // 提示弹层
        this.layerLock = true;
      } else {
        // 未锁定状态

        // 加载中
        this.loadingBoolean = true;
        // 提交数据
        let pos = new FormData();
        pos.append("customerId", this.cID);
        this.$axios
          .post("/api/customer/lock", pos)
          .then(res => {
            // 隐藏加载中
            this.loadingBoolean = false;
            if (res.data.status === 200) {
              this.data.lock_state = true;
            }
            this.tips(res.data.message);
          })
          .catch(err => {
            this.loadingBoolean = false;
            this.tips(this.$error[err.response.status]);
          });
      }
    },
    tips(txt) {
      this.$vux.toast.text(txt, "middle");
    },
    layerLockFn() {
      // 加载中
      this.loadingBoolean = true;
      this.$ajax
        .get("/api/customer/unlock", {
          customerId: this.cID
        })
        .then(res => {
          res = res.data;
          this.loadingBoolean = false;
          if (res.status === 200) {
            // 点击确定解除锁定
            this.tips("该用户已成功解除锁定");
            //提示
            this.data.lock_state = false;
          }
          if (res.message) {
            this.tips(res.message);
          }
        })
        .catch(err => {
          this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // 手机号处理
    setPhone(t, i) {
      let p = `${t}`;
      if (this.infoPhoneList[i]) {
        return `${p.slice(0, 3)}****${p.slice(-4)}`;
      } else {
        return p;
      }
    },
    // 手机号显示
    infoPhoneListFn(index) {
      return this.infoPhoneList[index];
    },
    // 显示电话号码
    showPhoneFn(index) {
      this.$set(this.infoPhoneList, index, !this.infoPhoneList[index]);
    },
    // 拨打电话
    callPhoneFn(num) {
      let j = {};
      let p = `${num.linkman_phone}`;
      j.phone = num.linkman_phone;
      j.show = true;
      j.tit = `是否呼叫${num.linkman_name}`;
      j.name = `${p.slice(0, 3)}-${p.slice(3, 7)}-${p.slice(-4)}`;
      this.layerPhone = j;
    },
    // 拨打电话弹层
    layerPhoneFn() {
      window.location.href = `tel:${this.layerPhone.phone}`;
    },
    // 返回暂无需求
    getNoDataFn(item) {
      if (item === "" || item == undefined) {
        return "暂无需求";
      } else {
        return item;
      }
    },
    // tab切换
    tabClickFn(index, tab) {
      this[tab].index = index;
    },
    tabRecordFn(index) {
      this.tabRecordIndex = index;
      setTimeout(() => {
        this._topScrollFn(-this.scroll.y);
        this.scroll.refresh();
      }, 100);
    },
    // 跳转链接
    routerPushFn(src) {
      this.changeStoreCID(this.cID);
      this.changeStorePID("");
      this.changeStoreCNmae("");
      this.$router.push({ path: `/${src}` });
    },
    addRouterPushFn() {
      this.changeStoreCID(this.cID);
      this.changeStorePID("");
      this.changeStoreCNmae("");
      this.$router.push({
        path: "/addCus",
        query: {
          title: "编辑客户"
        }
      });
    },
    // 转换
    nameChangeFn(index) {
      switch (index) {
        case 0:
          return "follows";
          break;
        case 1:
          return "looks";
          break;
        case 2:
          return "reports";
          break;
      }
    },
    // 进度条类名
    progressClassFn(index) {
      switch (index) {
        case 0:
          return "off";
          break;
        case 1:
          return "on";
          break;
        default:
          return "";
      }
    },
    // 默认图片
    getImgUrl(url = imgUrl) {
      if (url !== "") {
        return url;
      }
      return imgUrl;
    },
    // 获取数据
    getData() {
      /***
       * 4、图片链接字段
       */
      this.$ajax
        .get("/api/prc/customer", {
          customerId: this.cID
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.data = res.data;
            // 跟进进度
            this._initFollow(res.data.progress);
            // 录入人
            this._initEntry(res.data);
            // 显示电话
            let numberVar = res.data.mobiles.length;
            for (let i = 0; i < numberVar; i++) {
              this.infoPhoneList[i] = true;
            }
          }
        })
        .catch(err => {
          this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // 获取列表数据
    getDataList() {
      this.$ajax
        .get("/api/records/default", {
          customerId: this.cID,
          pageNum: 1,
          pageSize: this.toal
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            Object.assign(this.dataList, res.data);
          }
        })
        .catch(err => {
          this.loadingBoolean = false;
          this.tips(this.$error[err.response.status]);
        });
    },
    // 下拉加载
    _initPullUp() {
      this.scroll.on("pullingUp", () => {
        let name = this.nameChangeFn(this.tabRecordIndex);
        if (!this.dataList[name].hasNextPage) {
          // this.tips('已经到达底部了')
          this.$set(this.dataList.bottomTxt, this.tabRecordIndex, "没有了");
        } else {
          this.$set(this.dataList.bottomTxt, this.tabRecordIndex, "加载中...");
          this.$ajax
            .get("/api/records", {
              customerId: this.cID,
              type: this.tabRecordIndex,
              pageNum: this.dataList[name].pageNum + 1,
              pageSize: this.dataList[name].pageSize
            })
            .then(res => {
              res = res.data;
              if (res.status === 200) {
                this.$set(
                  this.dataList.bottomTxt,
                  this.tabRecordIndex,
                  "查看更多"
                );
                Object.assign(this.dataList[name], res.data, {
                  list: [...this.dataList[name].list, ...res.data.list]
                });
              }
            })
            .catch(err => {
              this.loadingBoolean = false;
              this.tips(this.$error[err.response.status]);
            });
        }

        // 请求数据
        this.scroll.finishPullUp();
        this.scroll.refresh();
      });
    },
    //自定义滚动事件
    _initDiyFn() {
      this.scroll.on("scroll", pos => {
        if (pos.y > 0) {
          this.scroll.scrollTo(0, 0, 0);
        }
        this._topScrollFn(-pos.y);
      });
    },
    _topScrollFn(y) {
      let heightCenter = this.setScrollTop[1] - this.setScrollTop[0];
      let heightBottom = this.setScrollTop[2] - this.setScrollTop[0];
      if (y > heightCenter) {
        this.infoClass = true;
        this.title = this.data.name;
      } else {
        this.infoClass = false;
        this.title = "客户详情";
      }
      if (y > heightBottom) {
        this.showTab = true;
      } else {
        this.showTab = false;
      }
    },
    // 跟进进度
    _initFollow(res) {
      let arr = res.slice(0);
      let arr2 = [];
      for (let [index, elem] of arr.entries()) {
        if (elem.view) {
          elem.number = 0;
          arr2.push(index);
        } else {
          elem.number = 2;
        }
      }
      // 去掉中间状态
      // arr[arr2.pop()].number = 1;
      this.progressBarList = arr;
    },
    // 录入人
    _initEntry(res) {
      console.log(6666);
      console.log(res);
      let jsonData = {
        tit: [],
        explain: []
      };
      if (res.type === 3) {
        //debugger //xu
        // 代表联动
        if (res.creator_name) {
          // debugger
          jsonData.tit.push("转入人");
          let name = `${res.creator_name}(${res.creator_dep_name})`;
          let time = res.create_time;
          jsonData.explain.push([
            {
              name,
              time
            }
          ]);
        }
        if (res.linkmans.length !== 0) {
          jsonData.tit.push("联动专员");
          let arr = [];
          res.linkmans.forEach(e => {
            let obj = {
              name: `${e.name}(${e.dep})`,
              time: res.create_time
            };
            arr.push(obj);
            /*arr.name = `${e.name}(${e.dep})`
                            arr.time = res.create_time*/
          });
          jsonData.explain.push(arr);
        }
      } else {
        if (res.creator_name !== "") {
          jsonData.tit.push("录入人");
          let name = `${res.creator_name}(${res.creator_dep_name})`;
          let time = res.create_time;
          jsonData.explain.push([
            {
              name,
              time
            }
          ]);
        }
        if (res.owner_name !== "") {
          jsonData.tit.push("维护人");
          let name = `${res.owner_name}(${res.owner_dep_name})`;
          let time = res.lock_start_time;
          jsonData.explain.push([
            {
              name,
              time
            }
          ]);
        }

        // 公客
        if (res.public_guest !== "" && res.public_guest) {
          jsonData.tit.push("公客池");
          let name = res.public_guest == 1 ? "公司公客池" : "部门公客池";
          // let name = `${res.owner_name}(${res.owner_dep_name})`;
          let time = res.pubile_lock_time;
          jsonData.explain.push([
            {
              name,
              time
            }
          ]);
        }
      }
      Object.assign(this.tabList, jsonData);
    },
    // vuex
    ...mapMutations(["changeStoreCID", "changeStorePID", "changeStoreCNmae"])
  },
  mounted() {
    // 获取数据
    this.getData();
    this.getDataList();
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

.break {
  word-break: break-all;
  word-wrap: break-word;
}

.mt-20 {
  margin-top: 20px;
}

.bd-bm {
  border-bottom: 1px solid @border-eb;
}

.no-data {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}

.info {
  // padding-bottom: 100px;

  // 滚动
  .info-scroll {
    position: absolute;
    top: 0;
    bottom: 100px;
    overflow: hidden;
  }

  .info-scroll-com {
    .info-scroll;
    bottom: 0;
  }

  // 头部
  /deep/.topbar {
    background-color: transparent;
    color: #fff;

    .iconfont {
      font-size: @font-size-icon;
    }

    .icon-locking {
      display: none;
    }

    .icon-unlocking {
      .icon-locking;
    }
  }

  .top-bj {
    background: url("../assets/img/customer-info-bj.png") no-repeat 0 -50px;
    background-size: cover;
    height: 320px;
    color: @color-white;
    padding-top: 140px;
    box-sizing: border-box;
    position: relative;
    .top-tip {
      position: absolute;
      text-align: center;
      width: 100%;
      line-height: 50px;
      height: 50px;
      color: #db7c30;
      background-color: #ffefd9;
      left: 0;
      top: 70px;
      font-size: 29px;
      .rest-time {
        font-size: 36px;
        font-weight: bold;
      }
    }
  }

  .info-top-box {
    padding: 0 30px;
    overflow: hidden;
    position: relative;

    .info-top-left {
      float: left;
      width: 120px;
      height: 120px;
      position: relative;
      border-radius: 50%;
      overflow: hidden;
      text-align: center;
      line-height: 120px;
      font-size: @font-size-icon;
      background-color: @color-base;
      margin-right: 30px;

      &::before {
        border: 4px solid @color-white;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        content: "";
      }
    }

    .info-top-right {
      position: absolute;
      top: 50%;
      right: 28px;
      width: 190px;
      line-height: 64px;
      height: 64px;
      margin-top: -32px;
      background-color: @color-orange;
      border-radius: 32px;
      color: @color-white;
      font-size: @font-size-m;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .info-top-right-bj {
      background-color: @color-green;
    }

    .iconfont {
      font-size: @font-size-icon-m;
      margin-right: 10px;
    }

    .info-centent {
      float: left;
      width: 340px;

      & > .p1 {
        font-size: 4.5vw;
      }

      & > .p2 {
        font-size: @font-size-m;
        padding-top: 14px;
      }
    }
  }

  // 背景色
  .info-bj {
    background-color: @color-white;
  }

  // 三个导航
  .info-nav {
    margin: 0 30px;
    background-color: @color-white;
    padding: 36px 0;
    display: flex;
    justify-content: space-around;
    border-radius: 6px;
    box-shadow: 0 0 20px #cedfc0;
    position: relative;
    top: -30px;

    & > li {
      text-align: center;
      width: 33.33%;

      & > .p1 {
        font-size: 38px;
        line-height: 50px;
        height: 50px;
        color: @color-main;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & > .p2 {
        padding-top: 20px;
        font-size: 24px;
        color: @color-assist;
      }
    }
  }

  //说明
  .info-explain {
    font-size: @font-size-m;
    padding: 0 30px;
    overflow: hidden;

    > li {
      position: relative;
      padding-left: 140px;
      color: @color-main;
      line-height: 52px;
      float: left;
      width: 50%;
      margin-bottom: 20px;
      box-sizing: border-box;

      > .info-explain-tit {
        position: absolute;
        left: 0;
        color: @color-assist;
      }
    }

    .info-explain-li {
      width: 100%;
    }
  }

  // 标题
  .info-tit {
    font-size: @font-size-xxl;
    font-weight: bold;
    padding: 40px 30px;
    .bd-bm;
  }

  // 联系方式
  .info-phone-ul {
    padding: 0 30px;

    > li {
      .bd-bm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px 0;
    }

    > li:last-child {
      border-bottom: 0;
    }

    .p1 {
      font-size: @font-size-m;
      font-weight: bold;
    }

    .p2 {
      display: flex;
      align-items: center;
      font-size: @font-size-m;
      padding-top: 10px;
    }

    .icon-eye {
      font-size: 50px;
      margin-left: 30px;
      color: @color-green;
    }

    .info-phone-call {
      padding: 0 20px;
      height: 56px;
      box-sizing: border-box;
      border: 2px solid @color-green;
      color: @color-green;
      font-size: @font-size-s;
      border-radius: 10px;
      display: flex;
      align-items: center;

      .icon-phone {
        font-size: @font-size-icon-m;
        margin-right: 6px;
      }
    }
  }

  // tab切换标题
  .info-tab-tit {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid @border-eb;
    padding: 30px 0;

    > li {
      padding: 10px 0 16px;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 50px;
        height: 6px;
        background-color: @color-white;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        border-radius: 3px;
      }
    }

    > .on {
      color: @color-green;

      &::before {
        background-color: @color-green;
      }
    }
  }

  // tab 切换内容
  .info-tab-explain {
    padding: 0 30px;

    > li {
      padding: 40px 0;

      > .p1 {
        font-size: @font-size-m;
      }

      .p2 {
        font-size: @font-size-s;
        color: @color-assist;
        padding-top: 24px;
      }
    }
  }

  // 进度条
  .info-progress-bar {
    display: flex;
    justify-content: space-around;
    margin: 0 30px;
    border-bottom: 1px solid @border-eb;
    padding: 40px 0;

    > li {
      flex-grow: 1;
      text-align: center;
      position: relative;

      > .round {
        width: 30px;
        height: 30px;
        background-color: @bg-ddd;
        border-radius: 30px;
        margin: auto;
        position: relative;
        z-index: 1;

        &::before {
          content: "";
          position: absolute;
          left: 2px;
          top: 2px;
          bottom: 2px;
          right: 2px;
          background-color: @bg-ddd;
          border-radius: 30px;
        }
      }

      > .line {
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 14px;
          width: 50%;
          height: 2px;
          background-color: @border-eb;
        }

        &::after {
          content: "";
          position: absolute;
          right: 0;
          top: 14px;
          width: 50%;
          height: 2px;
          background-color: @border-eb;
        }
      }

      > .p1 {
        font-size: @font-size-s;
        color: @color-assist;
        padding-top: 20px;
      }
    }

    > li:first-child {
      > .line::before {
        background-color: transparent;
      }
    }

    > li:last-child {
      > .line::after {
        background-color: transparent;
      }
    }

    > .off {
      > .round {
        background-color: @color-green;

        &::before {
          background-color: @color-green;
        }
      }

      > .line {
        &::before {
          background-color: @color-green;
        }

        &::after {
          background-color: @color-green;
        }
      }

      > .p1 {
        color: @color-main;
      }
    }

    > .on {
      > .round {
        background-color: @color-green;

        &::before {
          background-color: @color-white;
        }
      }

      > .line {
        &::before {
          background-color: @color-green;
        }

        &::after {
          background-color: @border-eb;
        }
      }

      > .p1 {
        color: @color-green;
      }
    }
  }

  // 记录切换
  .info-record {
    margin: 0 30px;
  }

  .info-record-fixed {
    margin: 0;
    position: fixed;
    left: 0;
    right: 0;
    top: 80px;
    z-index: 1;
    background-color: @bg-ff;

    .info-tab-tit {
      padding-left: 30px;
      padding-right: 30px;
    }
  }

  .record-follow {
    /deep/.data-list {
      .follow-img {
        background-image: url(../assets/img/customer-default.png);
        background-size: 88px auto;
      }

      .pc-name {
        display: inline-block;
        width: 370px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & > li .list-item-desc > p {
        &.desc-title {
          // padding-right: @font-size-s *3;
          position: relative;
          line-height: 40px;

          & > span:last-of-type {
            color: @color-assist;
            font-size: @font-size-s;
            // position: absolute;
            // right: 0;
            // top: 0;
            // text-align: right;
          }
        }

        &:nth-of-type(2) {
          font-size: @font-size-sm;
          color: @color-minor;
        }
      }
    }
  }

  // 私客详情底部
  .own-fixed {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: @bg-ff;
    z-index: 2;
    display: flex;
    justify-content: flex-end;

    .right {
      width: 300px;
      height: 100px;
      background-color: @color-green;
      color: @color-white;
      line-height: 100px;
      text-align: center;
      font-size: @font-size-xl;
    }

    .iconfont {
      font-size: @font-size-icon;
    }

    .ul {
      display: flex;
      justify-content: space-around;
      position: absolute;
      left: 0;
      right: 300px;
      top: 0;
      font-size: 20px;
      text-align: center;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background-color: @border-eb;
      }

      .po-r {
        position: relative;
        top: -4px;
      }
    }
  }

  .com-fixed {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    line-height: 100px;
    height: 100px;
    text-align: center;
    background-color: @color-green;
    font-size: @font-size-xl;
    color: @color-white;

    > li {
      flex-grow: 1;

      &:first-child {
        background-color: @color-orange;
      }
    }
  }

  // 拨打电话弹层
  .layer-phone {
    /deep/.weui-dialog {
      .weui-dialog__title {
        font-weight: normal;
      }

      .weui-dialog__bd {
        text-align: center;
        font-weight: bold;
      }
    }
  }
}

.info-class {
  /deep/.topbar {
    background-color: @bg-ff;
    color: @color-main;

    .icon-locking {
      display: inline-block;
    }

    .icon-unlocking {
      .icon-locking;
    }
  }
}

// 二维码弹层
.dialog-ewm {
  /deep/.weui-dialog {
    background-color: transparent;
  }

  /deep/.dialog-bj {
    background-color: @bg-ff;

    .p1 {
      font-size: 36px;
      padding-top: 60px;
    }

    .p2 {
      font-size: 28px;
      padding-top: 24px;
    }

    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 340px;
      padding-bottom: 30px;

      > img {
        height: 100%;
        display: block;
      }
    }
  }

  /deep/.dialog-icon {
    padding-top: 40px;

    .icon-exit {
      font-size: 80px;
      color: @color-white;
    }
  }
}

.bottom-tip {
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: #777;
  background-color: #fff;
}

.word {
  word-break: break-all;
  /* 支持IE和chrome，FF不支持*/
  word-wrap: break-word;
  /* 以上三个浏览器均支持 */
}
</style>