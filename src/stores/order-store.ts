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

const CHECKABLE_ORDER_STATUS: AdminOrderStatus = '0'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<AdminOrderItem[]>([])
  const loading = ref(false)
  const exportingOrderFile = ref(false)
  const selectedOrderIds = ref<string[]>([])
  const selectedOrderMap = ref<Record<string, AdminOrderItem>>({})

  const paging = reactive({
    pageNum: 1,
    pageSize: 8,
    total: 0,
  })

  const statusFilter = ref<number | null>(null)
  const sortFilter = ref<ManageOrderDirection>(null)
  const keyword = ref('')

  const statusOptions = ref<FilterOption<number | null>[]>([
    { label: '全部状态', value: null },
    { label: '待处理', value: 0 },
    { label: '已取消', value: 1 },
    { label: '已核销', value: 2 },
  ])

  const sortOptions = ref<FilterOption<ManageOrderDirection>[]>([
    { label: '默认排序', value: null },
    { label: '最新订单', value: 1 },
    { label: '最旧订单', value: 0 },
  ])

  const statusTitle = computed(() => {
    return (
      statusOptions.value.find((option) => option.value === statusFilter.value)?.label || '订单状态'
    )
  })

  const checkableSelectedOrders = computed(() => {
    return selectedOrderIds.value
      .map((id) => selectedOrderMap.value[id])
      .filter((order): order is AdminOrderItem => Boolean(order))
      .filter((order) => order.status === CHECKABLE_ORDER_STATUS)
  })

  const invalidSelectedOrders = computed(() => {
    return selectedOrderIds.value
      .map((id) => selectedOrderMap.value[id])
      .filter((order): order is AdminOrderItem => Boolean(order))
      .filter((order) => order.status !== CHECKABLE_ORDER_STATUS)
  })

  const canBatchCheck = computed(() => checkableSelectedOrders.value.length > 0)
  const batchCheckPreviewVisible = ref(false)

  const detailDialogVisible = ref(false)
  const detailLoading = ref(false)
  const currentDetail = ref<OrderInfoItem | null>(null)
  const currentDetailOrderId = ref<string>('')

  const detailPaging = reactive({
    pageNum: 1,
    pageSize: 1,
    total: 0,
  })

  const mergeSelectedOrdersFromCurrentPage = () => {
    const currentPageIds = new Set(orders.value.map((order) => order.id))

    currentPageIds.forEach((id) => {
      delete selectedOrderMap.value[id]
    })

    orders.value.forEach((order) => {
      if (selectedOrderIds.value.includes(order.id)) {
        selectedOrderMap.value[order.id] = order
      }
    })
  }

  const resolvePagedRows = (response: any) => {
    const rowsCandidate = response?.rows ?? response?.data?.rows ?? response?.data
    const rows = Array.isArray(rowsCandidate) ? rowsCandidate : []
    const totalCandidate = response?.total ?? response?.data?.total
    const total = Number(totalCandidate)
    return {
      rows,
      total: Number.isFinite(total) ? total : rows.length,
    }
  }

  const fetchOrders = async () => {
    loading.value = true
    try {
      const trimmedKeyword = keyword.value.trim()
      const isSearching = Boolean(trimmedKeyword)

      const response = isSearching
        ? await orderApi.getAdminQuery({
            pageNum: paging.pageNum,
            pageSize: paging.pageSize,
            goodsName: trimmedKeyword,
            isAsc: sortFilter.value,
            orderByColumn: 'createTime',
          })
        : await orderApi.getAdminList({
            pageNum: paging.pageNum,
            pageSize: paging.pageSize,
            status: statusFilter.value,
            isAsc: sortFilter.value,
          })

      if (response.code === 200) {
        const { rows, total } = resolvePagedRows(response)
        orders.value = rows
        paging.total = total
        mergeSelectedOrdersFromCurrentPage()
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

  const updateSelection = (rows: AdminOrderItem[]) => {
    const currentPageIds = new Set(orders.value.map((order) => order.id))

    selectedOrderIds.value = selectedOrderIds.value.filter((id) => !currentPageIds.has(id))

    rows.forEach((row) => {
      selectedOrderMap.value[row.id] = row
      if (!selectedOrderIds.value.includes(row.id)) {
        selectedOrderIds.value.push(row.id)
      }
    })
  }

  const clearBatchSelection = () => {
    selectedOrderIds.value = []
    selectedOrderMap.value = {}
  }

  const getStatusText = (status: string | AdminOrderStatus) => {
    const statusMap: Record<string, string> = {
      '0': '待处理',
      '1': '已取消',
      '2': '已核销',
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

  const isOrderCheckable = (status: string | AdminOrderStatus) =>
    String(status) === CHECKABLE_ORDER_STATUS

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

  const setKeyword = (value: string) => {
    keyword.value = value
  }

  const searchOrders = async () => {
    paging.pageNum = 1
    await fetchOrders()
  }

  const getExportFileName = (disposition: string | undefined) => {
    if (!disposition) {
      return 'orders.xlsx'
    }

    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match?.[1]) {
      return decodeURIComponent(utf8Match[1])
    }

    const normalMatch = disposition.match(/filename="?([^"]+)"?/i)
    if (normalMatch?.[1]) {
      return decodeURIComponent(normalMatch[1])
    }

    return 'orders.xlsx'
  }

  const exportOrderFile = async () => {
    exportingOrderFile.value = true
    try {
      const response = await orderApi.exportOrders()
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data || ''])
      const disposition = (response.headers?.['content-disposition'] ||
        response.headers?.['Content-Disposition']) as string | undefined
      const fileName = getExportFileName(disposition)

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('导出成功')
    } catch (error) {
      ElMessage.error('导出失败，请稍后重试')
    } finally {
      exportingOrderFile.value = false
    }
  }

  const checkSingleOrder = async (orderId: string) => {
    const targetOrder =
      orders.value.find((order) => order.id === orderId) || selectedOrderMap.value[orderId]
    if (targetOrder && !isOrderCheckable(targetOrder.status)) {
      ElMessage.warning('该订单当前状态不可核销')
      return
    }

    try {
      const response = await orderApi.checkOrders([orderId])
      if (response.code === 200) {
        ElMessage.success('核销成功')
        delete selectedOrderMap.value[orderId]
        selectedOrderIds.value = selectedOrderIds.value.filter((id) => id !== orderId)
        await fetchOrders()
        return
      }
      ElMessage.error(response.msg || '核销失败')
    } catch (error) {
      ElMessage.error('核销失败，请稍后重试')
    }
  }

  const cancelSingleOrder = async (orderId: string) => {
    const targetOrder =
      orders.value.find((order) => order.id === orderId) || selectedOrderMap.value[orderId]
    if (targetOrder && !isOrderCheckable(targetOrder.status)) {
      ElMessage.warning('该订单当前状态不可取消')
      return
    }

    try {
      const response = await orderApi.cancelUserOrder(orderId)
      if (response.code === 200) {
        ElMessage.success('取消成功')
        delete selectedOrderMap.value[orderId]
        selectedOrderIds.value = selectedOrderIds.value.filter((id) => id !== orderId)
        await fetchOrders()
        return
      }
      ElMessage.error(response.msg || '取消失败')
    } catch (error) {
      ElMessage.error('取消失败，请稍后重试')
    }
  }

  const openBatchCheckPreview = () => {
    if (!selectedOrderIds.value.length) {
      ElMessage.warning('请先选择订单')
      return
    }

    if (!checkableSelectedOrders.value.length) {
      ElMessage.warning('选中的订单中没有可核销的待处理订单')
      return
    }

    if (invalidSelectedOrders.value.length) {
      ElMessage.warning('已自动过滤不可核销订单，仅预览待处理订单')
    }

    batchCheckPreviewVisible.value = true
  }

  const closeBatchCheckPreview = () => {
    batchCheckPreviewVisible.value = false
  }

  const checkSelectedOrders = async () => {
    const orderIds = checkableSelectedOrders.value.map((order) => order.id)
    if (!orderIds.length) {
      ElMessage.warning('没有可核销的待处理订单')
      return
    }

    try {
      const response = await orderApi.checkOrders(orderIds)
      if (response.code === 200) {
        ElMessage.success('批量核销成功')
        closeBatchCheckPreview()
        clearBatchSelection()
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
    exportingOrderFile,
    paging,
    statusOptions,
    sortOptions,
    statusTitle,
    keyword,
    selectedOrderIds,
    checkableSelectedOrders,
    invalidSelectedOrders,
    canBatchCheck,
    batchCheckPreviewVisible,
    detailDialogVisible,
    detailLoading,
    detailPaging,
    currentDetail,

    fetchOrders,
    updateOrderPage,
    updateSelection,
    clearBatchSelection,
    getStatusText,
    getStatusTagType,
    isOrderCheckable,
    setStatusFilter,
    setSortFilter,
    setKeyword,
    searchOrders,
    exportOrderFile,
    checkSingleOrder,
    cancelSingleOrder,
    openBatchCheckPreview,
    closeBatchCheckPreview,
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
