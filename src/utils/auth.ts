import { authConfig } from '@/config/request.config'
import { userApi } from '@/api/user.api'

/**
 * 保存认证令牌
 */
export function saveAuthToken(token: string): void {
  try {
    localStorage.setItem(authConfig.tokenKey, token)
  } catch (error) {
    console.error('Failed to save auth token:', error)
  }
}

/**
 * 获取认证令牌
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(authConfig.tokenKey)
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

/**
 * 保存客户端标识
 */
export function saveClientId(clientId: string): void {
  try {
    localStorage.setItem(authConfig.clientIdKey, clientId)
  } catch (error) {
    console.error('Failed to save client id:', error)
  }
}

/**
 * 获取客户端标识
 */
export function getClientIdFromStorage(): string | null {
  try {
    return localStorage.getItem(authConfig.clientIdKey)
  } catch (error) {
    console.error('Failed to get client id:', error)
    return null
  }
}

/**
 * 清除客户端标识
 */
export function clearClientId(): void {
  try {
    localStorage.removeItem(authConfig.clientIdKey)
  } catch (error) {
    console.error('Failed to clear client id:', error)
  }
}

/**
 * 保存角色
 */
export function saveRole(role: string): void {
  try {
    localStorage.setItem(authConfig.roleKey, role)
  } catch (error) {
    console.error('Failed to save role:', error)
  }
}

/**
 * 获取角色
 */
export function getRole(): string | null {
  try {
    return localStorage.getItem(authConfig.roleKey)
  } catch (error) {
    console.error('Failed to get role:', error)
    return null
  }
}

/**
 * 保存角色组
 */
export function saveRoleGroup(roleGroup: string): void {
  try {
    localStorage.setItem(authConfig.roleGroupKey, roleGroup)
  } catch (error) {
    console.error('Failed to save role group:', error)
  }
}

/**
 * 获取角色组
 */
export function getRoleGroup(): string | null {
  try {
    return localStorage.getItem(authConfig.roleGroupKey)
  } catch (error) {
    console.error('Failed to get role group:', error)
    return null
  }
}

/**
 * 获取可用角色（优先角色组）
 */
export function getCachedRole(): string {
  return getRoleGroup() || getRole() || ''
}

/**
 * 清除角色信息
 */
export function clearRoleAuth(): void {
  try {
    localStorage.removeItem(authConfig.roleKey)
    localStorage.removeItem(authConfig.roleGroupKey)
  } catch (error) {
    console.error('Failed to clear role auth:', error)
  }
}

/**
 * 清除认证信息
 */
export function clearAuth(): void {
  try {
    localStorage.removeItem(authConfig.tokenKey)
    localStorage.removeItem(authConfig.clientIdKey)
    localStorage.removeItem(authConfig.roleKey)
    localStorage.removeItem(authConfig.roleGroupKey)
  } catch (error) {
    console.error('Failed to clear auth:', error)
  }
}

/**
 * 获取认证请求头
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const authToken = getAuthToken()
  const clientId = getClientIdFromStorage()

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  if (clientId) {
    headers.clientid = clientId
  }

  return headers
}

/**
 * 检查是否已登录
 */
export async function isLoggedIn(): Promise<boolean> {
  if (!getAuthToken()) {
    return false
  }
  const { code } = await userApi.isLogin()
  return code === 200
}
