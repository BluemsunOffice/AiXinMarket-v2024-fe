<template>
  <header class="navbar-shell">
    <div class="header-content">
      <div class="header-left">
        <div v-if="isMobile" ref="mobileEntryRef" class="mobile-entry">
          <button class="mobile-trigger icon-menu" @click="toggleMenu" aria-label="展开导航">
            <font-awesome-icon
              icon="fa-solid fa-ellipsis-vertical"
              style="color: rgba(116, 192, 252, 1)"
            />
          </button>
          <ul v-show="isMenuVisible" class="mobile-dropdown">
            <li
              v-for="item in menuItems"
              :key="item.path"
              :class="{ active: activePath === item.path }"
              @click="navigateTo(item.path)"
            >
              <font-awesome-icon :icon="item.icon" />
              {{ item.label }}
            </li>
          </ul>
        </div>

        <div class="top_hello">
          <span class="hello brand-title">爱心超市</span>
          <span class="campus-slot">
            <el-tag v-if="campusName" effect="light" type="primary" round>{{ campusName }}</el-tag>
          </span>
        </div>

        <div class="menuList" v-show="!isMobile">
          <span class="hello">爱心超市</span>
          <div class="divider"></div>
          <li
            v-for="item in menuItems"
            :key="item.path"
            :class="{ active: activePath === item.path }"
            @click="navigateTo(item.path)"
          >
            <font-awesome-icon :icon="item.icon" style="color: rgba(116, 192, 252, 1)" />
            {{ item.label }}
          </li>
        </div>
      </div>

      <div class="right">
        <div class="money" v-if="!isMobile">
          <Coins :coinType="CoinType.CareCoin" :amount="generalBalance" />
          <Coins :coinType="CoinType.WarmCoin" :amount="clothingBalance" />
        </div>

        <LogoutAction placement="bottom" />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LogoutAction from '@/components/logout-action/index.vue'
import { useUserStore } from '@/stores/user-store'
import Coins from '@/components/coins/index.vue'
import { CoinType } from '@/types/goods-info'
import { getAuthToken } from '@/utils/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const activePath = ref(route.path)
const mobileEntryRef = ref<HTMLElement | null>(null)

// 定义 isMobile 和 isMenuVisible
const isMenuVisible = ref(false)
const isMobile = ref(false)

// 检测是否是移动端
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 800
}

onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIfMobile)
  document.removeEventListener('click', handleOutsideClick)
})

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
}

const closeMenu = () => {
  isMenuVisible.value = false
}

const handleOutsideClick = (event: MouseEvent) => {
  if (!isMobile.value || !isMenuVisible.value) return
  const target = event.target as Node
  if (mobileEntryRef.value && !mobileEntryRef.value.contains(target)) {
    closeMenu()
  }
}

const generalBalance = computed(() => userStore.generalBalance)
const clothingBalance = computed(() => userStore.clothingBalance)
const campusName = computed(() => userStore.campusName)
const currentRole = computed(() => userStore.roleGroup || userStore.role || '')
const isManager = computed(() => ['超市管理员', '超级管理员'].includes(currentRole.value))

interface MenuItem {
  path: string
  label: string
  icon: string
}

const userMenuItems: MenuItem[] = [
  { path: '/home', label: '首页', icon: 'fa-solid fa-heart' },
  { path: '/cart', label: '购物车', icon: 'fa-solid fa-cart-arrow-down' },
  { path: '/orderList', label: '订单', icon: 'fa-solid fa-rectangle-list' },
]

const managerMenuItems: MenuItem[] = [
  { path: '/manage', label: '货物管理', icon: 'fa-solid fa-box-open' },
  { path: '/record', label: '进货记录', icon: 'fa-solid fa-truck-ramp-box' },
  { path: '/order', label: '订单管理', icon: 'fa-solid fa-clipboard-list' },
]

const menuItems = computed(() => (isManager.value ? managerMenuItems : userMenuItems))

