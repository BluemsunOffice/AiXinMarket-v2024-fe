<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchTerm"
      placeholder="搜索商品"
      class="search-input"
      @keydown.enter="onSearch"
    />
    <button @click="onSearch" class="search-button">搜索</button>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { ref } from "vue";
const search = inject("searchTerm");
const searchTerm = ref("");
const onSearch = () => {
  search.value = searchTerm.value;
};
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
  margin-left: 50px;
  padding-bottom: 13px;
}

.search-input {
  outline: none;
  width: 30vw;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.search-button {
  padding: 10px 15px;
  font-size: 16px;
  font-weight: 700;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: rgb(51.2, 126.4, 204);
}
/* 移动端适配 */
@media (max-width: 768px) {
  .search-input {
    width: 55vw;
  }
}
</style>
