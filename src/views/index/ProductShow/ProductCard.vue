<template>
  <div class="card" @click="handleView">
    <div class="thumb">
      <img :src="product.imageUrlUrl" :alt="product.name" />
      <div v-if="product.amount === 0" class="badge">缺货</div>
    </div>
    <div class="body">
      <div class="title" :title="product.name">{{ product.name }}</div>
      <div class="meta">
        <el-tag size="small" type="info">{{ product.currencyType }}</el-tag>
        <el-text class="price" size="large">{{ product.price }}</el-text>
      </div>
      <div class="stock">
        <el-text size="small">库存：{{ product.amount }}</el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { product } from "@/api/mart.api";

const emit = defineEmits<{
  (e: "view"): void;
}>();

const props = defineProps<{ product: product }>();

const product = props.product;

const handleView = () => emit("view");
</script>

<style scoped>
.card {
  width: 100%;
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
}
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
  gap: 8px;
  margin-top: 8px;
}
.price {
  color: #1f5fbf;
  font-weight: 700;
}
.stock {
  margin-top: 6px;
  color: #666;
}
</style>
