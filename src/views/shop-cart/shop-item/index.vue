<template>
  <article
    :class="['cart-item', { 'is-selected': selected && !isOffShelf, 'is-off-shelf': isOffShelf }]"
  >
    <el-checkbox
      :model-value="selected && !isOffShelf"
      :disabled="isOffShelf"
      @change="onSelectChange"
    />

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
          <span :class="{ 'low-stock': (item.amount ?? 0) <= 5 }">{{ item.amount ?? 0 }}</span>
        </p>
        <p class="item-meta">
          限购数量：
          <span>{{ item.limitNum }}</span>
        </p>
        <p v-if="isOffShelf" class="item-tip">该商品已下架，暂不可结算</p>
      </div>

      <div class="item-action">
        <CartoonStepper
          :model-value="item.num"
          :min="maxQuantity > 0 ? 1 : 0"
          :max="maxQuantity"
          :disabled="maxQuantity === 0"
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
import { computed, watch } from 'vue'
import CartoonStepper from '@/views/home/components/cartoon-stepper.vue'
import type { CartItem } from '@/api/cart.api'
import Coins from '@/components/coins/index.vue'

interface Props {
  item: CartItem
  selected: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-select': [goodsId: string, checked: boolean]
  'quantity-change': [goodsId: string, quantity: number]
  remove: [goodsId: string]
}>()

const isOffShelf = computed(() => String(props.item.status ?? '') !== '0')
const maxQuantity = computed(() => Math.min(props.item.amount ?? 0, props.item.limitNum))

// Keep parent selection state in sync when an item becomes off-shelf.
watch(
  () => [isOffShelf.value, props.selected],
  ([offShelf, selected]) => {
    if (offShelf && selected) {
      emit('toggle-select', props.item.goodsId, false)
    }
  },
  { immediate: true },
)

const formatPrice = (row: { price: number }) => +row.price.toFixed(2)

const onSelectChange = (checked: string | number | boolean) => {
  if (isOffShelf.value) {
    emit('toggle-select', props.item.goodsId, false)
    return
  }
  emit('toggle-select', props.item.goodsId, Boolean(checked))
}

const onQuantityChange = (value: number) => {
  if (!Number.isFinite(value)) {
    console.warn('Invalid quantity value:', value)
    emit('quantity-change', props.item.goodsId, props.item.num)
    return
  }

  const minQuantity = maxQuantity.value > 0 ? 1 : 0
  const normalizedQuantity = Math.min(maxQuantity.value, Math.max(minQuantity, Math.trunc(value)))

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

.cart-item.is-off-shelf {
  opacity: 0.68;
  background: #fafafa;
}

.cart-item.is-off-shelf:hover {
  box-shadow: none;
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

.item-tip {
  margin: 0;
  font-size: 12px;
  color: #f56c6c;
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
