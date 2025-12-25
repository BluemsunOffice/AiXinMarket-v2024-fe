
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

interface LoginParams {
  uname: string
  password: string
  remenber: boolean
  clientId: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const role = ref<string>(localStorage.getItem('role') || '')
  const uname = ref<string>('')
  const password = ref<string>('')
  const remenber = ref<boolean>(false)

  // 初始化记住密码
  const initRemember = () => {
    const savedUsername = localStorage.getItem('savedUsername')
    const savedPassword = localStorage.getItem('savedPassword')
    if (savedUsername && savedPassword) {
      uname.value = savedUsername
      password.value = savedPassword
      remenber.value = true
    }
  }
  initRemember()

  // 登录操作
  const login = async (params: LoginParams) => {
    try {
      const config = {
        headers: {
          'content-language': 'zh_CN',
        },
      }
      const postData = {
        tenantId: '000000',
        username: params.uname,
        password: params.password,
        rememberMe: params.remenber,
        clientId: params.clientId,
        grantType: 'password',
      }
      const response = await axios.post('http://59.110.62.188:8080/auth/login', postData, config)
      if (response.data.code === 200) {
        token.value = response.data.data.access_token || ''
        role.value = response.data.data.roles[0].roleName || ''
        localStorage.setItem('token', token.value)
        localStorage.setItem('role', role.value)
        if (params.remenber) {
          localStorage.setItem('savedUsername', params.uname)
          localStorage.setItem('savedPassword', params.password)
          uname.value = params.uname
          password.value = params.password
          remenber.value = true
        } else {
          localStorage.removeItem('savedUsername')
          localStorage.removeItem('savedPassword')
          uname.value = ''
          password.value = ''
          remenber.value = false
        }
        ElMessage.success('登录成功')
        return true as const
      } else {
        ElMessage.error(response.data.msg)
        return false as const
      }
    } catch {
      ElMessage.error('登录失败，请稍后重试')
      return false as const
    }
  }

  const logout = () => {
    token.value = ''
    role.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  return {
    token,
    role,
    uname,
    password,
    remenber,
    login,
    logout,
  }
})
