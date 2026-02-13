import { get } from "@/utils/request";
import type { ApiResponse } from "@/types/request.types";
import type { CoinType } from "@/types/goodsInfo";

export type OrderType = "price" | "name" | "type" | "createTime";
export interface goodListSearchParams {
  pageSize: 8;
  pageNum: number;
  currencyType: string;
  name: string;
  type: string;
  isAsc: boolean;
  orderByColumn: OrderType;
}

export interface goodListSearchResp {
  rows: Product[];
  code: number;
  msg: string;
  total: number;
}
export interface Product {
  amount: number;
  barcode: string;
  currencyType: CoinType;
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
  // 获取商品列表
  getGoodsList: (params: goodListSearchParams): Promise<ApiResponse> =>
    get("/market/goods/list", { params }),
};
