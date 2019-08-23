<template>
  <div>
    <topbar :title="title" :back="getBack" v-on:goBack="goBack"></topbar>
    <draggable
      tag="ul"
      :list="collectionList"
      class="list-group"
      handle=".handle"
      @start="drag1"
      @end="drag2"
    >
      <div
        v-for="(item,index) in collectionList"
        :key="index"
        class="production_list"
        v-leftMove="{container: '[data-touchmove-con]'}"
      >
        <span class="fa handle"></span>
        {{item.name}}
        <div class="delete_item" v-if="deleteItemShow" @click="deleteItem(index)">删除</div>
      </div>

           <!-- <c-scroll
      ref="bScroll"
      :data="scrollList"
      :total="total"
      :listenScroll="true"
      class="content"
      @scroll="moreData('refresh')"
      @scrollToEnd="moreData('more')"
       v-leftMove="{container: '[data-touchmove-con]'}"
    >
      <div>
        <p class="list-num">
          共
          <span>{{total}}</span>条记录
        </p>
        <building :house="scrollList"></building>
      </div>
    </c-scroll> -->
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import topbar from "@/components/topbar";
import { MIXINS, FILTERS } from "@/assets/JS/mixins";
import building from "@/components/building";
export default {
  mixins: [MIXINS, FILTERS],
  data() {
    return {
      getBack: true,
      title: "项目管理",
      deleteItemShow: true,
      collectionList: [
        { name: "John", text: "", id: 0 },
        { name: "Joao", text: "", id: 1 },
        { name: "Jean", text: "", id: 2 }
      ],
      
    };
  },

  methods: {
    // 删除
    deleteItem(index) {
      this.collectionList.splice(index, 1);
    },
    drag1() {
      this.deleteItemShow = false; //当开始滑的时候禁止出现删除按钮
    },
    drag2() {
      console.log(222);
      this.deleteItemShow = true;
    },
    
  },

  components: {
    draggable,
    topbar,
  }
};
</script>
<style lang="less" scoped>

.list-group {
  margin-top: 11.5vw;
  .draggable {
    position: relative;
  }
  .fa {
    position: absolute;
    right: 5vw;
    top: 2vw;
    display: inline-block;
    width: 12vw;
    height: 12vw;
    background: url("../assets/img/about_us.png") no-repeat 100% 100%;
    background-size: 12vw;
    z-index: 111;
  }
  .production_list {
    margin-bottom: 10px;
    background: white;
    height: 22vw;
    .delete_item {
      position: absolute;
      top: 0;
      right: -16vw;
      width: 16vw;
      line-height: 22vw;
      font-family: PingFangSC-Regular;
      font-size: 4vw;
      text-align: center;
      color: white;
      background: #ff7ea9;
    }
  }
}
</style>
