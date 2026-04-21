<template>
  <el-table
    ref="tableRef"
    :data="orders"
    border
    row-key="id"
    v-loading="loading"
    class="order-table"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="52"
      :reserve-selection="true"
      :selectable="isSelectableRow"
    />
    <el-table-column
      v-for="column in columns"
      :key="column.key"
      :prop="column.prop"
      :label="column.label"
      :min-width="column.minWidth"
      :show-overflow-tooltip="column.showOverflowTooltip"
    >
      <template #default="scope" v-if="column.type === 'status'">
        <el-tag :type="statusTagType(scope.row.status)">
          {{ statusText(scope.row.status) }}
        </el-tag>
      </template>

      <template #default="scope" v-else-if="column.type === 'total'">
        服装币: {{ scope.row.clothingBalance }}&nbsp;&nbsp; 日用币: {{ scope.row.generalBalance }}
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="300" fixed="right">
      <template #default="scope">
        <div class="action-row">
          <el-popconfirm
            v-if="isOrderCheckable(scope.row.status)"
            title="确定核销该订单？"
            @confirm="emit('check-one', scope.row.id)"
          >
            <template #reference>
              <el-button text type="primary">核销订单</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            v-if="isOrderCheckable(scope.row.status)"
            title="确定取消该订单？"
            @confirm="emit('cancel-one', scope.row.id)"
          >
            <template #reference>
              <el-button text type="danger">取消订单</el-button>
            </template>
          </el-popconfirm>

          <el-button text type="primary" @click="emit('view-detail', scope.row.id)">
            查看详情
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { ElTable } from 'element-plus'
import type { AdminOrderItem } from '@/api/order.api'

interface OrderTableColumn {
  key: string
  label: string
  minWidth: string
  prop?: keyof AdminOrderItem
  showOverflowTooltip?: boolean
  type?: 'text' | 'status' | 'total'
}

const props = defineProps<{
  orders: AdminOrderItem[]
  loading: boolean
  selectedOrderIds: string[]
  statusText: (status: string) => string
  statusTagType: (status: string) => 'primary' | 'danger' | 'success'
  isOrderCheckable: (status: string) => boolean
}>()

const emit = defineEmits<{
  'selection-change': [rows: AdminOrderItem[]]
  'check-one': [orderId: string]
  'cancel-one': [orderId: string]
  'view-detail': [orderId: string]
}>()

const tableRef = ref<InstanceType<typeof ElTable>>()
const isSyncingSelection = ref(false)

const columns: OrderTableColumn[] = [
  {
    key: 'createTime',
    prop: 'createTime',
    label: '订单时间',
    minWidth: '200',
    type: 'text',
  },
  {
    key: 'status',
    prop: 'status',
    label: '订单状态',
    minWidth: '140',
    type: 'status',
  },
  {
    key: 'names',
    prop: 'names',
    label: '商品名称',
    minWidth: '200',
    showOverflowTooltip: true,
    type: 'text',
  },
  {
    key: 'total',
    label: '订单总价',
    minWidth: '220',
    type: 'total',
  },
  {
    key: 'username',
    prop: 'username',
    label: '用户名称',
    minWidth: '120',
    type: 'text',
  },
]

const isSelectableRow = (row: AdminOrderItem) => props.isOrderCheckable(row.status)

const syncSelection = async () => {
  const table = tableRef.value
  if (!table) {
    return
  }

  isSyncingSelection.value = true
  table.clearSelection()
  props.orders.forEach((row) => {
    if (props.selectedOrderIds.includes(row.id) && props.isOrderCheckable(row.status)) {
      table.toggleRowSelection(row, true)
    }
  })

  await nextTick()
  isSyncingSelection.value = false
}

watch(
  () => [
    props.orders.map((row) => `${row.id}:${row.status}`).join('|'),
    props.selectedOrderIds.join('|'),
  ],
  () => {
    void syncSelection()
  },
  { immediate: true },
)

const handleSelectionChange = (rows: AdminOrderItem[]) => {
  if (isSyncingSelection.value) {
    return
  }
  emit('selection-change', rows)
}
</script>

<style scoped>
.order-table {
  width: 100%;
}

.action-row {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0px;
  white-space: nowrap;
}
</style>
