export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
  success: boolean
  [key: string]: any
}

export interface ErrorResponse {
  code: number
  msg: string
  success: boolean
}

export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'stream'
  validateStatus?: (status: number) => boolean
}
