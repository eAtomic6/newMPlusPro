<template>
    <div class="tab" :class="[modal?'active-modal':'']">
        <p v-for="(item,index) in tabList" :key="index" @click.stop="getTab(item)" :class="[(tabActive.name===item.name)&&getShowTab?'active':'']">
            <span>{{item.name}}</span>
            <i class="iconfont icon-triangle" :class="[(tabActive.name===item.name)&&getShowTab?'icon-top_triangle':'']"></i>
        </p>
        <ul class="slider" v-if="tabActive.name!==''&&dropdownState&&!getPicker&&showTab">
            <li @click.stop="getParam('all')">不限</li>
            <li v-for="item in getSlider" :key="item.id" :class="[getActive===item.key?'active':'']" @click.stop="getParam(item)">{{item.value}}</li>
            <li v-if="getInfo">
                <slot name="selectorInfo"></slot>
            </li>
        </ul>
        <div class="slider" v-if="tabActive.name!==''&&dropdownState&&getPicker">
            <slot name="picker"></slot>
        </div>

    </div>
</template>

<script>
const tabInit = {
  name: '',
  param: ''
}

export default {
  name: 'dropdown',
  props: {
    tab: {
      type: Array,
      default: []
    },
    slider: {
      type: Array,
      default: []
    },
    picker: {
      type: Boolean,
      defaultf: false
    },
    info: {
      type: Boolean,
      default: false
    },
    showTab: {
      type: Boolean,
      default: true
    },
    clearPrice: {
      //使用自定义li时，清楚当前列表选项
      type: Boolean,
      default: false
    },
    modal: {
      //重置激活的tab和模态窗状态
      type: Boolean,
      default: false
    },
    fatherName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tabActive: tabInit,
      param: {},
      dropdownState: false,
      dropdownParam: {}
    }
  },
  created() {
    // this.dropdownParam = sessionStorage.getItem('dropdownParam') || '{}'
    // this.param = JSON.parse(this.dropdownParam)[this.getFatherName] || {}
  },
  methods: {
    getTab: function(item) {
      //   debugger
      this.tabActive =
        this.tabActive.name === item.name && this.getShowTab ? tabInit : item
      this.dropdownState = true
      this.$emit('getTab', {
        index: item.index
      })
    },
    /**
     * 获取筛选条件
     * @param item
     */
    getParam: function(item) {
      // debugger
      // 筛选条件是否不限
      let value = ''
      if (item === 'all') {
        this.$set(this.param, this.tabActive.param, '')
        value = ''
      } else {
        this.$set(this.param, this.tabActive.param, item.key)
        value = item.value
      }

      let current = {}
      current[this.getFatherName] = JSON.parse(JSON.stringify(this.param))
      this.dropdownParam = sessionStorage.getItem('dropdownParam') || '{}'
      this.dropdownParam = Object.assign(
        {},
        JSON.parse(this.dropdownParam),
        current
      )
      sessionStorage.setItem('dropdownParam', JSON.stringify(this.dropdownParam))
      this.$emit('getParam', this.param, this.tabActive.param, value)

      this.tabActive = tabInit
      this.dropdownState = false
    }
  },
  computed: {
    tabList: function() {
      return this.tab
    },
    getSlider: function() {
      return this.slider
    },
    getPicker: function() {
      return this.picker
    },
    getInfo: function() {
      return this.info
    },
    getShowTab: function() {
      return this.showTab
    },
    getFatherName() {
      return this.fatherName
    },
    /**
     * 获取当前tab项
     * @returns {*}
     */
    getActive: function() {
      // debugger
      return this.param[this.tabActive.param]
    }
  },
  watch: {
    clearPrice: function(val) {
      // debugger
      if (val) {
        this.tabActive = tabInit
        delete this.param['buildingPrice']
      }
    },
    modal: function(val) {
      // debugger
      if (!val) {
        this.tabActive = tabInit
      }
    },
    getFatherName(val) {
      this.dropdownParam = sessionStorage.getItem('dropdownParam') || '{}'
      this.param = JSON.parse(this.dropdownParam)[val] || {}
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/CSS/config';
.tab {
  height: 90px;
  display: flex;
  background-color: @bg-ff;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  &.active-modal {
    &:before {
      content: '';
      position: fixed;
      top: 170px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
  > p {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    &.active {
      color: @color-green;
      > i {
        color: @color-green;
      }
    }
    > span {
      display: inline-block;
      max-width: 180px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
    }
    > i {
      /*position: absolute;
      top: 0;
      right: 10px;*/
      color: @color-assist;
    }
  }
  .slider {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: @bg-ff;
    > li {
      padding: 20px 30px;
      border-top: 1px solid @border-eb;
      &:last-of-type {
        border-bottom: 1px solid @border-eb;
      }
      &.active {
        color: @color-green;
      }
    }
  }
}
</style>


