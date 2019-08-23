<!--  -->
<template>
  <div class="main">
    <topbar :title="title" :back="getBack" @goBack="goBack"></topbar>
    <div class="content">
      <div class="title">
        {{notice.title}}
      </div>
      <div class="writer">
        <span class="name">{{notice.create_by}}</span>
        <span class="time">{{notice.create_time}}</span>
      </div>
      <div class="details">
          <p>{{notice.context}}</p>
      </div>
      <!-- <div class="image">
        <img src="#">
      </div> -->
      <div class="source">
        数据范围 : {{notice.readers}}
      </div>

      <!-- 评论部分一期不做 -->
      
      <!-- <div class="comment">
        <div class="title">评论(3)</div>
        <div class="subject">
          <div class="head">
              <div class="portrait">
                <img src="#">
              </div>
              <div class="name">林允儿-泰妍团队</div>
              <div class="time">2018-07-19 10:55</div>
              <span class="leave iconfont"></span>
          </div>
          <div class="text">
            <p>好日子在今天，大家乐棉棉。不管是男和女、不管是老和少，大家一齐唱，要活得健康，我们的歌声在空气中荡漾。今天是个好日子~ </p>
          </div>
        </div>

        <div class="subject">
          <div class="head">
              <div class="portrait">
                <img src="#">
              </div>
              <div class="name">林允儿-泰妍团队</div>
              <div class="time">2018-07-19 10:55</div>
              <span class="leave iconfont"></span>
          </div>
          <div class="text">
            <p>好日子在今天，大家乐棉棉。不管是男和女、不管是老和少，大家一齐唱，要活得健康，我们的歌声在空气中荡漾。今天是个好日子~ </p>
          </div>
          <div class="reply">
            <div class="triangle"></div>
            <div class="list">
              <span class="name">周杰伦-张三团队</span>回复<span class="name">林允儿-泰妍团队</span> : <span>谢谢你的鼓励~,我会继续努力的!</span>
            </div>
            <div class="list">
              <span class="name">林允儿-泰妍团队</span>回复<span class="name">周杰伦-张三团队</span> : <span>不用客气,一起努力吧!!!!!!</span>
            </div>
          </div>
        </div>

        <div class="subject">
          <div class="head">
              <div class="portrait">
                <img src="#">
              </div>
              <div class="name">林允儿-泰妍团队</div>
              <div class="time">2018-07-19 10:55</div>
              <span class="leave iconfont"></span>
          </div>
          <div class="text">
            <p>好日子在今天，大家乐棉棉。不管是男和女、不管是老和少，大家一齐唱，要活得健康，我们的歌声在空气中荡漾。今天是个好日子~ </p>
          </div>
        </div>
      </div> 
      <div class="write">
        <input type="text" placeholder="写下你的评论">
        <button>发送</button>
      </div> -->
    </div>
  </div>
</template>

<script>
import topbar from "@/components/topbar";
import { MIXINS } from "@/assets/JS/mixins";
import { XTextarea } from "vux";
import { api } from "@/assets/JS/ajax";

