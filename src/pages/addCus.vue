<template>
  <div class="main">
    <topbar ref="topBar" :title="title" :save="toSave" @clickSave="doSave" :back="getBack">
      <span slot="topbar-left" class="iconfont icon-back topbar-left" @click="getBackFuc"></span>
      <span slot="topbar-right" class="topbar-right save-btn" @click="doSave">保存</span>
    </topbar>
    <div class="content unselect">
      <div class="ban-box" ref="banBox">
        <p class="title">基本资料</p>
        <ul class="list-wrapper" v-if="toRadioList">
          <li class="list-item" v-for="(item,index) in toRadioList">
            <span class="item-tit">
              <i class="iconfont" :class="item.value==='客户等级'?'icon-asterisk':''"></i>
              {{item.value}}
            </span>
            <!-- {{item.value}} -->
            <radio-box
              :options="item.children"
              :radioId="item.id"
              :title="title"
              :checkedIndex="toRadioActiveIndex(item)"
              @clickRadio="getRadioData"
            ></radio-box>
          </li>
          <!-- 客户来源 -->
          <li class="list-item">
            <span class="item-tit">
              <i class="iconfont icon-asterisk"></i>
              {{sourceList.name}}
            </span>
            <P v-if="title === '编辑客户'" class="right">{{sourceList.holderValue}}</P>
            <P v-else class="right" @click="openPopup('',sourceList)">
              {{sourceList.holderValue}}
              <span class="iconfont icon-right_arrow"></span>
            </P>
          </li>
          <li class="list-item">
            <span class="item-tit">
              <i class="iconfont"></i>客户备注
            </span>
            <div class="right has-remark">
              <textarea
                ref="textArea"
                class="input-info word"
                v-model="requestData.remark"
                placeholder="请输入客户备注"
                maxlength="400"
              ></textarea>
            </div>
          </li>
        </ul>
        <p class="title">联系人</p>
        <template v-for="(item,index) in initData">
          <ul class="list-wrapper" :ref="'card'+index">
            <li class="list-item">
              <span class="item-tit">
                <i class="iconfont icon-asterisk"></i>姓名
              </span>
              <!-- <p v-if="title === '编辑客户' && !index" class="right">{{item.name}}</p> -->
              <p class="right input-box">
                <input
                  ref="textInput"
                  class="input-info"
                  type="text"
                  v-model="item.name"
                  placeholder="请输入真实姓名"
                  maxlength="20"
                  @focus="hidePopup(index)"
                  @blur="cancelTop($event,index)"
                >
              </p>
            </li>
            <li class="list-item">
              <span class="item-tit">
                <i class="iconfont icon-asterisk"></i>手机号
              </span>
              <p v-if="title === '编辑客户' && !index" class="right">{{item.phone}}</p>
              <p v-else class="right input-box">
                <input
                  ref="textInput"
                  class="input-info"
                  type="number"
                  v-model="item.phone"
                  @keyup="getInputTel(index,$event)"
                  placeholder="请输入手机号"
                  maxlength="11"
                  @focus="hidePopup(index)"
                  @blur="cancelTop($event,index)"
                >
              </p>
            </li>
            <li class="list-item" :ref="'relatList'+index">
              <span class="item-tit">
                <i class="iconfont icon-asterisk"></i>
                {{relatList.name}}
              </span>
              <P class="right" v-if="index===0">本人</P>
              <P class="right" v-else @click="openPopup('card'+index,relatList,index)">
                {{judgeRelat(item.relationshipId)}}
                <span class="iconfont icon-right_arrow"></span>
              </P>
            </li>
            <li class="list-item" v-if="index" @click="deleteCard(index)">
              <p class="right mid">
                <span class="iconfont icon-reduce"></span>
                删除
              </p>
            </li>
          </ul>
          <div class="list-item addBtn" @click="addCard(index)" v-if="!isAdd[index+1]">
            <p class="right mid">
              <span class="iconfont icon-added"></span>
              继续添加联系人（最多3个）
            </p>
          </div>
        </template>

        <ul class="list-wrapper mb0" ref="moreWishWrap">
          <li class="list-item" @click="toggleOpen">
            <p class="right mid">
              <template v-if="toOpen">
                展开更多意向
                <span class="iconfont icon-bottom_arrow"></span>
              </template>
              <template v-else>
                收起更多意向
                <span class="iconfont icon-top_arrow"></span>
              </template>
            </p>
          </li>
          <template v-if="!toOpen">
            <li class="list-item" v-for="item in moreWish">
              <span class="item-tit">
                <i class="iconfont"></i>
                {{item.name}}
              </span>
              <P class="right" @click="openPopup('moreWishWrap',item)">
                {{item.holderValue}}
                <span class="iconfont icon-right_arrow"></span>
              </P>
            </li>
          </template>
        </ul>
        <div v-if="isTop" style="height:150px;"></div>
      </div>
    </div>
    <!-- 确定取消弹层 -->
    <confirm
      v-model="confirmVal"
      title="新增客户失败"
      @on-cancel="onCancel"
      @on-confirm="onConfirm(alreadyId)"
      cancel-text="关闭"
      confirm-text="立即查看"
      class="dialog-confirm"
    >
      <p>{{promptWord}}新增客户失败！本次操作记录以保存到”我的-服务记录”中！，您可以：</p>
      <br>
      <p>1.通过“我的”-“服务记录”查询本次操作！</p>
      <p>2.点击下方“立即查看”查询该客户！</p>
    </confirm>
    <popup-pick
      :showPopup="toShowPopup"
      :pickList="toPickList"
      :isArray="isArray"
      :pickListArray="toPickListArray"
      @pickSelect="selectPopup"
      @confirm="hidePopup"
      @cancel="hidePopup"
      @clickMask="hidePopup"
      :contactIndex="contactIndex"
    ></popup-pick>
  </div>
