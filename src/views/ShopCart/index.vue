<template>
  <div>
    <NavBar />
    <div class="cart-card">
      <div class="cart-container">
        <!-- 移除原来的全选按钮 -->
        <div class="header-container">
          <div class="selected-count" v-if="selectedItems.length > 0">
            已选择 {{ selectedItems.length }} 个商品
          </div>
        </div>

        <!-- 商品卡片容器，只在非加载状态且有商品时显示 -->
        <div v-if="!isLoading && filteredItems.length > 0" class="card-container">
          <!-- 商品卡片 -->
          <div
            v-for="item in filteredItems"
            :key="item.goodsId"
            :class="['item-card', { 'item-selected': selectedItems.includes(item.goodsId) }]"
          >
            <el-checkbox
              v-model="selectedItems"
              :value="item.goodsId"
              @change="updateSelectedTotalPrice"
            />

            <div class="item-image-container">
              <img :src="item.imageUrlUrl" alt="商品图片" class="item-image" />
            </div>

            <div class="item-info">
              <div class="item-details">
                <el-tooltip :content="item.goodsName" placement="top">
                  <h3 class="item-name">{{ item.goodsName }}</h3>
                </el-tooltip>
                <p class="item-price">
                  {{ formatPrice(item).replace('¥', '') }}
                </p>
                <p class="currency-type">
                  货币类型:
                  {{ item.currencyType === '0' ? '日用币' : '服装币' }}
                </p>
                <p class="stock-info">
                  库存剩余:
                  <span :class="{ 'low-stock': item.limitNum <= 5 }">{{ item.limitNum }}</span>
                </p>
              </div>

              <div class="item-actions">
                <el-input-number
                  v-model="item.num"
                  :min="item.limitNum > 0 ? 1 : 0"
                  :max="item.limitNum"
                  @change="(value) => throttledQuantityChange(item, value)"
                  class="quantity-input"
                  :disabled="item.limitNum === 0"
                />
                <el-button
                  type="danger"
                  @click="showRemoveConfirmation(item.goodsId)"
                  class="remove"
                  >移除</el-button
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 购物车加载中状态 -->
        <div v-if="isLoading" class="loading-cart">
          <el-skeleton-item
            variant="circle"
            style="width: 100px; height: 100px; margin-bottom: 20px"
          />
          <el-skeleton-item variant="text" style="width: 240px; height: 30px" />
          <el-skeleton-item variant="text" style="width: 160px; height: 20px; margin-top: 20px" />
          <div class="loading-text">购物车加载中...</div>
        </div>

        <!-- 购物车为空的展示 -->
        <div v-else-if="filteredItems.length === 0" class="empty-cart">
          <img src="../background/emptyCart.png" alt="空购物车" class="empty-cart-image" />
          <p class="empty-cart-text">您的购物车是空的</p>
          <el-button type="primary" class="empty-cart-button" @click="toHome">继续购物</el-button>
        </div>

        <!-- 底部结算区域重新设计，只在非加载状态且有商品时显示 -->
        <div v-if="!isLoading && filteredItems.length > 0" class="foot">
          <!-- 添加全选按钮到底部 -->
          <div class="foot-left">
            <el-checkbox class="choose" v-model="isAllSelected" @change="toggleSelectAll"
              >全选</el-checkbox
            >
          </div>

          <div class="foot-middle">
            <div class="currency-info">
              <span>日用币: {{ dailyTotal.toFixed(2) }}</span>
              <span>服装币: {{ clothingTotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="foot-right">
            <el-button
              :type="selectedItems.length > 0 ? 'success' : 'info'"
              @click="checkout"
              class="checkout-button"
              :disabled="selectedItems.length === 0"
            >
              结算
              {{ selectedItems.length > 0 ? `(${selectedItems.length})` : '' }}
            </el-button>
          </div>

          <!-- 确认结算对话框 -->
          <el-dialog v-model="checkoutInfo" title="确认结算" width="500px" class="checkout-dialog">
            <div class="checkout-details">
              <div class="checkout-item">
                <span>服装币总额:</span>
                <span class="price">{{ clothingTotal.toFixed(2) }}</span>
              </div>
              <div class="checkout-item">
                <span>日用币总额:</span>
                <span class="price">{{ dailyTotal.toFixed(2) }}</span>
              </div>
              <div class="checkout-item" v-if="selectedItems.length > 0">
                <span>已选商品:</span>
                <span>{{ selectedItems.length }}件</span>
              </div>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="checkoutInfo = false" :disabled="isSettling">取消</el-button>
                <el-button
                  type="primary"
                  @click="reCheckout"
                  :loading="isSettling"
                  :disabled="isSettling"
                >
                  {{ isSettling ? '处理中...' : '确认结算' }}
                </el-button>
              </div>
            </template>
          </el-dialog>

          <!-- 确认移除对话框 -->
          <el-dialog
            v-model="removeConfirmVisible"
            title="确认移除"
            width="400px"
            class="checkout-dialog"
          >
            <div class="remove-confirm-content">
              <p>确定要从购物车中移除选中的商品吗？</p>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="removeConfirmVisible = false">取消</el-button>
                <el-button type="danger" @click="confirmRemove">确认移除</el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar/index.vue'
import { useCartStore } from '@/stores/cartStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import isLogin from '@/api/isLogin'
import { ElMessage } from 'element-plus'

const cartStore = useCartStore()
const {
  cartItems,
  filteredItems,
  selectedItems,
  clothingTotal,
  dailyTotal,
  checkoutInfo,
  isAllSelected,
  isSettling,
  router,
  isLoading,
} = storeToRefs(cartStore)

const {
  getItem,
  getCurrency,
  removeSelectedItems,
  checkout,
  reCheckout,
  toggleSelectAll,
  updateSelectedTotalPrice,
  formatPrice,
  toHome,
} = cartStore

// 节流函数实现
const throttle = (fn, delay) => {
  let timer = null
  let lastTime = 0

  return function (...args) {
    const now = Date.now()
    const remaining = delay - (now - lastTime)

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      lastTime = now
      fn.apply(this, args)
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now()
        fn.apply(this, args)
        timer = null
      }, remaining)
    }
  }
}

