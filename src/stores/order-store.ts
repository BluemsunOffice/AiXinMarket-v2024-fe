import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  orderApi,
  type AdminOrderItem,
  type AdminOrderStatus,
  type OrderInfoItem,
  type UserOrderInfoItem,
  type UserOrderItem,
} from '@/api/order.api'
import type { ManageOrderDirection } from '@/api/order.api'
import { getClientId } from '@/utils/device'
import { saveClientId } from '@/utils/auth'

export interface FilterOption<T> {
  label: string
  value: T
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<AdminOrderItem[]>([])
  const loading = ref(false)
  const selectedOrderIds = ref<string[]>([])

  const paging = reactive({
    pageNum: 1,
    pageSize: 8,
    total: 0,
  })

  const statusFilter = ref<number | null>(null)
  const sortFilter = ref<ManageOrderDirection>(null)

  const statusOptions: FilterOption<number | null>[] = [
    { label: '全部状态', value: null },
    { label: '待处理', value: 0 },
    { label: '已取消', value: 1 },
    { label: '已核销', value: 2 },
  ]

  const sortOptions: FilterOption<ManageOrderDirection>[] = [
    { label: '默认排序', value: null },
    { label: '最新订单', value: 1 },
    { label: '最旧订单', value: 0 },
  ]

  const statusTitle = computed(() => {
    return statusOptions.find((option) => option.value === statusFilter.value)?.label || '订单状态'
  })

  const canBatchCheck = computed(() => selectedOrderIds.value.length > 0)

  const detailDialogVisible = ref(false)
  const detailLoading = ref(false)
  const currentDetail = ref<OrderInfoItem | null>(null)
  const currentDetailOrderId = ref<string>('')

  const detailPaging = reactive({
    pageNum: 1,
    pageSize: 1,
    total: 0,
  })

