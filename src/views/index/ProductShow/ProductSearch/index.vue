<template>
  <div class="searchbar">
    <el-input
      v-model="name"
      placeholder="搜索商品"
      size="large"
      clearable
      class="search-input"
      @keyup.enter="emitSearch"
    >
      <template #prefix>
        <el-icon class="search-icon">
          <Search />
        </el-icon>
      </template>
    </el-input>

    <el-dropdown @command="onType">
      <el-button type="primary" plain size="large" class="dropdown-btn">
        商品分类：
        <span>{{ typeLabel }}</span>
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="">全部</el-dropdown-item>
          <el-dropdown-item command="1">服装</el-dropdown-item>
          <el-dropdown-item command="0">日常用品</el-dropdown-item>
          <el-dropdown-item command="2">学习用品</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown @command="onCurrency">
      <el-button type="primary" plain size="large" class="dropdown-btn">
        货币分类：
        <span>{{ currencyLabel }}</span>
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="">全部</el-dropdown-item>
          <el-dropdown-item command="1">服装币</el-dropdown-item>
          <el-dropdown-item command="0">日用币</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown @command="onOrder">
      <el-button type="primary" plain size="large" class="dropdown-btn">
        商品排序：
        <span>{{ orderLabel }}</span>
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="">综合</el-dropdown-item>
          <el-dropdown-item command="asc">按价格升序</el-dropdown-item>
          <el-dropdown-item command="desc">按价格降序</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button type="primary" size="large" round class="search-button" @click="emitSearch">
      搜索
    </el-button>
  </div>
  
</template>

<script setup name="SortDetails" lang="ts">
import { ref, computed } from 'vue'
import { Search, ArrowDown } from "@element-plus/icons-vue";

const emit = defineEmits<{
  (e: 'search', payload: { name: string; type: string; currencyType: string; isAsc: boolean }): void
}>()

const name = ref('')
const type = ref('')
const currencyType = ref('')
const isAsc = ref(false)
const order = ref('')

const typeLabel = computed(() => {
  if (type.value === '1') return '服装'
  if (type.value === '0') return '日常用品'
  if (type.value === '2') return '学习用品'
  return '全部'
})

const currencyLabel = computed(() => {
  if (currencyType.value === '1') return '服装币'
  if (currencyType.value === '0') return '日用币'
  return '全部'
})

const orderLabel = computed(() => {
  if (order.value === '') return '综合'
  if (order.value === 'asc') return '按价格升序'
  return '按价格降序'
})

const onType = (command: string) => { type.value = command }
const onCurrency = (command: string) => { currencyType.value = command }
const onOrder = (command: string) => {
  order.value = command
  isAsc.value = command === 'asc' ? true : command === 'desc' ? false : false
}

const emitSearch = () => {
  emit('search', { name: name.value, type: type.value, currencyType: currencyType.value, isAsc: isAsc.value })
}
</script>

<style scoped>
.searchbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  height: 10vh;
  padding: 14px 18px;
}

.search-input { width: 32vw; }
.search-icon { color: #3a7be0; font-size: 18px; }

.search-input :deep(.el-input__wrapper) {
  border-radius: 9999px;
  padding: 6px 14px;
  background-color: #eef6ff;
  border: 1px solid rgba(64, 158, 255, 0.28);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.20);
  transition: box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
}
.search-input :deep(.is-focus .el-input__wrapper),
.search-input :deep(.el-input__wrapper:hover) {
  background-color: #e6f2ff;
  border-color: rgba(64, 158, 255, 0.48);
  box-shadow: 0 10px 28px rgba(64, 158, 255, 0.28), 0 0 0 3px rgba(64, 158, 255, 0.18);
}

.search-button {
  padding: 10px 18px;
  font-size: 16px;
  font-weight: 700;
  background-image: linear-gradient(90deg, #409eff, #6aa8ff);
  box-shadow: 0 10px 28px rgba(64, 158, 255, 0.32), 0 0 0 3px rgba(64, 158, 255, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.search-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow: 0 12px 32px rgba(64, 158, 255, 0.38), 0 0 0 4px rgba(64, 158, 255, 0.22);
}

.dropdown-btn {
  width: fit-content;
  justify-content: space-between;
  white-space: nowrap;
  span {
    width: 80px;
  }
}

@media (max-width: 768px) {
  .searchbar { margin-left: 0; }
  .search-input { width: 65vw; }
}
</style>
