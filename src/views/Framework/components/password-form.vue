<template>
  <div class="password-container">
    <div class="password-header">
      <p class="subtitle">为了账户安全，请定期更新密码</p>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="handleSave"
      class="password-form"
      :label-width="isMobile ? '100%' : '100px'"
      :label-position="isMobile ? 'top' : 'right'"
    >
      <el-form-item label="旧密码" prop="oldPassword" class="form-item">
        <el-input
          v-model="form.oldPassword"
          :type="showPassword.old ? 'text' : 'password'"
          placeholder="请输入当前密码"
          size="large"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
          <template #append>
            <el-button
              :icon="showPassword.old ? View : Hide"
              @click="showPassword.old = !showPassword.old"
              class="pwd-toggle"
              link
            />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword" class="form-item">
        <el-input
          v-model="form.newPassword"
          :type="showPassword.new ? 'text' : 'password'"
          placeholder="5-20位字符"
          size="large"
          @input="checkPasswordRules"
        >
          <template #prefix>
            <el-icon><Key /></el-icon>
          </template>
          <template #append>
            <el-button
              :icon="showPassword.new ? View : Hide"
              @click="showPassword.new = !showPassword.new"
              class="pwd-toggle"
              link
            />
          </template>
        </el-input>

        <div class="password-rules" v-if="form.newPassword">
          <div class="rule-item" :class="{ 'rule-pass': rulesPass.length }">
            <el-icon :size="12">
              <Check v-if="rulesPass.length" />
              <Close v-else />
            </el-icon>
            长度5-20位
          </div>
        </div>
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword" class="form-item">
        <el-input
          v-model="form.confirmPassword"
          :type="showPassword.confirm ? 'text' : 'password'"
          placeholder="请再次输入新密码"
          size="large"
        >
          <template #prefix>
            <el-icon><Check /></el-icon>
          </template>
          <template #append>
            <el-button
              :icon="showPassword.confirm ? View : Hide"
              @click="showPassword.confirm = !showPassword.confirm"
              class="pwd-toggle"
              link
            />
          </template>
        </el-input>

        <div v-if="form.confirmPassword && form.newPassword" class="match-status">
          <el-icon :size="14" :color="isPasswordMatch ? '#67c23a' : '#f56c6c'">
            <Check v-if="isPasswordMatch" />
            <Close v-else />
          </el-icon>
          <span :class="{ 'match-success': isPasswordMatch, 'match-error': !isPasswordMatch }">
            {{ isPasswordMatch ? '密码一致' : '密码不一致' }}
          </span>
        </div>
      </el-form-item>

      <el-form-item class="form-actions">
        <el-button
          type="primary"
          size="large"
          @click="handleSave"
          :loading="loading"
          class="save-btn"
        >
          保存修改
        </el-button>
        <el-button size="large" @click="handleReset" class="reset-btn"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElIcon,
  ElMessage,
  type FormInstance,
} from 'element-plus'
import { Lock, Key, Check, Close, View, Hide } from '@element-plus/icons-vue'
import axios from 'axios'

const formRef = ref<FormInstance>()
const loading = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const showPassword = reactive({
  old: false,
  new: false,
  confirm: false,
})

const rulesPass = reactive({
  length: false,
})

const isPasswordMatch = computed(() => {
  return form.confirmPassword && form.newPassword && form.confirmPassword === form.newPassword
})

const checkPasswordRules = () => {
  rulesPass.length = form.newPassword.length >= 5 && form.newPassword.length <= 20
}

const confirmPasswordValidator = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请确认新密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const newPasswordValidator = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('新密码不能为空'))
  } else if (value.length < 5 || value.length > 20) {
    callback(new Error('密码长度应为5-20位'))
  } else if (value === form.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, validator: newPasswordValidator, trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: confirmPasswordValidator, trigger: 'blur' }],
}

const resetPassword = async (oldPassword: string, newPassword: string) => {
  try {
    loading.value = true

    const token = localStorage.getItem('token') || ''
    const clientid = localStorage.getItem('client_id') || ''

    const response = await axios.put(
      'http://59.110.62.188:8080/system/user/profile/updatePwd',
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          clientid: clientid,
        },
      },
    )

    if (response.data.code === 200) {
      ElMessage.success('密码修改成功')
      handleReset()
    } else {
      ElMessage.error(response.data.msg || '密码修改失败')
    }
  } catch (error: any) {
    console.error('请求错误:', error)

    let errorMessage = '密码修改失败'
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = '登录已过期'
      } else if (error.response.data?.msg) {
        errorMessage = error.response.data.msg
      }
    }

    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    await resetPassword(form.oldPassword, form.newPassword)
  } catch (error) {
    // 验证失败
  }
}

const handleReset = () => {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''

  showPassword.old = false
  showPassword.new = false
  showPassword.confirm = false

  rulesPass.length = false

  formRef.value?.clearValidate()
}

const updateDeviceState = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  updateDeviceState()
  window.addEventListener('resize', updateDeviceState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceState)
})
</script>

<style scoped>
.password-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.password-header {
  margin-bottom: 30px;
  text-align: center;
}

.password-header .subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.password-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
}

.form-item {
  margin-bottom: 24px;
}

.form-item :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.pwd-toggle {
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-rules {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.rule-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #f56c6c;
}

.rule-item.rule-pass {
  color: #67c23a;
}

.rule-item .el-icon {
  flex-shrink: 0;
}

.match-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
}

.match-success {
  color: #67c23a;
}

.match-error {
  color: #f56c6c;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.form-actions .el-button {
  min-width: 120px;
}

.save-btn {
  background-color: #409eff;
  border-color: #409eff;
}

.save-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.reset-btn {
  margin-left: 16px;
}

@media (max-width: 768px) {
  .password-container {
    padding: 0;
  }

  .password-form {
    padding: 14px;
  }

  .password-header .title {
    font-size: 20px;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-actions .el-button {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
