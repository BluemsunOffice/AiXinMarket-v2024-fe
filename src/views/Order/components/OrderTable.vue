<template>
  <el-table
    :data="orders"
    border
    v-loading="loading"
    class="order-table"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="52" />
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

    <el-table-column label="操作" min-width="180" fixed="right">
      <template #default="scope">
        <el-popconfirm
          v-if="statusText(scope.row.status) === '待处理'"
          title="确定核销该订单？"
          @confirm="emit('check-one', scope.row.id)"
        >
          <template #reference>
            <el-button text type="primary">核销订单</el-button>
          </template>
        </el-popconfirm>
        <el-button text type="primary" @click="emit('view-detail', scope.row.id)">
          查看详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
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
  statusText: (status: string) => string
  statusTagType: (status: string) => 'primary' | 'danger' | 'success'
}>()

const emit = defineEmits<{
  'selection-change': [ids: string[]]
  'check-one': [orderId: string]
  'view-detail': [orderId: string]
}>()

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

const handleSelectionChange = (rows: AdminOrderItem[]) => {
  const ids = rows.map((row) => row.id)
  emit('selection-change', ids)
}
</script>

<style scoped>
.order-table {
  width: 100%;
}
</style>
