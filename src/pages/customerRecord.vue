<template>
  <div class="container">
    <topbar :title="title" :back="toBack" v-on:goBack="goBack"></topbar>
    <div class="main" @click="modal=false">
      <dropdown :slider="getSlider" :tab="tab" :modal="modal" v-on:getTab="getTab" v-on:getParam="getDropdownParam"></dropdown>
      <c-scroll ref="bScroll" class="content" :data="scrollList" :total="total" :listenScroll="true" @scroll="getData(newPage)" @scrollToEnd="getData(newPage,0)">
        <div>
          <p class="list-num">共<span>{{total}}</span>条记录</p>
          <follow-list :list="scrollList" :nowrap="true" @getDetails="userDetails" @getEl="getEl">
            <p class="float-left-logo" slot="li-left" slot-scope="slotProps">
              <span>{{slotProps.li.name|nameFormatter}}</span></p>
            <template slot="li-right-title" slot-scope="slotProps">
              <span>{{slotProps.li.name|maxLen}}</span>
              <span>{{slotProps.li.phone | phoneFormatter}}</span>
              <span>{{slotProps.li.level}}-{{slotProps.li.lock_end_time}}-{{slotProps.li.follow_state}}</span>
            </template>
            <template slot="li-right-content" slot-scope="slotProps" class="info">
              意向：
              <span v-if="slotProps.li.house_price">{{slotProps.li.house_price}}</span>
              <span v-if="slotProps.li.house_acreage">面积{{slotProps.li.house_acreage}}</span>
              <span v-if="slotProps.li.house_type">{{slotProps.li.house_type}}</span>
              <span v-if="slotProps.li.intent_item">{{slotProps.li.intent_item}}</span>
              <span v-if="slotProps.li.district">{{slotProps.li.district}}</span>
              <span v-if="slotProps.li.house_intent">{{slotProps.li.house_intent}}</span>
              <span v-if="slotProps.li.house_reason">{{slotProps.li.house_reason}}</span>
              <span v-if="slotProps.li.people_count">居住人数{{slotProps.li.people_count}}人</span>
              <span v-if="!slotProps.li.house_price&&!slotProps.li.house_acreage&&!slotProps.li.house_type&&!slotProps.li.intent_item&&!slotProps.li.district&&!slotProps.li.house_intent&&!slotProps.li.house_reason&&!slotProps.li.people_count">暂无需求</span>
            </template>
            <template slot="li-right-footer" slot-scope="slotProps">
              <span class="desc-footer-left">{{slotProps.li.e_name}}-{{slotProps.li.last_follow_time}}</span>
              <span class="desc-footer-right">{{slotProps.li.create_time}}</span>
            </template>
          </follow-list>
        </div>
      </c-scroll>
    </div>
  </div>
</template>

