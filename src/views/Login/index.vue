<template>
  <div :class="isMobile ? 'container mobile-bg' : 'container pc-bg'">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      class="login-form"
    >
      <div :class="isMobile ? 'form-mobile' : 'form-pc'">
        <h1 class="login-title">资助统一身份认证</h1>
        <el-form-item prop="uname">
          <el-input
            v-model="ruleForm.uname"
            placeholder="学号/账号"
            :prefix-icon="User"
            :size="isMobile ? 'default' : 'large'"
            clearable
            autocomplete="username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            placeholder="密码"
            :prefix-icon="Unlock"
            show-password
            :size="isMobile ? 'default' : 'large'"
            clearable
            autocomplete="current-password"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="ruleForm.remenber"
            label="记住密码"
            :size="isMobile ? 'default' : 'large'"
            fill="#f5f5f5"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="log"
            type="primary"
            :size="isMobile ? 'default' : 'large'"
            style="width: 100%"
            :loading="loading"
            @click="submitForm"
            >登录</el-button
          >
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { User, Unlock } from '@element-plus/icons-vue'
import isLogin from '@/api/isLogin'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const clientId = ref('')
const isMobile = ref(false)
const ruleFormRef = ref<FormInstance>()
const ruleForm = ref({
  uname: userStore.uname || '',
  password: userStore.password || '',
  remenber: userStore.remenber,
})

const savedUsername = localStorage.getItem('savedUsername') || ''
const savedPassword = localStorage.getItem('savedPassword') || ''

// 更灵活的移动端判断
const detectDeviceType = () => {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 600) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}

const setClientId = () => {
  clientId.value = isMobile.value
    ? '428a8310cd442757ae699df5d894f051'
    : 'e5cd7e4891bf95d1d19206ce24a7b32e'
  localStorage.setItem('client_id', clientId.value)
}

onMounted(async () => {
  detectDeviceType()
  setClientId()
  window.addEventListener('resize', detectDeviceType)
  // pinia持久化记住密码
  if (userStore.remenber && userStore.uname && userStore.password) {
    ruleForm.value.uname = userStore.uname
    ruleForm.value.password = userStore.password
    ruleForm.value.remenber = true
  }
  // 检查登录状态
  const isLoggedIn = await isLogin()
  if (!isLoggedIn) {
    localStorage.removeItem('role')
    localStorage.removeItem('token')
  }
  if (localStorage.getItem('token') && localStorage.getItem('role')) {
    router.push('/framework')
  }
})

const rules = ref<FormRules>({
  uname: [
    { required: true, message: '请输入学号/账号', trigger: 'blur' },
    { min: 2, max: 32, message: '长度2-32位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '密码长度5-20位', trigger: 'blur' },
  ],
})

// 登录处理（带校验+pinia）
const submitForm = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const success = await userStore.login({
      uname: ruleForm.value.uname,
      password: ruleForm.value.password,
      remenber: ruleForm.value.remenber,
      clientId: clientId.value,
    })
    loading.value = false
    if (success) {
      router.push('/framework')
    }
  })
}
</script>

<style scoped lang="css">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
}
.pc-bg {
  background: url(./../../../image/pc登录背景.jpg) center center no-repeat;
  background-size: cover;
}
.mobile-bg {
  background: url(./../../../image/mobile登录背景.jpg) center center no-repeat fixed;
  background-size: cover;
}
.login-form {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-pc {
  width: 420px;
  padding: 36px 36px 20px 36px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}
.form-pc:hover {
  box-shadow: 0 12px 40px 0 rgba(0, 54, 133, 0.13);
}
.form-mobile {
  width: 94vw;
  max-width: 340px;
  padding: 24px 10px 10px 10px;
  background: rgba(255, 255, 255, 0.99);
  border-radius: 16px;
  box-shadow: 0 2px 16px 0 rgba(0, 54, 133, 0.1);
}
.login-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 22px;
  letter-spacing: 0.08em;
  color: #003685;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 54, 133, 0.06);
}
.el-form-item {
  margin-bottom: 18px;
}
.el-input__wrapper {
  background: #f5f7fa;
  border-radius: 6px;
  box-shadow: none;
  border: 1px solid #e4e7ed;
  transition: border-color 0.2s;
}
.el-input__wrapper:focus-within {
  border-color: #003685;
}
.el-input__inner {
  background: transparent;
  font-size: 16px;
}
.el-checkbox {
  --el-checkbox-checked-bg-color: #003685;
  --el-checkbox-checked-border-color: #003685;
  font-size: 15px;
}
.log {
  width: 100%;
  background: linear-gradient(90deg, #003685 0%, #0056b3 100%);
  border-radius: 6px;
  color: #fff;
  letter-spacing: 0.08em;
  font-size: 17px;
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 rgba(0, 54, 133, 0.1);
  transition:
    background 0.2s,
    box-shadow 0.2s;
}
.log:hover,
.log:focus {
  background: linear-gradient(90deg, #0056b3 0%, #003685 100%);
  box-shadow: 0 4px 16px 0 rgba(0, 54, 133, 0.13);
}
.el-button.is-loading .log {
  opacity: 0.7;
}
@media (max-width: 600px) {
  .form-pc {
    width: 98vw;
    min-width: unset;
    padding: 18px 2vw 10px 2vw;
  }
  .login-title {
    font-size: 20px;
    margin-bottom: 14px;
  }
}
</style>
