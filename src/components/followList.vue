<template>
  <ul class="data-list">
    <li v-for="(item,index) in getList" @click="toDetail(item,index)" ref="sth">
      <slot name="li-left" v-bind:li="item"></slot>
      <div class="list-item-desc">
        <p class="desc-title">
          <slot name="li-right-title" v-bind:li="item"></slot>
        </p>
        <p :class="[getWrap?'no-wrap':'']">
          <slot name="li-right-content" v-bind:li="item"></slot>
        </p>
        <p>
          <slot name="li-right-footer" v-bind:li="item"></slot>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import { MIXINS, FILTERS } from "@/assets/JS/mixins";

export default {
  mixins: [FILTERS, MIXINS],
  props: {
    list: {
      type: Array,
      default: []
    },
    nowrap: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getList: function() {
      return this.list;
    },
    getWrap: function() {
      return this.nowrap;
    }
  },
  methods: {
    toDetail(item,index) {
      console.log("haha");
      console.log(item.type);
      console.log(item.id);
      let param = {
        noticeId: item.id || item.c_id
      };
      console.log(item.c_id);
      // if (!item.c_id) {
      //   console.log("我是item.id");
      //   this.$ajax.get("/api/notice", param).then(res => {
      //     console.log("我是进入notice");
      //     console.log(res.data);
      //     if (res.data.status == 200) {
      //     console.log("haha凄凄切切群群群");
      //     console.log(res.data);
      //       if (res.data.data.type == 4) {
      //         this.$ajax
      //           .get("/api/prc/customer", {
      //             customerId: JSON.parse(res.data.data.context).id
      //           })
      //           .then(resp => {
      //             console.log("11111");
      //             console.log(resp.data.data);
      //             if (resp.data.status != 3010 || resp.data.data) {
      //               this.$emit("getDetails", item);
      //             } else {
      //               this.$vux.toast.text("客户已被其他人锁定", "middle");
      //             }
      //           });
      //       } else {
      //         console.log("亲嘻嘻嘻寻寻寻寻寻寻");
      //         this.$emit("getDetails", item);
      //       }
      //     }
      //   });
      // } else {
      //   console.log("我是item.c_id");
      //   this.$ajax.get("/api/prc/customer", {
      //       customerId: item.c_id
      //     })
      //     .then(resp => {
      //       console.log("11111");
      //       console.log(resp.data.data);
      //       if (resp.data.data) {
      //         this.$emit("getDetails", item);
      //       } else {
      //         this.$vux.toast.text("客户已被其他人锁定", "middle");
      //       }
      //     })
      //     .catch(err => {
      //       this.$vux.toast.text("客户已被其他人锁定", "middle");
      //     });
      // }
        this.$emit("getDetails", item);
      // 从哪个元素,从哪一页进去
      // this.$emit('getEl',this.$refs.sth[index],Math.ceil((index+1)/10))
      this.$emit('getEl',Math.ceil((index+1)/10))
    }
  }
};
</script>

<style scoped lang="less">
@import "~@/assets/CSS/config";

.data-list {
  background-color: @bg-ff;

  > li {
    display: flex;
    margin: 0 30px;
    padding: 40px 0;
    border-bottom: 1px solid @border-eb;

    .float-left-logo {
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

    .list-item-desc {
      margin-left: 30px;
      flex: 1;

      > p {
        overflow: auto;

        &.desc-title {
          @font-size-h3();

          > span {
            margin-right: 20px;
            &:last-of-type {
              color: @color-orange;
              float: right;
              margin: 0;
              font-weight: 400;
              font-size: @font-size-s;
            }
          }
        }

        &:nth-of-type(2) {
          margin: 20px 0;
          line-height: 1.6;
          color: @color-minor;
          font-size: @font-size-m;
          &.no-wrap {
            width: 500px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &:last-of-type {
          color: @color-assist;
          font-size: @font-size-s;

          .desc-footer-left {
            display: inline-block;
            width: 274px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .desc-footer-right {
            float: right;
          }
        }
      }
    }
  }
  .follow-img {
    width: 88px;
    height: 88px;
    border-radius: 50%;
  }
  .message-img {
    width: 94px;
    height: 94px;
    border-radius: 50%;
  }
}
</style>


