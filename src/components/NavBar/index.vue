<template>
  <header class="navbar-shell">
    <div class="header-content">
      <div class="header-left">
        <div v-if="isMobile" ref="mobileEntryRef" class="mobile-entry">
          <button
            class="mobile-trigger icon-menu"
            @click="toggleMenu"
            aria-label="展开导航"
          >
            <font-awesome-icon
              icon="fa-solid fa-ellipsis-vertical"
              style="color: rgba(116, 192, 252, 1)"
            />
          </button>
          <ul v-show="isMenuVisible" class="mobile-dropdown">
            <li :class="{ active: activeIndex === 0 }" @click="navigateToIndex(0)">首页</li>
            <li :class="{ active: activeIndex === 1 }" @click="navigateToIndex(1)">购物车</li>
            <li :class="{ active: activeIndex === 2 }" @click="navigateToIndex(2)">订单</li>
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
          <li :class="{ active: activeIndex === 0 }" @click="navigateToIndex(0)">
            <font-awesome-icon icon="fa-solid fa-heart" style="color: rgba(116, 192, 252, 1)" />
            首页
          </li>
          <li :class="{ active: activeIndex === 1 }" @click="navigateToIndex(1)">
            <font-awesome-icon
              icon="fa-solid fa-cart-arrow-down"
              style="color: rgba(116, 192, 252, 1)"
            />
            购物车
          </li>
          <li :class="{ active: activeIndex === 2 }" @click="navigateToIndex(2)">
            <font-awesome-icon
              icon="fa-solid fa-rectangle-list"
              style="color: rgba(116, 192, 252, 1)"
            />
            订单
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
import LogoutAction from '@/components/LogoutAction/index.vue'
import { useUserStore } from '@/stores/userStore'
import Coins from '@/components/coins/index.vue'
import { CoinType } from '@/types/goodsInfo'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const activeIndex = ref(0)
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

const pathToIndexMap: Record<string, number> = {
  '/home': 0,
  '/cart': 1,
  '/orderList': 2,
}

watch(
  () => route.path,
  (currentPath) => {
    activeIndex.value = pathToIndexMap[currentPath] ?? 0
    closeMenu()
  },
  { immediate: true },
)

watch(isMobile, (mobile) => {
  if (!mobile) {
    closeMenu()
  }
})

const navigateToIndex = (index: number) => {
  activeIndex.value = index // 更新激活项
  const path = ['home', 'cart', 'orderList'][index]
  if (isMobile.value) {
    closeMenu()
  }
  router.push(`/${path}`)
}

onMounted(async () => {
  if (!localStorage.getItem('token')) {
    router.push('/')
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
  font-size: clamp(26px, 1.8vw, 34px);
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
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 15px;
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
  padding: 0 10px;
  border-radius: 8px;
  color: #303133;
  font-size: 14px;
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
