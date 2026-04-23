<template>
  <div class="order-filters">
    <el-input
      :model-value="keyword"
      class="search-input"
      placeholder="请输入用户名模糊搜索"
      clearable
      @update:model-value="handleKeywordChange"
      @keyup.enter="emit('search')"
      @clear="emit('search')"
    />
    <el-button type="primary" class="search-btn" @click="emit('search')">搜索</el-button>

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

    <el-tooltip
      :disabled="canBatchCheck"
      effect="dark"
      content="请先选择待处理订单"
      placement="top"
    >
      <el-button type="primary" :disabled="!canBatchCheck" @click="emit('batch-check-preview')">
        批量核销
      </el-button>
    </el-tooltip>
    <el-button type="primary" :loading="exportLoading" @click="emit('export-file')">
      导出文件
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
import type { FilterOption } from '@/stores/order-store'
import { ref } from 'vue'
import type { ManageOrderDirection } from '@/api/order.api'

defineProps<{
  statusTitle: string
  keyword: string
  exportLoading: boolean
  canBatchCheck: boolean
  statusOptions: FilterOption<number | null>[]
  sortOptions: FilterOption<ManageOrderDirection>[]
}>()

const emit = defineEmits<{
  'keyword-change': [value: string]
  search: []
  'status-change': [value: number | null]
  'sort-change': [value: ManageOrderDirection]
  'batch-check-preview': []
  'export-file': []
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

const handleKeywordChange = (value: string | number | null | undefined) => {
  emit('keyword-change', String(value ?? ''))
}
</script>

<style scoped>
.order-filters {
  display: flex;
  align-items: center;
  column-gap: 12px;
  row-gap: 12px;
  flex-wrap: wrap;
}

.order-filters > * {
  margin: 0 !important;
}

.order-filters :deep(.el-tooltip__trigger) {
  display: inline-flex;
  margin: 0 !important;
}

.filter-btn {
  padding: 10px 16px;
}

.search-input {
  width: 240px;
}

.search-btn {
  padding: 10px 16px;
}
</style>
