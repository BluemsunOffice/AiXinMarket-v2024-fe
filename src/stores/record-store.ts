import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  manageGoodsApi,
  type RestockDetailItem,
  type RestockRecordItem,
} from '@/api/manage-goods.api'

const defaultDetail = (): RestockDetailItem => ({
  id: 0,
  goodsId: 0,
  name: '',
  amount: 0,
  originAmount: 0,
  endAmount: 0,
  imageUrl: '',
})

export const useRecordStore = defineStore('record', () => {
  const loading = ref(false)
  const items = ref<RestockRecordItem[]>([])
  const total = ref(0)

  const pager = reactive({
    pageNum: 1,
    pageSize: 6,
  })

  const detailVisible = ref(false)
  const detailLoading = ref(false)
  const detail = ref<RestockDetailItem>(defaultDetail())

  const increaseAmount = computed(() => {
    return Number(detail.value.endAmount || 0) - Number(detail.value.originAmount || 0)
  })

  const fetchRecords = async () => {
    loading.value = true
    try {
      const response = await manageGoodsApi.getRestockList({
        pageNum: pager.pageNum,
        pageSize: pager.pageSize,
      })

      if (response.code === 200) {
        items.value = response.rows || []
        total.value = response.total || 0
        return
      }

      items.value = []
      total.value = 0
      ElMessage.error(response.message || response.msg || '获取进货记录失败')
    } catch (error) {
      items.value = []
      total.value = 0
      ElMessage.error('获取进货记录失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  const changePage = async (pageNum: number) => {
    pager.pageNum = pageNum
    await fetchRecords()
  }

  const openDetail = async (id: number | string) => {
    detailVisible.value = true
    detailLoading.value = true

    try {
      const response = await manageGoodsApi.getRestockInfo(id)
      if (response.code === 200) {
        detail.value = response.data
        return
      }

      detail.value = defaultDetail()
      ElMessage.error(response.message || response.msg || '获取详情失败')
    } catch (error) {
      detail.value = defaultDetail()
      ElMessage.error('获取详情失败，请稍后重试')
    } finally {
      detailLoading.value = false
    }
  }

  const closeDetail = () => {
    detailVisible.value = false
    detail.value = defaultDetail()
  }

  return {
    loading,
    items,
    total,
    pager,
    detailVisible,
    detailLoading,
    detail,
    increaseAmount,

    fetchRecords,
    changePage,
    openDetail,
    closeDetail,
  }
})
