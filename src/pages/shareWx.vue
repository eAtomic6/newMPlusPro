<template>
  <div>分享记录次数</div>
</template>

<script>
export default {
  created() {
    wx.ready(function() {
      //分享朋友圈
      let link = window.location.href;
      alert(link);
      //分享朋友圈
      wx.onMenuShareTimeline({
        title: "分享朋友圈！",
        link: link,
        imgUrl:
          "http://img1.jjdc.net/display/eb4201b5806360b706dc52cc2639c957.jpg", // 分享图标
        trigger: function(res) {
          // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回.
          alert("click shared");
        },
        success: function(res) {
          alert("shared success");
          //some thing you should do
        },
        cancel: function(res) {
          alert("shared cancle");
        },
        fail: function(res) {
          alert(JSON.stringify(res));
        }
      });
      //分享给好友
      wx.onMenuShareAppMessage({
        title: "分享给好友！", // 分享标题
        desc: "分享给好友123！", // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl:
          "http://img1.jjdc.net/display/eb4201b5806360b706dc52cc2639c957.jpg", // 分享图标
        type: "link", // 分享类型,music、video或link，不填默认为link
        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
        success: function(res) {
          // 用户点击了分享后执行的回调函数
          console.log(333);
          alert(333);
          alert(res);
          console.log("成功");
        }
      });
      wx.error(function(res) {
        console.log(444);
        alert(444);
        alert(JSON.stringify(res));
      });
    });
  },
  mounted() {
    this.getWxData();
  },
  methods: {
    getWxData() {
      console.log(1);
      alert(1);
      alert("/api/wx/wxeabf8e8336fc3861/wechatParam");
      console.log(location.href.split("#").toString());
      let url = location.href.split("#").toString();
      this.$ajax
        .get("/api/wx/wxeabf8e8336fc3861/wechatParam", {
          url: url
        })
        .then(res => {
          if (res.status == 200) {
            console.log(2);
            alert(2);
            console.log(res.data.data.appId);
            alert(res.data.data.signature);
            wx.config({
              debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: res.data.data.appId, // 必填，公众号的唯一标识
              timestamp: res.data.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
              signature: res.data.data.signature, // 必填，签名
              jsApiList: [
                "checkJsApi", //判断当前客户端版本是否支持指定JS接口
                "onMenuShareTimeline", //分享给好友
                "onMenuShareAppMessage" //分享到朋友圈
              ] // 必填，需要使用的JS接口列表
            });
            console.log("结束后的");
            alert("结束后的");
            alert(JSON.stringify(res.data.data));
          }
        })
        .catch(err => {
          alert(1111);
          alert(err);
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>
