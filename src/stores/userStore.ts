

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { isLogin } from '@/utils/auth'

interface LoginParams {
  isMobile: boolean
  tenantId?: string,
  username: string
  password: string
  clientId?: string
  rememberMe: boolean
  grantType?: string
}


export const useUserStore = defineStore('user', () => {
  const loading = ref(false)

  const token = ref<string>(localStorage.getItem('token') || '')
  const role = ref<string>(localStorage.getItem('role') || '')
  const ruleForm = reactive<LoginParams>({
    tenantId: '000000',
    isMobile: false,
    username: '',
    password: '',
    rememberMe: false,
    grantType: 'password',
  })
  const initLoginState = async () => {
    initRemember()
    const isLoggedIn = await isLogin()
    if (!isLoggedIn) {
      localStorage.removeItem('role')
      localStorage.removeItem('token')
    }
  }
  const detectDeviceType = () => {
    ruleForm.isMobile = (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 600)
    setClientId(ruleForm.isMobile)
  }

  // 初始化记住密码
  const initRemember = () => {
    const savedUsername = localStorage.getItem('savedUsername')
    const savedPassword = localStorage.getItem('savedPassword')
    if (savedUsername && savedPassword) {
      ruleForm.username = savedUsername
      ruleForm.password = savedPassword
      ruleForm.rememberMe = true
    }
  }

  const setClientId = (isMobile: boolean) => {
    const id = isMobile
      ? '428a8310cd442757ae699df5d894f051'
      : 'e5cd7e4891bf95d1d19206ce24a7b32e'
    ruleForm.clientId = id
    localStorage.setItem('client_id', id)
  }

  const setRememberMe = () => {
    if (ruleForm.rememberMe) {
      localStorage.setItem('savedUsername', ruleForm.username)
      localStorage.setItem('savedPassword', ruleForm.password)
    } else {
      localStorage.removeItem('savedUsername')
      localStorage.removeItem('savedPassword')
      ruleForm.username = ''
      ruleForm.password = ''
    }
  }

  const login = async () => {
    loading.value = true
    setClientId(ruleForm.isMobile)

    const config = {
      headers: {
        'content-language': 'zh_CN',
      },
    }

    try {
      const response = await axios.post(
        'http://59.110.62.188:8080/auth/login',
        ruleForm,
        config
      )

      if (response.data.code === 200) {
        token.value = response.data.data.access_token || ''
        role.value = response.data.data.roles[0].roleName || ''
        localStorage.setItem('token', token.value)
        localStorage.setItem('role', role.value)

        setRememberMe()

        return Promise.resolve({
          success: true,
          message: '登录成功'
        })
      } else {
        return Promise.reject({
          success: false,
          messagge: response.data.msg
        })
      }
    } catch (error) {
      return Promise.reject({
        success: false,
        message: error
      })
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = ''
    role.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return {
    loading,
    token,
    role,
    ruleForm,
    login,
    logout,
    setClientId,
    detectDeviceType,
    initLoginState,
  }
})
