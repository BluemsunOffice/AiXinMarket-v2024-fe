<template>
  <main class="order-page">
    <Nav />
    <section class="order-container">
      <header class="order-header">
        <h2>订单列表</h2>
        <OrderFilters
          :status-title="statusTitle"
          :can-batch-check="canBatchCheck"
          :status-options="statusOptions"
          :sort-options="sortOptions"
          @status-change="setStatusFilter"
          @sort-change="setSortFilter"
          @batch-check="checkSelectedOrders"
        />
      </header>

      <OrderTable
        :orders="orders"
        :loading="loading"
        :status-text="getStatusText"
        :status-tag-type="getStatusTagType"
        @selection-change="updateSelection"
        @check-one="checkSingleOrder"
        @view-detail="openDetailDialog"
      />

      <div class="pagination-wrap">
        <el-pagination
          :model-value="paging.pageNum"
          layout="prev,pager,next,jumper,total"
          :page-size="paging.pageSize"
          :pager-count="5"
          :total="paging.total"
          @current-change="updateOrderPage"
        />
      </div>
    </section>

    <OrderDetailDialog
      :visible="detailDialogVisible"
      :loading="detailLoading"
      :detail="currentDetail"
      :total="detailPaging.total"
      :page-num="detailPaging.pageNum"
      @update:visible="handleDetailVisibleChange"
      @page-change="updateDetailPage"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Nav from '@/components/nav-bar/index.vue'
import { useOrderStore } from '@/stores/order-store'
import OrderFilters from './components/order-filters.vue'
import OrderTable from './components/order-table.vue'
import OrderDetailDialog from './components/order-detail-dialog.vue'

const orderStore = useOrderStore()

const {
  orders,
  loading,
  paging,
  statusTitle,
  canBatchCheck,
  detailDialogVisible,
  detailLoading,
  detailPaging,
  currentDetail,
} = storeToRefs(orderStore)

const {
  statusOptions,
  sortOptions,
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
} = orderStore

const handleDetailVisibleChange = (visible: boolean) => {
  if (!visible) {
    closeDetailDialog()
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-page {
  min-height: 100vh;
}

.order-container {
  max-width: 1300px;
  margin: 26px auto;
  padding: 20px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #ebeef5;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.08);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.order-header h2 {
  margin: 0;
  color: #409eff;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 900px) {
  .order-container {
    margin: 12px;
    padding: 12px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
