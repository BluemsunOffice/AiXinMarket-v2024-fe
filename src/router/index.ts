import { createRouter, createWebHistory } from "vue-router";
import { authConfig } from "@/config/request.config";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 登录
    {
      path: "/",
      component: () => import("@/views/Login/index.vue"),
    },
    {
      name: "details",
      path: "/details",
      component: () => import("@/views/index/GoodsDetails.vue"),
      meta: { role: ["资助对象"] },
    },
    {
      path: "/cart",
      component: () => import("@/views/ShopCart/index.vue"),
      meta: { role: ["资助对象"] },
    },
    {
      name: "OrderList",
      path: "/orderList",
      component: () => import("@/views/OrderList/OrderListIndex.vue"),
      meta: { role: ["资助对象"] },
    },
    {
      //首页
      path: "/home",
      name: "home",
      component: () => import("@/views/index/index.vue"),
      meta: { role: ["资助对象"] },
    },
    {
      name: "shopcart",
      path: "/shopcart",
      component: () => import("@/views/ShopCart/index.vue"),
      meta: { role: ["资助对象"] },
    },
    {
      path: "/manage",
      name: "manage",
      component: () => import("@/views/Manage/index.vue"),
      meta: { role: ["超市管理员"] },
    },
    {
      path: "/order",
      name: "order",
      component: () => import("@/views/Order/index.vue"),
      meta: { role: ["超市管理员"] },
    },
    {
      path: "/record",
      name: "record",
      component: () => import("@/views/Record/index.vue"),
      meta: { role: ["超市管理员"] },
    },
    {
      path: "/framework",
      name: "framework",
      component: () => import("@/views/Framework/index.vue"),
      meta: { role: ["超市管理员", "资助对象", "老师", "超级管理员"] },
      children: [
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/Profile/index.vue"),
        },
      ]
    },
    {
      path: "/studentFiles",
      name: "studentFiles",
      component: () => import("@/views/Student/index.vue"),
      meta: { role: ["老师", "超级管理员"] },
    },
  ],
});

const ADMIN_ROLES = ["超市管理员", "超级管理员"];

const getCachedRole = () => {
  return localStorage.getItem("roleGroup") || localStorage.getItem("role") || "";
};

const resolveHomePathByRole = (role: string) => {
  if (ADMIN_ROLES.includes(role)) {
    return "/manage";
  }
  if (role === "资助对象") {
    return "/home";
  }
  if (role === "老师") {
    return "/studentFiles";
  }
  return "/framework";
};

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem(authConfig.tokenKey);
  const role = getCachedRole();
  const allowRoles = (to.meta?.role as string[] | undefined) || [];

  if (!token && to.path !== "/") {
    next("/");
    return;
  }

  if (token && to.path === "/") {
    next(resolveHomePathByRole(role));
    return;
  }

  if (allowRoles.length && role && !allowRoles.includes(role)) {
    next(resolveHomePathByRole(role));
    return;
  }

  next();
});

//暴露出去router
export default router;
