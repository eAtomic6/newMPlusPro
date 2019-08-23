<!--  -->
<template>
    <transition tag="div" name="wrap">
        <div class="popup-pick unselect" v-if="getShowPopup">
            <div class="mask" @click.stop.prevent="clickMask"></div>
            <div class="popup-wrap">
                <p class="title">
                    <span class="left" @click="cancel">取消</span>
                    <span class="center" v-if="getIsArray&&getPickListArray.length">意向区域</span>
                    <span class="center" v-else>{{getPickList.value}}</span>
                    <span class="right" @click="confirm">确定</span>
                </p>
                <template v-if="getIsArray&&getPickListArray.length">
                    <div class="list-wrap" @touchmove.stop>
                        <ul class="pick-list">
                            <li v-for="(item,index) in getPickListArray" :key="item.ID" class="pick-item" :class="item.ID===initData.district?'active-item':''" @click="selectItem(item,index)">
                                {{item.AreaName}}
                            </li>
                        </ul>
                    </div>
                </template>
                <template v-else-if="isCustomer">
                    <div class="list-wrap" @touchmove.stop>
                        <ul class="pick-list">
                            <li v-for="(item,index) in getPickList.children" :key="item.id" class="pick-item" :class="getShowIndex === index ?'active-item':''" @click="selectItemUp(index)">
                                {{item.value}}
                            </li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <div class="list-wrap" @touchmove.stop>
                        <ul class="pick-list">
                            <li v-for="(item,index) in getPickList.children" :key="item.key" class="pick-item" :class="item.key===initData[getPickList.id]?'active-item':''" @click="selectItem(item,index)">
                                {{item.value}}
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script>
// const initData = {}
export default {
  name: 'popupPick',
  data() {
    return {
      initData: {},
      avtiveItem: {},
      getShowIndex: this.showIndex,
      checkFlag: false
    }
  },
  props: {
    pickList: {
      type: Object,
      default() {
        return {}
      }
    },
    isArray: {
      type: Boolean,
      default: false
    },
    pickListArray: {
      type: Array,
      default() {
        return []
      }
    },
    showPopup: {
      type: Boolean,
      default: false
    },
    isCustomer: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Number,
      default: 0
    },
    contactIndex: {
      //当同一个页面有多个相同选择器时使用
      type: Number,
      default: 0
    }
  },
  methods: {
    selectItem(item, index) {
      this.checkFlag = true
      if (this.getIsArray && this.getPickListArray.length) {
        this.$set(this.initData, 'district', item.ID)
        this.$set(this.initData, 'districtName', item.AreaName)
        // this.$emit('pickSelect', 'intentArea', item.AreaName, this.initData)
      } else {
        this.$set(this.initData, this.getPickList.id, item.key)
        // this.$emit('pickSelect', this.getPickList.id, item.value, this.initData)
      }
      this.avtiveItem = item
    },
    clickMask() {
      this.$emit('clickMask')
    },
    cancel() {
      this.$emit('cancel')
      this.checkFlag = false
    },
    confirm() {
      console.log(this.getPickList)

      // this.checkFlag=false
      console.log('进来了')
      if (this.isCustomer) {
        this.$emit('confirm', this.getShowIndex)
      } else {
        this.$emit('confirm')
        if (!this.checkFlag) {
          return
        }
        if (this.getIsArray && this.getPickListArray.length) {
          this.$emit(
            'pickSelect',
            'intentArea',
            this.avtiveItem.AreaName,
            this.initData
          )
        } else {
          this.$emit(
            'pickSelect',
            this.getPickList.id,
            this.avtiveItem.value,
            this.initData,
            this.contactIndex
          )
        }
        this.checkFlag = false
      }
    },
    selectItemUp(index) {
      this.getShowIndex = index
    }
  },
  computed: {
    getPickList() {
      return this.pickList
    },
    getIsArray() {
      return this.isArray
    },
    getPickListArray() {
      return this.pickListArray
    },
    getShowPopup() {
      return this.showPopup
    }
  },
  watch: {
    showPopup(e) {
      console.log('================popupPick')
      console.log(this.pickList)
      if (e && this.isCustomer) {
        this.getShowIndex = this.showIndex
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/CSS/config';

.popup-pick {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: @font-size-l;
  color: @color-main;
  &.wrap-enter-active,
  &.wrap-leave-active {
    transition: all 0.1s;

    .popup-wrap {
      transition: all 0.1s;
    }

    .mask {
      transition: all 0.1s;
    }
  }

  &.wrap-enter,
  &.wrap-leave-to {
    .popup-wrap {
      transform: translate3d(0, 100%, 0);
    }

    .mask {
      opacity: 0;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }

  .popup-wrap {
    display: flex;
    flex-direction: column;
    position: fixed;
    max-height: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color-white;
    z-index: 999;

    .title {
      display: flex;
      flex: 0 0 110px;
      height: 110px;
      line-height: 110px;
      padding: 0 29px;
      border-bottom: 1px solid #efefef;

      .left,
      .right {
        flex: 0 0 70px;
        font-size: @font-size-l;
      }

      .center {
        flex: 1;
        text-align: center;
        color: @color-main;
        font-size: @font-size-xl;
        font-weight: bold;
      }
      .right {
        text-align: right;
        color: @color-green;
      }
    }

    .list-wrap {
      overflow: auto;
      flex: 0 0 1;
      height: 400px;
      .pick-list {
        display: block;
        padding: 0 30px;
        font-size: @font-size-m;
        .pick-item {
          display: block;
          height: 90px;
          line-height: 90px;
          border-bottom: 1px solid #f2f2f2;
          border-top-style: none;
          &.active-item {
            color: @color-green;
          }
          //   &:focus {
          //     outline: none;
          //     background: red;
          //   }
          &:hover {
            outline: none;
            background: transparent;
            padding: 0;
          }
          &:active {
            outline: none;
            background: transparent;
            padding: 0;
          }
        }
      }
    }
  }
}
</style>