watch(
  () => route.path,
  (currentPath) => {
    activePath.value = currentPath
    closeMenu()
  },
  { immediate: true },
)

watch(isMobile, (mobile) => {
  if (!mobile) {
    closeMenu()
  }
})

const navigateTo = (path: string) => {
  if (path === route.path) {
    closeMenu()
    return
  }

  if (isMobile.value) {
    closeMenu()
  }
  router.push(path)
}

onMounted(async () => {
  if (!getAuthToken()) {
    return
  }

  await userStore.fetchNavBarData()
})
</script>

<style scoped>
.navbar-shell {
  position: sticky;
  top: 0;
  z-index: 1200;
  width: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  padding: 6px 0;
}

.header-content {
  width: 100%;
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
  border: 1px solid rgba(64, 158, 255, 0.15);
  border-radius: 0;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.08);
  backdrop-filter: blur(10px);
  height: 72px;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  min-width: 0;
  flex: 1;
}

.hello {
  color: #409eff;
  font-family: '黑体';
  font-weight: 800;
}

.brand-title {
  font-size: clamp(22px, 1.4vw, 28px);
  letter-spacing: 0.06em;
}

.menuList .hello {
  display: none;
  line-height: 1.2;
}

.campus {
  color: #606266;
  font-size: 15px;
  font-family: '黑体';
}

.campus-slot {
  display: inline-flex;
  align-items: center;
  min-width: 140px;
  height: 28px;
}

.money-item {
  cursor: default;
}

.top_hello {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 300px;
}

.mobile-entry {
  display: none;
}

.menuList {
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  gap: 6px;
}

.menuList li {
  height: 72px;
  line-height: 72px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #303133;
  text-decoration: none;
  transition: all 0.25s ease;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.right {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: flex-end;
  min-width: 280px;
}

.money {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 160px;
  gap: 4px;
}

.money-line {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  width: 100%;
  font-size: 13px;
  line-height: 1.2;
  color: #606266;
}

.money-label {
  min-width: 52px;
  text-align: left;
}

.money-value {
  min-width: 20px;
  text-align: left;
  font-weight: 600;
}

.icon-menu {
  border: none;
  font-size: 24px;
  color: #409eff;
  background: transparent;
  cursor: pointer;
}

.mobile-trigger {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.mobile-dropdown {
  list-style: none;
  margin: 0;
  padding: 8px;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 130px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid rgba(64, 158, 255, 0.2);
  box-shadow: 0 10px 24px rgba(64, 158, 255, 0.16);
  z-index: 1202;
}

.mobile-dropdown li {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: 0 10px;
  border-radius: 8px;
  color: #303133;
  font-size: 13px;
  cursor: pointer;
}

.mobile-dropdown li.active,
.mobile-dropdown li:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.12);
}

.menuList li.active {
  border-bottom: 3px solid #9ec8f3;
  color: #409eff;
}

.menuList li:hover:not(.active) {
  border-bottom: 3px solid #9ec8f3;
  color: #409eff;
}

@media (max-width: 800px) {
  .header-content {
    position: relative;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 0 10px;
    height: 64px;
  }

  .header-left {
    gap: 10px;
    align-items: center;
  }

  .mobile-entry {
    display: flex;
    position: relative;
    align-items: center;
  }

  .top_hello {
    min-width: 0;
  }

  .money {
    display: none;
  }

  .right {
    display: flex;
    align-items: center;
    min-width: auto;
  }

  .right .icon-menu {
    display: none;
  }
}

@font-face {
  font-family: ChillLongCangKaiShu_Bold;
  src: url(../../../font/ChillLongCangKaiShu_Bold.otf);
}

@media (max-width: 1250px) {
  .top_hello .brand-title {
    display: none;
  }

  .campus,
  .campus-slot {
    display: none;
  }

  .money {
    display: none;
  }
}

.top_hello,
.money,
.menuList li,
el-button {
  white-space: nowrap;
}
</style>
