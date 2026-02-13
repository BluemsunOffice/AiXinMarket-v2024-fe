<template>
  <div class="tab-container">
    <template v-if="isMobile">
      <el-select v-model="activeTab" class="mobile-tab-select" size="default">
        <el-option
          v-for="option in tabOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <div v-if="activeTab === 'profile' && role === '资助对象'" class="mobile-content-card">
        <h2>
          <font-awesome-icon icon="fa-solid fa-user-graduate" style="color: #2d4059" />
          学生信息
        </h2>
        <div class="text-content">
          <information-form v-model="studentInfo" />
        </div>
      </div>

      <div v-if="activeTab === 'account'" class="mobile-content-card">
        <h2>
          <font-awesome-icon icon="fa-solid fa-key" style="color: #2d4059" />
          修改密码
        </h2>
        <div class="text-content">
          <password-form />
        </div>
      </div>
    </template>

    <el-tabs v-else v-model="activeTab" class="custom-tabs" type="card">
      <el-tab-pane v-if="role === '资助对象'" label="基本信息" name="profile">
        <h2>
          <font-awesome-icon icon="fa-solid fa-user-graduate" style="color: #2d4059" />
          学生信息
        </h2>
        <div class="text-content">
          <information-form v-model="studentInfo" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="account">
        <h2>
          <font-awesome-icon icon="fa-solid fa-key" style="color: #2d4059" />
          修改密码
        </h2>
        <div class="text-content">
          <password-form />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import InformationForm from './InformationForm.vue'
import PasswordForm from './PasswordForm.vue'
import type { FundUserInfo } from '@/api/user.api'

const studentInfo = defineModel('fundUserInfo', {
  default: {} as FundUserInfo,
  required: false,
})
const role = defineModel('role', {
  default: '' as string,
  required: false,
})

const activeTab = ref('profile')
const isMobile = ref(window.innerWidth <= 768)

const tabOptions = computed(() => {
  const options = [] as Array<{ label: string; value: string }>
  if (role.value === '资助对象') {
    options.push({ label: '基本信息', value: 'profile' })
  }
  options.push({ label: '修改密码', value: 'account' })
  return options
})

const updateDeviceState = () => {
  isMobile.value = window.innerWidth <= 768
}

watch(
  () => role.value,
  (newRole) => {
    if (newRole !== '资助对象' && activeTab.value === 'profile') {
      activeTab.value = 'account'
    }
  },
  { immediate: true },
)

onMounted(() => {
  updateDeviceState()
  window.addEventListener('resize', updateDeviceState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceState)
})
</script>
<style scoped lang="scss">
/* 标题样式 */
h2 {
  position: relative;
  grid-column: span 2;
  text-align: center;
  font-size: 2.1vw;
  color: #2d4059;
  font-weight: 600;
  margin-bottom: 24px;
}
h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, #3498db, #2ecc71);
  border-radius: 2px;
}

.tab-container {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

  .mobile-tab-select {
    width: 100%;
    margin-bottom: 12px;
  }

  .mobile-content-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.05),
      0 1px 3px rgba(0, 0, 0, 0.1);
  }

  :deep(.custom-tabs) {
    .el-tabs__header {
      margin: 0 0 24px;
      border-bottom: 2px solid #e2e8f0;

      .el-tabs__nav {
        border: none;
        border-radius: 12px 12px 0 0;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .el-tabs__item {
        position: relative;
        padding: 16px 32px;
        height: auto;
        font-size: 15px;
        font-weight: 500;
        color: #64748b;
        background: #ffffff;
        border: none;
        border-right: 1px solid #f1f5f9;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          color: #3b82f6;
          background: #f8fafc;
        }

        &.is-active {
          color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          font-weight: 600;
          box-shadow: inset 0 -3px 0 #3b82f6;

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            border-radius: 2px 2px 0 0;
          }
        }

        &:last-child {
          border-right: none;
        }
      }

      .el-tabs__active-bar {
        display: none; // 使用自定义样式
      }
    }

    .el-tabs__content {
      background: #ffffff;
      border-radius: 12px;
      padding: 32px;
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.05),
        0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow:
          0 6px 25px rgba(0, 0, 0, 0.08),
          0 2px 6px rgba(0, 0, 0, 0.12);
      }
    }
  }

  .text-content {
    animation: fadeIn 0.5s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  h2 {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .tab-container {
    padding: 12px;

    :deep(.custom-tabs) {
      .el-tabs__header {
        .el-tabs__item {
          padding: 12px 20px;
          font-size: 14px;
        }
      }

      .el-tabs__content {
        padding: 16px;
      }
    }
  }
}
</style>
