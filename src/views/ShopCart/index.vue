<template>
  <div class="cart-page">
    <NavBar />

    <section class="cart-card">
      <header class="cart-header">
        <h2>我的购物车</h2>
        <el-tag v-if="selectedItems.length" type="info" round>
          已选择 {{ selectedItems.length }} 个商品
        </el-tag>
      </header>

      <div v-if="isLoading" class="loading-cart">
        <p class="loading-text">购物车加载中...</p>
      </div>

      <div v-else-if="!filteredItems.length" class="empty-cart">
        <img src="../background/emptyCart.png" alt="空购物车" class="empty-cart-image" />
        <p class="empty-cart-text">您的购物车是空的</p>
        <el-button type="primary" class="empty-cart-button" @click="toHome">继续购物</el-button>
      </div>

      <template v-else>
        <div class="cart-list">
          <ShopItem
            v-for="item in filteredItems"
            :key="item.goodsId"
            :item="item"
            :selected="selectedItems.includes(item.goodsId)"
            @toggle-select="handleToggleSelect"
            @quantity-change="handleQuantityChange"
            @remove="showRemoveConfirmation"
          />
        </div>

        <ShopCartBottom
          :is-all-selected="isAllSelected"
          :daily-total="dailyTotal"
          :clothing-total="clothingTotal"
          :selected-count="selectedItems.length"
          @toggle-all="toggleSelectAll"
          @checkout="checkout"
        />
      </template>
    </section>

    <el-dialog
      v-model="checkoutDialogVisible"
      title="确认结算"
      width="500px"
      class="checkout-dialog"
    >
      <div class="checkout-details">
        <div class="checkout-item">
          <span>服装币总额:</span>
          <span class="price">{{ clothingTotal.toFixed(2) }}</span>
        </div>
        <div class="checkout-item">
          <span>日用币总额:</span>
          <span class="price">{{ dailyTotal.toFixed(2) }}</span>
        </div>
        <div class="checkout-item" v-if="selectedItems.length">
          <span>已选商品:</span>
          <span>{{ selectedItems.length }} 件</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="checkoutDialogVisible = false" :disabled="isSettling">取消</el-button>
          <el-button
            type="primary"
            :loading="isSettling"
            :disabled="isSettling"
            @click="reCheckout"
          >
            {{ isSettling ? '处理中...' : '确认结算' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="removeConfirmVisible"
      title="确认移除"
      width="400px"
      class="checkout-dialog"
    >
      <div class="remove-confirm-content">
        <p>确定要从购物车中移除该商品吗？</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="removeConfirmVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmRemove">确认移除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import NavBar from '@/components/NavBar/index.vue'
import { useCartStore } from '@/stores/cartStore'
import ShopItem from './ShopItem/index.vue'
import ShopCartBottom from './ShopCartBottom/index.vue'

const cartStore = useCartStore()
const {
  filteredItems,
  selectedItems,
  clothingTotal,
  dailyTotal,
  checkoutDialogVisible,
  isAllSelected,
  isSettling,
  isLoading,
} = storeToRefs(cartStore)

const {
  initCartPage,
  removeSelectedItems,
  checkout,
  reCheckout,
  toggleSelectAll,
  toHome,
  updateItemQuantity,
} = cartStore

const removeConfirmVisible = ref(false)
const itemToRemove = ref<string | null>(null)

const showRemoveConfirmation = (goodsId: string) => {
  itemToRemove.value = goodsId
  removeConfirmVisible.value = true
}

const confirmRemove = async () => {
  if (itemToRemove.value === null) {
    return
  }
  await removeSelectedItems(itemToRemove.value)
  removeConfirmVisible.value = false
  itemToRemove.value = null
}

const handleQuantityChange = (goodsId: string, value: number) => {
  const targetItem = filteredItems.value.find((item) => item.goodsId === goodsId)
  if (!targetItem) {
    return
  }

  const minQuantity = targetItem.limitNum > 0 ? 1 : 0
  const maxQuantity = Math.max(targetItem.limitNum, minQuantity)
  const normalizedQuantity = Number.isFinite(value)
    ? Math.min(maxQuantity, Math.max(minQuantity, Math.trunc(value)))
    : targetItem.num

  updateItemQuantity(goodsId, normalizedQuantity)
}

const handleToggleSelect = (goodsId: string, checked: boolean) => {
  const exists = selectedItems.value.includes(goodsId)
  if (checked && !exists) {
    selectedItems.value.push(goodsId)
    return
  }
  if (!checked && exists) {
    selectedItems.value = selectedItems.value.filter((id) => id !== goodsId)
  }
}

onMounted(() => {
  initCartPage()
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f4f6fb;
}

.cart-card {
  max-width: 1200px;
  margin: 20px auto;
  padding: 28px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 14px;
  margin-bottom: 18px;
}

.cart-header h2 {
  margin: 0;
  font-size: 22px;
  color: #1f2d3d;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.loading-cart,
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 24px;
  border-radius: 14px;
  background: #fafbff;
}

.loading-text {
  margin-top: 18px;
  color: #6b7280;
}

.empty-cart-image {
  width: 150px;
  opacity: 0.82;
}

.empty-cart-text {
  margin: 22px 0;
  font-size: 24px;
  color: #1f2d3d;
}

.checkout-dialog :deep(.el-dialog) {
  border-radius: 16px;
}

.checkout-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 10px;
  background: #f8faff;
}

.checkout-item .price {
  color: #111;
  font-weight: 700;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.remove-confirm-content {
  text-align: center;
  color: #4b5563;
}

@media (max-width: 900px) {
  .cart-card {
    margin: 12px;
    padding: 16px;
  }
}
</style>
