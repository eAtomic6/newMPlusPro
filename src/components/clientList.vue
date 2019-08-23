<!--  -->
<template>
    <div class="client-list">
        <li class="item" v-for="(item,index) in getList" @click="selectItem(item,index)" :key="index" ref="sth">
            <!-- <p class="pic"></p> -->
            <p class="pic">{{item.c_name|nameFormatter}}</p>
            <div class="rest-time" v-if="item.flag">{{item.hour}}h</div>
            <img src="../assets/img/toPublic@2x.png" alt="即将掉公" class="to-public" v-if="item.flag">
            <div class="info">
                <p class="name"><span>{{item.c_name | maxLen}}</span>
                    <span class="tel">{{item.phone}}</span>
                    <span class="lock">{{item.level}}-
                        <template v-if="item.lock_state_zh&&activeLink!='link'">{{item.lock_state_zh}}-</template>{{item.follow_state}}{{item.male_guest_type==1?"- 公司":item.male_guest_type==2?"- 部门":""}}</span>
                </p>
                <p class="client text-ellipsis">意向：{{getIntent(item)}}</p>
                <p class="follow">
                    <span :class="{'red':item.flag}">{{item.owner_name}}
                      <span class="orange">{{item.not_follow_day}}</span> 天未跟进
                    </span>
                    <span class="time">{{getDay(item.create_time)}} 登记</span>
                </p>
            </div>
        </li>
    </div>
</template>

<script>
import { FILTERS, TIME } from '@/assets/JS/mixins'

export default {
  name: 'clientList',
  mixins: [FILTERS],
  data() {
    return {
      userName: '',
      activeLink:''
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    getSurname(name) {
      return name.substring(0, 1)
    },
    selectItem(item,index) {
      this.$emit('selectItem', item)
      // 从哪个元素,从哪一页进去
      // this.$emit('getEl',this.$refs.sth[index],Math.ceil((index+1)/10))
      console.log("从哪个元素,从哪一页进去");
      this.$emit('getEl',Math.ceil((index+1)/10))
    },
    getDay(str) {
      let strArr = str.split(' ')[0].split('-')
      let string = ''
      strArr.forEach((item, i) => {
        if (i == 0) {
          string = item + '年'
        } else if (i == 1) {
          string = string + item + '月'
        } else {
          string = string + item + '日'
        }
      })
      return string
    },
    getIntent(item) {
      let str = ''
      if (
        item.intent_item ||
        item.house_price ||
        item.house_acreage ||
        item.house_type ||
        item.house_intent ||
        item.house_reason
      ) {
        str =
          this.getStr(item.intent_item) +
          ' ' +
          this.getStr(item.house_price) +
          ' ' +
          this.getStr(item.house_acreage) +
          ' ' +
          this.getStr(item.house_type) +
          ' ' +
          this.getStr(item.house_intent) +
          ' ' +
          this.getStr(item.house_reason) +
          '-有意向'
      } else {
        str = '暂无需求'
      }
      return str
    },
    getStr(str) {
      return str || ''
    }
  },
  computed: {
    getList() {
      this.activeLink = sessionStorage.getItem('activeLink')
      console.log('===================')
      console.log(this.activeLink)
      return this.list
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/CSS/config';
.client-list {
  padding: 0 30px;
  background: #fff;
  .item {
    position: relative;
    display: flex;
    padding: 40px 0;
    list-style: none;
    border-bottom: 1px solid @border-eb;
    &:last-child {
      border-bottom: none;
    }
    .pic {
      margin-right: 24px;
      flex: 0 0 94px;
      width: 94px;
      height: 94px;
      line-height: 94px;
      font-size: 46px;
      border: 1px solid @color-green;
      border-radius: 50%;
      background: #eef6e9;
      text-align: center;
      color: @color-green;
    }
    .rest-time {
      font-size: 26px;
      color: #fff;
      font-weight: bold;
      line-height: 96px;
      width: 96px;
      text-align: center;
      position: absolute;
      border-radius: 50%;
      left: 0px;
      top: 41px;
      background: url('../assets/img/clock.png') no-repeat;
      background-position: center;
      background-size: 84px 84px;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .to-public {
      position: absolute;
      width: 160px;
      height: 70px;
      right: 0;
      top: 75px;
    }
    .info {
      flex: 1;
      width: 300px;
      .name {
        position: relative;
        margin-bottom: 17px;
        height: 36px;
        line-height: 36px;
        top: -6px;
        @font-size-h3();
        display: flex;
        justify-content: space-between;
        > .tel {
          display: inline-block;
          // margin-left: 30px;
        }
        > .lock {
          // float: right;
          font-size: 24px;
          font-weight: 400;
          color: @color-orange;
        }
      }
      > .client {
        width: 100%;
        height: 46px;
        line-height: 46px;
        font-size: @font-size-m;
        color: @color-minor;
      }
      > .follow {
        margin-top: 17px;
        height: 30px;
        line-height: 30px;
        font-size: @font-size-s;
        color: #999;
        > .time {
          float: right;
        }
        > .red {
          color: @color-red;
        }
         .orange {
          color: @color-orange;
          font-weight: 600;
        }
      }
    }
  }
}
</style>