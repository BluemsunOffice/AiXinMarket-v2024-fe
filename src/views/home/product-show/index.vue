<template>
  <div class="shell">
    <div v-if="loading" class="loading-wrap">
      <el-skeleton :rows="8" animated />
    </div>
    <div v-else class="list">
      <div class="item" v-for="p in products" :key="p.id">
        <ProductCard :product="p" @view="openProductDetail(p)" />
      </div>
    </div>
  </div>
  <GoodsDetails v-if="detailModalVisible" :product-detail="currentProduct" @close="closeModal" />
</template>

<script setup lang="ts">
import { ref, toRefs, type PropType } from 'vue'
import ProductCard from './product-card.vue'
import GoodsDetails from '@/views/home/goods-details.vue'
import type { Product } from '@/api/mart.api'

const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const { products, loading } = toRefs(props)

const detailModalVisible = ref(false)
const currentProduct = ref<Product | null>(null)

const openProductDetail = (p: Product) => {
  currentProduct.value = p
  detailModalVisible.value = true
}

function closeModal() {
  detailModalVisible.value = false
}
</script>

<style scoped>
.shell {
  width: 100%;
  min-height: 750px;
}
.loading-wrap {
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
}
.list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
}
</style>
