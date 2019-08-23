let c_id = '';
let p_id = '';
let c_type = 0;
let c_name = '';
try {
  if (localStorage.c_id) {
    c_id = localStorage.c_id
  }
  if (localStorage.p_id) {
    p_id = localStorage.p_id
  }
  if (localStorage.c_type) {
    c_type = localStorage.c_type
  }
  if (localStorage.c_name) {
    c_name = localStorage.c_name
  }
} catch (e) {
  console.log(e)
}

const state = {
  LOADING: false,
  parentName:'',
  zhuguanList:[],
  departmentMsg:{},
  satrapIDs:[],
  depId:'',
  once:true,
  c_id,//客户 id
  p_id,//意向项目 id
  c_type,//0 没有进入，1 进入意向项目并选择了，2 进入意向项目没有选择，
  c_name,//意向项目 名称
  isBack: false, //是否从详情页返回列表页
  stopActivate: false, // 阻止activated里面的函数执行  
  isChecking: false, // 是否在查看页面
  isShowpopup:""
}

export default state
