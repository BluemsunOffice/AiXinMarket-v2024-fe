import { get, post, put, del } from '@/utils/request';
import type { ApiResponse } from '@/types/request.types';

export interface goodItem {
  goodsId: number;
  num: number;
  imgUrl?: string;
  goodsName?: string;
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
}