export default {
  mixins: [MIXINS],
  components: {
    topbar,
    XTextarea
  },
  data() {
    return {
      title: "项目公告",
      getBack: true,
      value: "",
      id: this.$route.query.id,
      type: this.$route.query.type,
      notice: {}
    };
  },
  created() {
    if(this.type==1){
      this.title="系统公告"
    }
    this.getNotice(this.id);
  },
  methods: {
    getNotice(id) {
      let param = {
        noticeId: id
      };
      this.$ajax.get("/api/notice", param).then(res => {
        res = res.data;
        if (res.status === 200) {
          this.notice = res.data;
        }
      }).catch((err) => {
          this.$vux.toast.text(this.$error[err.response.status], 'middle')
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~@/assets/CSS/config";
.content {
  width: 100%;
  height: 100%;
  background-color: @bg-f5;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  > .title {
    font-size: 46px;
    color: @color-main;
    font-weight: Bold;
    padding: 30px;
    background: @bg-ff;
    border-top: 1px solid @border-ea;
  }
  .writer {
    color: @color-assist;
    font-size: @font-size-m;
    padding: 0 30px;
    background: @bg-ff;
    .name{
      padding-right: 30px;
    }
  }
  .details {
    font-size: @font-size-l;
    color: @color-main;
    padding: 35px 30px 0 30px;
    background: @bg-ff;
    p {
      line-height: 50px;
      text-indent: 60px;
    }
  }
  .image {
    padding: 30px;
    background: @bg-ff;
    img {
      width: 690px;
      height: 400px;
      display: block;
    }
  }
  .source {
    padding: 15px 30px 40px 30px;
    color: @color-assist;
    font-size: @font-size-m;
    background: @bg-ff;
  }
  // .comment {
  //   margin-top: 20px;
  //   padding: 0 30px;
  //   background: @bg-ff;
  //   .title {
  //     height: 114px;
  //     line-height: 114px;
  //     font-size: @font-size-xxl;
  //     color: @color-main;
  //     font-weight: bold;
  //     border-bottom: 1px solid @border-eb;
  //   }
  //   .subject {
  //     padding-top: 40px;
  //     padding-bottom: 40px;
  //     border-bottom: 1px solid @border-ea;
  //     &:last-of-type {
  //       border-bottom: none;
  //     }
  //     .head {
  //       height: 127px;
  //       position: relative;
  //       .portrait {
  //         width: 88px;
  //         height: 88px;
  //         padding-right: 30px;
  //         float: left;
  //         img {
  //           width: 88px;
  //           height: 88px;
  //         }
  //       }
  //       > .name {
  //         color: #5b6a92;
  //         font-size: @font-size-m;
  //         line-height: 48px;
  //       }
  //       > .time {
  //         color: @color-assist;
  //         font-size: @font-size-s;
  //       }
  //       .leave {
  //         width: 40px;
  //         height: 40px;
  //         position: absolute;
  //         right: 0;
  //         top: 50%;
  //         margin-top: -45px;
  //         &:before {
  //           content: "\e60c";
  //           position: absolute;
  //           color: #cdcdcd;
  //           top: 50%;
  //           right: 0;
  //           transform: translateY(-50%);
  //           font-size: @font-size-icon;
  //         }
  //       }
  //     }
  //     .text {
  //       padding-bottom: 40px;
  //       p {
  //         font-size: @font-size-m;
  //         color: @color-main;
  //       }
  //     }
  //     .reply {
  //       padding: 39px 49px 39px 30px;
  //       border-radius: 4px;
  //       background: @bg-f5;
  //       font-size: @font-size-m;
  //       color: @color-main;
  //       position: relative;
  //       .triangle {
  //         height: 0;
  //         width: 0;
  //         border-top: 15px solid white;
  //         border-right: 15px solid white;
  //         border-bottom: 15px solid @bg-f5;
  //         border-left: 15px solid white;
  //         position: absolute;
  //         top: -29px;
  //         left: 20px;
  //       }
  //       .list {
  //         > .name {
  //           color: #5b6a92;
  //         }
  //       }
  //     }
  //   }
  // }
  // .write {
  //   border-top: 1px solid #ebebeb;
  //   padding: 0 30px;
  //   background: @bg-ff;
  //   height: 110px;
  //   > input {
  //     width: 480px;
  //     height: 80px;
  //     margin-top: 14px;
  //     background: rgba(235, 235, 235, 1);
  //     border-radius: 10px;
  //     outline: none;
  //     border: none;
  //     box-sizing: border-box;
  //     &::-webkit-input-placeholder {
  //       color: @color-assist;
  //       font-size: @font-size-m;
  //     }
  //   }
  //   > button {
  //     width: 180px;
  //     height: 80px;
  //     box-sizing: border-box;
  //     background: rgba(199, 199, 199, 1);
  //     border-radius: 10px;
  //     outline: none;
  //     border: none;
  //     font-size: @font-size-m;
  //     color: @color-minor;
  //     float: right;
  //     margin-top: 14px;
  //   }
  // }
}
</style>