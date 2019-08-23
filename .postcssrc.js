// https://github.com/michael-ciniawsky/postcss-load-config


module.exports = {
  "plugins": {
    "postcss-import": {},//解决@import引入路径问题
    "postcss-url": {},//该插件主要用来处理文件，比如图片文件、字体文件等引用路径的处理
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {//移动端1px解决方案 
      utf8: false
    },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
      viewportHeight: 1334, //视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置著作权归作者所有。
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）著作权归作者所有。
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList: ['.ignore', '.hairlines', '.weui-dialog', 'dp-item', '.scroller', '.scroller', '.pswp'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名著作权归作者所有。
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值著作权归作者所有。
      mediaQuery: false // 允许在媒体查询中转换`px`
    },
    "postcss-viewport-units": {}, //给css添加content的属性，配合viewport-units-buggyfill库解决适配问题
    "cssnano": {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
}
