

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { userApi, type FundUserInfo, type User } from '@/api/user.api'
import { authConfig } from '@/config/request.config'
import { getClientId } from '@/utils/device'
import { isLoggedIn } from '@/utils/auth'

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
  const loginBtnLoading = ref(false)
  const authToken = ref<string>(localStorage.getItem(authConfig.tokenKey) || '')
  const role = ref<string>(localStorage.getItem('role') || '')
  const ruleForm = reactive<LoginParams>({
    tenantId: '000000',
    isMobile: false,
    username: '',
    password: '',
    rememberMe: false,
    grantType: 'password',
  })
  const userProfile = ref<User>({} as User);
  const fundUserProfile = ref<FundUserInfo>({} as FundUserInfo);
  const roleGroup = ref<string>();

  const initLoginState = async () => {
    initRemember()
    if (!isLoggedIn()) {
      localStorage.removeItem(authConfig.tokenKey)
    }
  }
  const detectDeviceType = () => {
    ruleForm.isMobile = (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 600)
    setClientId()
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

  const setClientId = () => {
    const id = getClientId()
    ruleForm.clientId = id
    localStorage.setItem(authConfig.clientIdKey, id)
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
    loginBtnLoading.value = true
    setClientId()
    try {
      const { code, data, message: msg } = await userApi.login(ruleForm)
      if (code === 200) {
        authToken.value = data.access_token || ''
        role.value = data.roles[0].roleName || ''
        localStorage.setItem(authConfig.tokenKey, authToken.value)
        setRememberMe();
        // 获取用户信息
        await getProfile();

        return Promise.resolve({
          success: true,
          message: '登录成功'
        })
      } else {
        return Promise.reject({
          success: false,
          messagge: msg
        })
      }
    } catch (error) {
      return Promise.reject({
        success: false,
        message: error
      })
    } finally {
      loginBtnLoading.value = false
    }
  }

  const getProfile = async () => {
    try {
      const { code, data } = await userApi.getCurrentUser()
      if (code === 200) {
        userProfile.value = data.user;
        fundUserProfile.value = data.fundUserInfo;
        roleGroup.value = data.roleGroup;
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const updateAvatar = async (file: File) => {
    return userApi.uploadAvatar(file).then(({ code, data: { imgUrl: string } }) => {
      if (code === 200) {
        userProfile.value.avatar = data.imgUrl;
      }
    })
  }

  const logout = () => {
    authToken.value = ''
    role.value = ''
    localStorage.removeItem(authConfig.tokenKey)
    localStorage.removeItem('role')
  }

  return {
    loginBtnLoading,
    authToken,
    role,
    ruleForm,
    userProfile,
    fundUserProfile,
    roleGroup,

    login,
    logout,
    setClientId,
    detectDeviceType,
    initLoginState,
    getProfile,
    updateAvatar
  }
})
