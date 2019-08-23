<template>
  <ul class="artice-content artice-content-house" :class="boObject?'interProject':''">
    <!--  -->
    <draggable
      tag="div"
      v-if="title=='项目管理'"
      :list="house"
      v-model="house"
      class="list-group"
      handle=".handle"
      :options="dragOptions"
      :componentData="componentData"
      :animation="100"
      @end="onEnd"
      @start="onStart()"
      @change="moved"
    >
      <li
        v-for="(item,index) in house"
        @click="toDetails(item)"
        :key="item.id"
        v-leftMove="{container:'[data-touchmove-con]'}"
        :class="draggable?'active':''"
      >
        <div class="house-window">
          <p class="float-state">{{item.projectStatusString}}</p>
          <img
            class="c-img"
            v-if="item.coverPhoto"
            v-lazy="{src: item.coverPhoto,loading: getImg('house-info.png')}"
          >
          <img class="c-img" v-if="!item.coverPhoto" src="../assets/img/house-info.png">
        </div>
        <div class="house-desc">
          <p>{{item.name | limit1}}</p>
          <p class="house-desc-tips">
            <span>{{item.effectiveTypeOfProjectString}}</span>
            <span>{{item.buildingPropertyString}}</span>
          </p>
          <p>
            均价
            <span>{{item.buildingPrice}}</span>元/m²
          </p>
          <p>
            <i class="iconfont icon-location"></i>
            <span>{{item.city}} {{item.area}}</span>
          </p>
        </div>
        <button class="fa handle" disabled="disabled"></button>
        <div class="delete_item" @click.stop="remove(index,item.relationshipId)">删除</div>
      </li>
    </draggable>
    <li v-if="title !='项目管理'" v-for="(item,index) in house" @click="toDetails(item)" :key="index">
      <div class="house-window">
        <p class="float-state">{{item.projectStatusString}}</p>
        <!-- <img class="c-img" v-lazy="!item.coverPhoto?getImg('house-info.png'):item.coverPhoto"/> -->
        <img
          class="c-img"
          v-if="item.coverPhoto"
          v-lazy="{src: item.coverPhoto,loading: getImg('house-info.png')}"
        >
        <img class="c-img" v-if="!item.coverPhoto" src="../assets/img/house-info.png">
      </div>
      <div class="house-desc">
        <p v-if="title =='转发最多项目'|| title =='访问最多的项目'">{{item.name | limit1}}</p>
        <p v-else>{{item.name}}</p>
        <span class="brownCount" v-if="title =='转发最多项目'">{{item.count}}次转发</span>
        <span class="brownCount" v-if="title =='访问最多的项目'">{{item.count}}次访问</span>
        <p class="house-desc-tips">
          <span>{{item.effectiveTypeOfProjectString}}</span>
          <span>{{item.buildingPropertyString}}</span>
        </p>
        <p>
          均价
          <span>{{item.buildingPrice}}</span>元/m²
        </p>
        <p>
          <i class="iconfont icon-location"></i>
          <span>{{item.city}} {{item.area}}</span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import { MIXINS } from "../assets/JS/mixins";
