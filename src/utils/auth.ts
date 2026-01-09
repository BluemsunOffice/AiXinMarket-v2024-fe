import { authConfig } from "@/config/request.config";
import { userApi } from "@/api/user.api";

/**
 * 保存认证令牌
 */
export function saveAuthToken(token: string): void {
  try {
    localStorage.setItem(authConfig.tokenKey, token);
  } catch (error) {
    console.error("Failed to save auth token:", error);
  }
}

/**
 * 获取认证令牌
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(authConfig.tokenKey);
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
}

/**
 * 清除认证信息
 */
export function clearAuth(): void {
  try {
    localStorage.removeItem(authConfig.tokenKey);
  } catch (error) {
    console.error("Failed to clear auth:", error);
  }
}

/**
 * 检查是否已登录
 */
export async function isLoggedIn(): Promise<boolean> {
  if (!getAuthToken()) {
    return false;
  }
  const { code } = await userApi.isLogin();
  return code === 200;
}
