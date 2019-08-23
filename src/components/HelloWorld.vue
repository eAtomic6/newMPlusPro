<template>
  <div class="hello">
    <p>{{ msg }}<span>hello</span></p>
    <button @click="sub">click</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props:{
    listData:{
      type: Object
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created(){
    console.log(this.listData)
  },
  methods:{
    sub:function () {
      this.$emit('getList',{
        data:'hello'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
p{
  font-weight: normal;
  color: red;
  font-size: 12px;
  >span{
    font-size: 20px;
  }
}
</style>
