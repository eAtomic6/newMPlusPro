<template>
  <div>
      <topbar :title="title" :back="toBack" :rightTool="rightTool" v-on:goBack="goBack"></topbar>
      <div class="videoPlayer" v-if="show">
        <video-player ref="videoPlayer" v-for="(item,index) in scrollList" :key="index"  class="video-player vjs-custom-skin"
              :playsinline="false"
              :options="item"
              @play="onPlayerPlay($event)" 
              @pause="onPlayerPause($event)"
        ></video-player>
      </div>
      <div v-if="!show"  class="videoPlayerText">
        {{msg}}
      </div>
    
  </div>
        
</template>
<script>
import topbar from "@/components/topbar";
import { videoPlayer } from "vue-video-player";
export default {
  name: "BusImg",
  props: ["bId"],
  data() {
    return {
      title: "项目视频",
      toBack: true,
      rightTool: false,
      // 视频播放
      scrollList: [],
      show: true,
      msg: "暂无视频"
    };
  },
  created() {
    let id = this.bId;
    this.getStart();
  },

  methods: {
    goPlayer() {
      console.log(this.$refs.videoPlayer);
      if (!this.$refs.videoPlayer) {
        this.show = false;
      } else {
        this.$refs.videoPlayer[0].player.play();
      }
    },
    onPlayerPlay(player) {},
    onPlayerPause() {},
    goBack() {
      if (this.$refs.videoPlayer)  {
        this.$refs.videoPlayer[0].player.pause();
      }
      this.$emit("status", true);
    },
    getStart() {
      this.$ajax.get("/api/getProjectVideo", { bId: this.bId }).then(res => {
        console.log(res.data);

        if (res.data.status == 200) {
          if (res.data.data.length == 0) {
            this.show = false;
          } else {
            let object = {
              playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
              autoplay: false, //如果true,浏览器准备好时开始回放。
              muted: false, // 默认情况下将会消除任何音频。
              loop: false, // 导致视频一结束就重新开始。
              preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
              language: "zh-CN",
              aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
              fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
              sources: {
                src: res.data.data[0].url //url地址
              },
              poster: res.data.data[0].cover, //你的封面地址
              // width: document.documentElement.clientWidth,
              notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
              controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: true,
                fullscreenToggle: true //全屏按钮
              }
            };
            this.scrollList.push(object);
          }
        }
      });
    }
  },
  components: {
    topbar,
    videoPlayer
  }
};
</script>
<style lang="less">
.vjs-playback-rate {
  display: none;
}
.videoPlayer {
  margin-top: 12vw;
}
.videoPlayerText {
  margin-top: 30vw;
  text-align: center;
  color: #999;
}
// .video-js .vjs-big-play-button{
//   /*
//   播放按钮换成圆形
//   */
//  height: 2em;
//  width: 2em;
//  line-height: 2em;
//  border-radius: 1em;
//  }
</style>
