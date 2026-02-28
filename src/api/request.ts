import axios from 'axios'
import { requestConfig } from '@/config/request.config'
import { getAuthHeaders } from '@/utils/auth'

const request = axios.create({
  baseURL: requestConfig.baseURL,
  timeout: 60000,
})

request.interceptors.request.use((config) => {
  const authHeaders = getAuthHeaders()
  config.headers = config.headers || {}

  Object.entries(authHeaders).forEach(([key, value]) => {
    ; (config.headers as Record<string, string>)[key] = value
  })

  return config
})

export default request
