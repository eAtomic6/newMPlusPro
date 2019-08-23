<template>
  <div class="videoList">
    <div class="search-bar">
      <i class="iconfont icon-back topbar-left" @click="goBack"></i>
      <p class="iconfont">
        <input
          type="text"
          placeholder="请输入内容"
          v-model="inputVal"
          @keyup.enter="getResult(inputVal)"
          ref="search"
        >
      </p>
    </div>
    <c-scroll
      id="content"
      :data="scrollList"
      :total="total"
      :listenScroll="listenScroll"
      @scrollToEnd="pullupMore"
      @scroll="pullDownRefresh"
    >
      <div>
        <ul>
          <li v-for="(item,index) in scrollList">
            <video-player
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="item"
              @play="onPlayerPlay(index)"
              @pause="activeIndex==index?onPlayerPause(index):''"
            ></video-player>
            <div class="clearfix">
              <span>{{item.name}}</span>
              <span>{{item.time}}</span>
            </div>
          </li>
        </ul>
      </div>
    </c-scroll>
  </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
export default {
  data() {
    return {
      inputVal: "",
      // 视频播放
      listenScroll: true,
      scrollList: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      name: "",
      pages: "",
      activeIndex: 0
    };
  },
  created() {
    this.getVedioListAjax();
  },
  methods: {
    onPlayerPause(val) {
      console.log(val);
      console.log("暂停");
    },
    onPlayerPlay(val) {
      console.log(val);
      console.log("播放");
      this.activeIndex = val;

      for (let index = 0; index < this.$refs.videoPlayer.length; index++) {
        if (val == index) {
          this.$refs.videoPlayer[val].player.play();
        } else {
          const element = this.$refs.videoPlayer[index];
          element.player.pause();
        }
      }
    },
    goBack() {
      if (this.$route.query.goId == 1) {
        this.$router.push("/login?flase=false");
      } else if (this.$route.query.goId == 2) {
        this.$router.go(-1); //返回上一页
      }
    },
    getResult(val) {
      this.name = val;
      this.scrollList = [];
      this.getVedioListAjax();
    },
    /**
     * 加载更多
     */
    pullupMore() {
      this.pageNum = this.pageNum + 1;
      if (this.pageNum <= this.pages) {
        this.getVedioListAjax();
      }
    },
    /**
     * 下拉刷新
     */
    pullDownRefresh() {
      this.scrollList = [];
      this.pageNum = 1;
      this.getVedioListAjax();
    },
    /**
     * 获取视频列表数据
     */
    getVedioListAjax() {
      let that = this;
      let param = Object.assign({}, that.vedioFrom, {
        pageNum: that.pageNum,
        pageSize: that.pageSize,
        isOnshelve: true,
        name: this.name,
        companyId: JSON.parse(localStorage.getItem("userMessage")).companyId
      });
      this.$ajax.get("/api/media/public", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          let getData = res.data;
          if (this.total === 0) {
            this.total = getData.total;
            this.pages = getData.pages;
            getData.list.forEach(element => {
              let playerOption = {
                // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: "zh-CN",
                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: {
                  src: element.url //url地址
                },
                poster: element.cover, //你的封面地址
                notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                  remainingTimeDisplay: true,
                  fullscreenToggle: true //全屏按钮
                },
                name: element.name,
                time: element.onshelveTime
              };
              that.scrollList.push(playerOption);
              console.log("我是视频列表");
              console.log(that.scrollList);
            });
          } else {
            getData.list.forEach(element => {
              let playerOption = {
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: "zh-CN",
                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: {
                  src: "" //url地址
                },
                poster: element.cover, //你的封面地址
                notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                  timeDivider: true,
                  durationDisplay: true,
                  remainingTimeDisplay: true,
                  fullscreenToggle: true //全屏按钮
                },
                name: element.name,
                time: element.onshelveTime
              };
              playerOption.sources.src = element.url;
              that.scrollList.push(playerOption);
            });
          }
        }
      });
    }
  },
  components: {
    videoPlayer
  }
};
</script>

<style lang="less">
@import "~@/assets/CSS/config";
.videoList {
  background-color: @bg-ff;
  .search-bar {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid @border-eb;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    > i {
      color: #333;
      font-weight: 600;
      font-size: 8vw;
      padding-left: 2vw;
    }
    > p {
      flex: 1;
      display: inherit;
      height: 70px;
      margin-left: 2vw;
      padding: 0 20px 0 60px;
      background-color: @bg-f0;
      border-radius: @border-radiaus;
      position: relative;
      margin-right: 4vw;

      &:before {
        content: "\e60b";
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        font-size: @font-size-icon;
        color: @color-assist;
      }

      > input {
        display: inline-block;
        width: 100%;
        border: 0px;
        width: 100%;
        background-color: @bg-f0;
        align-self: center;
        font-size: @font-size-m;

        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          font-size: @font-size-m;
        }
      }
    }

    > span {
      padding: 0 30px;
    }
  }
  #content {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 80px;
    bottom: 0;
    left: 0;
    right: 0;
    &.ban-scroll {
      overflow: hidden;
    }
    ul {
      li {
        &:nth-of-type(1) {
          margin-top: 1vw;
        }
        margin-top: 3vw;
        background-color: #fff;
        .clearfix {
          width: 100%;
          span {
            padding: 2vw 4vw;
            &:nth-of-type(1) {
              color: #333;
              font-size: 3.7333vw;
              float: left;
            }
            &:nth-of-type(2) {
              color: #999;
              font-size: 3.7333vw;
              float: right;
            }
          }
        }
      }
    }
  }
  .vjs-playback-rate {
    display: none;
  }
}
</style>

