<template>
  <div class="search-container">
    <el-input
      v-model="keyword"
      placeholder="搜索商品"
      size="large"
      clearable
      class="search-input"
      @keyup.enter="onSearch"
    >
      <template #prefix>
        <el-icon class="search-icon">
          <Search />
        </el-icon>
      </template>
    </el-input>
    <el-button type="primary" size="large" round class="search-button" @click="onSearch">
      搜索
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

const emit = defineEmits<{
  (e: 'search', term: string): void
}>();

const keyword = ref("");
const onSearch = () => {
  emit('search', keyword.value);
};
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 10vh;
  margin-left: 50px;
  padding: 14px 18px;
  padding-bottom: 13px;
}

.search-input {
  width: 36vw;
}

.search-icon {
  color: #3a7be0;
  font-size: 18px;
}

/* 自定义 Element Plus 输入框外观 */
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

/* 移动端适配 */
@media (max-width: 768px) {
  .search-input {
    width: 65vw;
  }
}
</style>
