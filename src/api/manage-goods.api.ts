import { del, get, post, put } from '@/utils/request'
import type { ApiResponse } from '@/types/request.types'

export type GoodsStatus = '0' | '1'
export type GoodsType = '0' | '1' | '2'
export type GoodsCurrencyType = '0' | '1'
export type GoodsLimitType = '0' | '1'

export interface ManageGoodsItem {
  id: string
  name: string
  price: number
  amount: number
  type: GoodsType
  currencyType: GoodsCurrencyType
  status: GoodsStatus
  intro: string
  imageUrl: string
  imageUrlUrl?: string
  limitNum: number
  limitType: GoodsLimitType
  barcode?: string
  quantifier?: string
}

export interface GoodsListParams {
  pageNum: number
  pageSize: number
  name?: string
}

export interface PagedRows<T> extends ApiResponse {
  rows: T[]
  total: number
}

export interface SaveGoodsPayload {
  id?: string
  name: string
  price: number
  currencyType: GoodsCurrencyType
  type: GoodsType
  status: GoodsStatus
  barcode: string
  intro: string
  limitNum: number
  limitType: GoodsLimitType
  quantifier: string
  imageUrl: string
  amount?: number
}

export interface RestockPayload {
  goodsId: string
  amount: number
}

export interface RestockListParams {
  pageNum: number
  pageSize: number
  name?: string
}

export interface RestockRecordItem {
  id: number
  goodsId: number
  name: string
  amount: number
  originAmount: number
  endAmount: number
  imageUrl: string
}

export interface RestockDetailItem {
  id: number
  goodsId: number
  name: string
  amount: number
  originAmount: number
  endAmount: number
  imageUrl: string
}

interface OssAsset {
  ossId: string
  url: string
}

export const manageGoodsApi = {
  getGoodsList: (params: GoodsListParams): Promise<PagedRows<ManageGoodsItem>> =>
    get('/market/goods/list', params).then(
      (response) => response as unknown as PagedRows<ManageGoodsItem>,
    ),

  getGoodsDetail: (id: string): Promise<ApiResponse<ManageGoodsItem>> =>
    get(`/market/goods/${id}`) as Promise<ApiResponse<ManageGoodsItem>>,

  createGoods: (payload: SaveGoodsPayload): Promise<ApiResponse> => post('/market/goods', payload),

  updateGoods: (payload: SaveGoodsPayload): Promise<ApiResponse> => put('/market/goods', payload),

  deleteGoods: (ids: string[]): Promise<ApiResponse> => del(`/market/goods/${ids.join(',')}`),

  restockGoods: (payload: RestockPayload): Promise<ApiResponse> => post('/market/restock', payload),

  getRestockList: (params: RestockListParams): Promise<PagedRows<RestockRecordItem>> =>
    get('/market/restock/list', params).then(
      (response) => response as unknown as PagedRows<RestockRecordItem>,
    ),

  getRestockInfo: (id: number | string): Promise<ApiResponse<RestockDetailItem>> =>
    get(`/market/restock/info/${id}`) as Promise<ApiResponse<RestockDetailItem>>,

  uploadImage: (file: File): Promise<ApiResponse<{ ossId: string }>> => {
    const formData = new FormData()
    formData.append('file', file)

    return post('/resource/oss/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<ApiResponse<{ ossId: string }>>
  },

  getOssAssets: (ossIds: string): Promise<ApiResponse<OssAsset[]>> =>
    get(`/resource/oss/listByIds/${ossIds}`) as Promise<ApiResponse<OssAsset[]>>,
}
