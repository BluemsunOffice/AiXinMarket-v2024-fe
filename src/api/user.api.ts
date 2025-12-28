import { get, post, put, del } from '@/utils/request';
import type { ApiResponse } from '@/types/request.types';

export interface Role {
  roleName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  roles: Role[]
}

// 用户类型
export interface User {
  userId: string;
  tenantId: string;
  deptId: string;
  userName: string;
  nickName: string;
  userType: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string | null;
  status: string;
  loginIp: string;
  loginDate: string;
  remark: string;
  createTime: string;
  deptName: string;
  roles: Role[];
  roleIds: string[] | null;
  postIds: string[] | null;
  roleId: string | null;
}

// 资助用户信息类型
export interface FundUserInfo {
  id?: number;
  userId?: string;
  studentId: string;
  name: string;
  gender?: string;
  degree: string;
  birthday: string;
  grade: string;
  college: string;
  nationality?: string;
  major: string;
  admissionDate?: string;
  email?: string;
  apartment: string;
  dormitory: string;
  telephone?: string;
  homeAddress: string | null;
  political?: string;
  marry?: string;
  fundType?: string;
  status?: string;
}

export interface UserWithFundInfo {
  user: User;
  roleGroup: string;
  postGroup: string;
  fundUserInfo: FundUserInfo;
}

// 用户相关API
export const userApi = {
  // 检查登录状态
  isLogin: (): Promise<ApiResponse<boolean>> =>
    get('/auth/isLogin'),

  // 登录
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    post('/auth/login', data),

  // 登出
  logout: (): Promise<ApiResponse> =>
    post('/auth/logout'),

  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<UserWithFundInfo>> =>
    get('/system/user/profile'),

  uploadAvatar: (file: File): Promise<ApiResponse<{ imgUrl: string }>> => {
    const formData = new FormData();
    formData.append('avatarfile', file);
    return post('/system/user/profile/avatar', formData);
  },

  // 更新用户信息
  updateUser: (id: number, data: Partial<FundUserInfo>): Promise<ApiResponse<FundUserInfo>> =>
    put(`/user/${id}`, data),

  // 获取用户列表
  getUsers: (params?: { page?: number; size?: number }): Promise<ApiResponse<FundUserInfo[]>> =>
    get('/users', params),

  // 删除用户
  deleteUser: (id: number): Promise<ApiResponse<void>> =>
    del(`/user/${id}`),
};
