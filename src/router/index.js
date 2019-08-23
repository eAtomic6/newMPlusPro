import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/pages/index')
const Home = () => import('@/pages/home')
const User = () => import('@/pages/user')
const House = () => import('@/pages/house')
const Mine = () => import('@/pages/mine')
const tipFollow = () => import('@/pages/tipFollow')
const tipRecord = () => import('@/pages/tipRecord')
const houseDetails = () => import('@/pages/houseDetails')
const customerRecord = () => import('@/pages/customerRecord')
const barCode = () => import('@/pages/barCode')
const personalData = () => import('@/pages/personalData')
const about = () => import('@/pages/about')
const outCompany = () => import('@/pages/outCompany')
const organization = () => import('@/pages/organization')
const Search = () => import('@/pages/search')
const Calculator = () => import('@/pages/calculator')
const Task = () => import('@/pages/task')
const addTask = () => import('@/pages/addTask')
const changeTask = () => import('@/pages/changeTask')
const batch = () => import('@/pages/batch')
const message = () => import('@/pages/message')
const messageDetail = () => import('@/pages/messageDetail')
const customerInfoComplete = () => import('@/pages/customerInfoComplete')
const customerFollowUp = () => import('@/pages/customerFollowUp')
const customerReported = () => import('@/pages/customerReported')
const customerWidthSee = () => import('@/pages/customerWidthSee')
const customerRob = () => import('@/pages/customerRob')
const staffDetail = () => import('@/pages/staffDetail')
const staffList = () => import('@/pages/staffList')
const invite = () => import('@/pages/invite')
const intentProject = () => import('@/pages/intentProject')
const appDownload = () => import('@/pages/appDownload')
const serviceLog = () => import('@/pages/serviceLog')
const Login = () => import('@/pages/login')
const selectSatrap = () => import('@/pages/selectSatrap')
const sectorSet = () => import('@/pages/sectorSet')
const moveDepart = () => import('@/pages/moveDepart')
const addSector = () => import('@/pages/addSector')
const buildingMap = () => import('@/pages/buildingMap')
const addCus = () => import('@/pages/addCus')
const teamReport = () => import('@/pages/teamReport')
const dealList = () => import('@/pages/dealList')
const commissionList = () => import('@/pages/commissionList')
const customerHeir = () => import('@/pages/customerHeir')
// 广告页
const adPage = () => import('@/pages/adPage')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/home',
      component: Index,
      children: [{
          path: 'home',
          component: Home,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'user',
          component: User,
          meta: {
            needLogin: true,
            keepAlive: true
          }
        },
        {
          path: 'house',
          component: House,
          meta: {
            needLogin: true,
            keepAlive: true
          }
        },
        {
          path: 'mine',
          component: Mine,
          meta: {
            needLogin: true
          }
        }
      ]
    },
    {
      path: '/tipFollow',
      component: tipFollow,
      meta: {
        needLogin: true,
        keepAlive: true
      }
    },
    {
      path: '/tipRecord',
      component: tipRecord,
      meta: {
        needLogin: true,
        keepAlive: true
      }
    },
    {
      path: '/tipService',
      component: tipRecord,
      meta: {
        needLogin: true,
        keepAlive: true
      }
    },
    {
      path: '/houseDetails',
      component: houseDetails,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerRecord',
      component: customerRecord,
      meta: {
        needLogin: true,
        keepAlive: true
      }
    },
    {
      path: '/barCode',
      component: barCode,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/personalData',
      component: personalData,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/about',
      component: about,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/outCompany',
      component: outCompany,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/organization',
      component: organization,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/calculator',
      component: Calculator,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/batch',
      component: batch,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/message',
      component: message,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/messageDetail',
      component: messageDetail,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/task',
      component: Task,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/addTask',
      component: addTask,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/changeTask',
      component: changeTask,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerInfoComplete',
      component: customerInfoComplete,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerRob',
      component: customerRob,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerFollowUp',
      component: customerFollowUp,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerReported',
      component: customerReported,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerWidthSee',
      component: customerWidthSee,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/staffDetail',
      component: staffDetail,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/staffList',
      component: staffList,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/invite',
      component: invite
    },
    {
      path: '/appDownload',
      component: appDownload
    },
    {
      path: '/servicelog',
      component: serviceLog,
      meta: {
        needLogin: true,
        keepAlive: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/selectSatrap',
      component: selectSatrap,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/sectorSet',
      component: sectorSet,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/intentProject',
      component: intentProject,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/moveDepart',
      component: moveDepart,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/addSector',
      component: addSector,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/buildingMap',
      component: buildingMap,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/addCus',
      component: addCus,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/teamReport',
      component: teamReport,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/dealList',
      component: dealList,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/commissionList',
      component: commissionList,
      meta: {
        needLogin: true
      }
    },
    {
      path: '/customerHeir',
      component: customerHeir,
      meta: {
        needLogin: true
      }
    },
    // 广告页
    {
      path: '/adPage',
      name: "adPage",
      component: adPage,
    },


    /**  
     * 2.0 新加需求
     * 
     */

    // 个人网店
    {
      path: '/personalOnlineStore',
      name: "personalOnlineStore",
      component: resolve => require(["@/pages/personalOnlineStore"], resolve)
    },
    // 个人网店 --- 房源管理
    {
      path: '/propertyManagement',
      name: "propertyManagement",
      component: resolve => require(["@/pages/propertyManagement"], resolve)
    },
    // 电子名片
    {
      path: '/electCard',
      name: "electCard",
      component: import('@/pages/electCard'),
      component: resolve => require(["@/pages/electCard"], resolve)
    },
    // 营销素材
    {
      path: '/marketingMaterial',
      name: "marketingMaterial",
      meta: {
        needLogin: false,
        keepAlive: false // 需要被缓存
      },
      component: resolve => require(["@/pages/marketingMaterial"], resolve)
    },
    // 我的 --- 微信二维码
    {
      path: '/uploadQR',
      name: "uploadQR",
      component: resolve => require(["@/pages/uploadQR"], resolve)
    },
    // 最近访客
    {
      path: '/currentVisitor',
      name: "currentVisitor",
      component: resolve => require(["@/pages/currentVisitor"], resolve)
    },
    // 浏览最多的访客
    {
      path: '/maxVisitors',
      name: "maxVisitors",
      component: resolve => require(["@/pages/maxVisitors"], resolve)
    },
    // 浏览最多的访客记录
    {
      path: '/goWxPerson',
      name: "goWxPerson",
      component: resolve => require(["@/pages/goWxPerson"], resolve)
    },
    // 访问最多的房源
    {
      path: '/maxVisitedHouse',
      name: "maxVisitedHouse",
      component: resolve => require(["@/pages/maxVisitedHouse"], resolve)
    }
    ,
    // 转发最多的房源
    {
      path: '/maxTransmitHouse',
      name: "maxTransmitHouse",
      component: resolve => require(["@/pages/maxTransmitHouse"], resolve)
    }  
     ,
    // 电子名片
    {
      path: '/eleCard',
      name: "eleCard",
      component: resolve => require(["@/pages/eleCard"], resolve)
    },
    // 营销素材--公共详情页
    {
      path: '/adComponent',
      name: "adComponent",
      component: resolve => require(["@/components/adComponent"], resolve)
    },
  ]
})
