import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 登录
    {
      path: '/',
      component: () => import('@/views/Login/index.vue')
    },
    {
      name: 'details',
      path: '/details',
      component: () => import('@/views/index/GoodsDetails.vue'),
      meta: { role: ['Beneficiary'] }
    },
    {
      path: '/cart',
      component: () => import('@/views/ShopCart/index.vue'),
      meta: { role: ['Beneficiary'] }
    },
    {
      name: 'OrderList',
      path: '/orderList',
      component: () => import('@/views/OrderList/OrderListIndex.vue'),
      meta: { role: ['Beneficiary'] }
    },
    {//首页
      path: '/home',
      name: 'home',
      component: () => import('@/views/index/index.vue'),
      meta: { role: ['Beneficiary'] }
    },
    {
      name: 'shopcart',
      path: '/shopcart',
      component: () => import('@/views/ShopCart/index.vue'),
      meta: { role: ['Beneficiary'] }
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@/views/Manage/index.vue'),
      meta: { role: ['超市管理员'] }
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/views/Order/index.vue'),
      meta: { role: ['超市管理员'] }
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('@/views/Record/index.vue'),
      meta: { role: ['超市管理员'] }
    },
    {
      path: '/framework',
      name: 'framework',
      component: () => import('@/views/Framework/index.vue'),
    },
    {
      path: '/new-file',
      name: 'new-file',
      component: () => import('@/views/new-file.vue'),
    },

    {
      path: '/studentFiles',
      name: 'studentFiles',
      component: () => import('@/views/Student/index.vue'),
      meta: { role: ['老师', '超级管理员'] }
    },
  ]
})

//暴露出去router
export default router

