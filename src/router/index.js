import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: '微信后台管理系统',
      meta: { title: '微信后台管理', icon: 'home', noCache: true }
    }]
  },
  {
    path: '/accountlist',
    component: Layout,
    redirect: '/accountlist',
    name: 'admin',
    meta: { title: '公众号列表', icon: 'person' },
    children: [
      {
        path: 'accountlist',
        name: 'Accountlist',
        component: () => import('@/views/accountlist/index'),
        meta: { title: '公众号列表', icon: 'wechat' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/info',
    name: 'account',
    meta: { title: '公众号管理', icon: 'material' },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/account/info'),
        meta: { title: '账号信息', icon: 'account-box' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/account/menu'),
        meta: { title: '菜单管理', icon: 'menu' }
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('@/views/account/news'),
        meta: { title: '图文管理', icon: 'document' }
      },
      {
        path: 'text',
        name: 'Text',
        component: () => import('@/views/account/text'),
        meta: { title: '文本管理', icon: 'text' }
      },
      {
        path: 'image',
        name: 'image',
        component: () => import('@/views/account/image'),
        meta: { title: '图片管理', icon: 'picture' }
      }
    ]
  },
  // {
  //   path: '/public',
  //   component: Layout,
  //   redirect: '/public/table',
  //   name: 'public',
  //   meta: { title: '公共素材', icon: 'material' },
  //   children: [
  //     {
  //       path: 'news',
  //       name: 'News',
  //       component: () => import('@/views/public/news'),
  //       meta: { title: '图文管理', icon: 'document' }
  //     },
  //     {
  //       path: 'text',
  //       name: 'Text',
  //       component: () => import('@/views/public/text'),
  //       meta: { title: '消息管理', icon: 'text' }
  //     },
  //     {
  //       path: 'image',
  //       name: 'image',
  //       component: () => import('@/views/public/image'),
  //       meta: { title: '图片管理', icon: 'picture' }
  //     },
  //     {
  //       path: 'test',
  //       name: 'test',
  //       component: () => import('@/views/public/test'),
  //       meta: { title: 'test', icon: 'picture' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