  const fetchOrders = async () => {
    loading.value = true
    try {
      const response = await orderApi.getAdminList({
        pageNum: paging.pageNum,
        pageSize: paging.pageSize,
        status: statusFilter.value,
        isAsc: sortFilter.value,
      })

      if (response.code === 200) {
        orders.value = response.rows || []
        paging.total = response.total || 0
        return
      }

      orders.value = []
      paging.total = 0
      ElMessage.error(response.msg || '订单列表加载失败')
    } catch (error) {
      orders.value = []
      paging.total = 0
      ElMessage.error('订单列表加载失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  const updateOrderPage = async (pageNum: number) => {
    paging.pageNum = pageNum
    await fetchOrders()
  }

  const updateSelection = (ids: string[]) => {
    selectedOrderIds.value = ids
  }

  const getStatusText = (status: string | AdminOrderStatus) => {
    const statusMap: Record<string, string> = {
      '0': '待处理',
      '1': '已核销',
      '2': '已取消',
    }
    return statusMap[String(status)] || '未知'
  }

  const getStatusTagType = (status: string | AdminOrderStatus) => {
    const typeMap: Record<string, 'primary' | 'success' | 'danger'> = {
      '0': 'primary',
      '1': 'success',
      '2': 'danger',
    }
    return typeMap[String(status)] || 'primary'
  }

  const setStatusFilter = async (status: number | null) => {
    statusFilter.value = status
    paging.pageNum = 1
    await fetchOrders()
  }

  const setSortFilter = async (sort: ManageOrderDirection) => {
    sortFilter.value = sort
    paging.pageNum = 1
    await fetchOrders()
  }

  const checkSingleOrder = async (orderId: string) => {
    try {
      const response = await orderApi.checkOrders([orderId])
      if (response.code === 200) {
        ElMessage.success('核销成功')
        await fetchOrders()
        return
      }
      ElMessage.error(response.msg || '核销失败')
    } catch (error) {
      ElMessage.error('核销失败，请稍后重试')
    }
  }

  const checkSelectedOrders = async () => {
    if (!selectedOrderIds.value.length) {
      ElMessage.warning('请先选择订单')
      return
    }

    try {
      const response = await orderApi.checkOrders(selectedOrderIds.value)
      if (response.code === 200) {
        ElMessage.success('批量核销成功')
        selectedOrderIds.value = []
        await fetchOrders()
        return
      }
      ElMessage.error(response.msg || '批量核销失败')
    } catch (error) {
      ElMessage.error('批量核销失败，请稍后重试')
    }
  }

  const openDetailDialog = async (orderId: string) => {
    currentDetailOrderId.value = orderId
    detailDialogVisible.value = true
    await updateDetailPage(1)
  }

  const closeDetailDialog = () => {
    detailDialogVisible.value = false
    detailPaging.pageNum = 1
    detailPaging.total = 0
    currentDetail.value = null
    currentDetailOrderId.value = ''
  }

  const updateDetailPage = async (pageNum: number) => {
    if (!currentDetailOrderId.value) {
      return
    }

    detailLoading.value = true
    detailPaging.pageNum = pageNum

    try {
      const response = await orderApi.getOrderInfoPage({
        orderId: currentDetailOrderId.value,
        pageNum,
        pageSize: detailPaging.pageSize,
      })

      if (response.code === 200) {
        const rows = response.rows || []
        currentDetail.value = rows[0] || null
        detailPaging.total = response.total || 0
        return
      }

      currentDetail.value = null
      detailPaging.total = 0
      ElMessage.error(response.msg || '订单详情加载失败')
    } catch (error) {
      currentDetail.value = null
      detailPaging.total = 0
      ElMessage.error('订单详情加载失败，请稍后重试')
    } finally {
      detailLoading.value = false
    }
  }

  const tableData = ref<UserOrderItem[]>([])
  const detailTableData = ref<UserOrderInfoItem[]>([])

  const query = reactive({
    pageNum: 1,
    pageSize: 10,
    status: '',
  })

  const pageSizes = ref([10, 20, 30, 40, 50, 100])
  const total = ref(0)

  const loadings = reactive({
    table: false,
    detail: false,
  })

  const statusMap = ref<Record<string, string>>({
    0: '待处理',
    1: '失败',
    2: '成功',
  })

  const visible = ref(false)
  const userDetailOrderId = ref<number | null>(null)

  const detailTableDataTotal = computed(() => detailTableData.value.length)

  const fetchOrderList = async (pageNum = query.pageNum, pageSize = query.pageSize) => {
    loadings.table = true
    try {
      const response = await orderApi.getUserList({
        pageNum,
        pageSize,
        status: query.status,
      })

      query.pageNum = pageNum
      query.pageSize = pageSize
      tableData.value = response.rows || []
      total.value = response.total || 0
    } catch (error) {
      ElMessage.error('获取订单列表失败')
    } finally {
      loadings.table = false
    }
  }

  const cancelOrder = async (row: UserOrderItem) => {
    try {
      const response = await orderApi.cancelUserOrder(row.id)
      if (response.code === 200) {
        ElMessage.success('取消成功')
        await fetchOrderList(query.pageNum, query.pageSize)
      } else {
        ElMessage.error(response.msg || '取消失败')
      }
    } catch (error) {
      ElMessage.error('取消订单失败')
    }
  }

  const showDetail = async (row: UserOrderItem) => {
    if (!row?.id) {
      return
    }

    userDetailOrderId.value = Number(row.id)
    visible.value = true
    loadings.detail = true

    try {
      const detail = await orderApi.getUserOrderDetail(row.id)
      detailTableData.value = Array.isArray(detail) ? detail : []
    } catch (error) {
      ElMessage.error('获取订单详情失败')
    } finally {
      loadings.detail = false
    }
  }

  const setPageSize = async (pageSize: number) => {
    await fetchOrderList(query.pageNum, pageSize)
  }

  const setPageNum = async (pageNum: number) => {
    await fetchOrderList(pageNum, query.pageSize)
  }

  const initPage = async () => {
    saveClientId(getClientId())
    await fetchOrderList()
  }

  return {
    orders,
    loading,
    paging,
    statusOptions,
    sortOptions,
    statusTitle,
    canBatchCheck,
    detailDialogVisible,
    detailLoading,
    detailPaging,
    currentDetail,

    fetchOrders,
    updateOrderPage,
    updateSelection,
    getStatusText,
    getStatusTagType,
    setStatusFilter,
    setSortFilter,
    checkSingleOrder,
    checkSelectedOrders,
    openDetailDialog,
    closeDetailDialog,
    updateDetailPage,

    tableData,
    detailTableData,
    detailTableDataTotal,
    query,
    pageSizes,
    total,
    loadings,
    statusMap,
    visible,
    fetchOrderList,
    cancelOrder,
    showDetail,
    setPageSize,
    setPageNum,
    initPage,
  }
})
