<template>
  <ul class="data-list">
    <li v-for="(item,index) in getList"  @click="toDetail(item,index)" ref="sth">
      <div class="list-item-title">
        <p>{{item.c_name | nameFormatter}}</p>
        <div class="title-desc">
          <p>
            <span>{{item.c_name|maxLen(5)}}</span>
            <span>{{item.phone}}</span>
            <span>{{item.state}}</span>
          </p>
          <p>客户编号：【{{item.c_no}}】</p>
        </div>
      </div>
      <ul class="list-item-context">
        <li>{{getManage}}项目：{{item.b_name}}</li>
        <li>项目状态：{{item.project_state}}</li>
        <li>
          <div v-if="item.reporting_type == 2">定点保护期：{{item.period_time}}</div>
          <div v-else>{{getManage}}保护期：{{item.valid_time}}小时</div>
        </li>
        <li>楼盘性质：{{item.building_property}}</li>
      </ul>
      <p class="list-item-footer">
        <span>{{getManage}}人：{{item.pc_name}}-{{item.pc_dep_name}}</span>
        <span>{{item.create_time}}</span>
      </p>
    </li>
     <!-- 2s后消失的弹框 -->
  </ul>
</template>

<script>
import { FILTERS } from "@/assets/JS/mixins";
import { Toast } from "vux";
export default {
  mixins: [FILTERS],
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    card: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show2: false,
      toastTxt: ""
    };
  },
  methods: {
    toDetail(item,index) {
      let param = {
        customerId: item.c_id
      };
       this.$emit("getDetails", item);
      // this.$ajax.get("/api/prc/customer", param).then(res => {
      //   if (res.data.status == 200) {
      //     console.log(222);
      //     this.$emit("getDetails", item);
      //   } else {
      //     console.log(111);

      //      this.$vux.toast.text("客户已被其他人锁定", "middle");
      //   }
      // });
      
      // 从哪个元素,从哪一页进去
      // this.$emit('getEl',this.$refs.sth[index],Math.ceil((index+1)/10))
      this.$emit('getEl',Math.ceil((index+1)/10))
    }
  },
  computed: {
    getList: function() {
      return this.list;
    },
    getManage: function() {
      if (this.card === "我的报备") {
        return "报备";
      } else {
        return "带看";
      }
    }
  },
  filters: {
    nameFormatter: function(val) {
      if (!val) {
        return "无";
      } else {
        return val.substr(0, 1);
      }
    }
  },
  components: {
    Toast
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

.data-list {
  background-color: @bg-f5;
  > li {
    padding: 30px;
    margin-bottom: 30px;
    background-color: @bg-ff;
    .list-item-title {
      display: flex;
      > p {
        width: 94px;
        height: 94px;
        border: 1px solid @color-green;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        color: @color-green;
        background-color: @bg-E7;
        display: inherit;
        justify-content: center;
        align-items: center;
        @font-size-h2();
      }
      .title-desc {
        flex: 1;
        margin-left: 30px;
        > p {
          font-size: @font-size-m;
          &:first-of-type {
            overflow: auto;
            @font-size-h3();
            > span:first-of-type {
              margin-right: 10px;
            }
            > span:last-of-type {
              float: right;
              color: @color-orange;
              font-weight: 400;
              font-size: @font-size-s;
            }
          }
          &:nth-of-type(2) {
            color: @color-assist;
            margin-top: 20px;
          }
        }
      }
    }
    .list-item-context {
      display: flex;
      flex-wrap: wrap;
      margin: 20px 0;
      > li {
        width: 50%;
        color: @color-minor;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:first-of-type,
        &:nth-of-type(2) {
          margin: 0 !important;
        }
        &:nth-of-type(2n-1) {
          margin-top: 8px;
        }
        &:nth-of-type(2n) {
          margin-top: 8px;
        }
      }
    }
    .list-item-footer {
      overflow: auto;
      color: #c9c9c9;
      font-size: @font-size-s;
      > span {
        &:first-of-type {
          display: inline-block;
          width: 274px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:last-of-type {
          float: right;
        }
      }
    }
  }
}
</style>
