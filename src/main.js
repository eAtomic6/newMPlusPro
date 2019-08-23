// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {
  ConfirmPlugin,
  ToastPlugin,
  DatetimePlugin
} from 'vux'
import router from './router'
import axios from 'axios'
import store from './store'
import 'swiper/dist/css/swiper.css'
import {
  dropdown
} from '@/assets/JS/dropdown'
import {
  api,
  errorMsg
} from '@/assets/JS/ajax'
import VueClipboard from 'vue-clipboard2'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import VueLazyload from 'vue-lazyload'
import directives from './components/leveMove'
Vue.use(preview)
Vue.use(VueClipboard)
directives.init(Vue);

Vue.config.productionTip = false
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(DatetimePlugin)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  //   error: 'dist/error.png',
  //   loading: 'dist/static/img/loading.gif',
  attempt: 1
})


//c-loading
import cloading from './components/Loading/index.js'
Vue.use(cloading)


// 手机调试
import VConsole from 'vconsole'
const vConsole = new VConsole()
export default vConsole;


// 分享的接口
let ipconfig = "https://newhousesys.jjw.com/"//正式
// let ipconfig = "http://newhousesys.t.jjw.com/"//预2
Vue.prototype.$ipconfig = ipconfig

// 视频
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(VideoPlayer)

//c-scroll
import cscroll from './components/Scroll/index.js'
Vue.use(cscroll)




router.beforeEach((to, from, next) => {
  // debugger
  let token = localStorage['token']
  if (to.matched.some(record => record.meta.needLogin) && (!token || token === null)) {

    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else if (Object.keys(from.query).length === 0) {
    next()
  } else {
    let redirect = from.query.redirect
    if (to.fullPath === redirect) {
      next()
    } else {
      next()
    }
  }
})

// 添加请求拦截
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // debugger
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/login?toast=true')
          break
      }
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  }
)

//1.监听plusready事件
var urlIos, paramIos;
document.addEventListener("plusready", function () {
  // 扩展API加载完毕，现在可以正常调用扩展API

  // 2.监听点击消息事件
  Vue.prototype.$osName = plus.os.name;

  plus.push.addEventListener("click", function (val) {

    console.log("我是从状态栏进来的");
    console.log(plus.os.name);
    if (plus.os.name == 'iOS') {
      console.log("我是打开状态");
      router.push({
        path: urlIos,
        query: paramIos
      })
    } else {
      let payload1 = JSON.parse(val.payload)
      router.push({
        path: payload1.url,
        query: payload1.param
      })
    }
    return false;
  }, false);

  // 监听在线消息事件
  //监听接收到推送消息事件
  plus.push.addEventListener("receive", function (msg) {
    console.log("新消息创建");
    createLocalPushMsg(msg)
  }, false);


  // 监听从后台到前台
  document.addEventListener("resume", function () {
    console.log("我是从后台到前台");
  }, false);



}, false);


//创建本地通知
function createLocalPushMsg(msg) {
  console.log("进入本地通知");
  let content1, payload1;
  if (plus.os.name == 'iOS') {
    console.log("我是苹果")
    console.log(msg);
    if (msg.aps) {
      console.log("我是aps进来的");
      content1 = JSON.parse(msg.payload.json)
      router.push({
        path: content1.url,
        query: content1.param
      })

    } else {
      console.log("我不是aps进来的");
      content1 = msg.payload
      if (content1) {
        urlIos = content1.url;
        paramIos = content1.param;
        payload1 = msg.payload
        var options = {
          "title": content1.title,
        };
        var str = content1.text;
        plus.push.createMessage(str, msg, options);
      }
    }

  } else {
    console.log("我是安卓")
    content1 = JSON.parse(msg.payload)
    payload1 = msg.payload
    var options = {
      "title": content1.title,
    };
    var str = content1.text;
    plus.push.createMessage(str, payload1, options);
  }
}

//创建本地消息的方法
/*
1.3、 createMessage: 创建本地消息
plus.push.createMessage(content, payload, option);

说明： 在本地直接创建推送消息， 并添加到系统消息中心。

参数：

content: (String) 必选 消息显示的内容， 在系统通知中心中显示的文本内容。

payload: (String) 可选 消息承载的数据， 可根据业务逻辑自定义数据格式。

option: (MessageOptions) 可选 创建消息的额外参数， 参考MessageOptions。

返回值： void: 无
*/




Vue.prototype.$dropdown = dropdown
Vue.prototype.$ajax = api
Vue.prototype.$error = errorMsg
Vue.prototype.$axios = axios

// let location;
// if (window.location.host == "newhousesys.t.jjw.com:8091" || window.location.host == "s224.360fdc.com:8091" || window.location.host == "192.168.1.224:8091") {
//   location = window.location.hostname + ":8095";
// } else if (window.location.host == "newhousesys.t.jjw.com:8081" || window.location.host == "s224.360fdc.com:8081") {
//   location = window.location.hostname + ":8091";
// } else if (window.location.host == "newhousesys.t.jjw.com" || window.location.host == "s224.360fdc.com") {
//   location = window.location.hostname;
// }
// Vue.prototype.$location = location; //用于分享获得

switch (location) {
  case "newhousesys.t.jjw.com:8091": // 预二
    Vue.prototype.$HTTP = "http://newhousesys.t.jjw.com"
    break;
  case "s224.360fdc.com:8091": // 测二
    Vue.prototype.$HTTP = "http://s224.360fdc.com:18088/ws"
    break;
  case "newhousesys.jjw.com:8081": // 正式
    Vue.prototype.$HTTP = "https://newhousesys.jjw.com"
    break;
  case "localhost:8080":
    Vue.prototype.$HTTP = "http://s224.360fdc.com:18088"
    break;
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  watch: {
    aaa(val) {
      console.log(val);
    }
  }
})
