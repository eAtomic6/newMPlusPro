<template>
  <div class="swiper-main">
    <swiper :options="swiperOption" ref="mySwiper" @slideChangeTransitionStart="end">
      <!-- slides -->
      <swiper-slide class="guide-img guide-img-bj1"></swiper-slide>
      <swiper-slide class="guide-img guide-img-bj2"></swiper-slide>
      <swiper-slide class="guide-img guide-img-bj3"></swiper-slide>
      <swiper-slide class="guide-img guide-img-bj4">
        <p class="operation">
          <span class="operation-btn" @click="start">立即登录</span>
        </p>
      </swiper-slide>
    </swiper>
    <div class="btn-top" @click="start">跳过</div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";

import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "guide",
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption: {
        initialSlide: 0
      },
      paginationHidden: true
    };
  },
  mounted() {
    // console.log('this is current swiper instance object', this.swiper)
    // localStorage.setItem("imgFlag", JSON.stringify({ "flag": true }));
  },
  methods: {
    end: function(event) {
      if (this.swiper.activeIndex >= 3) {
        this.paginationHidden = false;
      } else {
        this.paginationHidden = true;
      }
      // console.log(this.swiper.activeIndex)
    },
    start: function() {
      this.$emit("swiperHidden", { state: true });
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  }
};
</script>

<style scoped lang="less">
.operation {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 50px;
  z-index: 9;

  &-btn {
    background-color: #5ca52a;
    color: #fff;
    display: inline-block;
    width: 300px;
    line-height: 80px;
    border-radius: 40px;
    font-size: 32px;
  }
}

// 光标
/deep/.swiper-pagination {
  bottom: 60px;

  .swiper-pagination-bullet {
    width: 16px;
    height: 16px;
    margin: 0 10px;
    background-color: #e6e6e6;
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: #5ca52a;
    width: 40px;
    border-radius: 8px;
  }
}

// 图片
.img {
  width: 100%;
}
/deep/.swiper-container {
  height: 100%;
}
.guide-img {
  width: 100vw;
  height: 100vh;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: top center;
}
// .guide-img-bj1{
//     background-image: url(../assets/img/guide-img01.png)
// }
// .guide-img-bj2{
//     background-image: url(../assets/img/guide-img02.png)
// }
// .guide-img-bj3{
//     background-image: url(../assets/img/guide-img03.png)
// }
// .guide-img-bj4{
//     background-image: url(../assets/img/guide-img04.png)
// }

// 跳过
.btn-top {
  width: 110px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  right: 34px;
  top: 32px;
  z-index: 2;
}

// 外框
// .swiper-main {
//     overflow-y: hidden;
// }
</style>
