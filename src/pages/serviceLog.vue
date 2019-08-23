<template>

  <div class="container">
    <topbar :title="title" :back="toBack" :search="toSearch" v-on:goBack="goBack" v-on:find="toFind"></topbar>
    <div class="main">
      <c-scroll ref="bScroll" class="content" :total="total" :data="list" :listenScroll="true" @scrollToEnd="scrollToEnd" @scroll="scrollToTop">
        <p class="list-total" v-show="list.length">共
          <span>{{total}}</span>条记录</p>
        <follow-list :list="list" @getDetails="goDetails" @getEl="getEl">
          <p class="name" slot="li-left" slot-scope="slotProps">
            <span>{{slotProps.li.c_name|nameFormatter}}</span>
          </p>
          <template slot="li-right-title" slot-scope="slotProps">
            <span class="t-name">{{slotProps.li.c_name | maxLen}}</span>
            <span class="t-phone">{{slotProps.li.phone}}</span>
            <span class="t-type">{{slotProps.li.type}}</span>
          </template>
          <template slot="li-right-content" slot-scope="slotProps" class="t-item">意向：{{getIntent(slotProps.li)}}</template>
          <template slot="li-right-footer" slot-scope="slotProps">
            <span class="desc-footer-left">
              <span class="t-day">{{slotProps.li.not_follow_day}}</span>天未跟进</span>
            <span class="t-time">{{slotProps.li.create_time|timeFormatter}}</span>
          </template>
        </follow-list>
      </c-scroll>
      <abnormal v-show="nodata"></abnormal>
    </div>

  </div>
</template>

<script>
import { dateFormat } from 'vux'
import { MIXINS, FILTERS } from "@/assets/JS/mixins"
import topbar from '@/components/topbar'
import followList from '@/components/followList'
import abnormal from '@/components/abnormal'

export default {
  name: 'servicelog',
  mixins: [MIXINS, FILTERS],
  components: {
    topbar,
    followList,
    abnormal
  },
  data() {
    return {
      total: 0,
      title: '服务记录',
      toBack: true,
      toSearch: true,
      pageParam: {
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      nodata: false,
      oldEl: '',
      pageNum: '' //记录需要刷新的页数
    }
  },
  // mounted() {
  //   this.getListData(this.pageParam)
  // },
  methods: {
    scrollToEnd() {
      if (this.total !== this.list.length) {
        this.pageParam.pageNum += 1
        this.getListData(this.pageParam)
      }
    },
    scrollToTop() {
      this.list = []
      this.pageParam.pageNum = 1
      this.getListData(this.pageParam)
    },
    toFind() {
      this.$router.push({
        path: 'search',
        query: {
          title: '服务记录'
        }
      })
    },
    getListData(param,isBack) {
      this.$store.commit('SHOW_LOADING', true)
      this.$ajax.get('/api/services', param).then(res => {
        res = res.data
        if (res.status === 200) {
          this.total = res.data.total
          if(!isBack) {
            this.list = this.list.concat(res.data.list)
          }else {
            this.list.splice((param.pageNum-1)*10,res.data.list.length,...res.data.list);
          }
        }
        this.$store.commit('SHOW_LOADING', false)
        if (this.total === 0) {
          this.nodata = true
        }
        else {
          this.nodata = false
        }
      }).catch((err) => {
        this.$store.commit('SHOW_LOADING', false)
        this._catchMess(err)
      })
    },
    goDetails(item) {
      this.$router.push({
        path: 'customerInfoComplete',
        query: {
          c_id: item.c_id,
          c_phone: 1
        }
      })
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
          ' ' +
          this.getStr(item.b_name) +
          '-有意向'
      } else {
        str = '暂无需求'
      }
      return str
    },
    getStr(str) {
      return str || ''
    },
    _catchMess(err) {
      this.$vux.toast.text(this.$error[err.response.status], 'middle')
    },
  },
  filters: {
    timeFormatter(time) {
      return dateFormat(time, 'YYYY-MM-DD 登记')
    },
    nothing(str) {
      if (str === '' || str === null) {
        return '暂无意向'
      }
      else {
        return str
      }
    }
  },
  activated() {
    // 返回时局部刷新页面并调到指定位置
    if(this.$store.state.isBack) {
      let param = {
        pageNum: this.pageNum,
        pageSize: 10
      }
      this.getListData(param,true)
      // 调用mixins中的方法
      this.goOldEl()
    }else {
      // 不是返回则刷新页面
      this.list = [];
      this.pageParam.pageNum = 1;
      this.getListData(this.pageParam)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/CSS/config';
.main {
  background-color: @bg-f5;
  position: relative;
}
.content {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;
  .list-total {
    padding: 10px 30px;
    > span {
      @font-size-h3();
      color: @color-green;
    }
  }
  .data-list {
    .t-time {
      float: right;
    }
    .name {
      width: 94px;
      height: 94px;
      border: 1px solid @color-green;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      color: @color-green;
      background-color: #eef6e9;
      display: inherit;
      justify-content: center;
      align-items: center;
      @font-size-h2();
    }
    .desc-footer-left {
      .t-day {
        font-weight: bold;
        color: @color-orange;
      }
      .t-time {
        float: right;
      }
    }
  }
}
</style>
