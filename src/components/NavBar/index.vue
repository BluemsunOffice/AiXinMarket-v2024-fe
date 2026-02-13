<template>
  <header class="navbar-shell">
    <div class="header-content">
      <div class="header-left">
        <div class="top_hello">
          <span class="hello brand-title">爱心超市</span>
          <span class="campus-slot">
            <el-tag v-if="campusName" effect="light" type="primary" round>{{ campusName }}</el-tag>
          </span>
        </div>

        <div
          class="menuList"
          :class="{
            'mobile-menu': isMobile,
            'mobile-hidden': isMobile && !isMenuVisible,
          }"
          v-show="!isMobile || (isMobile && isMenuVisible)"
        >
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
          <li v-if="isMobile" class="money-item">
            <font-awesome-icon icon="fa-solid fa-coins" style="color: rgba(116, 192, 252, 1)" />
            日用币：{{ generalBalance }}
          </li>
          <li v-if="isMobile" class="money-item">
            <font-awesome-icon icon="fa-solid fa-coins" style="color: rgba(252, 116, 148, 1)" />
            服饰币：{{ clothingBalance }}
          </li>
        </div>
      </div>

      <div class="right">
        <div class="money" v-if="!isMobile">
          <span class="money-line">
            <Coins :coinType="CoinType.WarmCoin" />
            <span class="money-value">{{ generalBalance }}</span>
          </span>
          <span class="money-line">
            <Coins :coinType="CoinType.CareCoin" />
            <span class="money-value">{{ clothingBalance }}</span>
          </span>
        </div>

        <LogoutAction placement="bottom" />
        <button v-if="isMobile" class="iconfont icon-menu" @click="toggleMenu"></button>
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
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIfMobile)
})

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
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
  },
  { immediate: true },
)

const navigateToIndex = (index: number) => {
  activeIndex.value = index // 更新激活项
  const path = ['home', 'cart', 'orderList'][index]
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
    gap: 0;
  }

  .menuList.mobile-hidden {
    display: none !important;
  }

  .menuList.mobile-menu:not(.mobile-hidden) {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: linear-gradient(180deg, #409eff 0%, #78b9ff 100%);
    height: 100vh;
    width: min(300px, 72vw);
    padding: 18px 12px;
    overflow-y: auto;
    gap: 16px;
    z-index: 1001;
    box-shadow: 12px 0 30px rgba(17, 40, 80, 0.32);
  }

  .menuList.mobile-menu .hello {
    display: block;
    color: white;
    font-size: clamp(20px, 5vw, 28px) !important;
    text-align: center;
    margin: 2vh 1vw;
    padding: 0 1vw;
    line-height: 1.3;
    word-break: keep-all;
    white-space: normal;
    overflow: visible;
    font-family: '黑体';
    font-weight: 700;
  }

  .menuList li {
    display: flex;
    align-items: center;
    color: white;
    justify-content: center;
    box-sizing: border-box;
    padding: 12px;
    height: auto;
    min-height: 44px;
    transition: background-color 0.3s;
    cursor: pointer;
    font-size: clamp(14px, 3vw, 18px);
    line-height: 1.4;
    white-space: normal;
    overflow: visible;
    margin: 0;
    border-radius: 10px;
    border-bottom: none;
  }

  .menuList li.active,
  .menuList li:hover:not(.active) {
    border-bottom: none;
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }

  .divider {
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
    height: 1px;
  }

  .top_hello,
  .campus-slot {
    display: none;
  }

  .hello {
    color: white;
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
    cursor: pointer;
    display: block;
  }

  .mobile-menu .money-item:first-of-type::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 15%;
    right: 15%;
    height: 1px;
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
