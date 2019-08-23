<template>
  <div ref="wrapper">
    <div style="min-height: 101%;" ref="content" class="content">
      <div class="top-tip" v-if="pullDownPrompt">
        <span class="refresh-hook" ref="refresh_hook">
          <i class="iconfont icon-arrows-down"></i>下拉刷新
        </span>
      </div>
      <slot></slot>
      <div v-if="LOADING">
        <c-loading></c-loading>
      </div>
      <div class="bottom-tip" v-show="isShow">
        <span class="loading-hook" ref="loading_hook">上拉加载更多</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import { mapState } from "vuex";
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    ifClick: {
      type: Number
    },
    click: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    loadTime: {
      type: Number,
      default: 1000
    },
    pullDownPrompt: {
      type: Boolean,
      default: true
    },
    isLastPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["LOADING"]),
    isShow() {
      if (!this.total || this.total <= 10) {
        return false;
      }
      return this.listenScroll;
    },
    maxScrollY() {
      return this.scroll && this.scroll.maxScrollY;
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.ifClick) {
        this.click = false;
      } else {
        this.click = true;
      }
      this._initScroll();
    }, this.refreshDelay);
  },
  methods: {
    _initScroll() {
      let timeState = true;
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      if (this.listenScroll) {
        this.scroll.on("scroll", pos => {
          if (timeState) {
            // alert(1)

            if (pos.y > 20) {
              this.$refs.refresh_hook.innerHTML =
                '<i class="iconfont icon-slippery"></i>释放立即刷新';
            }
          } else {
            this.$refs.refresh_hook.innerHTML =
              '<i class="iconfont icon-refresh"></i>正在刷新';
          }
        });

        this.scroll.on("touchEnd", pos => {
          if (timeState) {
            if (pos.y > 20) {
              setTimeout(() => {
                this.$refs.refresh_hook.innerHTML =
                  '<i class="iconfont icon-drop_down"></i>下拉刷新';
                this.$emit("scroll");
                this.refresh();
                if (this.total) {
                  this._toastMess(`找到${this.total}条记录`);
                }
                timeState = true;
              }, this.loadTime);
              timeState = false;
            } else if (pos.y < this.scroll.maxScrollY - 20) {
              if (this.total === this.data.length || this.isLastPage) {
                // this.$refs.loading_hook.innerText = '没有了'
                this.$refs.loading_hook.innerText = "到底了...";
                return false;
              } else {
                this.$refs.loading_hook.innerText = "加载中...";
                setTimeout(() => {
                  this.$refs.loading_hook.innerText = "上拉加载更多";
                  this.$emit("scrollToEnd");
                  this.refresh();
                  timeState = true;
                }, this.loadTime);
                timeState = false;
              }
            }
          }
        });
      }
      // this.scrollTo(0,sessionStorage.getItem('currentY'))
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    _toastMess(text) {
      this.$vux.toast.text(text, "middle");
    }
  },
  watch: {
    data(s) {
      // debugger
      if ((s.length !== 0 && this.total === s.length) || this.isLastPage) {
        this.$refs.loading_hook.innerText = "到底了...";
      } else {
        this.$refs.loading_hook.innerText = "上拉加载更多";
      }
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
  // beforeDestroy() {
  //   sessionStorage.setItem('currentY',this.scroll.y)
  // },
};
</script>
<style lang="less">
@import "~@/assets/CSS/config";
.top-tip {
  position: absolute;
  top: -80px;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: @color-minor;
  i {
    color: @color-minor;
    font-size: 50px;
    position: relative;
    top: 5px;
  }
}
.bottom-tip {
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  color: @color-minor;
  background-color: @bg-ff;
  display: block !important;
}
</style>
