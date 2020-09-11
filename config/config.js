// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path:'/',
              redirect:'/shop/product',
            },
            {
              path: '/shop',//商品列表
              name: 'shop',
              icon: 'shop',
              "routes":[
                // { path: '/shop/product',      name: 'product',      component: './shop/Product', }, //商品列表 
                // { path: '/shop/productEdit',  name: 'productEdit',  component: './shop/productEdit', hideInMenu:true,  },    //商品新增-商品编辑
                // { path: '/shop/productOrder', name: 'productOrder', component: './shop/productOrder', },  //订单管理
                // { path: '/shop/orderDetails', name: 'orderDetails', component: './shop/OrderDetails', hideInMenu:true,},   //订单详情
                // { path: '/shop/protectRights', name: 'protectRights', component: './shop/ProtectRights', },  //维权订单管理
                // { path: '/shop/protectRightsDetails', name: 'protectRightsDetails', component: './shop/ProtectRightsDetails', hideInMenu:true,},   //维权订单详情
                // { path: '/shop/productSort', name: 'productSort', component: './shop/productSort', }, //商品分类
                // { path: '/shop/productSupport', name: 'productSupport', component: './shop/productSupport', }, //商品支持
                // { path: '/shop/client', name: 'client', component: './shop/client', }, //品牌客户
              ]
            },
            {
              path: '/ListUser',//用户列表
              icon: 'user',
              name: 'ListUser',
              "routes":[
                { path: '/ListUser/userList', name: 'userList', component: './ListUser/userList', }, //用户列表 
                // { path: '/ListUser/imageReview', name: 'imageReview', component: './ListUser/imageReview', }, //图片审核 
              ]
            },
            {
              path: '/site',//网点管理
              name: 'site',
              "routes": [
                { path: '/site/siteList', name: 'siteList', component: './site/siteList', }, //网点开通创建 
                // { path: '/site/siteData', name: 'siteData', component: './site/SiteData', }, //网点数据汇总 
              ]
            },


            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
