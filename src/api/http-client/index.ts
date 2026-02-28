import axios from 'axios'
import { getAuthToken, getClientIdFromStorage } from '@/utils/auth'

// 创建一个 axios 实例
const instance = axios.create({
  timeout: 10000, // 设置超时时间
})

// 请求拦截器：在请求发送之前附加 Authorization 头
instance.interceptors.request.use(
  (config) => {
    const clientId = getClientIdFromStorage()
    const token = getAuthToken()

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['Content-Type'] = 'application/json'
      if (clientId) {
        config.headers['clientid'] = clientId
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器：处理响应数据或错误
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理错误
    if (error.response && error.response.status === 401) {
      // 如果 token 过期或无效，可以在这里处理，例如跳转到登录页
    }
    return Promise.reject(error)
  },
)

export default instance