</template>

<script>
import { Confirm } from "vux";
import { MIXINS } from "@/assets/JS/mixins";
import topbar from "@/components/topbar";
import radioBox from "@/components/radioBox";
import popupPick from "@/components/popupPick";
import { mapState, mapMutations } from "vuex";
import { stringify } from "querystring";

const SOURCE_LIST = {
  id: 200,
  name: "客户来源",
  holderValue: "请选择客户来源"
};
const RELAT_LIST = {
  id: 221,
  name: "关系",
  fixedValue: "本人"
};
const MORE_WISH = [
  {
    name: "价格区间",
    holderValue: "请选择价格区间",
    id: 231
  },
  {
    name: "面积区间",
    holderValue: "请选择面积区间",
    id: 250
  },
  {
    name: "意向户型",
    holderValue: "请选择意向户型",
    id: 257
  },
  {
    name: "意向项目",
    holderValue: "请选择意向项目",
    id: "link",
    value: "intentProject"
  },
  {
    name: "意向区域",
    holderValue: "请选择意向区域",
    id: "intentArea"
  },
  {
    name: "购房意愿",
    holderValue: "请选择购房意愿",
    id: 284
  },
  {
    name: "购房目的",
    holderValue: "请选择购房目的",
    id: 288
  },
  {
    name: "居住人数",
    holderValue: "请选择居住人数",
    id: 292
  }
];
const MO = function(e) {
  e.preventDefault();
};
export default {
  name: "search",
  mixins: [MIXINS],
  components: {
    Confirm,
    topbar,
    radioBox,
    popupPick
  },
  data() {
    return {
      toTitle: "新增客户",
      getBack: true,
      toSave: true,
      toOpen: true,
      isAdd: [true],
      contactIndex: 0, //判断选择的是第几个联系人
      toShowPopup: false,
      toPickList: {},
      isArray: false,
      toPickListArray: [],
      toRadioList: {},
      inputTop: 0,
      userData: {}, //存储用户数据
      requestData: {}, //存储请求参数
      alreadyId: 0, //存储 当前用户 同公司已录入的客户id
      pageType: 0, //存储 c_type页面类型
      initData: [
        {
          name: "",
          phone: "",
          relationshipId: 1 //第一个固定为本人
        }
      ],
      confirmVal: false,
      promptWord: "", //弹窗提示
      popupList: {},
      /**
       * 静态数据展示
       */
      sourceList: {},
      relatList: {},
      moreWish: [],
      isTop: false, //垫高底部
      openPopupBtn: "", //存储当前点击的选择器btn
      toUserType: "", //模拟数据，2为分销，1和-1为直销，3为联动
      relationList: []
    };
  },

  methods: {
    /**
     * 打开底部弹层
     */
    openPopup(str, item, index) {
      this.openPopupBtn = str;
      this.$refs.textArea.blur();
      if (this.$refs.textInput) {
        this.$refs.textInput.forEach(item => {
          item.blur();
        });
      }

      if (item.id === "intentArea") {
        //意向区域
        this.toShowPopup = true;
        this.stop();
        this.isArray = true;
      } else if (item.id === "link") {
        //意向项目
        localStorage.setItem(
          "addCusRequestData",
          JSON.stringify(this.requestData)
        );
        this.saveData();
        this.$router.push({
          path: item.value,
          query: {
            title: item.name,
            type: this.type
          }
        });
      } else {
        //其他
        this.isArray = false;
        this.getPopupListAjax(item.id);
      }
      if (index) {
        this.contactIndex = index;
      }
    },
    /**
     * 选择弹层 item
     * @pickId 选中的id
     * @itemValue 选中的字段
     * @popupData 所有选项的数据
     * @index 多个相同的选择器，区分
     */
    selectPopup(pickId, itemValue, popupData, index) {
      if (pickId === 200) {
        this.$set(this.sourceList, "holderValue", itemValue);
      } else if (pickId === 221) {
        this.initData[index].relationshipId = popupData[pickId];
      } else if (pickId === 231) {
        this.$set(this.moreWish[0], "holderValue", itemValue);
      } else if (pickId === 250) {
        this.$set(this.moreWish[1], "holderValue", itemValue);
      } else if (pickId === 257) {
        this.$set(this.moreWish[2], "holderValue", itemValue);
      } else if (pickId === 284) {
        this.$set(this.moreWish[5], "holderValue", itemValue);
      } else if (pickId === 288) {
        this.$set(this.moreWish[6], "holderValue", itemValue);
      } else if (pickId === 292) {
        this.$set(this.moreWish[7], "holderValue", itemValue);
      } else if (pickId === "intentArea") {
        this.$set(this.moreWish[4], "holderValue", itemValue);
      }
      this.requestData = Object.assign({}, this.requestData, popupData);
    },
    /**
     * 控制弹窗
     */
    hidePopup(index) {
      this.toShowPopup = false;
      this.move();
      if (this.openPopupBtn !== "") {
        let obj = this.openPopupBtn;
        setTimeout(() => {
          if (obj === "moreWishWrap") {
            this.$refs[obj].scrollIntoView(false);
          } else {
            this.$refs[obj][0].scrollIntoView(false);
          }
        }, 100);
      }
      if (index > 0) {
        this.isTop = true;
        setTimeout(() => {
          this.$refs["card" + index][0].scrollIntoView(true);
        }, 100);
      }
    },
    cancelTop(e, index) {
      this.isTop = false;
      setTimeout(() => {
        this.$refs["relatList" + index][0].scrollIntoView(false);
      }, 100);
    },
    /**
     * 联系人检测
     */
    testContact(item) {
      if (!this.testName(item.name)) {
        this.useToast("请正确填写联系人姓名");
        return false;
      }
      if (!this.testphone(item.phone)) {
        this.useToast("请正确填写联系人手机号");
        return false;
      }
      if (!item.relationshipId) {
        this.useToast("请选择联系人与客户关系");
        return false;
      }
      return true;
    },
    /**
     * 添加客户卡片
     * @index 卡片的索引值
     */
    addCard(index) {
      if (index == 2) {
        this.useToast("最多添加三个");
        return;
      }
      if (!this.testContact(this.initData[index])) {
        return;
      }
      let blank = {
        name: "",
        phone: "",
        relationshipId: "" //第一个固定为本人
      };
      this.initData.push(blank);
      this.isAdd.push(true);
    },
    /**
     * 删除客户卡片
     * @index 卡片索引值
     */
    deleteCard(index) {
      this.initData.splice(index, 1);
      this.isAdd.splice(index, 1);
    },
    /**
     * 控制意向项目 显示/隐藏
     */
    toggleOpen() {
      this.toOpen = !this.toOpen;
      setTimeout(() => {
        this.$refs.moreWishWrap.scrollIntoView(false);
      }, 100);
    },
    /**
     * 获取 客户等级、客户状态、是否锁定 选中的值
     */
    getRadioData(radio, id) {
      this.requestData[radio] = id;
    },
    /**
     * 将客户等级、客户状态、是否锁定 选中的值传递给radio显示
     */
    toRadioActiveIndex(radio) {
      return this.requestData[radio.id];
    },
    /**
     * 保存客户
     */
    doSave() {
      let param = {
        level: this.requestData[211],
        state: this.requestData[216],
        sourceId: this.requestData[200],
        remark: this.requestData.remark,
        linkmans: this.initData,
        priceId: this.requestData[231],
        acreageId: this.requestData[250],
        houseType: this.requestData[257],
        buildingId: this.requestData.buildingId,
        district: this.requestData.district,
        districtName: this.requestData.districtName,
        houseIntent: this.requestData[284],
        houseReason: this.requestData[288],
        housePeople: this.requestData[292]
      };
      if (this.toUserType != 2) {
        param = Object.assign({}, param, {
          isLock: this.requestData[346]
        });
      }
      // 1.6版本有bug：有时候请求不到后台的数据列表，请求不到给默认的
      if (!param.level && !param.state && !param.isLock) {
        param.level = 1;
        aram.state = 1;
        param.isLock = 1;
      }
      //客户等级、客户状态、是否锁定有默认值
      if (!param.sourceId) {
        this.useToast("请选择客户来源");
        return;
      }
      //检测联系人
      let stopFlag = false;

      param.linkmans.forEach((item, index) => {
        if (!this.testContact(item)) {
          stopFlag = true;
          return;
        }
      });

      if (!stopFlag) {
        if (this.title === "编辑客户") {
          param = Object.assign({}, param, {
            id: this.customerId
          });
          this.refreshData(param);
        } else if (this.title === "新增客户") {
          this.addData(param);
        }
      }
    },

    /**
     * 判断联系人关系
     */
    judgeRelat(id) {
      if (id) {
        return this.relationList[id - 1].value;
      } else {
        return "请选择联系人与客户关系";
      }
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
     * 将数据存储到localStorage中
     */
    saveData() {
      let addCusData = {}; //存储值，之后提交
      addCusData["requestData"] = this.requestData;
      addCusData["linkmans"] = this.initData;
      addCusData["moreWish"] = this.moreWish;
      addCusData["sourceList"] = this.sourceList;
      localStorage.setItem("addCusData", JSON.stringify(addCusData));
    },
    /**
     * 清空存储值
     */
    clearData() {
      this.requestData = {};
      this.initData = {};
      this.moreWish = [];
      this.sourceList = {};
      localStorage.setItem("addCusData", "");
    },
    /**
     * 获取意向区域 展示数据
     */
    getIntentArea() {
      let param = {
        cityID: this.userData.cityId || 1
      };
      this.$ajax
        .get("/api/resource/area", param)
        .then(res => {
          // debugger
          res = res.data;
          if (res.status === 200) {
            res.data.forEach((item, i) => {
              this.$set(this.toPickListArray, i, item);
            });
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 请求字典表  数据展示
     */
    getPopupListAjax(parentId, pageType) {
      let param = {
        parentId: parentId
      };
      let url = "dictionary";
      if (typeof parentId === "object") {
        parentId = parentId.join(",");
        url = "dictionary/list";
        param = {
          ids: parentId
        };
      }
      this.$ajax
        .get("/api/" + url, param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            if (
              parentId === 200 ||
              parentId === 221 ||
              parentId === 231 ||
              parentId === 250 ||
              parentId === 257 ||
              parentId === 284 ||
              parentId === 288 ||
              parentId === 292
            ) {
              this.toShowPopup = true;
              this.stop();
              this.toPickList = res.data;
            } else if (typeof parentId == "string") {
              this.toRadioList = res.data;

              if (this.title === "编辑客户") {
                return;
              }
              if (pageType > 0) {
                return;
              }
              //设置客户等级、客户状态、是否锁定默认值
              this.requestData[211] = this.toRadioList[211].children[0].key;
              this.requestData[216] = this.toRadioList[216].children[0].key;
              if (this.toUserType != 2) {
                this.requestData[346] = this.toRadioList[346].children[1].key;
              }
            }
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 编辑客户时
     * 获取客户初始数据
     * @id 客户id
     */
    getEditData(id) {
      let param = {
        customerId: this.customerId
      };
      this.$ajax
        .get("/api/customer/details", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            let data = res.data;
            //获取 requestData
            this.requestData[211] = data.level;
            this.requestData[216] = data.state;
            if (this.toUserType != 2) {
              this.requestData[346] = data.isLock;
            }
            this.requestData[200] = data.sourceId;
            this.requestData.remark = data.remark;
            this.requestData[231] = data.priceId;
            this.requestData[250] = data.acreageId;
            this.requestData[257] = data.houseType;
            this.requestData.buildingId = data.buildingId;

            this.requestData.district = data.district;
            this.requestData.districtName = data.districtName;
            this.requestData[284] = data.houseIntent;
            this.requestData[288] = data.houseReason;
            this.requestData[292] = data.housePeople;

            // return
            //获取 initData
            this.initData = data.linkmans;
            //获取 moreWish 字段
            this.moreWish[0].holderValue = data.priceId_zh || "请选择价格区间";

            this.moreWish[1].holderValue =
              data.acreageId_zh || "请选择面积区间";
            this.moreWish[2].holderValue =
              data.houseType_zh || "请选择意向户型";
            this.moreWish[3].holderValue =
              data.buildingId_zh || "请选择意向项目";
            this.moreWish[4].holderValue =
              data.districtName || "请选择意向区域";
            this.moreWish[5].holderValue =
              data.houseIntent_zh || "请选择购房意愿";
            this.moreWish[6].holderValue =
              data.houseReason_zh || "请选择购房目的";
            this.moreWish[7].holderValue =
              data.housePeople_zh || "请选择居住人数";

            //获取 sourceList 字段
            if (this.title === "编辑客户") {
              this.sourceList.holderValue = data.sourceId_zh;
            } else {
              //添加客户
              this.sourceList.holderValue =
                data.sourceId_zh || "请选择客户来源";
            }

            this.saveData();
            this.contactNum(data.linkmans);
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 编辑客户时，更新客户数据 ajax
     */
    refreshData(param) {
      this.$ajax
        .putJSON("/api/customer", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.useToast("编辑客户成功");
            this.$router.go(-1);
          } else {
            this.useToast(res.message);
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 新增客户时，新增客户数据 ajax
     */
    addData(param) {
      this.$ajax
        .postJSON("/api/customer", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.useToast("新增客户成功");
            this.jumpToUser();
          } else if (res.status === 3001) {
            this.promptWord = res.message;
            this.confirmVal = true;
            this.alreadyId = res.data;
          } else if (res.status === 3002) {
            this.useToast(res.message, "200px");
          } else if (res.status == 400) {
            this.useToast("添加失败", "200px");
          } else {
            this.useToast(res.message);
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    /**
     * 关闭弹窗提示
     */
    onCancel() {
      this.confirmVal = false;
    },
    /**
     * 跳转客户列表
     */
    jumpToUser() {
      sessionStorage.isSelected = 1;
      this.$store.commit("changeIsBack");
      setTimeout(() => {
        this.clearData();
        this.$router.push({
          path: "/user"
        });
      }, 500);
    },
    /**
     * 立即查看该客户,跳转客户详情
     */
    onConfirm(id) {
      this.clearData();
      this.$router.push({
        path: "customerInfoComplete",
        query: {
          c_id: id
        }
      });
    },
    /**
     * 返回上一页
     * 根据当前情况判断
     */
    getBackFuc() {
      //将存储的客户数据清空
      this.clearData();
      this.$router.go(-1);
    },
    /**
     * 检测电话输入框长度
     */
    getInputTel(index, e) {
      let str = this.initData[index].phone;
      if (str.length > 11) {
        this.initData[index].phone = str.substring(0, 11);
      }
    },
    /**
     * 检测人名
     */
    testName(str) {
      const re1 = /^[\u4E00-\u9FA5A-Za-z]+$/;
      if (!re1.test(str)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 检测手机号
     */
    testphone(str) {
      const re2 = /^1[0-9]{10}$/;
      if (!re2.test(str)) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 判断联系人个数
     * $arr 存储联系人对象的数组
     */
    contactNum(arr) {
      if (arr.length === 2) {
        this.isAdd.push(true);
      } else if (arr.length === 3) {
        this.isAdd.push(true, true);
      }
    },
    /**
     * 使用toast
     */
    useToast(word, width) {
      this.$vux.toast.show({
        text: word,
        type: "text",
        position: "middle",
        width: width || "160px"
      });
    },
    /***滑动限制***/
    stop() {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", MO, false); //禁止页面滑动
    },
    /***取消滑动限制***/
    move() {
      document.body.style.overflow = ""; //出现滚动条
      document.removeEventListener("touchmove", MO, false);
    },

    ...mapMutations(["changeStoreCType"])
  },
  computed: {
    ...mapState(["c_type", "p_id", "c_id", "c_name"])
  },
  created() {
    //获取用户类型
    this.userData = JSON.parse(localStorage.getItem("userMessage"));
    this.toUserType = this.userData.companyType;
    //数据初始化
    this.sourceList = JSON.parse(JSON.stringify(SOURCE_LIST));
    this.relatList = JSON.parse(JSON.stringify(RELAT_LIST));
    this.moreWish = JSON.parse(JSON.stringify(MORE_WISH));

    //获取页面静态展示数据
    this.pageType = this.c_type;
    this.changeStoreCType(0);
    //页面类型
    //大于0  从意向项目页面过来的
    //为1  进入过意向项目页面并且选择了意向项目
    //为0  其他情况
    this.title = this.$route.query.title;
    this.getIntentArea();
    if (this.toUserType === 2) {
      this.getPopupListAjax([211, 216], this.pageType);
    } else {
      this.getPopupListAjax([211, 216, 346], this.pageType);
    }

    //获取后台的数据
    if (this.title === "编辑客户") {
      this.customerId = +this.c_id;
      if (+this.pageType == 0) {
        //从意向项目页面过来不再获取后台编辑数据
        this.getEditData();
      }
    }

    //获取存储的数据
    if (this.pageType > 0) {
      if (localStorage.getItem("addCusData")) {
        let addCusData = JSON.parse(localStorage.getItem("addCusData"));
        let requestDataJson = addCusData.requestData;

        for (var key in requestDataJson) {
          this.$set(this.requestData, key, requestDataJson[key]);
        }

        this.initData = addCusData.linkmans;
        this.moreWish = addCusData.moreWish;
        this.sourceList = addCusData.sourceList;
        this.contactNum(this.initData);
      }
    }

    // 获取联系人关系数组
    this.$ajax.get("/api/dictionary", { parentId: 221 }).then(res => {
      this.relationList = res.data.data.children;
    });

    //页面类型
    //为1  进入过意向项目页面并且选择了意向项目
    //为0  其他情况

    //从意向项目页面过来，并选择了意向项目
    if (this.pageType == 1) {
      setTimeout(() => {
        this.$set(this.moreWish[3], "holderValue", this.c_name); //意向项目的字段
        this.requestData.buildingId = this.p_id; //意向项目的id
        this.$set(this.requestData, "buildingId", this.p_id);
      }, 200);
    }

    // 从意向项目页面过来的
    if (+this.pageType > 0) {
      this.toOpen = false;
      setTimeout(() => {
        this.$refs.moreWishWrap.scrollIntoView(false);
      }, 200);
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";
.main {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  height: 100%;
}
.content {
  position: relative;
  -webkit-box-flex: 1;
  -webkit-overflow-scrolling: touch;
  height: 100%;
}
.title {
  padding-left: 30px;
  height: 100px;
  line-height: 100px;
  font-size: @font-size-m;
  color: @color-minor;
  background: @bg-f5;
}
.list-wrapper {
  margin-bottom: 20px;
  padding: 0 30px;
  background: @color-white;
  &.mb0 {
    margin-bottom: 0;
  }
}
.list-item {
  display: flex;
  min-height: 100px;
  line-height: 100px;
  border-bottom: 1px solid @bg-f1;
  font-size: @font-size-m;
  color: @color-minor;
  background: @color-white;
  &.addBtn {
    margin: 20px 0;
  }
  &:last-of-type {
    border-bottom: none;
  }
  &.tit {
    border-bottom: 1px solid @bg-f1;
  }
  .icon-reduce,
  .icon-added,
  .icon-bottom_arrow,
  .icon-top_arrow {
    position: relative;
    font-size: 50px;
    vertical-align: sub;
  }
  .icon-bottom_arrow {
    top: 5px;
  }
  .item-tit {
    position: relative;
    flex: 0 0 142px;
    padding-left: 20px;
    > .icon-asterisk {
      position: absolute;
      left: -19px;
      font-size: 50px;
      color: #ff3b2c;
    }
  }

  .input-info,
  .word {
    flex: 1;
    line-height: 100px;
    font-size: @font-size-m;
  }

  .right {
    flex: 1;
    line-height: 100px;
    vertical-align: sub;
    color: #333;
    overflow: hidden;
    &.has-remark {
      padding: 29px 0 0 10px;
      box-sizing: border-box;
      height: 200px;
      .word {
        width: 100%;
        height: 100%;
        display: inline-block;
        line-height: 42px;
        font-size: @font-size-m;
        color: @color-main;
        box-sizing: border-box;
        overflow-y: scroll;
      }
    }
    &.input-box {
      height: 100px;
      box-sizing: border-box;
      padding-top: 33px;
      padding-bottom: 33px;
      line-height: 34px;

      .input-info {
        width: 100%;
        height: 34px;
        line-height: 34px;
        color: #333;
        border: 0px;
        outline: none;
        display: inline-block;
        font-size: @font-size-m;
        &::-webkit-input-placeholder {
          color: #b0b0b0;
        }
      }
    }
    &.mid {
      height: 100px;
      text-align: center;
    }
    .icon-right_arrow {
      float: right;
      font-size: 50px;
      vertical-align: sub;
    }
  }
}
</style>