<script>
  import {MIXINS, FILTERS} from "@/assets/JS/mixins";
  // import {SCROLL} from "@/assets/JS/scroll";

  import topbar from '@/components/topbar'
  import followList from '@/components/followList'
  import dropdown from '@/components/dropdown'

  const tabInit=[
    {
      index: 1,
      name: '客户进展',
      param: 'followState'
    },
    {
      index: 2,
      name: '排序日期',
      param: 'sortingDate'
    },
    {
      index: 3,
      name: '客户级别',
      param: 'level'
    }
  ]

  export default {
    name: "customer-record",
    mixins: [MIXINS, FILTERS],
    components: {
      topbar,
      followList,
      dropdown
    },
    data() {
      return {
        title: '项目客户',
        toBack: true,
        toSearch: true,
        tab: [],
        tabIds: [264, 341, 211],
        selector: null,
        slider: 1,
        modal: false,
        dropdownPayload: {},//下拉筛选条件
        listRequest: '/api/projectCustomerList',
        total: 0,
        currentPage: 1,
        scrollList: [],
        pageNum: '' // 记录需要刷新的页数
      }
    },
    created() {
      // let param = {
      //   id: this.$route.query.buildingId,
      //   pageNum: 1,
      //   pageSize: 10
      // }
      // this.getData(param,0)
      // this.getDropdownData()
    },
    methods: {
      /**
       * 获取下拉筛选数据
       */
      getDropdownData: function () {
        let param = {
          ids: this.tabIds.join(',')
        }
        this.$ajax.get('/api/dictionary/list', param).then(res => {
          res = res.data
          if (res.status === 200) {
            this.selector = res.data
          }
        }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        })
      },
      /**
       * 获取初始列表
       * @param param
       */
      getData: function (param, init = 1,isBack) {
        if (init) {
          this.currentPage = 1
          this.total = 0
          this.scrollList = []
          param.pageNum = 1
        }
        this.$ajax.get(this.listRequest, param).then(res => {
          // debugger
          res = res.data
          if (res.status === 200) {
            this.total = res.data.total
            if (isBack) {
              this.scrollList.splice((param.pageNum-1)*10,res.data.list.length,...res.data.list);
            }else if (this.total > this.scrollList.length) {
              this.currentPage += 1
              this.scrollList = this.scrollList.concat(res.data.list)
            }
          }
        }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        })
      },
      getTab: function (payload) {
        this.modal = ((this.slider === payload.index && this.modal) ? false : true)
        this.slider = payload.index
      },
      /**
       * 筛选列表
       * @param payload
       */
      getDropdownParam: function (payload,tabActive,value) {
        this.tab.forEach((item,index)=>{
          if(item.param===tabActive){
            item.name=!value?tabInit[index].name:value
          }
        })
        this.modal = false
        this.dropdownPayload = payload
        this.getData(this.newPage)
      },
      /**
       * 跳转客户详情页
       * @param payload
       */
      userDetails: function (payload) {
        // debugger
        this.$router.push({
          path:'customerInfoComplete',
          query:{
            c_id:payload.id
          }
        })
      }
    },
    computed: {
      getSlider: function () {
        // debugger
        if (!this.selector) {
          return []
        } else {
          switch (this.slider) {
            case 1:
              return this.selector[this.tabIds[0]].children
              break
            case 2:
              return this.selector[this.tabIds[1]].children
              break
            case 3:
              return this.selector[this.tabIds[2]].children
              break
          }
        }
      },
      newPage: function () {
        let param = {
          id: this.$route.query.buildingId,
          pageNum: this.currentPage,
          pageSize: 10
        }
        // debugger
        param = Object.assign({}, param, this.dropdownPayload)
        // console.log(param)
        return param
      }
    },
    activated() {
      var param = {
        id: this.$route.query.buildingId,
        pageNum: 1,
        pageSize: 10
      }
      // 返回时局部刷新页面并调到指定位置
      if(this.$store.state.isBack) {
        param.pageNum = this.pageNum
        param = Object.assign({}, param, this.dropdownPayload)
        this.getData(param,false,true)
        // 调用mixins中的方法
        this.goOldEl()
      }else {
        // 不是返回则刷新页面
        this.scrollList = []
        this.tab = [{
          index: 1,
          name: '客户进展',
          param: 'followState'
        },
        {
          index: 2,
          name: '排序日期',
          param: 'sortingDate'
        },
        {
          index: 3,
          name: '客户级别',
          param: 'level'
        }]
        this.getData(param)
        this.getDropdownData()
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@/assets/CSS/config";

  .main {
    background-color: #f2f2f2;
    position: relative;
  }

  /*.data-list {
    background-color: #ffffff;
    > li {
      display: flex;
      padding: 10px;
      border-bottom: 1px solid #c9c9c9;
      > p {
        width: 40px;
        height: 40px;
        border: 1px solid orange;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        color: orange;
        display: inherit;
        justify-content: center;
        align-items: center;
      }
      .list-item-desc {
        margin-left: 10px;
        flex: 1;
        > p {
          overflow: auto;
          &.desc-title {
            color: orange;
            > span {
              margin-right: 10px;
              &:last-of-type {
                color: #000;
                float: right;
                margin: 0;
              }
            }
          }
          &:nth-of-type(2){
            width: 300px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            color: #999999;
          }
          &:last-of-type {
            color: #c9c9c9;
            font-size: 12px;
            > span:last-of-type {
              float: right;
            }
          }
        }
      }
    }
  }*/

  .content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 170px;
    bottom: 0;
    left: 0;
    right: 0;
    .list-num {
      padding: 10px 30px;
      > span {
        @font-size-h3();
        color: @color-green;
      }
    }
  }
</style>
