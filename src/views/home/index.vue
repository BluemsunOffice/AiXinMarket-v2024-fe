<template>
  <div class="home-container-layout">
    <NavBar />
    <div class="show">
      <ProductCarrousel />
    </div>
    <ProductSearch @search="handleUnifiedSearch" />
    <ProductShow :products="products" :loading="isLoading" />
    <el-empty v-if="!isLoading && products.length === 0" :image-size="150" />
    <el-pagination
      id="pagenation"
      background
      layout="prev, pager, next, jumper, total"
      :total="totalNum"
      :page-size="goodListSearchParams.pageSize"
      v-model:current-page="currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElEmpty, ElPagination } from 'element-plus'
import NavBar from '@/components/nav-bar/index.vue'
import ProductCarrousel from '@/views/home/product-carousel/index.vue'
import ProductSearch from '@/views/home/product-show/product-search/product-search.vue'
import ProductShow from '@/views/home/product-show/index.vue'
import type { OrderDirection } from '@/api/mart.api'
import { useProductStore } from '@/stores/product-store'

const productStore = useProductStore()
const { products, totalNum, goodListSearchParams, isLoading } = storeToRefs(productStore)

const currentPage = computed({
  get: () => goodListSearchParams.value.pageNum,
  set: (val) => {
    goodListSearchParams.value.pageNum = val
  },
})

// 页码改变时重新加载商品
const handlePageChange = async (newPage: number) => {
  await productStore.setPageNum(newPage)
}

onMounted(() => {
  productStore.fetchProducts()
})

const handleUnifiedSearch = (payload: {
  name: string
  type: string
  currencyType: string
  isAsc: OrderDirection
}) => {
  productStore.updateSearch(payload)
}
</script>

<style scoped>
.home-container-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.show {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

#pagenation {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
.center-container {
  width: 80%;
  display: flex;
  margin-top: 20px;
}
/* 移动端适配 */
@media (max-width: 768px) {
  .center-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