// 移除商品的确认对话框
const removeConfirmVisible = ref(false)
const itemToRemove = ref(null)

// 显示移除确认对话框
const showRemoveConfirmation = (goodsId) => {
  itemToRemove.value = goodsId
  removeConfirmVisible.value = true
}

// 确认移除
const confirmRemove = () => {
  if (itemToRemove.value) {
    removeSelectedItems(itemToRemove.value)
    removeConfirmVisible.value = false
    itemToRemove.value = null
  }
}

// 使用节流函数包装handleQuantityChange
const handleQuantityChange = (item, value) => {
  // 检查输入的数量是否超过库存限制，本地进行限制
  if (value > item.limitNum) {
    value = item.limitNum
    item.num = item.limitNum
    ElMessage.warning({
      message: `商品"${item.goodsName}"的数量不能超过库存上限(${item.limitNum})`,
      duration: 3000,
      showClose: true,
      type: 'warning',
    })
  }

  // 更新总价（本地立即更新UI）
  updateSelectedTotalPrice()

  // 调用 Pinia 方法更新数量（它会处理2秒内只发一次请求的逻辑）
  cartStore.updateItemQuantity(item.goodsId, value)
}

// 我们可以使用更短的节流时间，因为实际防抖逻辑已在store中实现
const throttledQuantityChange = throttle(handleQuantityChange, 100)

onMounted(() => {
  console.log('开始挂载')
  getItem()
  getCurrency()
  isLogin()
})

// 确保全选功能正常
const handleSelectAll = (val) => {
  toggleSelectAll(val)
}

// 确保单个选择正常
const handleItemSelect = () => {
  updateSelectedTotalPrice()
}
</script>

<style lang="css" scoped>
/* 整体页面样式 */
.cart-card {
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  margin: 24px auto;
  justify-content: center;
  background-color: #f5f5f7; /* Apple风格背景色 */
  color: #1d1d1f;
  max-width: 1200px;
}

