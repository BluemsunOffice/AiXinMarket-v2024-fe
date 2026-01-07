import { get, post, put, del } from '@/utils/request';
import type { ApiResponse } from '@/types/request.types';

export interface goodItem {
  goodsId: number;
  num: number;
  imgUrl?: string;
  goodsName?: string;
}
export type OrderType = 'price' | 'name' | 'type' | 'createTime';
export interface goodListSearchParams {
  pageSize: 8,
  pageNum: number,
  currencyType: string,
  name: string,
  type: string,
  isAsc: boolean,
  orderByColumn: OrderType,
}

export interface goodListSearchResp {
  rows: product[];
  code: number;
  msg: string;
  total: number;
}
export interface product {
  amount: number;
  barcode: string;
  currencyType: string;
  id: string;
  imageUrl: string;
  imageUrlUrl: string;
  intro: string;
  limitNum: number;
  limitType: string;
  name: string;
  price: number;
  quantifier: string;
  status: string;
  type: string;
}




export const martApi = {
  // 购物车列表
  cartList: (): Promise<ApiResponse> =>
    get('/market/cart/list'),

  // 商品详情
  goodsDetail: (goodsId: number): Promise<ApiResponse> =>
    get(`/market/goods/${goodsId}`),

  // 用户余额
  userBalance: (): Promise<ApiResponse> =>
    get('/market/balance'),

  // 删除购物车商品
  removeCartItem: (removeItemIds: number[]): Promise<ApiResponse> =>
    del(`/market/cart/${removeItemIds.join(',')}`),

  // 结算购物车商品
  settleCartItems: (data: { carts: goodItem[] }): Promise<ApiResponse> =>
    post('/market/cart/settle', { data }),

  // 更新购物车商品数量
  updateCartItem: (data: goodItem): Promise<ApiResponse> =>
    put('/market/cart', { data }),

  // 添加购物车商品
  addCartItem: (data: goodItem): Promise<ApiResponse> =>
    post('/market/cart', data),

  // 获取商品列表
  getGoodsList: (params: goodListSearchParams): Promise<ApiResponse> => get('/market/goods/list', { params }),
}
