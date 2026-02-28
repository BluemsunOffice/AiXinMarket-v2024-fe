import { del, get, post, put } from "@/utils/request";
import type { ApiResponse } from "@/types/request.types";
import type { CoinType } from "@/types/goods-info";

export interface CartItemPayload {
  goodsId: string;
  num: number;
  imgUrl?: string;
  goodsName?: string;
}

export interface CartItem {
  goodsId: string;
  goodsName: string;
  imageUrlUrl: string;
  currencyType: CoinType;
  price: number;
  num: number;
  limitNum: number;
  [key: string]: any;
}

export interface CartBalance {
  generalBalance: number;
  clothingBalance: number;
}

export interface GoodsDetailData {
  amount: number;
  [key: string]: any;
}

export const cartApi = {
  list: (): Promise<ApiResponse<CartItem[]>> => get("/market/cart/list"),

  goodsDetail: (goodsId: string): Promise<ApiResponse<GoodsDetailData>> =>
    get(`/market/goods/${goodsId}`),

  balance: (): Promise<ApiResponse<CartBalance>> => get("/market/balance"),

  remove: (removeItemIds: string[]): Promise<ApiResponse> =>
    del(`/market/cart/${removeItemIds.join(",")}`),

  settle: (data: { carts: CartItemPayload[] }): Promise<ApiResponse> =>
    post("/market/cart/settle", data),

  update: (data: CartItemPayload): Promise<ApiResponse> =>
    put("/market/cart", data),

  add: (data: CartItemPayload): Promise<ApiResponse> => post("/market/cart", data),
};
