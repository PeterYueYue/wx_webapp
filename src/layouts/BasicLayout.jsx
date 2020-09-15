/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList => {

  const list = [
    {
      path: '/code',//二维码管理
      name: 'code',
      "routes": [
        { path: '/code/codeList', name: 'codeList', component: './code/codeList', }, //二维码列表 
        { path: '/code/codeManage', name: 'codeManage', component: './code/codeManage', }, //解绑二维码 
      ]
    },
    {
      path: '/area',//区域管理
      name: 'area',
      "routes": [
        { path: '/area/areaList', name: 'areaList', component: './area/areaList', }, //设置区域 
        { path: '/area/areaCommunity', name: 'areaCommunity', component: './area/areaCommunity', }, //小区管理  
        { path: '/area/areaSet', name: 'areaSet', component: './area/areaSet', }, //设置门牌号  
      ]
    },
    {
      path: '/family',//家庭管理
      name: 'family',
      "routes": [
        { path: '/family/familyList', name: 'familyList', component: './family/familyList', }, //家庭列表 
      ]
    },
    {
      path: '/ListUser',//用户列表
      name: 'ListUser',
      "routes": [
        { path: '/ListUser/userList', name: 'userList', component: './ListUser/userList', }, //用户列表 
        { path: '/ListUser/userOrder', name: 'userOrder', component: './ListUser/userOrder', }, //用户投递订单 
      ]
    },
    {
      path: '/supervisor',//督导员管理
      name: 'supervisor',
      "routes": [
        { path: '/supervisor/supervisorManage', name: 'supervisorManage', component: './supervisor/supervisorManage', }, //督导员列表 
      ]
    },
    {
      path: '/site',//网点管理
      name: 'site',
      "routes": [
        { path: '/site/siteList', name: 'siteList', component: './site/siteList', }, //网点开通创建 
        { path: '/site/siteData', name: 'siteData', component: './site/siteData', }, //网点数据汇总 
      ]
    },
    {
      path: '/media',//媒体公告
      name: 'media',
      "routes": [
        { path: '/media/banner', name: 'banner', component: './media/banner', }, //轮播图 
        { path: '/media/notice', name: 'notice', component: './media/notice', }, //公告 
      ]
    },
    {
      path: '/shop',//商品列表
      name: 'shop',
      "routes": [
        { path: '/shop/product', name: 'product', component: './shop/Product', }, //商品列表 
        { path: '/shop/productEdit', name: 'productEdit', component: './shop/productEdit', hideInMenu: true, },    //商品新增-商品编辑
        // { path: '/shop/productOrder', name: 'productOrder', component: './shop/productOrder', },  //订单管理
        // { path: '/shop/orderDetails', name: 'orderDetails', component: './shop/OrderDetails', hideInMenu: true, },   //订单详情
        // { path: '/shop/protectRights', name: 'protectRights', component: './shop/ProtectRights', },  //维权订单管理
        // { path: '/shop/protectRightsDetails', name: 'protectRightsDetails', component: './shop/ProtectRightsDetails', hideInMenu: true, },   //维权订单详情
        // { path: '/shop/productSort', name: 'productSort', component: './shop/productSort', }, //商品分类
        // { path: '/shop/productSupport', name: 'productSupport', component: './shop/productSupport', }, //商品支持
        { path: '/shop/client', name: 'client', component: './shop/client', }, //品牌客户
      ]
    },

  ]
  return list

  // menuList.map(item => {
  //   const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
  //   return Authorized.check(item.authority, localItem, null);
  // });
}


const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 无锡易腐垃圾平台"
    links={[
      {
        key: 'Ant Design',
        title: '无锡',
        // href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {

    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (
    <ProLayout
      logo="http://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/index/0602.png"
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link onClick={() => { localStorage.setItem("current", 1) }} to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
