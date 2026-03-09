import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { clearAuth, getAuthToken, getClientIdFromStorage } from '@/utils/auth'
import type { ApiResponse, RequestOptions, ErrorResponse } from '@/types/request.types'

export class RequestCore {
  private instance: AxiosInstance
  private requestInterceptor?: number
  private responseInterceptor?: number

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.setupInterceptors()
  }

  /**
   * 设置请求拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.requestInterceptor = this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 获取认证令牌
        const token = getAuthToken()
        const clientId = getClientIdFromStorage()

        // 添加认证头
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
          if (clientId) {
            config.headers.clientid = clientId
          }
        }

        // 这里可以添加其他全局请求处理逻辑
        console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params,
        })

        return config
      },
      (error) => {
        console.error('[Request Error]', error)
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.responseInterceptor = this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        console.log(`[Response] ${response.config.url}`, response.data)

        const responseBody = response.data as
          | (ApiResponse & { msg?: string })
          | undefined

        // 业务状态码 401（例如：{ code: 401, data: null, msg: "认证失败，无法访问系统资源" }）
        if (responseBody?.code === 401) {
          this.handleUnauthorized()

          const unauthorizedError: ErrorResponse = {
            code: 401,
            msg: responseBody.msg || '登录状态已过期，请重新登录',
            success: false,
          }

          return Promise.reject(unauthorizedError)
        }

        // 可以根据业务需求统一处理响应数据
        if (response.data && typeof response.data === 'object') {
          // 示例：检查业务状态码
          if (response.data.code !== 200 && response.data.code !== 0) {
            return Promise.reject(response.data)
          }
        }

        return response
      },
      (error) => {
        console.error('[Response Error]', error)

        // 统一错误处理
        const errorResponse: ErrorResponse = {
          code: error.response?.status || 500,
          msg: error.response?.data?.msg || error.msg || '请求失败',
          success: false,
        }

        // 认证失败处理（401）
        if (error.response?.status === 401) {
          this.handleUnauthorized()
        }

        return Promise.reject(errorResponse)
      },
    )
  }

  /**
   * 处理认证失败
   */
  private handleUnauthorized(): void {
    clearAuth()

    // 这里可以添加跳转到登录页的逻辑
    console.warn('Authentication failed, redirecting to login...')
    window.location.href = '/'
  }

  /**
   * 发送请求
   */
  async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout,
      withCredentials: options.withCredentials,
      responseType: options.responseType,
      validateStatus: options.validateStatus || ((status) => status >= 200 && status < 300),
    }

    try {
      const response = await this.instance.request<ApiResponse<T>>(config)
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    url: string,
    params?: any,
    options?: Partial<RequestOptions>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...options,
    })
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    options?: Partial<RequestOptions>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options,
    })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    options?: Partial<RequestOptions>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options,
    })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    url: string,
    data?: any,
    options?: Partial<RequestOptions>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...options,
    })
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    url: string,
    data?: any,
    options?: Partial<RequestOptions>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...options,
    })
  }

  /**
   * 移除拦截器
   */
  destroy(): void {
    if (this.requestInterceptor !== undefined) {
      this.instance.interceptors.request.eject(this.requestInterceptor)
    }
    if (this.responseInterceptor !== undefined) {
      this.instance.interceptors.response.eject(this.responseInterceptor)
    }
  }
}
