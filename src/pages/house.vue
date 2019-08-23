<template>
  <div class="main" @click="closeModal">
    <topbar class="topbar-info" :title="title" :search="toSearch" v-on:find="toFind">
      <p slot="topbar-left" class="iconfont icon-location topbar-left" @click="showPop">
        <span>{{!city.cityName?locationCityName:city.cityName}}</span>
      </p>
    </topbar>
    <dropdown
      :slider="getSlider"
      :tab="tab"
      :picker="picker"
      :modal="modal"
      :showTab="showPicker"
      :info="slider===2"
      :clearPrice="infoClear"
      v-on:getTab="getTab"
      v-on:getParam="getDropdownParam"
    >
      <p class="price-info" v-if="slider===2" slot="selectorInfo" @click.stop>
        <label>自定义</label>
        <input
          class="input-info"
          type="number"
          placeholder="最低价格"
          name="minPrice"
          :value="price.minPrice"
          @input="getInt"
        >
        <span></span>
        <input
          class="input-info"
          type="number"
          placeholder="最高价格"
          name="maxPrice"
          :value="price.maxPrice"
          @input="getInt"
        >
        <span>元</span>
        <span class="submit-price" @click.stop="priceInfo">确定</span>
      </p>
      <div class="dropdown-picker" slot="picker">
        <div class="picker-record">
          <div class="picker-record-tips">
            <label>记录：</label>
            <ul>
              <li
                v-for="item in locationRecord"
                :key="item.ID"
                @click.stop="historyClick(item)"
              >{{item.ShangQuanName}}</li>
            </ul>
          </div>
          <span @click.stop="clearHistory">清除</span>
        </div>
        <div class="picker-context">
          <ul class="picker-grade-first">
            <li
              v-for="item in sliderList"
              :key="item.id"
              @click.stop="chosePicker(item)"
              :class="[firstGrade===item.id?'active':'']"
            >{{item.name}}</li>
          </ul>
          <ul class="picker-grade-second" v-if="!rangePicker">
            <li @click.stop="searchAll('areaId')">不限</li>
            <li
              v-for="item in areaList"
              :key="item.id"
              @click.stop="choseArea(item)"
              :class="[secondGrade===item.ID?'active':'']"
            >{{item.AreaName}}</li>
          </ul>
          <ul class="picker-grade-third" v-if="tradingAreaList.length>0&&!rangePicker">
            <li @click.stop="searchAll('businessDistrictId')">不限</li>
            <li
              v-for="item in tradingAreaList"
              :key="item.id"
              :class="[thirdGrade===item.ID?'active':'']"
              @click.stop="choseTradingArea(item)"
            >{{item.ShangQuanName}}</li>
          </ul>
          <ul class="picker-grade-foured" v-if="rangePicker">
            <li @click.stop="searchAll('distance')">不限</li>
            <li
              v-for="item in getSlider"
              :key="item.id"
              :class="[fouredGrade===item.key?'active':'']"
              @click.stop="choseRange(item)"
            >{{item.value}}</li>
          </ul>
        </div>
      </div>
    </dropdown>
    <c-scroll
      ref="bScroll"
      :data="scrollList"
      :total="total"
      :listenScroll="true"
      class="content"
      @scroll="moreData('refresh')"
      @scrollToEnd="moreData('more')"
    >
      <div>
        <p class="list-num">
          共
          <span>{{total}}</span>条记录
        </p>
        <building :house="scrollList"></building>
      </div>
    </c-scroll>
    <popup v-model="pop">
      <topbar :title="popTitle">
        <span slot="topbar-left" class="topbar-left cancel" @click="initPicker">取消</span>
        <span slot="topbar-right" class="topbar-right msg" @click="submitPop">确定</span>
      </topbar>
      <div class="picker">
        <p class="picker-location">
          <label>定位：</label>
          <span>{{locationCityName}}</span>
        </p>
        <div class="picker-city">
          <p class="picker-city-chose">
            <span
              :class="[location==='ProvinceName'?'active':'']"
              @click="toLocation"
            >{{city.provinceName===''?'请选择':city.provinceName}}</span>
            <span
              :class="[location==='CityName'?'active':'']"
              @click="toLocation('city')"
              v-if="city.provinceName!==''"
            >请选择</span>
          </p>
          <ul class="city-list">
            <li
              v-for="item in cityList"
              :key="item.id"
              :class="[location==='ProvinceName'?(city.provinceId===item.ID?'active':''):(city.cityId===item.CityID?'active':'')]"
              @click="choseCity(item)"
            >{{item[location]}}</li>
          </ul>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Popup } from "vux";
