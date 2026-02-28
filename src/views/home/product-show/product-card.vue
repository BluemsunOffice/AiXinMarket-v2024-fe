<template>
  <div class="card" @click="handleView">
    <div class="thumb">
      <img :src="product.imageUrlUrl" :alt="product.name" />
      <div v-if="product.amount === 0" class="badge">缺货</div>
    </div>
    <div class="body">
      <div class="title" :title="product.name">{{ product.name }}</div>
      <div class="meta">
        <Coins :coin-type="product.currencyType" :amount="product.price" />
      </div>
      <div class="stock">
        <Stock :amount="product.amount" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/api/mart.api'
import Coins from '@/components/coins/index.vue'
import Stock from '@/components/stock/index.vue'

const emit = defineEmits<{
  (e: 'view'): void
}>()

const props = defineProps<{ product: Product }>()

const product = props.product

const handleView = () => emit('view')
</script>

<style scoped>
.card {
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}

.thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #f6f8fb;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #f56c6c;
  color: #fff;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  .title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .meta {
    display: flex;
    align-items: center;
  }

  .stock {
    gap: 4px;
    font-size: 13px;
    line-height: 1.2;
    display: flex;
    color: #666;
  }
}
</style>
