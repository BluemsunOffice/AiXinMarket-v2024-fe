<template>
  <el-container class="layout-container">
    <el-aside v-if="!isMobile" width="240px" class="sidebar">
      <div class="sidebar-title">
        <span class="sidebar-title-text">{{ currentRole }} 导航</span>
        <span class="logout-action">
          <LogoutAction placement="right" />
        </span>
      </div>
      <el-scrollbar class="sidebar-scroll">
        <el-menu :default-active="activeMenu" class="sidebar-menu" router>
          <el-menu-item
            v-for="item in visibleMenus"
            :key="item.key"
            :index="item.route || item.key"
            :route="item.route"
            :class="['menu-item', { 'is-active': currentPage === item.page }]"
            @click="handleMenuClick(item)"
          >
            {{ item.label }}
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="header">
        <h1 class="title">爱心超市管理系统 - {{ currentModuleLabel }}</h1>
        <div class="header-actions">
          <el-select
            v-if="isMobile"
            v-model="mobileMenuValue"
            class="mobile-menu-select"
            size="small"
            @change="handleMobileMenuChange"
          >
            <el-option
              v-for="item in visibleMenus"
              :key="item.key"
              :label="item.label"
              :value="item.route || item.key"
            />
          </el-select>
          <el-button v-if="canAccessSuperMarket" class="market-entry" link @click="goToSuperMarket">
            <span>
              前往爱心超市
              <font-awesome-icon
                icon="fa-solid fa-angles-right"
                style="color: rgba(116, 192, 252, 1)"
              />
            </span>
          </el-button>
        </div>
      </el-header>

      <el-main class="main-content">
        <section v-if="currentPage === 'personalCenter'" class="personal-container">
          <personal-box
            :student-id="fundUserProfile?.studentId || userProfile.userId"
            :name="userProfile.userName || userProfile.nickName"
            :role="userRole"
            :avatar-url="userProfile.avatar"
            @avatar-changed="handleUploadAvatar"
          />
          <personal-text :role="userRole" :fund-user-info="fundUserProfile" />
        </section>
        <router-view v-else />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import PersonalBox from '@/views/framework/components/personal-box.vue'
import PersonalText from '@/views/framework/components/personal-text.vue'
import LogoutAction from '@/components/logout-action/index.vue'
import { isLoggedIn } from '@/utils/auth'
import { useUserStore } from '@/stores/user-store'
import { storeToRefs } from 'pinia'

interface MenuItem {
  key: string
  label: string
  page: string
  route?: string
  roles?: string[]
}

const userStore = useUserStore()
const { roleGroup: userRole, userProfile, fundUserProfile } = storeToRefs(userStore)

const router = useRouter()
const route = useRoute()
const isMobile = ref(window.innerWidth <= 768)
const activeMenu = ref('/framework')
const currentPage = ref('personalCenter')
const mobileMenuValue = ref('/framework')

const menuList: MenuItem[] = [
  {
    key: 'personalCenter',
    label: '账号中心',
    page: 'personalCenter',
    route: '/framework',
  },
  {
    key: 'superMarketManage',
    label: '爱心超市管理员',
    page: 'superMarketManage',
    route: '/manage',
    roles: ['超市管理员', '超级管理员'],
  },
  {
    key: 'personalProfile',
    label: '个人成长档案',
    page: 'personalProfile',
    route: '/framework/profile',
    roles: ['资助对象'],
  },
  {
    key: 'studentsProfile',
    label: '学生档案',
    page: 'studentsProfile',
    route: '/framework/studentFiles',
    roles: ['老师', '超级管理员'],
  },
]

const currentRole = computed(() => userRole.value || '用户')
const canAccessSuperMarket = computed(() => ['资助对象', '超级管理员'].includes(currentRole.value))
const visibleMenus = computed(() => {
  return menuList.filter((item) => !item.roles || item.roles.includes(currentRole.value))
})
const currentModuleLabel = computed(() => {
  const matchedMenu = menuList.find((item) => item.page === currentPage.value)
  return matchedMenu?.label || '个人中心'
})

const updateDeviceState = () => {
  isMobile.value = window.innerWidth <= 768
}

const handleMenuClick = (item: MenuItem) => {
  activeMenu.value = item.route || item.key
  currentPage.value = item.page

  if (isMobile.value) {
    mobileMenuValue.value = activeMenu.value
  }
}

const handleMobileMenuChange = (routePath: string) => {
  const matched = menuList.find((item) => (item.route || item.key) === routePath)
  if (!matched) {
    return
  }
  handleMenuClick(matched)
  if (matched.route) {
    router.push(matched.route)
  }
}

const goToSuperMarket = () => {
  router.push('/home')
}

const syncMenuByRoute = () => {
  const matched = menuList.find((item) => item.route === route.path)
  if (matched) {
    activeMenu.value = matched.route || matched.key
    currentPage.value = matched.page
    mobileMenuValue.value = activeMenu.value
    return
  }

  activeMenu.value = '/framework'
  currentPage.value = 'personalCenter'
  mobileMenuValue.value = '/framework'
}

onMounted(async () => {
  const logged = await isLoggedIn()
  if (!logged) {
    router.push('/')
    return
  }

  await userStore.getProfile()
  syncMenuByRoute()
  window.addEventListener('resize', updateDeviceState)
})

watch(
  () => route.path,
  () => {
    syncMenuByRoute()
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceState)
})

const handleUploadAvatar = (payload: { file: File; dataUrl: string }) => {
  userStore.updateAvatar(payload.file).catch(() => {
    ElMessage.error('头像上传失败')
  })
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background: #1f2a37;
  color: #d1d9e6;
  border-right: 1px solid #2b3647;
}

.sidebar-title {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 15px;
  font-weight: 600;
  color: #f0f4f8;
  background: #18212f;
}

.sidebar-title-text {
  pointer-events: none;
}
.logout-action {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.sidebar-scroll {
  flex: 1;
}

.sidebar-menu {
  border-right: none;
  background: transparent;
}

.menu-item {
  height: 46px;
  margin: 4px 10px;
  border-radius: 8px;
  color: #bdc7d6;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu-item:hover {
  color: #ffffff;
  background: #3a7bfa;
}

.menu-item.is-active {
  color: #ffffff;
  background: #3a7bfa;
}

.header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background: #ffffff;
  border-bottom: 1px solid #e5eaf3;
  padding: 0 18px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3d4f;
  letter-spacing: 0.08em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.market-entry {
  width: 132px;
}

.mobile-menu-select {
  width: 132px;
}

.main-content {
  padding: 18px;
}

.personal-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .header {
    height: auto;
    min-height: 56px;
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
  }

  .title {
    font-size: 16px;
    letter-spacing: 0.03em;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .market-entry {
    width: 120px;
  }

  .mobile-menu-select {
    width: 140px;
  }

  .main-content {
    padding: 12px;
  }
}
</style>
