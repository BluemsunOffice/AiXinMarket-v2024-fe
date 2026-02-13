import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
    orderApi,
    type AdminOrderItem,
    type AdminOrderStatus,
    type OrderInfoItem,
} from "@/api/order.api";

export interface FilterOption<T> {
    label: string;
    value: T;
}

const STATUS_TEXT_MAP: Record<AdminOrderStatus, string> = {
    "0": "待处理",
    "1": "失败",
    "2": "成功",
};

const STATUS_TAG_MAP: Record<AdminOrderStatus, "primary" | "danger" | "success"> = {
    "0": "primary",
    "1": "danger",
    "2": "success",
};

export const useOrderStore = defineStore("order", () => {
    const orders = ref<AdminOrderItem[]>([]);
    const loading = ref(false);
    const selectedOrderIds = ref<number[]>([]);

    const filters = reactive({
        status: null as number | null,
        isAsc: null as 0 | 1 | null,
    });

    const paging = reactive({
        pageNum: 1,
        pageSize: 9,
        total: 0,
    });

    const detailDialogVisible = ref(false);
    const detailLoading = ref(false);
    const detailRows = ref<OrderInfoItem[]>([]);
    const detailPaging = reactive({
        pageNum: 1,
        pageSize: 1,
        total: 0,
    });
    const activeOrderId = ref<number | null>(null);

    const statusOptions: FilterOption<number | null>[] = [
        { label: "全部", value: null },
        { label: "待处理", value: 0 },
        { label: "失败", value: 1 },
        { label: "成功", value: 2 },
    ];

    const sortOptions: FilterOption<0 | 1>[] = [
        { label: "按时间降序", value: 0 },
        { label: "按时间升序", value: 1 },
    ];

    const statusTitle = computed(() => {
        return statusOptions.find((item) => item.value === filters.status)?.label || "全部";
    });

    const sortTitle = computed(() => {
        return sortOptions.find((item) => item.value === filters.isAsc)?.label || "按时间排序";
    });

    const canBatchCheck = computed(() => {
        return filters.status === 0 && selectedOrderIds.value.length > 0;
    });

    const currentDetail = computed<OrderInfoItem | null>(() => {
        return detailRows.value[0] || null;
    });

    const getStatusText = (status: string) => {
        return STATUS_TEXT_MAP[(status as AdminOrderStatus) || "2"] || "成功";
    };

    const getStatusTagType = (status: string) => {
        return STATUS_TAG_MAP[(status as AdminOrderStatus) || "2"] || "success";
    };

    const setStatusFilter = async (status: number | null) => {
        filters.status = status;
        paging.pageNum = 1;
        selectedOrderIds.value = [];
        await fetchOrders();
    };

    const setSortFilter = async (isAsc: 0 | 1) => {
        filters.isAsc = isAsc;
        paging.pageNum = 1;
        await fetchOrders();
    };

    const fetchOrders = async () => {
        loading.value = true;
        try {
            const response = await orderApi.getAdminList({
                pageSize: paging.pageSize,
                pageNum: paging.pageNum,
                status: filters.status,
                isAsc: filters.isAsc,
            });

            orders.value = response.rows || [];
            paging.total = response.total || 0;
        } catch (error) {
            console.error("获取订单列表失败:", error);
            ElMessage.error("获取订单列表失败");
        } finally {
            loading.value = false;
        }
    };

    const updateOrderPage = async (pageNum: number) => {
        paging.pageNum = pageNum;
        await fetchOrders();
    };

    const updateSelection = (ids: number[]) => {
        selectedOrderIds.value = ids;
    };

    const checkOrders = async (orderIds: number[]) => {
        if (!orderIds.length) {
            return;
        }

        try {
            const response = await orderApi.checkOrders(orderIds);
            if (response.code === 200) {
                ElMessage.success("核销成功");
            } else {
                ElMessage.error(response.message || "核销失败");
            }
            await fetchOrders();
            selectedOrderIds.value = [];
        } catch (error) {
            console.error("核销订单失败:", error);
            ElMessage.error("核销订单失败");
        }
    };

    const checkSingleOrder = async (orderId: number) => {
        await checkOrders([orderId]);
    };

    const checkSelectedOrders = async () => {
        await checkOrders(selectedOrderIds.value);
    };

    const openDetailDialog = async (orderId: number) => {
        activeOrderId.value = orderId;
        detailPaging.pageNum = 1;
        detailDialogVisible.value = true;
        await fetchOrderDetail();
    };

    const closeDetailDialog = () => {
        detailDialogVisible.value = false;
    };

    const fetchOrderDetail = async () => {
        if (!activeOrderId.value) {
            return;
        }

        detailLoading.value = true;
        try {
            const response = await orderApi.getOrderInfoPage({
                orderId: activeOrderId.value,
                pageSize: detailPaging.pageSize,
                pageNum: detailPaging.pageNum,
            });
            detailRows.value = response.rows || [];
            detailPaging.total = response.total || 0;
        } catch (error) {
            console.error("获取订单详情失败:", error);
            ElMessage.error("获取订单详情失败");
        } finally {
            detailLoading.value = false;
        }
    };

    const updateDetailPage = async (pageNum: number) => {
        detailPaging.pageNum = pageNum;
        await fetchOrderDetail();
    };

    return {
        orders,
        loading,
        selectedOrderIds,
        filters,
        paging,
        statusOptions,
        sortOptions,
        statusTitle,
        sortTitle,
        canBatchCheck,
        detailDialogVisible,
        detailLoading,
        detailRows,
        detailPaging,
        currentDetail,
        getStatusText,
        getStatusTagType,
        setStatusFilter,
        setSortFilter,
        fetchOrders,
        updateOrderPage,
        updateSelection,
        checkSingleOrder,
        checkSelectedOrders,
        openDetailDialog,
        closeDetailDialog,
        updateDetailPage,
    };
});
