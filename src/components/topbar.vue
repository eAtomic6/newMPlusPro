<template>
    <p class="topbar">
      <slot name="topbar-left">
        <span class="iconfont icon-back topbar-left" v-if="getBack" @click="backUp"></span>
      </slot>
      <slot name="topbar-content">
        <span class="topbar-title">{{getTitle}}</span>
      </slot>
      <slot name="topbar-right">
        <span class="iconfont icon-search topbar-right" v-if="getSearch" @click="find"></span>
      </slot>
      <slot name="whose">
        <span class="topbar-left staff-btn iconfont icon-staff" v-if="getMy" @click="whose"> {{staff|maxLen}}</span>
      </slot>
    </p>
</template>

<script>
import {FILTERS} from "@/assets/JS/mixins"
export default {
  name: 'topbar',
  mixins: [FILTERS],
  props: {
    title: {
      type: String,
      default: '吉家'
    },
    back: {
      type: Boolean,
      default: false
    },
    code: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    rightTool: {
      type: Boolean,
      default: true
    },
    operationBtn: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    message: {
      type: Boolean,
      default: false
    },
    read: {
      type: Boolean,
      default: false
    },
    cancelLeft: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    codeRight: {
      type: Boolean,
      default: false
    },
    save: {
      type: Boolean,
      default: false
    },
    finish: {
      type: Boolean,
      default: false
    },

    move: {
      type: Boolean,
      default: false
    },
    evenMore: {
      type: Boolean,
      default: false
    },
    organization: {
      type: Boolean,
      default: false
    },
    lock: {
      type: Boolean,
      default: true
    },
    typeInfo:{
      type:Boolean,
      default:false
    },
    my: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isChecked: true,
      activeLink: 1
    }
  },
  methods: {
    backUp: function() {
      this.$emit('goBack')
    },
    barCode: function() {
      this.$emit('code')
    },
    find: function() {
      this.$emit('find')
    },
    msg: function() {
      this.$emit('msg')
    },
    create: function() {
      this.$emit('addOpera')
    },
    opera: function() {
      this.$emit('opera')
    },
    allRead: function() {
      this.$emit('allRead')
    },
    selectItem: function() {
      this.isChecked = !this.isChecked
    },
    cancel: function() {
      this.$emit('cancel')
    },
    check: function() {
      this.$emit('confirm')
    },
    codeRightFn() {
      this.$emit('codeRightFn')
    },
    clickSave: function() {
      this.$emit('clickSave')
    },
    goFinish: function() {
      this.$emit('goFinish')
    },
    cancelRight: function() {
      this.$emit('cancelRight')
    },
    more_out: function() {
      this.$emit('more_out')
    },
    batch: function() {
      this.$emit('goBatch')
    },
    lockItem() {
      this.$emit('lockFn')
    },
    whose() {
      this.$store.commit('changeStop');
      this.$emit('whose')
    }
  },
  computed: {
    getTitle: function() {
      return this.title
    },
    getBack: function() {
      return this.back
    },
    getCode: function() {
      return this.code
    },
    getSearch: function() {
      return this.search
    },
    getTool: function() {
      return this.rightTool
    },
    getOperationBtn: function() {
      return this.operationBtn
    },
    getAdd: function() {
      return this.add
    },
    getMessage: function() {
      return this.message
    },
    getRead: function() {
      return this.read
    },
    getAddBtn() {
      return this.addBtn
    },
    getCancel: function() {
      return this.cancel
    },
    getCancelLeft: function() {
      return this.cancelLeft
    },
    getConfirm: function() {
      return this.confirm
    },
    getCodeRight() {
      return this.codeRight
    },
    getSave: function() {
      return this.save
    },
    getFinish: function() {
      return this.finish
      console.log(this.finish)
    },

    getMove: function() {
      return this.move
    },
    getEvenMore: function() {
      return this.evenMore
    },
    getOrganization: function() {
      return this.organization
    },
    getLock() {
      return this.lock
    },
    getTypeInfo(){
      return this.typeInfo
    },
    getMy() {
      return this.my
    },
    staff() {
      // if(this.$route.path == '/tipFollow' || this.$route.path == '/user') return
      if(this.$route.path == this.path) {
        let isSelected = sessionStorage.getItem('isSelected')
        if (isSelected == '1') {
          this.$emit('selectMy');  
          sessionStorage.isSelected = 0;
        }
        return this.$route.query.name || '全部'
      }
    },
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/CSS/config';

.topbar {
  width: 100%;
  height: 80px;
  margin: 0;
  background-color: @bg-ff;
  position: absolute;
  top: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  .msg {
    color: @color-green;
    font-size: @font-size-m;
  }
  .edit {
    display: inline-block;
    width: 120px;
    height: 56px;
    line-height: 56px;
    text-align: center;
    border-radius: 6px;
    background: @color-green;
    font-size: @font-size-m;
    color: @bg-ff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .save-btn {
    right: 30px;
    width: 120px;
    height: 56px;
    line-height: 56px;
    background: @color-green;
    border-radius: 6px;
    font-size: @font-size-m;
    text-align: center;
    color: #fff;
  }
  .staff-btn {
    margin-left: 100px;
    display: inline-block;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 30px;
    color: #333;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .cancel {
    color: @color-main;
    font-size: @font-size-m;
  }
  &-title {
    @font-size-h2();
    max-width: 470px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.opera {
      border: 1px solid @color-orange;
      border-radius: 35px;
      color: @color-orange;
      padding: 0 30px;
      background-color: @bg-FB;
    }
  }
  &-left,
  &-right {
    font-size: 60px;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  &-left {
    left: 20px;
  }
  &-right {
    right: 20px;
  }
  &-left {
    left: 20px;
  }
  &-right {
    right: 20px;
    &.with {
      right: 120px;
    }
  }
  .tab-btn {
    display: inline-block;
    width: 160px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 28px;
    color: #333;
    border: 2px solid @color-green;
    box-sizing: border-box;
    &.short {
      width: 120px;
    }
    &.active {
      background: @color-green;
      color: @bg-ff;
    }
    &.left {
      border-bottom-left-radius: 30px;
      border-top-left-radius: 30px;
      border-right: none;
    }
    &.right {
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      border-left: none;
    }
  }
}
</style>


