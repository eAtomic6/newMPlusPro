'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/app': { //代理地址
        target: 'http://192.168.1.253:8080', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false
      },
      '/resource': { //代理地址
        target: 'http://192.168.1.224:18081', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false
      },
      '/api': {
        // target: 'http://s224.360fdc.com:8081/api', //需要代理的地址
        // target: "http://192.168.1.224:18082",//测2
        // target: "http://192.168.1.97:18081", //童代理
        // target: "http://192.168.1.93:18081", //曾代理
        target: "http://newhousesys.t.jjw.com:8091/api", //预2
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/scoket': {
        // target: 'http://s224.360fdc.com:18088', //测2
        // target: "http://newhousesys.t.jjw.com:18088",//预2
        target: "http://192.168.1.97:18089",
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          '^/scoket': ''
        }
      },
      '/person1': {
        target: 'http://192.168.1.104:8081', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          '^/person1': ''
        }
      },
      '/lwz': {
        target: 'http://192.168.1.80:18081', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          '^/lwz': ''
        }
      },
      '/calculator': {
        target: 'http://uplus.t.jjdc.com.cn',  //需要代理的地址
        changeOrigin: true,  //是否跨域
        secure: false,
        pathRewrite: {
          '^/calculator': ''
        }
      },
      '/img': {
        target: 'http://s224.360fdc.com:8081/img/', //需要代理的地址
        changeOrigin: true, //是否跨域
        secure: false,
        pathRewrite: {
          '^/img': ''
        }
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST 192.168.1.186
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
