import { get, post } from "@/utils/request";
import type { ApiResponse } from "@/types/request.types";
import request from "@/api/request";

export type AdminOrderStatus = "0" | "1" | "2";

export interface AdminOrderItem {
  id: number;
  status: AdminOrderStatus;
  checked?: boolean;
  userId: string;
  username: string;
  createTime: string;
  clothingBalance: number | string;
  generalBalance: number | string;
  names: string[] | string;
}

export interface OrderInfoItem {
  orderId: number;
  goodsId: string;
  goodsName: string;
  price: number | string;
  amount: number;
  currencyType: string;
  imageUrl: string;
  intro: string;
}

export interface UserOrderItem {
  id: string;
  status: string;
  createTime: string;
  generalBalance: number | string;
  clothingBalance: number | string;
  [key: string]: any;
}

export interface UserOrderInfoItem {
  goodsName: string;
  currentType: number;
  amount: number;
  price: number | string;
  imageUrl: string;
  [key: string]: any;
}

export interface OrderListQuery {
  pageSize: number;
  pageNum: number;
  status?: number | null;
  isAsc?: 0 | 1 | null;
}

export interface OrderInfoPageQuery {
  orderId: string;
  pageSize: number;
  pageNum: number;
}

export interface UserOrderListQuery {
  pageNum: number;
  pageSize: number;
  status?: string;
}

export interface PagedRows<T> extends ApiResponse {
  rows: T[];
  total: number;
}

export const orderApi = {
  getAdminList: (params: OrderListQuery): Promise<PagedRows<AdminOrderItem>> =>
    get("/market/order/adminlist", params).then(
      (response) => response as unknown as PagedRows<AdminOrderItem>,
    ),

  getOrderInfoPage: (
    params: OrderInfoPageQuery,
  ): Promise<PagedRows<OrderInfoItem>> =>
    get("/market/orderInfo/page", params).then(
      (response) => response as unknown as PagedRows<OrderInfoItem>,
    ),

  checkOrders: (orderIds: number[]): Promise<ApiResponse> =>
    post(`/market/order/check/${orderIds.join(",")}`),

  getUserList: (params: UserOrderListQuery): Promise<PagedRows<UserOrderItem>> =>
    get("/market/order/userlist", params).then(
      (response) => response as unknown as PagedRows<UserOrderItem>,
    ),

  cancelUserOrder: (orderId: string): Promise<ApiResponse> =>
    post(`/market/order/cancel/${orderId}`),

  getUserOrderDetail: (orderId: string): Promise<UserOrderInfoItem[]> =>
    request.get(`/market/orderInfo/${orderId}`).then((response) => response.data as UserOrderInfoItem[]),
};