// import {SCROLL} from "@/assets/JS/scroll"
import { MIXINS } from "@/assets/JS/mixins";
import topbar from "@/components/topbar";
import dropdown from "@/components/dropdown";
import building from "@/components/building";
import BMap from "BMap";

let CITY = {
  provinceId: JSON.parse(localStorage.getItem("userMessage")).provinceId,
  provinceName: "",
  cityId: JSON.parse(localStorage.getItem("userMessage")).cityId,
  cityName: "",
  areaId: "",
  businessDistrictId: ""
};
let areaHistory = [];
const tabInit = [
  {
    index: 1,
    name: "区域位置",
    param: "area"
  },
  {
    index: 2,
    name: "均价区间",
    param: "buildingPrice"
  },
  {
    index: 3,
    name: "楼盘性质",
    param: "buildingProperty"
  },
  {
    index: 4,
    name: "项目状态",
    param: "projectState"
  }
];

export default {
  name: "house",
  mixins: [MIXINS],
  components: {
    topbar,
    dropdown,
    building,
    Popup,
    BMap
  },
  data() {
    return {
      title: "新房项目",
      popTitle: "选择城市",
      toSearch: true,
      cancelLeft: true,
      confirm: true,
      tab: [
        {
          index: 1,
          name: "区域位置",
          param: "area"
        },
        {
          index: 2,
          name: "均价区间",
          param: "buildingPrice"
        },
        {
          index: 3,
          name: "楼盘性质",
          param: "buildingProperty"
        },
        {
          index: 4,
          name: "项目状态",
          param: "projectState"
        }
      ],
      tabIds: [335, 317, 208, 117],
      selector: null,
      picker: false,
      showPicker: true,
      modal: false,
      num: 16,
      total: 0,
      currentPage: 1,
      scrollList: [],
      slider: 1,
      infoClear: false,
      pop: false,
      sliderList: [
        {
          id: 1,
          name: "区域"
        },
        {
          id: 2,
          name: "附近"
        }
      ],
      cityList: [],
      areaList: [],
      tradingAreaList: [],
      rangeList: [],
      rangePicker: false,
      map: [],
      location: "ProvinceName",
      province: "",
      locationCityName: "",
      city: {
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        areaId: "",
        businessDistrictId: "",
        distance: "",
        longitude: "", //新加经纬度
        latitude: ""
      },
      locationRecord: [],
      dropdownPayload: {}, //下拉筛选列表的筛选结果
      price: {
        //自定义价格
        minPrice: "",
        maxPrice: ""
      },
      //区域位置联动选择
      firstGrade: 1,
      secondGrade: "",
      thirdGrade: "",
      fouredGrade: ""
    };
  },
  created() {
    this.addressDetail();
    this.getDropdownData();

    this.$ajax
      .get("/api/resource/city")
      .then(res => {
        res = res.data;
        if (res.status === 200) {
          this.map = res.data;
          this.cityList = res.data;
        }
      })
      .catch(err => {
        this.$vux.toast.text(this.$error[err.response.status], "middle");
      });

    this.getPersonMsg().then(res => {
      this.getLocationArea(CITY.cityId);
    });
    this.city.provinceId = JSON.parse(
      localStorage.getItem("userMessage")
    ).provinceId;
    this.getHouse(this.newPage);
  },
  activated() {
    // 强制定位到指定位置
    if (this.$store.state.isBack) {
      let param = Object.assign({}, this.newPage);
      param.pageNum = this.pageNum;
      this.getHouse(param, false, true);
      // 调用mixins中的方法
      this.goOldEl();
    }
  },
  methods: {
    addressDetail() {
      //获取地理位置
      let self = this;
      //全局的this在方法中不能使用，需要重新定义一下
      var geolocation = new BMap.Geolocation();
      //调用百度地图api 中的获取当前位置接口
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //获取当前位置经纬度
          var myGeo = new BMap.Geocoder();
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(
            result
          ) {
            if (result) {
              console.log(result);
              self.city.latitude = result.point.lat;
              self.city.longitude = result.point.lng;
              console.log(self.latitude);
            }
          });
        }
      });
    },
    /**
     * 只允许输入正整数
     */
    getInt: function(e) {
      this.$set(
        this.price,
        e.target.getAttribute("name"),
        e.target.value.replace(/[^\d]/g, "")
      );
    },
    /**
     * 获取当前定位城市区域
     */
    getLocationArea: function(id) {
      let param = {
        cityID: id
      };
      this.$ajax
        .get("/api/resource/area", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.areaList = res.data;
            this.tradingAreaList = [];
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    closeModal: function() {
      this.modal = false;
      this.picker = false;
      this.showPicker = false;
    },
    /**
     * 获取商圈点击记录
     */
    getAreaHistory: function() {
      let logs = localStorage.getItem("houseAreaHistory");
      if (logs) {
        this.locationRecord = JSON.parse(logs);
        areaHistory = JSON.parse(logs);
      }
    },
    /**
     * 清除商圈点击记录
     */
    clearHistory: function() {
      localStorage.removeItem("houseAreaHistory");
      this.locationRecord = [];
      areaHistory = [];
    },
    /**
     * 添加商圈点击记录
     */
    setAreaHistory: function(item) {
      item.provinceId = this.city.provinceId;
      item.cityName = this.city.cityName;
      item.provinceName = this.city.provinceName;

      if (areaHistory.length >= 5) {
        areaHistory.pop();
      } else {
        // console.log(areaHistory.includes(tip))
        areaHistory.forEach((history, index) => {
          if (history.ID === item.ID) {
            areaHistory.splice(index, 1);
          }
        });
      }
      areaHistory.unshift(item);
      localStorage.setItem("houseAreaHistory", JSON.stringify(areaHistory));
    },
    /**
     * 加载
     */
    moreData: function(type = "more") {
      if (type === "more") {
        this.getHouse(this.newPage, 0);
      } else {
        this.getHouse(this.newPage);
      }
    },
    /**
     * 获取下拉筛选数据
     */
    getDropdownData: function() {
      let param = {
        ids: this.tabIds.join(",")
      };
      this.$ajax
        .get("/api/dictionary/list", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.selector = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 筛选条件不限
     */
    searchAll: function(str) {
      this.tab[0].name = tabInit[0].name;
      // debugger
      this.city[str] = "";
      switch (str) {
        case "areaId":
          this.secondGrade = "";
          this.thirdGrade = "";
          this.city["businessDistrictId"] = "";
          this.tradingAreaList = [];
          break;
        case "businessDistrictId":
          this.thirdGrade = "";
          break;
        case "distance":
          this.fouredGrade = "";
          break;
      }
      this.modal = false;
      this.picker = false;
      this.showPicker = false;
      this.getHouse(this.newPage);
    },
    /**
     * 获取个人信息
     */
    getPersonMsg: function() {
      return new Promise((resolve, reject) => {
        this.$ajax
          .get("/api/personal/me")
          .then(res => {
            res = res.data;
            if (res.status === 200) {
              CITY.cityId = res.data.cityId;
              CITY.cityName = res.data.cityName;
              this.city.provinceId = res.data.provinceId;
              this.city.cityId = res.data.cityId;
              this.city.cityName = res.data.cityName;
              this.locationCityName = res.data.cityName;
              resolve();
            } else {
              reject();
            }
          })
          .catch(err => {
            this.$vux.toast.text(this.$error[err.response.status], "middle");
          });
      });
    },
    getTab: function(payload) {
      this.modal = this.slider === payload.index && this.modal ? false : true;
      this.slider = payload.index;
      this.showPicker = true;
      if (payload.index === 1) {
        this.picker = true;
        this.getAreaHistory();
      } else {
        this.picker = false;
      }
    },
    /**
     * 监听筛选下拉框，获取筛选条件
     */
    getDropdownParam: function(payload, tabActive, value) {
      // debugger
      this.tab.forEach((item, index) => {
        if (item.param === tabActive) {
          item.name = !value ? tabInit[index].name : value;
        }
      });
      this.infoClear = false;
      if (this.slider === 2) {
        this.price.minPrice = "";
        this.price.maxPrice = "";
      }
      this.dropdownPayload = Object.assign({}, this.dropdownPayload, payload);
      this.modal = false;
      this.getHouse(this.newPage);
    },
    /**
     * 自定义价格区间
     */
    priceInfo: function() {
      if (this.price.minPrice || this.price.maxPrice) {
        this.tab[1].name = `${this.price.minPrice}${
          this.price.minPrice && this.price.maxPrice ? "-" : ""
        }${this.price.maxPrice}元`;
      }
      this.modal = false;
      this.picker = false;
      this.showPicker = false;
      this.infoClear = true;
      if (this.dropdownPayload.buildingPrice) {
        this.dropdownPayload.buildingPrice = "";
      }
      this.getHouse(this.newPage);
    },
    toFind: function() {
      this.getEl(this.newPage.pageNum - 1);
      this.$router.push({
        path: "search",
        query: {
          title: this.title
        }
      });
    },
    /**
     * 获取项目列表（默认强推）
     */
    getHouse: function(param, init = 1, isBack) {
      if (init) {
        this.currentPage = 1;
        this.total = 0;
        this.scrollList = [];
        param.pageNum = 1;
      }
      this.$ajax
        .get("/api/appProjectList", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.total = res.data.total;
            if (this.total === this.scrollList.length) {
              return;
            } else if (isBack) {
              this.scrollList.splice(
                (param.pageNum - 1) * 10,
                res.data.list.length,
                ...res.data.list
              );
            } else {
              this.currentPage += 1;
              this.scrollList = this.scrollList.concat(res.data.list);
            }
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    showPop: function() {
      // this.modal = true
      this.pop = true;
    },
    /**
     * Tab，获取城市选择器的列表渲染数据
     */
    toLocation: function(tip = "province") {
      // debugger
      if (tip === "city") {
        //二级，城市选择
        this.location = "CityName";
        this.map.find(item => {
          if (item.ProvinceName === this.city.provinceName) {
            this.cityList = item.CityList;
            return;
          }
        });
      } else {
        //一级，省份选择
        this.location = "ProvinceName";
        this.cityList = this.map;
      }
    },
    /**
     * 获取城市选择器筛选结果
     */
    choseCity: function(item) {
      // debugger
      if (this.location === "ProvinceName") {
        this.city.provinceId = item.ID;
        this.city.provinceName = item.ProvinceName;
        this.city.cityId = "";
        this.city.cityName = "";
        this.location = "CityName";
        // this.province = item.ProvinceName
        this.toLocation("city");
      } else {
        this.city.cityId = item.CityID;
        this.city.cityName = item.CityName;
      }
    },
    /**
     * 提交城市选择器数据
     */
    submitPop: function() {
      this.pop = false;
      if (!this.city.cityId) {
        CITY.cityId = user.cityId;
        CITY.cityName = user.cityName;
        CITY.provinceId = "";
        CITY.provinceName = "";
        this.initPicker();
        this.getHouse(this.newPage);
      } else {
        CITY = Object.assign({}, this.city); //避免指向同一个对象地址，相互影响
        this.currentPage = 1; //每次选择城市后，重新从第一页查找
        this.getHouse(this.newPage);
        // debugger
        this.getLocationArea(CITY.cityId);
      }
    },
    /**
     * 取消城市选择
     */
    initPicker: function() {
      // debugger
      this.pop = false;
      // this.province = ''
      //重置筛选项为上一次筛选结果
      this.city = CITY;

      this.location = "ProvinceName";
      this.cityList = this.map;
      // this.getHouse(this.newPage)
    },
    /**
     * 切换选择器
     */
    chosePicker: function(item) {
      this.firstGrade = item.id;
      if (item.id === 2) {
        this.rangePicker = true;
      } else {
        this.rangePicker = false;
      }
    },
    /**
     * 选择城市区域
     */
    choseArea: function(item) {
      // debugger
      this.tab[0].name = tabInit[0].name;
      this.city.areaId = item.ID;
      this.city.businessDistrictId = "";
      this.thirdGrade = "";
      this.secondGrade = item.ID;
      this.getTradingArea();
      this.getHouse(this.newPage);
    },
    /**
     * 获取商圈列表
     */
    getTradingArea: function() {
      let param = {
        cityID: this.city.cityId,
        areaID: this.city.areaId
      };
      this.$ajax
        .get("/api/resource/shangquan", param)
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.tradingAreaList = res.data;
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err.response.status], "middle");
        });
    },
    /**
     * 选择城市商圈
     */
    choseTradingArea: function(item) {
      // debugger
      this.tab[0].name = item.ShangQuanName;
      this.setAreaHistory(item);
      this.city.businessDistrictId = item.ID;
      this.thirdGrade = item.ID;
      // debugger
      this.modal = false;
      this.picker = false;
      this.showPicker = false;
      this.getHouse(this.newPage);
    },
    /**
     * 选择范围
     */
    choseRange: function(item) {
      // debugger
      this.tab[0].name = item.value;
      this.city.distance = item.key;

      this.fouredGrade = item.key;

      this.modal = false;
      this.picker = false;
      this.showPicker = false;
      this.getHouse(this.newPage);
    },
    /**
     * 点击商圈记录
     */
    historyClick: function(item) {
      // debugger
      this.city.provinceId = item.provinceId;
      this.city.cityId = item.CityID;
      this.city.areaId = item.AreaID;
      this.city.businessDistrictId = item.ID;
      this.city.provinceName = item.provinceName;
      this.city.cityName = item.cityName;
      this.tab[0].name = item.ShangQuanName;

      this.secondGrade = "";
      this.thirdGrade = "";
      this.tradingAreaList = [];

      this.modal = false;
      this.picker = false;
      this.showPicker = false;
      this.getHouse(this.newPage);
    }
  },
  computed: {
    getSlider: function() {
      // debugger
      if (!this.selector) {
        return [];
      } else {
        switch (this.slider) {
          case 1:
            return this.selector[this.tabIds[0]].children;
            break;
          case 2:
            return this.selector[this.tabIds[1]].children;
            break;
          case 3:
            return this.selector[this.tabIds[2]].children;
            break;
          case 4:
            return this.selector[this.tabIds[3]].children;
            break;
        }
      }
    },
    newPage: function() {
      let param = {
        minPrice: this.price.minPrice,
        maxPrice: this.price.maxPrice,
        pageNum: this.currentPage,
        pageSize: 10
      };

      param = Object.assign(
        {},
        param,
        !this.city.cityId ? CITY : this.city,
        this.dropdownPayload
      );
      return param;
    }
  },
  watch: {
    price: function(val) {
      debugger;
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

.main {
  background-color: #f2f2f2;
  position: relative;
}

.topbar-info {
  position: fixed;
  .topbar-left {
    display: flex;
    align-items: center;
    > span {
      font-size: @font-size-m;
    }
  }
}
.tab {
  position: fixed !important;
}
.content {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 170px;
  bottom: 100px;
  left: 0;
  right: 0;
  transform: translateX(0);
  .list-num {
    padding: 10px 30px;
    > span {
      @font-size-h3();
      color: @color-orange;
    }
  }
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /*padding: 10px 30px;*/
  > span:first-of-type {
    max-width: 20px;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      border-top: 2px solid @color-assist;
    }
  }
  > input {
    border: 1px solid @border-eb;
    border-radius: @border-radiaus;
    flex: 1;
    max-width: 200px;
    padding: 16px 8px;
    box-sizing: border-box;
    text-align: center;
    background-color: @bg-EB;
    color: @color-assist;
    /*&:first-of-type{
        margin-left: 40px;
      }*/
  }
  .submit-price {
    background-color: @color-green;
    color: @color-white;
    padding: 16px 20px;
    -webkit-border-radius: @border-radiaus;
    -moz-border-radius: @border-radiaus;
    border-radius: @border-radiaus;
  }
}

.picker {
  margin-top: 80px;
  background-color: @bg-ff;
  &-location {
    height: 90px;
    display: flex;
    align-items: center;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: @bg-f5;
    > label {
      color: @color-assist;
    }
  }
  &-city {
    padding: 40px 30px 0px;
    &-chose {
      margin-bottom: 12px;
      > span {
        display: inline-block;
        margin-right: 80px;
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
        height: 90px;
        display: flex;
        align-items: center;
        border-top: 1px solid @border-eb;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        &.active {
          color: @color-green;
        }
      }
    }
  }
}

.dropdown-picker {
  .picker-record {
    display: flex;
    height: 90px;
    align-items: center;
    background-color: @bg-f5;
    &-tips {
      flex: 1;
      /*height: 100%;*/
      position: relative;
      display: flex;
      display: -webkit-box;
      align-items: center;
      padding-left: 30px;
      > ul {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 150px;
        right: 0;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        > li {
          margin-right: 20px;
        }
      }
    }
    > span {
      &:first-of-type {
        color: @color-assist;
      }
      &:last-of-type {
        display: inherit;
        align-items: center;
        height: 100%;
        padding: 0 30px;
        color: @color-green;
        position: relative;
        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          box-shadow: -10px 0px 30px @color-minor;
        }
      }
    }
  }
  .picker-context {
    display: flex;
    > ul {
      flex: 1;
      height: 540px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &:first-of-type {
        max-width: 30%;
      }
      &:nth-of-type(2) {
        background-color: @bg-fb;
      }
      &:nth-of-type(3) {
        background-color: @bg-f7;
      }
      > li {
        height: 90px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        border-bottom: 1px solid @border-eb;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        &.active {
          color: @color-green;
        }
      }
    }
  }
}
</style>
