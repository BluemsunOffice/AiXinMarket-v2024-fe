<template>
  <el-header height="86px" class="manager-nav">
    <div class="manager-nav__content">
      <div class="manager-nav__brand">
        <h2>爱心超市</h2>
        <span>{{ campusName || '校区信息加载中' }}</span>
      </div>

      <el-menu
        mode="horizontal"
        :default-active="activePath"
        class="manager-nav__menu"
        @select="handleSelect"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>

      <div class="manager-nav__right">
        <div class="manager-nav__balance">
          <Coins :coinType="CoinType.CareCoin" :amount="generalBalance" />
          <Coins :coinType="CoinType.WarmCoin" :amount="clothingBalance" />
        </div>
        <el-avatar :size="42" :src="avatarUrl" />
        <el-button type="primary" plain @click="centerDialogVisible = true"> 退出登录 </el-button>
      </div>
    </div>

    <el-dialog v-model="centerDialogVisible" title="确认退出" width="360" align-center>
      <span>退出后将返回登录页，是否继续？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleLogout">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </el-header>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Box, Document, ShoppingCartFull } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user.api'
import { useUserStore } from '@/stores/userStore'
import Coins from '@/components/coins/index.vue'
import { CoinType } from '@/types/goodsInfo'

interface NavMenuItem {
  path: string
  label: string
  icon: typeof Box
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const centerDialogVisible = ref(false)
const activePath = ref(route.path)

const menuItems: NavMenuItem[] = [
  { path: '/manage', label: '货物管理', icon: Box },
  { path: '/record', label: '进货记录', icon: ShoppingCartFull },
  { path: '/order', label: '订单管理', icon: Document },
]

const campusName = computed(() => userStore.campusName)
const avatarUrl = computed(() => userStore.avatarUrl)
const generalBalance = computed(() => userStore.generalBalance)
const clothingBalance = computed(() => userStore.clothingBalance)

watch(
  () => route.path,
  (path) => {
    activePath.value = path
  },
  { immediate: true },
)

const handleSelect = (path: string) => {
  if (path !== route.path) {
    router.push(path)
  }
}

const handleLogout = async () => {
  try {
    const { code, message } = await userApi.logout()
    if (code === 200) {
      ElMessage.success('退出成功！')
      userStore.logout()
      localStorage.removeItem('client_id')
      centerDialogVisible.value = false
      router.push('/')
      return
    }
    ElMessage.error(`${message}!`)
  } catch (error) {
    ElMessage.error('请求失败！')
  }
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
.manager-nav {
  padding: 0 20px;
}

.manager-nav__content {
  height: 100%;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(243.9, 244.2, 244.8);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.1);
  border-radius: 10px;
  background: #fff;
  padding: 0 20px;
  gap: 20px;
}

.manager-nav__brand {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.manager-nav__brand h2 {
  margin: 0;
  font-size: 28px;
  color: #409eff;
  font-family: '黑体';
}

.manager-nav__brand span {
  font-size: 13px;
  color: #606266;
}

.manager-nav__menu {
  flex: 1;
  border-bottom: none;
  min-width: 360px;
}

.manager-nav__menu .el-menu-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
}

.manager-nav__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.manager-nav__balance {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #606266;
  line-height: 1.45;
  text-align: right;
}

@media (max-width: 1200px) {
  .manager-nav__balance,
  .manager-nav__brand span {
    display: none;
  }

  .manager-nav__content {
    padding: 0 12px;
  }
}
</style>
