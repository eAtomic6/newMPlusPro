import LoadingComponent from './Index.vue'
const loading = {
  install: function(Vue) {
    Vue.component('CLoading', LoadingComponent)
  }
}
export default loading