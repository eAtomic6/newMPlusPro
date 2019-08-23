<template>
  <div class="container">
    <topbar :title="title" :back="toBack" v-on:goBack="goBack">
      <a slot="topbar-right" class="topbar-right icon-gps" :href="getAddress">导航</a>
    </topbar>
    <div id="allmap" class="content map"></div>
    <ul class="map-tool">
      <li
        v-for="item in tool"
        :key="item.id"
        :class="[addressActive===item.id?'active':'']"
        @click="getBuilding(item)"
      >
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import BMap from "BMap";
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";

let xPoint = 0;
let yPoint = 0;

export default {
  name: "building-map",
  mixins: [MIXINS],
  components: {
    topbar
  },
  data() {
    return {
      title: "位置与周边",
      toBack: true,
      tool: [
        {
          id: 1,
          name: "附近小区"
        },
        {
          id: 2,
          name: "地铁"
        },
        {
          id: 3,
          name: "公交"
        },
        {
          id: 4,
          name: "学校"
        },
        {
          id: 5,
          name: "餐饮"
        },
        {
          id: 6,
          name: "购物"
        },
        {
          id: 7,
          name: "医院"
        }
      ],
      location: {
        lng: 0,
        lat: 0
      },
      searchPoint: [],
      addressActive: 0,
      buildingList: []
    };
  },
  created() {
    this.location.lng = this.$route.query.lng;
    this.location.lat = this.$route.query.lat;
    xPoint = this.$route.query.lng;
    yPoint = this.$route.query.lat;
    this.getLocalHouse();
  },
  mounted() {
    /*this.getLocation().then(res => {
        // debugger
        let point = new BMap.Point(xPoint,yPoint);
        this.map.centerAndZoom(point,12);
        // this.getBuilding()
        let marker = new BMap.Marker(point)
        this.map.addOverlay(marker)
      })*/
    let point = new BMap.Point(xPoint, yPoint);
    this.map.centerAndZoom(point, 12);
    // this.getBuilding()
    let marker = new BMap.Marker(point);
    this.map.addOverlay(marker);
  },
  methods: {
    /**
     * 获取附近小区
     */
    getLocalHouse: function() {
      let param = {
        latitude: this.location.lat,
        longitude: this.location.lng,
        distance: 5,
        pageNum: 1,
        pageSize: 100
      };
      this.$ajax.get("/api/appProjectList", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.buildingList = res.data.list;
        }
      });
    },
    getBuilding(item) {
      let _that = this;
      this.deletePoint();
      this.addressActive = item.id;
      let options = {
        onSearchComplete: function(results) {
          // 判断状态是否正确
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            _that.searchPoint = [];

            console.log("我是检测arr");
            console.log(results);
            results.Ar.forEach(item => {
              _that.searchPoint.push(item.point);
            });
            _that.drawPoint(_that.searchPoint, item.id);
          }
        }
      };
      let local = new BMap.LocalSearch(this.map, options);
      local.search(item.name);
    },
    /**
     * 获取城市定位
     */
    getLocation: function() {
      // debugger
      return new Promise((resolve, reject) => {
        let geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(
          function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              xPoint = r.point.lng;
              yPoint = r.point.lat;
              resolve();
            } else {
              reject();
            }
          },
          { enableHighAccuracy: true }
        );
      });
    },
    /**
     * 绘制地标
     */
    drawPoint: function(arr, id) {
      if (id === 1) {
        arr = this.buildingList;
      }
      // let _that = this
      arr.forEach(item => {
        // debugger
        let pt = new BMap.Point(
          id === 1 ? item.longitude : item.lng,
          id === 1 ? item.latitude : item.lat
        );
        if (id !== 1) {
          let myIcon = new BMap.Icon(
            `./static/img/address-${id}-icon.png`,
            new BMap.Size(100, 100)
          );
          let marker2 = new BMap.Marker(pt, { icon: myIcon }); // 创建标注
          this.map.addOverlay(marker2); // 将标注添加到地图中
        } else {
          let opts = {
            position: pt, // 指定文本标注所在的地理位置
            offset: new BMap.Size(30, -30) //设置文本偏移量
          };
          let price = parseFloat(item.buildingPrice / 10000).toString();
          let label = new BMap.Label(
            `${
              price.indexOf(".") > -1 && price.split(".")[1].length > 1
                ? `${price.split(".")[0]}.${price.split(".")[1].substr(0, 1)}`
                : price
            }万/平 ${item.name}`,
            opts
          ); // 创建文本标注对象
          label.setStyle({
            color: "white",
            fontSize: "12px",
            height: "20px",
            borderRadius: "4px",
            border: "0px",
            padding: "0 10px",
            backgroundColor: "#5CA52A",
            lineHeight: "20px",
            fontFamily: "微软雅黑"
          });
          this.map.addOverlay(label);
        }
      });
    },
    /**
     * 清空地标
     */
    deletePoint: function() {
      let allOverlay = this.map.getOverlays();
      for (let i = 0; i < allOverlay.length - 1; i++) {
        this.map.removeOverlay(allOverlay[i]);
      }
    }
  },
  computed: {
    map: function() {
      return new BMap.Map("allmap");
    },
    getAddress: function() {
      let str = `http://api.map.baidu.com/geocoder?location=${
        this.location.lat
      },${this.location.lng}&output=html&src=webapp.baidu.openAPIdemo`;
      // alert(str)
      return str;
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";
.map {
  width: 100%;
  height: 95%;
}
.icon-gps {
  text-decoration: none;
  font-size: @font-size-m !important;
  color: @color-minor;
}

.map-tool {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  background-color: @bg-ff;
  > li {
    padding: 10px 0;
    position: relative;
    &:before {
      content: "";
      display: block;
      margin: 0 auto;
      width: 44px;
      height: 44px;
      -webkit-background-size: 100%;
      background-size: 100%;
    }
    &:first-of-type {
      &:before {
        background-image: url("~@/assets/img/address-1.png");
      }
    }
    &:nth-of-type(2) {
      &:before {
        background-image: url("~@/assets/img/address-2.png");
      }
    }
    &:nth-of-type(3) {
      &:before {
        background-image: url("~@/assets/img/address-3.png");
      }
    }
    &:nth-of-type(4) {
      &:before {
        background-image: url("~@/assets/img/address-4.png");
      }
    }
    &:nth-of-type(5) {
      &:before {
        background-image: url("~@/assets/img/address-5.png");
      }
    }
    &:nth-of-type(6) {
      &:before {
        background-image: url("~@/assets/img/address-6.png");
      }
    }
    &:nth-of-type(7) {
      &:before {
        background-image: url("~@/assets/img/address-7.png");
      }
    }
    &.active {
      &:first-of-type {
        &:before {
          background-image: url("~@/assets/img/address-1-active.png");
        }
      }
      &:nth-of-type(2) {
        &:before {
          background-image: url("~@/assets/img/address-2-active.png");
        }
      }
      &:nth-of-type(3) {
        &:before {
          background-image: url("~@/assets/img/address-3-active.png");
        }
      }
      &:nth-of-type(4) {
        &:before {
          background-image: url("~@/assets/img/address-4-active.png");
        }
      }
      &:nth-of-type(5) {
        &:before {
          background-image: url("~@/assets/img/address-5-active.png");
        }
      }
      &:nth-of-type(6) {
        &:before {
          background-image: url("~@/assets/img/address-6-active.png");
        }
      }
      &:nth-of-type(7) {
        &:before {
          background-image: url("~@/assets/img/address-7-active.png");
        }
      }
      > span {
        color: @color-green;
      }
    }
    > span {
      font-size: @font-size-s;
    }
  }
}
</style>
