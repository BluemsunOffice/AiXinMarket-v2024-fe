<template>
  <main class="order-page">
    <Nav />
    <section class="order-container">
      <header class="order-header">
        <div class="header-title-wrap">
          <h2>订单列表</h2>
          <p v-if="selectedOrderIds.length" class="selection-summary">
            当前已跨页选中 {{ selectedOrderIds.length }} 条，可核销
            {{ checkableSelectedOrders.length }} 条
          </p>
          <p v-else class="selection-summary is-empty">当前未选择订单</p>
        </div>
        <OrderFilters
          :status-title="statusTitle"
          :keyword="keyword"
          :export-loading="exportingOrderFile"
          :can-batch-check="canBatchCheck"
          :status-options="statusOptions"
          :sort-options="sortOptions"
          @keyword-change="setKeyword"
          @search="searchOrders"
          @export-file="exportOrderFile"
          @status-change="setStatusFilter"
          @sort-change="setSortFilter"
          @batch-check-preview="openBatchCheckPreview"
        />
      </header>

      <OrderTable
        :orders="orders"
        :loading="loading"
        :selected-order-ids="selectedOrderIds"
        :status-text="getStatusText"
        :status-tag-type="getStatusTagType"
        :is-order-checkable="isOrderCheckable"
        @selection-change="updateSelection"
        @check-one="checkSingleOrder"
        @cancel-one="cancelSingleOrder"
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

    <el-dialog
      v-model="batchCheckPreviewVisible"
      title="批量核销预览"
      width="900px"
      :append-to-body="true"
    >
      <el-alert
        v-if="invalidSelectedOrders.length"
        type="warning"
        :closable="false"
        show-icon
        class="preview-alert"
        :title="`已自动过滤 ${invalidSelectedOrders.length} 条不可核销订单（已核销或已取消）`"
      />

      <el-table :data="checkableSelectedOrders" border max-height="420" class="preview-table">
        <el-table-column prop="createTime" label="订单时间" min-width="180" />
        <el-table-column prop="username" label="用户名称" min-width="120" />
        <el-table-column label="订单状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="names" label="商品名称" min-width="220" show-overflow-tooltip />
        <el-table-column label="订单总价" min-width="220">
          <template #default="{ row }">
            服装币: {{ row.clothingBalance }}&nbsp;&nbsp;日用币: {{ row.generalBalance }}
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <div class="preview-footer">
          <span class="preview-count">共 {{ checkableSelectedOrders.length }} 条待核销</span>
          <div>
            <el-button @click="closeBatchCheckPreview">取消</el-button>
            <el-button
              type="primary"
              :disabled="!checkableSelectedOrders.length"
              @click="checkSelectedOrders"
            >
              确认核销
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

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
  statusOptions,
  sortOptions,
  statusTitle,
  keyword,
  exportingOrderFile,
  selectedOrderIds,
  checkableSelectedOrders,
  invalidSelectedOrders,
  canBatchCheck,
  batchCheckPreviewVisible,
  detailDialogVisible,
  detailLoading,
  detailPaging,
  currentDetail,
} = storeToRefs(orderStore)

const {
  fetchOrders,
  updateOrderPage,
  updateSelection,
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

.header-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selection-summary {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

.selection-summary.is-empty {
  color: #909399;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.preview-alert {
  margin-bottom: 12px;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.preview-count {
  color: #606266;
  font-size: 14px;
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

  .preview-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
