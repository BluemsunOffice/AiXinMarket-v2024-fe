<template>
  <span text class="sidebar-logout-btn" @click="outerVisible = true">
    <el-tooltip :content="tooltipContent" :effect="effect" :placement="placement">
      <el-icon>
        <font-awesome-icon :icon="icon" :style="{ color: iconColor }" />
      </el-icon>
    </el-tooltip>
  </span>

  <el-dialog
    append-to-body
    v-model="outerVisible"
    class="logout-dialog"
    title="退出确认"
    width="420px"
    align-center
  >
    <div class="dialog-content logout-dialog-content">
      <div class="logout-icon-wrap">
        <el-icon class="logout-icon"><WarningFilled /></el-icon>
      </div>
      <div class="logout-text-wrap">
        <p class="logout-title">确认退出当前账号吗？</p>
        <p class="logout-subtitle">退出后将返回登录页</p>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer logout-dialog-footer">
        <el-button class="logout-cancel-btn" @click="outerVisible = false">取消</el-button>
        <el-button type="primary" class="logout-confirm-btn" @click="handleLogout"
          >确认退出</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user.api'
import { useUserStore } from '@/stores/user-store'

withDefaults(
  defineProps<{
    placement?:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'
      | 'right'
      | 'right-start'
      | 'right-end'
    effect?: 'dark' | 'light'
    tooltipContent?: string
    icon?: string
    iconColor?: string
  }>(),
  {
    placement: 'right',
    effect: 'light',
    tooltipContent: '退出登录',
    icon: 'fa-solid fa-arrow-right-from-bracket',
    iconColor: 'rgba(249, 55, 55, 1)',
  },
)

const outerVisible = ref(false)
const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    const { code, message: msg } = await userApi.logout()
    if (code === 200) {
      ElMessage.success('退出成功！')
      outerVisible.value = false
      userStore.logout()
      localStorage.removeItem('client_id')
      setTimeout(() => {
        router.push('/')
      }, 120)
    } else {
      ElMessage.error(msg + '!')
    }
  } catch (error) {
    ElMessage.error('请求失败！')
  }
}
</script>

<style scoped>
.sidebar-logout-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sidebar-logout-btn:hover {
  background-color: rgba(249, 55, 55, 0.08);
}

.sidebar-logout-btn .el-icon {
  font-size: 19px;
}

.dialog-content {
  text-align: center;
  padding: 12px 0;
  color: #4b5563;
}

.logout-dialog-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 4px 4px;
}

.logout-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-warning-light-9);
  flex-shrink: 0;
}

.logout-icon {
  color: var(--el-color-warning);
  font-size: 22px;
}

.logout-text-wrap {
  text-align: left;
}

.logout-title {
  margin: 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.logout-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.logout-dialog-footer {
  padding-top: 6px;
}

.logout-cancel-btn {
  min-width: 82px;
}

.logout-confirm-btn {
  min-width: 96px;
}
</style>
