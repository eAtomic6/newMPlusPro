<template>
    <div class="abnormal">
        <span class="img-wrap" :class="getIconName"></span>
        <span class="word-wrap">{{getWord}}</span>
        <span class="btn" v-if="getIconName==='noNetwork'" @click="againLode">重新加载</span>
    </div>
</template>

<script>
export default {
  name: 'abnormal',
  props: {
    iconName: {
      type: String, //网络异常   暂无消息  暂无客户 暂无任务
      default: 'noClient' //noNetwork,noMessage,noClient,noTask
    },
    newWord: {
      type: String,
      default: ''
    }
  },
  computed: {
    getIconName() {
      return this.iconName
    },
    getWord() {
      if (this.iconName == 'noNetwork') {
        return '网络异常'
      } else if (this.iconName == 'noMessage') {
        return '暂无消息通知'
      } else if (this.iconName == 'noClient') {
        return '暂无客户'
      } else if (this.iconName == 'noTask') {
        return '暂无任务'
      }
    }
  },
  methods: {
    againLode() {
      this.$emit('againLode')
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/CSS/config';
.abnormal {
  margin: 0 auto;
  padding-bottom: 100px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; //弹性盒子对象在主轴上的对齐方式
  align-items: center;
  box-sizing: border-box;
  background-color: #f5f5f5;
  .img-wrap {
    display: inline-block;
    margin-bottom: 15px;
    &.noNetwork {
      width: 416px;
      height: 234px;
      background-image: url('~@/assets/img/abnormal-noNetwork.png');
      background-size: 416px 234px;
    }
    &.noMessage {
      width: 328px;
      height: 256px;
      background-image: url('~@/assets/img/abnormal-noMessage.png');
      background-size: 328px 256px;
    }
    &.noClient {
      width: 328px;
      height: 258px;
      background-image: url('~@/assets/img/abnormal-noClient.png');
      background-size: 328px 258px;
    }
    &.noTask {
      width: 308px;
      height: 267px;
      background-image: url('~@/assets/img/abnormal-noTask.png');
      background-size: 308px 267px;
    }
  }
  .word-wrap {
    height: 98px;
    line-height: 98px;
    font-size: 28px;
    color: #333;
  }
  .btn {
    width: 240px;
    height: 80px;
    line-height: 80px;
    background-color: #5ca52a;
    text-align: center;
    color: #fff;
    border-radius: 6px;
  }
}
</style>
