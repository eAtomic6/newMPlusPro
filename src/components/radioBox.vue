<!--  -->
<template>
    <div class="radio-box">
        <label class="label-wrap" v-for="(item,index) in getOptions" :key="item.key">
            <template v-if="index===0&&getOptions.length==1">
                <input type="radio" :name="radioId" :id="radioId+'-'+item.key" :checked="getCheckedIndex(item.key,index)" @click="selectItem(getOptions.length,radioId,index,item.key)" hidden />
            </template>
            <template v-else-if="index===0&&getOptions.length!=1">
                <input type="radio" :name="radioId" :id="radioId+'-'+item.key" :checked="getCheckedIndex(item.key,index)" @click="selectItem(getOptions.length,radioId,index,item.key)" hidden />
            </template>
            <template v-else>
                <input type="radio" :name="radioId" :id="radioId+'-'+item.key" :checked="getCheckedIndex(item.key,index)" @click="selectItem(getOptions.length,radioId,index,item.key)" hidden />
            </template>
            <label :for="radioId+'-'+item.key" class="iconfont icon-select radio-beauty"></label>
            <span class="radio-name">{{item.value}}</span>
        </label>
    </div>
</template>

<script>
export default {
  name: 'radioBox',
  props: {
    options: {
      type: Array,
      default: []
    },
    radioId: {
      type: Number,
      default: 0
    },
    checkedIndex: {
      type: Number,
      default: -1//未选择
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isChecked: true
    }
  },
  computed: {
    getOptions() {
      return this.options
    },
  },
  methods: {
    selectItem(length, radioId, index, key) {
      if (length === 1) {
        this.isChecked = !this.isChecked
      }
      this.$emit('clickRadio', radioId, key)
    },
    getCheckedIndex(key,index) {
        // console.log(key)
        // console.log(index)
        // console.log('===============')
        // console.log(this.checkedIndex)
        if(this.checkedIndex<0){
            if(index == 0){
                return true
            }else{
                return false
            }
        }else{
            if(key===this.checkedIndex){
                return true
            }
        }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/CSS/config';
.radio-box {
  flex: 1;
  font-size: 0;
  .label-wrap{
      display: inline-block;
  }
  .radio-name {
    margin: 0 45px 0 0;
    padding-left: 11px;
    vertical-align: middle;
    color: @color-main;
    font-size: @font-size-m;
  }
  .radio-beauty {
    width: 50px;
    font-size: 50px;
    display: inline-block;
    vertical-align: middle;
  }
  input[type='radio']:checked + .radio-beauty {
    color: @color-green;
  }
}
</style>