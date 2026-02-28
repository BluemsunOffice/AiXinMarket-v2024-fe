<template>
  <div class="order-filters">
    <el-dropdown>
      <el-button type="primary" class="filter-btn">
        {{ currentStatus }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="option in statusOptions"
            :key="option.label"
            @click="handleStatusChange(option)"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown>
      <el-button type="primary" class="filter-btn">
        {{ currentSort }}
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="option in sortOptions"
            :key="option.label"
            @click="handleSortChange(option)"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-popconfirm title="确定核销选中订单？" @confirm="emit('batch-check')">
      <template #reference>
        <el-button type="primary" :disabled="!canBatchCheck">批量核销</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import type { FilterOption } from '@/stores/order-store'
import { ElDropdown } from 'element-plus'
import { computed, ref } from 'vue'
import type { ManageOrderDirection } from '@/api/order.api'

defineProps<{
  statusTitle: string
  canBatchCheck: boolean
  statusOptions: FilterOption<number | null>[]
  sortOptions: FilterOption<ManageOrderDirection>[]
}>()

const emit = defineEmits<{
  'status-change': [value: number | null]
  'sort-change': [value: ManageOrderDirection]
  'batch-check': []
}>()

const currentStatus = ref<string>('全部状态')
const currentSort = ref<string>('默认排序')

const handleStatusChange = (option: FilterOption<number | null>) => {
  currentStatus.value = option.label ?? '订单状态'
  emit('status-change', option.value)
}

const handleSortChange = (option: FilterOption<ManageOrderDirection>) => {
  currentSort.value = option.label ?? '排序方式'
  emit('sort-change', option.value)
}
</script>

<style scoped>
.order-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-btn {
  padding: 10px 16px;
}
</style>
