<template>
  <div class="container">
      <router-view class="tab-view" v-if="isReload"></router-view>
      <ul class="tab">
        <li :class="[currentRoute===item.path?'active':'']" v-for="item in tab" :key="item.index" @click="toLink(item)">
          <span>{{item.name}}</span>
        </li>
      </ul>
  </div>
</template>

<script>
  import guide from '@/pages/guide'
  import {MIXINS} from "@/assets/JS/mixins"

  export default {
    mixins:[MIXINS],
    components: {
      guide
    },
    data() {
      return {
        swiperShow: true,
        isReload: true,
        tab: [
          {
            index: 1,
            name: '首页',
            path: 'home',
            tab: 'home-tab-1@2x.png'
          },
          {
            index: 2,
            name: '客户',
            path: 'user',
            tab: 'home-tab-2@2x.png'
          },
          {
            index: 3,
            name: '项目',
            path: 'house',
            tab: 'home-tab-3@2x.png'
          },
          {
            index: 4,
            name: '我的',
            path: 'mine',
            tab: 'home-tab-4@2x.png'
          }
        ],
        currentRoute:'home'
      }
    },
    created() {
      this.currentRoute = this.$route.path.split('/')[1]
    },
    activated(){
      this.currentRoute = this.$route.path.split('/')[1]
    },
    methods: {
      toLink: function (item) {
        this.currentRoute = item.path
        this.$router.push({
          path: item.path
        })
      },
    },
   
  }
</script>

<style scoped lang="less">
  @import "~@/assets/CSS/config";
  .guide-page{
    width: 100%;
    height: 100%;
  }
  .entry {
    position: relative;
  }

  .tab {
    height: 100px;
    border-top: 1px solid #EFEFEF;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    background-color: #ffffff;
    > li {
      flex: 1;
      display: inherit;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      &:before{
        content: '';
        width: 42px;
        height: 40px;
        background-size: 100%;
      }
      &.active{
        >span{
          color: @color-green;
        }
      }
      &:first-of-type{
        &:before{
          background-image: url("~@/assets/img/home-tab-1@2x.png");
        }
        &.active{
          &:before{
            background-image: url("~@/assets/img/home-tab-1-active@2x.png");
          }
        }
      }
      &:nth-of-type(2){
        &:before{
          background-image: url("~@/assets/img/home-tab-2@2x.png");
        }
        &.active{
          &:before{
            background-image: url("~@/assets/img/home-tab-2-active@2x.png");
          }
        }
      }
      &:nth-of-type(3){
        &:before{
          background-image: url("~@/assets/img/home-tab-3@2x.png");
        }
        &.active{
          &:before{
            background-image: url("~@/assets/img/home-tab-3-active@2x.png");
          }
        }
      }
      &:nth-of-type(4){
        &:before{
          background-image: url("~@/assets/img/home-tab-4@2x.png");
        }
        &.active{
          &:before{
            background-image: url("~@/assets/img/home-tab-4-active@2x.png");
          }
        }
      }
      >span{
        font-size: @font-size-s;
      }
      img{
        width: 42px;
      }
    }
  }

  .tab-view {
    padding-bottom: @bottom;
  }
</style>
