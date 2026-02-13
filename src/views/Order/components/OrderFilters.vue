<template>
  <div class="order-filters">
    <el-dropdown>
      <el-button type="primary" class="filter-btn">
        {{ statusTitle }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="option in statusOptions"
            :key="option.label"
            @click="emit('status-change', option.value)"
          >
            {{ option.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown>
      <el-button type="primary" class="filter-btn">
        {{ sortTitle }}
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="option in sortOptions"
            :key="option.label"
            @click="emit('sort-change', option.value)"
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
import type { FilterOption } from '@/stores/orderStore'

defineProps<{
  statusTitle: string
  sortTitle: string
  canBatchCheck: boolean
  statusOptions: FilterOption<number | null>[]
  sortOptions: FilterOption<0 | 1>[]
}>()

const emit = defineEmits<{
  'status-change': [value: number | null]
  'sort-change': [value: 0 | 1]
  'batch-check': []
}>()
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