import { mapMutations } from "vuex";
import draggable from "vuedraggable";
export default {
  name: "building",
  mixins: [MIXINS],
  props: {
    house: {
      type: Array,
      default: []
    },
    boObject: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      draggable: false,

      componentData: {
        props: {
          type: "transition",
          name: "flip-list"
        }
      }
    };
  },
  methods: {
    // 删除
    remove(index, moveId) {
      console.log(index);

      this.$ajax
        .put("/api/managementProjectDeletion", {
          id: moveId
        })
        .then(res => {
          res = res.data;
          if (res.status === 200) {
            this.house.splice(index, 1);
            // this.$emit("refreshList"); //删除成功后重新调用列表页刷新
            this.$vux.toast.text("删除成功", "middle");
          } else {
            this.$vux.toast.text(res.message, "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text(err, "middle");
        });
    },
    toDetails(item) {
      if (this.boObject) {
        if (item.projectResident) {
          this.changeStorePID(item.id);
          this.changeStoreCType(1);
          this.changeStoreCNmae(item.name);
          this.changeStoreShowpopup(2);
          if (this.$route.query.c_search) {
            this.$router.go(-2);
          } else {
            this.$router.go(-1);
          }
        } else {
          this.$vux.toast.text("项目没有分配驻场不能选择", "middle");
        }
      } else {
        if (item.is_del == 1) {
          this.$vux.toast.text("项目已被删除", "middle");
        } else {
          this.$router.push({
            path: "houseDetails",
            query: {
              id: item.id
            }
          });
        }
      }
    },
    ...mapMutations([
      "changeStorePID",
      "changeStoreCType",
      "changeStoreCNmae",
      "changeStoreShowpopup"
    ]),
    // 拖拽---开始
    onStart() {
      this.draggable = true;
      this.$emit("draggable", this.draggable);
      console.log(this.draggable);
    },
    // 拖拽---结束
    onEnd() {
      this.draggable = false;
      this.$emit("draggable", this.draggable);
      console.log(this.draggable);
    },
    moved(evt) {
      console.log(evt);
      console.log(this.house);
      console.log(`我是移动了：${evt.moved.oldIndex - evt.moved.newIndex}个`);

      let moveArr = [];
      // 表示移到后面去了
      if (evt.moved.newIndex > evt.moved.oldIndex) {
        // 修改移动的元素的sort
        let preMoveIndex = this.house.indexOf(evt.moved.element) - 1; //移动后，该元素再数组中的前一个元素的索引

        this.house[preMoveIndex + 1].sort = this.house[preMoveIndex].sort + 1;
        console.log(`我是移动后的sort,${evt.moved.element.sort}`);
        console.log(this.house);
        moveArr = this.house.slice(evt.moved.oldIndex, evt.moved.newIndex + 1);
        console.log("移到后面");
        console.log("我是变化前的");
        console.log(moveArr);
        moveArr.forEach((element, index) => {
          element.sort = element.sort - 1;
        });
        console.log("我是变化后的");
        console.log(moveArr);
      } else {
        // 移到前面去了
        let preMoveIndex1 = this.house.indexOf(evt.moved.element) + 1; //移动后，该元素再数组中的后一个元素的索引
        this.house[preMoveIndex1 - 1].sort = this.house[preMoveIndex1].sort - 1;
        console.log(`我是移动后的sort,${evt.moved.element.sort}`);
        console.log(this.house);
        moveArr = this.house.slice(evt.moved.newIndex, evt.moved.oldIndex + 1);

        console.log("我是变化前的");
        console.log(moveArr);
        moveArr.forEach((element, index) => {
          element.sort = element.sort + 1;
        });
        console.log("我是变化后的");
        console.log(moveArr);
      }
      let param = {
        id: localStorage.getItem("userMessageId"),
        list: JSON.stringify(moveArr)
      };
      console.log(param);
      this.$ajax
        .put("/api/projectManagementSort", param)
        .then(res => {
          if (res.data.status == 200) {
            console.log(res);
          } else {
            this.$vux.toast.text("拖拽过快", "middle");
          }
        })
        .catch(err => {
          this.$vux.toast.text(this.$error[err], "middle");
        });
    }
  },

  components: {
    draggable
  },
  computed: {
    dragOptions() {
      return {
        scrollFn: function(
          offsetX,
          offsetY,
          originalEvent,
          touchEvt,
          hoverTargetEl
        ) {
          offsetX = 0;
        }
      };
    }
  },
  filters: {
    limit1: function(str) {
      if (str) {
        return str.length > 9 ? str.slice(0, 9) + "..." : str;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

.artice {
  &-content {
    border-top: 1px solid @border-eb;

    &-house {
      background-color: @bg-ff;
      li {
        padding: 30px;
        border-bottom: 1px solid @border-eb;
        display: flex;
        background: white;
        position: relative;
        .fa {
          position: absolute;
          right: 0;
          top: 0;
          background: url("../assets/img/drap.png") no-repeat center center;
          background-size: 6.5vw 3.5vw;
          z-index: 111;
          border: 0;
          padding: 4.5vw 7.5vw 5.5vw;
          box-sizing: content-box;
        }
        .delete_item {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          right: -16vw;
          width: 16vw;
          height: 100%;
          font-size: 4vw;
          color: white;
          background: red;
        }
        .house-window {
          width: 240px;
          -webkit-border-radius: @border-radiaus;
          -moz-border-radius: @border-radiaus;
          border-radius: @border-radiaus;
          margin-right: 30px;
          position: relative;
          overflow: hidden;

          > img {
            width: 100%;
            border-radius: @border-radiaus;
          }
        }

        .house-desc {
          flex: 1;
          position: relative;
          > .brownCount {
            position: absolute;
            right: 0vw;
            top: 0vw;
            color: #999;
            font-size: 3.2vw;
          }
          > p {
            &:first-of-type {
              @font-size-h3();
              font-size: @font-size-m;
              margin-bottom: 15px;
              max-width: 400px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            &:nth-of-type(3) {
              color: @color-orange;
              padding: 8px 0px 0px;
              > span {
                @font-size-h3();
              }
            }

            &:last-of-type {
              display: flex;
              align-items: center;
              font-size: @font-size-s;
              > i {
                font-size: @font-size-icon-m;
              }
              > span {
                color: @color-assist;
              }
            }
          }

          &-tips {
            > span {
              display: inline-block;
              color: @color-green;
              background-color: @bg-E7;
              font-size: @font-size-xs;
              margin-right: 14px;
              padding: 0 10px;
              border-radius: @border-radiaus;
            }
          }
        }
      }
    }
  }

  &.task {
    border-top: 1px solid #c9c9c9;
    margin-top: 30px;
  }
}

.float-state {
  /*width: 100px;*/
  padding: 6px 10px 6px 6px;
  text-align: center;
  background-color: @color-orange;
  color: @color-white;
  font-style: italic;
  font-size: @font-size-s;
  letter-spacing: 4px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  position: absolute;
  top: 15px;
  left: 0;
  z-index: 9;
}

.interProject {
  & > li {
    .house-desc > p:last-of-type > span {
      font-size: 24px;
    }
    .house-window > .c-img {
      width: 240px;
      height: 180px;
    }
  }
}
.artice-content-house li.active {
  transform: translateX(0) !important;
  transition: transform 0 ease 0s !important;
}
</style>
