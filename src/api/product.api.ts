import { get, post, put, del } from "@/utils/request";
import type { ApiResponse } from "@/types/request.types";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  images: string[];
}

// 产品相关API
export const productApi = {
  // 获取产品列表
  getProducts: (params?: {
    category?: string;
    page?: number;
    size?: number;
    sortBy?: string;
  }): Promise<ApiResponse<Product[]>> => get("/products", params),

  // 获取产品详情
  getProduct: (id: number): Promise<ApiResponse<Product>> =>
    get(`/product/${id}`),

  // 创建产品
  createProduct: (data: Omit<Product, "id">): Promise<ApiResponse<Product>> =>
    post("/product", data),

  // 更新产品
  updateProduct: (
    id: number,
    data: Partial<Product>,
  ): Promise<ApiResponse<Product>> => put(`/product/${id}`, data),

  // 删除产品
  deleteProduct: (id: number): Promise<ApiResponse<void>> =>
    del(`/product/${id}`),
};
