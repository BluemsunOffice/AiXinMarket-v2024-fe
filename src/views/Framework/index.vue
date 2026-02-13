<template>
  <el-container class="layout-container">
    <el-button v-if="isMobile" class="menu-toggle" @click="toggleSidebar">
      <el-icon>
        <component :is="sidebarVisible ? ArrowLeft : ArrowRight" />
      </el-icon>
    </el-button>

    <el-aside
      v-if="sidebarVisible || !isMobile"
      :width="isMobile ? '68vw' : '240px'"
      class="sidebar"
    >
      <div class="sidebar-title">
        <span class="sidebar-title-text">{{ currentRole }} 导航</span>
        <LogoutAction placement="right" />
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
        <el-button v-if="canAccessSuperMarket" class="market-entry" link @click="goToSuperMarket">
          <span>
            前往爱心超市
            <font-awesome-icon
              icon="fa-solid fa-angles-right"
              style="color: rgba(116, 192, 252, 1)"
            />
          </span>
        </el-button>
      </el-header>

      <el-main class="main-content">
        <section v-if="currentPage === 'personalCenter'" class="personal-container">
          <personal-box
            :student-id="fundUserProfile.studentId"
            :name="userProfile.userName"
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
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import PersonalBox from '@/views/Framework/components/PersonalBox.vue'
import PersonalText from '@/views/Framework/components/PersonalText.vue'
import LogoutAction from '@/components/LogoutAction/index.vue'
import { isLoggedIn } from '@/utils/auth'
import { useUserStore } from '@/stores/userStore'
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
const sidebarVisible = ref(true)
const isMobile = ref(window.innerWidth <= 768)
const activeMenu = ref('/framework')
const currentPage = ref('personalCenter')

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
    roles: ['资助对象', '超级管理员'],
  },
  {
    key: 'studentsProfile',
    label: '学生档案',
    page: 'studentsProfile',
    route: '/studentFiles',
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

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const updateDeviceState = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    sidebarVisible.value = true
  }
}

const handleMenuClick = (item: MenuItem) => {
  activeMenu.value = item.route || item.key
  currentPage.value = item.page

  if (isMobile.value) {
    sidebarVisible.value = false
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
    return
  }

  activeMenu.value = '/framework'
  currentPage.value = 'personalCenter'
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
  justify-content: center;
  position: relative;
  background: #ffffff;
  border-bottom: 1px solid #e5eaf3;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2f3d4f;
  letter-spacing: 0.08em;
}

.market-entry {
  position: absolute;
  right: 18px;
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

.menu-toggle {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 1000;
  background: #3a7bfa;
  color: #fff;
  border: none;
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 68vw;
    max-width: 280px;
    transition: all 0.3s ease;
  }

  .sidebar-title {
    font-size: 14px;
  }

  .menu-item {
    margin: 4px 8px;
    font-size: 14px;
  }

  .title {
    font-size: 16px;
  }

  .market-entry {
    right: 10px;
    width: 120px;
  }

  .menu-toggle {
    padding: 8px;
  }
}
</style>
