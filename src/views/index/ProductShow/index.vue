<template>
  <div class="list">
    <div class="grid">
      <div class="col" v-for="p in products" :key="p.id">
        <ProductCard :product="p" @view="openProductDetail(p)" />
      </div>
    </div>
  </div>
  <GoodsDetails v-if="detailModalVisible" :product-detail="currentProduct" @close="closeModal" />
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import ProductCard from './ProductCard.vue'
import GoodsDetails from '@/views/index/GoodsDetails.vue'
import type { product } from '@/api/mart.api'

const products = defineModel('products', {
  type: Array as PropType<product[]>,
  required: true,
})

const detailModalVisible = ref(false)
const currentProduct = ref<product | null>(null)

const openProductDetail = (p: product) => {
  currentProduct.value = p
  detailModalVisible.value = true
}

function closeModal() {
  detailModalVisible.value = false
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 21px;
  font-weight: 800;
  color: rgb(122, 121, 121);
  margin-bottom: 5px;
  margin-top: 5px;
}

.list {
  padding: 24px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.col {
  display: block;
}
@media (max-width: 768px) {
  /* 针对手机端的样式调整 */
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .title {
    font-size: 15px;
  }

  .title {
    font-size: 15px;
  }
}
@media (min-width: 1300px) {
  /* 大屏幕 */
  .grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 767px) {
  /* 更小屏幕 */
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
