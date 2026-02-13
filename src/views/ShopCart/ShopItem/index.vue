<template>
  <article :class="['cart-item', { 'is-selected': selected }]">
    <el-checkbox :model-value="selected" @change="onSelectChange" />

    <div class="item-image-wrap">
      <img :src="item.imageUrlUrl" :alt="item.goodsName" class="item-image" />
    </div>

    <div class="item-info">
      <div class="item-main">
        <el-tooltip :content="item.goodsName" placement="top">
          <h3 class="item-title">{{ item.goodsName }}</h3>
        </el-tooltip>
        <p class="item-price">
          <Coins :coin-type="item.currencyType" :amount="formatPrice(item)" />
        </p>
        <p class="item-meta">
          库存剩余：
          <span :class="{ 'low-stock': item.limitNum <= 5 }">{{ item.limitNum }}</span>
        </p>
      </div>

      <div class="item-action">
        <CartoonStepper
          :model-value="item.num"
          :min="item.limitNum > 0 ? 1 : 0"
          :max="item.limitNum"
          :disabled="item.limitNum === 0"
          class="quantity-input"
          @update:model-value="onQuantityChange"
        />
        <el-button text class="remove-btn" @click="emit('remove', item.goodsId)">
          <font-awesome-icon icon="fa-solid fa-trash-can" style="color: rgba(249, 55, 55, 1)" />
        </el-button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import CartoonStepper from '@/views/index/components/CartoonStepper.vue'
import type { CartItem } from '@/api/cart.api'
import Coins from '@/components/coins/index.vue'

interface Props {
  item: CartItem
  selected: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-select': [goodsId: number, checked: boolean]
  'quantity-change': [goodsId: number, quantity: number]
  remove: [goodsId: number]
}>()

const formatPrice = (row: { price: number }) => +row.price.toFixed(2)

const onSelectChange = (checked: string | number | boolean) => {
  emit('toggle-select', props.item.goodsId, Boolean(checked))
}

const onQuantityChange = (value: number) => {
  if (!Number.isFinite(value)) {
    console.warn('Invalid quantity value:', value)
    emit('quantity-change', props.item.goodsId, props.item.num)
    return
  }

  const minQuantity = props.item.limitNum > 0 ? 1 : 0
  const maxQuantity = Math.max(props.item.limitNum, minQuantity)
  const normalizedQuantity = Math.min(maxQuantity, Math.max(minQuantity, Math.trunc(value)))

  emit('quantity-change', props.item.goodsId, normalizedQuantity)
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 18px;
  align-items: center;
  padding: 18px;
  border: 1px solid #eceff5;
  border-radius: 14px;
  transition: all 0.25s ease;
}

.cart-item:hover {
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
}

.cart-item.is-selected {
  border-color: #c7dcff;
  box-shadow: 0 8px 22px rgba(64, 158, 255, 0.1);
}

.cart-item :deep(.el-checkbox__input) {
  transform: scale(1.35);
}

.item-image-wrap {
  width: 118px;
  height: 118px;
  border-radius: 12px;
  background: #f7f8fc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.item-image {
  width: 85%;
  height: 85%;
  object-fit: contain;
}

.item-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.item-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-title {
  margin: 0;
  max-width: 360px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px;
  color: #1f2d3d;
}

.item-price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  font-size: 16px;
  color: #111;
  font-weight: 600;
}

.item-meta {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.low-stock {
  color: #f56c6c;
  font-weight: 700;
}

.item-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  margin-left: auto;
}

.quantity-input {
  width: 120px;
}

.remove-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.remove-btn:hover {
  background: rgba(249, 55, 55, 0.08);
}

@media (max-width: 900px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-info {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .item-action {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-left: 0;
  }
}
</style>
