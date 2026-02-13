import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
  orderApi,
  type UserOrderInfoItem,
  type UserOrderItem,
} from "@/api/order.api";

const MOBILE_CLIENT_ID = "428a8310cd442757ae699df5d894f051";
const PC_CLIENT_ID = "e5cd7e4891bf95d1d19206ce24a7b32e";

const isPcDevice = () => {
  const userAgent = navigator.userAgent;
  const mobileAgents: RegExp[] = [
    /android/i,
    /iphone|ipad|ipod/i,
    /windows phone/i,
    /blackberry/i,
    /opera mini/i,
    /mobile/i,
    /touch/i,
  ];

  return !mobileAgents.some((regex) => regex.test(userAgent));
};

export const useOrderListStore = defineStore("orderList", () => {
  const tableData = ref<UserOrderItem[]>([]);
  const detailTableData = ref<UserOrderInfoItem[]>([]);

  const query = reactive({
    pageNum: 1,
    pageSize: 10,
    status: "",
  });

  const pageSizes = ref([10, 20, 30, 40, 50, 100]);
  const total = ref(0);

  const loadings = reactive({
    table: false,
    detail: false,
  });

  const statusMap = ref<Record<string, string>>({
    0: "未知",
    1: "失败",
    2: "成功",
  });

  const visible = ref(false);
  const currentDetailOrderId = ref<number | null>(null);

  const detailTableDataTotal = computed(() => detailTableData.value.length);

  const fetchOrderList = async (pageNum = query.pageNum, pageSize = query.pageSize) => {
    loadings.table = true;
    try {
      const response = await orderApi.getUserList({
        pageNum,
        pageSize,
        status: query.status,
      });

      query.pageNum = pageNum;
      query.pageSize = pageSize;
      tableData.value = response.rows || [];
      total.value = response.total || 0;
    } catch (error) {
      console.error("获取订单列表失败:", error);
      ElMessage.error("获取订单列表失败");
    } finally {
      loadings.table = false;
    }
  };

  const cancelOrder = async (row: UserOrderItem) => {
    try {
      const response = await orderApi.cancelUserOrder(row.id);
      if (response.code === 200) {
        ElMessage.success("取消成功");
        await fetchOrderList(query.pageNum, query.pageSize);
      } else {
        ElMessage.error(response.message || "取消失败");
      }
    } catch (error) {
      console.error("取消订单失败:", error);
      ElMessage.error("取消订单失败");
    }
  };

  const showDetail = async (row: UserOrderItem) => {
    if (!row?.id) {
      return;
    }

    currentDetailOrderId.value = Number(row.id);
    visible.value = true;
    loadings.detail = true;

    try {
      const detail = await orderApi.getUserOrderDetail(row.id);
      detailTableData.value = Array.isArray(detail) ? detail : [];
    } catch (error) {
      console.error("获取订单详情失败:", error);
      ElMessage.error("获取订单详情失败");
    } finally {
      loadings.detail = false;
    }
  };

  const setPageSize = async (pageSize: number) => {
    await fetchOrderList(query.pageNum, pageSize);
  };

  const setPageNum = async (pageNum: number) => {
    await fetchOrderList(pageNum, query.pageSize);
  };

  const initPage = async () => {
    const clientId = isPcDevice() ? PC_CLIENT_ID : MOBILE_CLIENT_ID;
    localStorage.setItem("clientid", clientId);
    await fetchOrderList();
  };

  return {
    tableData,
    detailTableData,
    detailTableDataTotal,
    query,
    pageSizes,
    total,
    loadings,
    statusMap,
    visible,
    currentDetailOrderId,
    fetchOrderList,
    cancelOrder,
    showDetail,
    setPageSize,
    setPageNum,
    initPage,
  };
});
