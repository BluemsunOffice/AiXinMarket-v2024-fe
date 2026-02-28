import axios from 'axios'
import { authConfig } from '@/config/request.config'
const authToken = localStorage.getItem(authConfig.tokenKey)
const clientId = localStorage.getItem(authConfig.clientIdKey)
const request = axios.create({
  baseURL: 'http://59.110.62.188:8080/',
  timeout: 60000,
  headers: {
    Authorization: `Bearer ${authToken}`,
    clientId: `${clientId}`,
  },
})

export default request
