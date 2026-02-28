import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import {
  userApi,
  type FundProjectRecord,
  type FundPunishRecord,
  type FundScholarshipRecord,
  type FundUserInfo,
  type UpdateOwnProfilePayload,
  type User,
} from '@/api/user.api'
import { getClientId } from '@/utils/device'
import {
  clearAuth,
  getAuthToken,
  getRole,
  getRoleGroup,
  isLoggedIn,
  saveAuthToken,
  saveClientId,
  saveRole,
  saveRoleGroup,
} from '@/utils/auth'

interface LoginParams {
  isMobile: boolean
  tenantId?: string
  username: string
  password: string
  clientId?: string
  rememberMe: boolean
  grantType?: string
}

interface PagingState {
  pageNum: number
  pageSize: number
  total: number
}

export const useUserStore = defineStore('user', () => {
  const loginBtnLoading = ref(false)
  const authToken = ref<string>(getAuthToken() || '')
  const role = ref<string>(getRole() || '')
  const roleGroup = ref<string>(getRoleGroup() || '')
  const ruleForm = reactive<LoginParams>({
    tenantId: '000000',
    isMobile: false,
    username: '',
    password: '',
    rememberMe: false,
    grantType: 'password',
  })
  const userProfile = ref<User>({} as User)
  const fundUserProfile = ref<FundUserInfo>({} as FundUserInfo)
  const campusName = ref('')
  const avatarUrl = ref('')
  const generalBalance = ref(0)
  const clothingBalance = ref(0)
  const navDataLoaded = ref(false)
  const ownProfile = ref<FundUserInfo>({} as FundUserInfo)
  const ownPunishList = ref<FundPunishRecord[]>([])
  const ownScholarshipList = ref<FundScholarshipRecord[]>([])
  const ownProjectList = ref<FundProjectRecord[]>([])

  const punishPaging = reactive<PagingState>({
    pageNum: 1,
    pageSize: 8,
    total: 0,
  })
  const scholarshipPaging = reactive<PagingState>({
    pageNum: 1,
    pageSize: 8,
    total: 0,
  })
  const projectPaging = reactive<PagingState>({
    pageNum: 1,
    pageSize: 8,
    total: 0,
  })

  const initLoginState = async () => {
    initRemember()
    if (!(await isLoggedIn())) {
      clearAuth()
    }
  }
  const detectDeviceType = () => {
    ruleForm.isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 600
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
    saveClientId(id)
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
        saveAuthToken(authToken.value)
        saveRole(role.value)
        setRememberMe()
        // 获取用户信息
        await getProfile()

        return Promise.resolve({
          success: true,
          message: '登录成功',
        })
      } else {
        console.error('Login failed:', msg)
        return Promise.reject({
          success: false,
          message: msg,
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      return Promise.reject({
        success: false,
        message: error instanceof Error ? error.message : String((error as { msg?: unknown }).msg),
      })
    } finally {
      loginBtnLoading.value = false
    }
  }

  const getProfile = async () => {
    try {
      const { code, data } = await userApi.getCurrentUser()
      if (code === 200) {
        userProfile.value = data.user
        fundUserProfile.value = data.fundUserInfo
        roleGroup.value = data.roleGroup || ''
        saveRoleGroup(roleGroup.value)
        campusName.value = data.user?.deptName || ''
        avatarUrl.value = data.user?.avatar || ''
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const fetchNavBarData = async (force = false) => {
    if (navDataLoaded.value && !force) {
      return
    }

    try {
      const [, balanceResponse] = await Promise.all([getProfile(), userApi.getMarketBalance()])

      if (balanceResponse.code === 200) {
        generalBalance.value = balanceResponse.data?.generalBalance || 0
        clothingBalance.value = balanceResponse.data?.clothingBalance || 0
      }

      navDataLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch navbar data:', error)
    }
  }

  const updateAvatar = async (file: File) => {
    return userApi.uploadAvatar(file).then(({ code, data }) => {
      if (code === 200) {
        userProfile.value.avatar = data.imgUrl
      }
    })
  }

  const setOwnProfilePageSize = (pageSize: number) => {
    punishPaging.pageSize = pageSize
    scholarshipPaging.pageSize = pageSize
    projectPaging.pageSize = pageSize
  }

  const fetchOwnProfile = async () => {
    const { code, data } = await userApi.getOwnInfo()
    if (code === 200) {
      ownProfile.value = data.fundUserInfoVo
    }
  }

  const fetchOwnPunishList = async () => {
    const { code, data } = await userApi.getOwnInfo({
      pageNum: punishPaging.pageNum,
      pageSize: punishPaging.pageSize,
    })
    if (code === 200) {
      ownPunishList.value = data.fundPunishVo || []
      punishPaging.total = data.punishTotal || 0
    }
  }

  const fetchOwnScholarshipList = async () => {
    const { code, data } = await userApi.getOwnInfo({
      pageNum: scholarshipPaging.pageNum,
      pageSize: scholarshipPaging.pageSize,
    })
    if (code === 200) {
      ownScholarshipList.value = data.fundScholarshipVo || []
      scholarshipPaging.total = data.scholarshipTotal || 0
    }
  }

  const fetchOwnProjectList = async () => {
    const { code, data } = await userApi.getOwnInfo({
      pageNum: projectPaging.pageNum,
      pageSize: projectPaging.pageSize,
    })
    if (code === 200) {
      ownProjectList.value = data.fundProjectVo || []
      projectPaging.total = data.projectTotal || 0
    }
  }

  const fetchOwnProfilePageData = async () => {
    await Promise.all([
      fetchOwnProfile(),
      fetchOwnPunishList(),
      fetchOwnScholarshipList(),
      fetchOwnProjectList(),
    ])
  }

  const updateOwnProfile = async (data: UpdateOwnProfilePayload) => {
    const response = await userApi.updateOwnProfile(data)
    if (response.code === 200) {
      await fetchOwnProfile()
    }
    return response
  }

  const updateOwnPunishPage = async (pageNum: number) => {
    punishPaging.pageNum = pageNum
    await fetchOwnPunishList()
  }

  const updateOwnScholarshipPage = async (pageNum: number) => {
    scholarshipPaging.pageNum = pageNum
    await fetchOwnScholarshipList()
  }

  const updateOwnProjectPage = async (pageNum: number) => {
    projectPaging.pageNum = pageNum
    await fetchOwnProjectList()
  }

  const logout = () => {
    authToken.value = ''
    role.value = ''
    roleGroup.value = ''
    campusName.value = ''
    avatarUrl.value = ''
    generalBalance.value = 0
    clothingBalance.value = 0
    navDataLoaded.value = false
    clearAuth()
  }

  return {
    loginBtnLoading,
    authToken,
    role,
    ruleForm,
    userProfile,
    fundUserProfile,
    roleGroup,
    campusName,
    avatarUrl,
    generalBalance,
    clothingBalance,
    ownProfile,
    ownPunishList,
    ownScholarshipList,
    ownProjectList,
    punishPaging,
    scholarshipPaging,
    projectPaging,

    login,
    logout,
    setClientId,
    detectDeviceType,
    initLoginState,
    getProfile,
    fetchNavBarData,
    updateAvatar,
    setOwnProfilePageSize,
    fetchOwnProfile,
    fetchOwnPunishList,
    fetchOwnScholarshipList,
    fetchOwnProjectList,
    fetchOwnProfilePageData,
    updateOwnProfile,
    updateOwnPunishPage,
    updateOwnScholarshipPage,
    updateOwnProjectPage,
  }
})
