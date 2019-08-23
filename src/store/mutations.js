import * as types from './mutation-types'
const mutations = {
  [types.SHOW_LOADING](state, res) {
    state.LOADING = res
  },
  setParentName:function(state, res){
    state.parentName = res
  },
  setZhuGuanList:function(state, res){
    state.zhuguanList = res
  },
  setDepartmentMsg:function(state, res){
    state.departmentMsg = res
  },
  setSatrapIDs:function(state, res){
    state.satrapIDs = res
  },
  setDepId:function(state, res){
    state.depId = res
  },
  setOnce:function(state, res){
    state.once = res
  },
  changeStoreCID(state,res){
    state.c_id = res;
    try {
      localStorage.c_id = res
    } catch (e) {
      console.log(e)
    }
  },
  changeStorePID(state,res){
    state.p_id = res;
    try {
      localStorage.p_id = res
    } catch (e) {
      console.log(e)
    }
  },
  changeStoreCType(state,res){
    state.c_type = res;
    try {
      localStorage.c_type = res
    } catch (e) {
      console.log(e)
    }
  },
  changeStoreCNmae(state,res){
    state.c_name = res;
    try {
      localStorage.c_name = res
    } catch (e) {
      console.log(e)
    }
  },
  isBackToTrue(state){
    state.isBack = true
  },
  isBackToFalse(state){
    state.isBack = false
  },
  changeStop(state){
    state.stopActivate = !state.stopActivate
  },
  changeCheck(state,res){
    state.isChecking = res
  },
  changeStoreShowpopup(state,res){
    state.isShowpopup = res
  },

  // 控制网店房源的删除
  // ifDeleteItemShow(state,res){
  //   state.isShowpopup = res
  // },

}
export default mutations
