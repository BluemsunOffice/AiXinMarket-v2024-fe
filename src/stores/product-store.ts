import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import {
    martApi,
    type goodListSearchParams,
    type goodListSearchResp,
    type OrderDirection,
    type Product,
} from '@/api/mart.api'

interface ProductSearchPayload {
    name: string
    type: string
    currencyType: string
    isAsc: OrderDirection
}

export const useProductStore = defineStore('productStore', () => {
    const products = ref<Product[]>([])
    const totalNum = ref(0)
    const isLoading = ref(false)

    const goodListSearchParams = ref<goodListSearchParams>({
        pageSize: 8,
        pageNum: 1,
        currencyType: '',
        name: '',
        type: '',
        isAsc: null,
        orderByColumn: 'price',
    })

    const fetchProducts = async () => {
        isLoading.value = true
        try {
            const response = (await martApi.getGoodsList(
                goodListSearchParams.value,
            )) as unknown as goodListSearchResp
            const { code, msg, rows, total } = response

            if (code === 200) {
                products.value = rows || []
                totalNum.value = total || 0
                return
            }

            products.value = []
            totalNum.value = 0
            ElMessage.error(msg || '商品列表加载失败')
        } catch (error) {
            products.value = []
            totalNum.value = 0
            console.error('Error loading products:', error)
            ElMessage.error('商品列表加载失败，请稍后重试')
        } finally {
            isLoading.value = false
        }
    }

    const setPageNum = async (newPage: number) => {
        goodListSearchParams.value.pageNum = newPage
        await fetchProducts()
    }

    const updateSearch = async (payload: ProductSearchPayload) => {
        goodListSearchParams.value.name = payload.name
        goodListSearchParams.value.type = payload.type
        goodListSearchParams.value.currencyType = payload.currencyType
        goodListSearchParams.value.isAsc = payload.isAsc
        goodListSearchParams.value.pageNum = 1
        await fetchProducts()
    }

    return {
        products,
        totalNum,
        isLoading,
        goodListSearchParams,
        fetchProducts,
        setPageNum,
        updateSearch,
    }
})