/* 顶部容器 */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 20px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 16px;
}

.selected-count {
  background-color: #000000; /* Nike风格黑色 */
  color: white;
  padding: 8px 18px;
  border-radius: 24px;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.cart-container {
  padding: 0;
}

/* 调整全选选择框 */
.choose {
  font-size: 16px;
  color: #1d1d1f;
  font-weight: 500;
}

.choose :deep(.el-checkbox__input) {
  transform: scale(1.6);
  margin-right: 12px;
}

.choose :deep(.el-checkbox__label) {
  font-size: 15px;
  letter-spacing: 0.3px;
}

/* 商品卡片容器 */
.card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 库存信息 */
.stock-info {
  font-size: 13px;
  color: #6e6e73;
  margin-top: 8px;
}

.low-stock {
  color: #ff3b30;
  font-weight: bold;
}

/* 商品卡片样式 */
.item-card {
  width: 100%;
  max-width: 1000px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
}

/* 商品卡片选中状态 */
.item-selected {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e2e2;
}

.item-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

/* 增大商品选择框 */
.item-card :deep(.el-checkbox__input) {
  transform: scale(1.6);
  margin-right: 24px;
}

/* 商品图片容器 */
.item-image-container {
  width: 130px;
  height: 130px;
  margin-right: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: #f9f9f9;
  overflow: hidden;
}

.item-image {
  width: 85%;
  height: 85%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.item-image-container:hover .item-image {
  transform: scale(1.08);
}

/* 商品信息布局 */
.item-info {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
}

/* 商品名称样式 */
.item-name {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f; /* Apple风格文字颜色 */
  letter-spacing: 0.3px;
  line-height: 1.3;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

/* 商品价格样式 */
.item-price {
  font-size: 24px;
  font-weight: 500;
  color: #000000; /* Nike风格黑色 */
  margin: 4px 0 8px 0;
}

/* 货币类型标签 */
.currency-type {
  font-size: 13px;
  color: #6e6e73; /* Apple风格次要文字颜色 */
  background-color: #f5f5f7;
  border-radius: 20px;
  padding: 6px 14px;
  display: inline-block;
  font-weight: 500;
  letter-spacing: 0.2px;
}

/* 数量选择器 */
.item-card :deep(.el-input-number) {
  border-radius: 8px;
  overflow: hidden;
}

.item-card :deep(.el-input-number .el-input__inner) {
  font-size: 15px;
  color: #1d1d1f;
  text-align: center;
}

.item-card :deep(.el-input-number__decrease),
.item-card :deep(.el-input-number__increase) {
  background-color: #f5f5f7;
  color: #1d1d1f;
  border-color: #e5e5e5;
}

.quantity-input {
  width: 120px;
  margin-bottom: 15px;
}

/* 移除按钮 */
.remove {
  color: white;
  font-size: 14px;
  border-radius: 24px;
  padding: 10px 20px;
  background: #000000; /* Nike风格黑色 */
  border: none;
  letter-spacing: 0.5px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.remove:hover {
  background: #333333;
  transform: translateY(-2px);
}

/* 底部结算区域布局调整 */
.foot {
  display: flex;
  align-items: center;
  margin-top: 40px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 1020px;
  margin-left: auto;
  margin-right: auto;
}

/* 调整左侧区域 */
.foot-left {
  display: flex;
  align-items: center;
  flex: 1; /* 增加全选区域的比例 */
}

/* 调整中间区域 */
.foot-middle {
  display: flex;
  flex: 1.1; /* 略微增加币值显示区域的比例 */
  justify-content: flex-end; /* 向右对齐，紧挨着结算按钮 */
  padding-right: 0; /* 移除与结算按钮的间距 */
}

/* 调整右侧区域 */
.foot-right {
  flex: 0.7; /* 减小结算按钮区域比例 */
  display: flex;
  justify-content: flex-end; /* 结算按钮靠右 */
  padding-left: 0; /* 移除左侧内边距 */
}

/* 货币信息样式调整 */
.currency-info {
  display: flex;
  flex-direction: row;
  gap: 15px; /* 减小间距 */
  align-items: center;
  justify-content: flex-end; /* 确保内容靠右 */
}

.currency-info span {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
}

/* 全选选择框样式 */
.choose {
  font-size: 16px;
  color: #1d1d1f;
  font-weight: 500;
}

.choose :deep(.el-checkbox__input) {
  transform: scale(1.6);
  margin-right: 12px;
}

.choose :deep(.el-checkbox__label) {
  font-size: 15px;
  letter-spacing: 0.3px;
}

/* 移除旧的总额显示样式 */
.cart-total {
  display: none;
}

/* 恢复结算按钮原样式并增大 */
.checkout-button {
  background: #000000;
  color: #fff;
  transition: all 0.3s;
  font-size: 20px; /* 更大的字体 */
  padding: 16px 45px; /* 更大的内边距 */
  border-radius: 30px;
  border: none;
  font-weight: 600; /* 更粗的字体 */
  letter-spacing: 0.7px;
}

.checkout-button:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.checkout-button[disabled] {
  background: #a1a1a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 空购物车样式 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: #1d1d1f;
  text-align: center;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin: 40px 0;
}

.empty-cart-image {
  width: 150px;
  height: auto;
  margin-bottom: 40px;
  opacity: 0.8;
  animation: float 5s ease-in-out infinite;
}

.empty-cart-text {
  font-size: 28px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 30px;
  letter-spacing: 0.5px;
}

.empty-cart-button {
  font-size: 16px;
  color: #fff;
  background-color: #000000;
  border: none;
  padding: 14px 32px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.7px;
}

.empty-cart-button:hover {
  background-color: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 结算弹窗样式 */
.checkout-dialog :deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.checkout-dialog :deep(.el-dialog__header) {
  background-color: #000000;
  color: white;
  padding: 20px;
  text-align: center;
}

.checkout-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 0.7px;
}

.checkout-dialog :deep(.el-dialog__headerbtn .el-dialog__close) {
  color: rgba(255, 255, 255, 0.9);
}

.checkout-dialog :deep(.el-dialog__body) {
  padding: 30px;
}

.checkout-details {
  padding: 10px 0;
}

.checkout-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  color: #1d1d1f;
}

.checkout-item:last-child {
  border-bottom: none;
  margin-top: 8px;
  background-color: #f5f5f7;
  border-radius: 12px;
  padding: 18px 16px;
}

.checkout-item .price {
  font-weight: 600;
  color: #000000;
  font-size: 17px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
}

.dialog-footer :deep(.el-button) {
  border-radius: 30px;
  padding: 12px 26px;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.dialog-footer :deep(.el-button--default) {
  border-color: #d2d2d7;
  color: #1d1d1f;
}

.dialog-footer :deep(.el-button--primary) {
  background-color: #000000;
  border-color: #000000;
}

.dialog-footer :deep(.el-button--primary:hover) {
  background-color: #333333;
  border-color: #333333;
}

/* 确认移除对话框样式 */
.remove-confirm-content {
  padding: 10px 0;
  text-align: center;
}

.remove-confirm-content p {
  font-size: 16px;
  color: #1d1d1f;
}

/* 优雅的动画效果 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* 确保复选框可点击 */
.item-card :deep(.el-checkbox),
.choose :deep(.el-checkbox) {
  pointer-events: auto;
  cursor: pointer;
}

.item-card :deep(.el-checkbox__input),
.choose :deep(.el-checkbox__input) {
  z-index: 2;
  pointer-events: auto;
}

/* 加载中购物车样式 */
.loading-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  color: #1d1d1f;
  text-align: center;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  margin: 40px 0;
}

.loading-text {
  font-size: 18px;
  font-weight: 500;
  color: #1d1d1f;
  margin-top: 25px;
  letter-spacing: 0.5px;
  opacity: 0.7;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
}

.loading-cart :deep(.el-skeleton-item) {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
