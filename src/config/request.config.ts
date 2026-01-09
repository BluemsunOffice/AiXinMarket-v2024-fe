import { getClientId } from "@/utils/device";

export interface RequestConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
}

export interface AuthConfig {
  tokenKey: string;
  clientIdKey: string;
  clientId: string;
}

// 请求配置
export const requestConfig: RequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  withCredentials: false,
};

// 认证配置
export const authConfig: AuthConfig = {
  tokenKey: "auth_token",
  clientIdKey: "client_id",
  clientId: getClientId(),
};
