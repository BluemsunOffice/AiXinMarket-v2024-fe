<template>
  <el-dialog
    v-model="visible"
    width="720px"
    @close="close"
    class="product-dialog"
    top="8vh"
    align-center
  >
    <template #title>
      <div class="dialog-title">商品详情</div>
    </template>
    <div class="dialog-body">
      <div class="image-wrap">
        <div class="image-decor"></div>
        <el-image :src="productDetail.imageUrlUrl" fit="cover" class="image" />
        <el-tag v-if="productDetail.amount === 0" type="danger" class="badge">缺货</el-tag>
      </div>
      <div class="info">
        <div class="header-row">
          <div class="name">{{ productDetail.name }}</div>
          <Stock v-if="productDetail.amount > 0" :amount="productDetail.amount" />
        </div>
        <div class="price-cartoon">
          <div class="coin-pill">
            <Coins :coinType="productDetail.currencyType" :amount="productDetail.price" />
          </div>
          <div class="purchase-limit">
            <span class="limit-label">限购数量</span>
            <span class="limit-value">{{ productDetail.limitNum }} 件</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="intro-box">
          <div class="intro-header">
            <el-icon class="intro-icon"><InfoFilled /></el-icon>
            <span class="intro-title">商品介绍</span>
          </div>
          <div class="intro-content">{{ productDetail.intro }}</div>
        </div>
        <div class="actions-cartoon">
          <span class="stepper-label">选择数量</span>
          <div class="stepper-wrap">
            <CartoonStepper
              v-model="num"
              :min="1"
              :max="maxAvailableQuantity"
              :disabled="productDetail.amount === 0"
            />
            <el-button
              type="primary"
              size="large"
              class="add-btn-cartoon"
              :disabled="productDetail.amount === 0"
              @click="addToCart"
            >
              <el-icon class="btn-icon"><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, ShoppingCart } from '@element-plus/icons-vue'
import { cartApi, type CartItemPayload } from '@/api/cart.api'
import CartoonStepper from './components/cartoon-stepper.vue'
import type { Product } from '@/api/mart.api'
import Coins from '@/components/coins/index.vue'
import Stock from '@/components/stock/index.vue'

const num = ref(1)
const visible = ref(true)

const emit = defineEmits()

const props = defineProps({
  productDetail: {
    type: Object as () => Product,
    required: true,
  },
})

const productDetail = ref(props.productDetail)
const maxAvailableQuantity = computed(() =>
  Math.min(productDetail.value.amount, productDetail.value.limitNum),
)

watch(
  () => props.productDetail,
  (newVal) => {
    productDetail.value = newVal
  },
  { immediate: true },
)

const addToCart = async () => {
  if (productDetail.value.amount <= 0) {
    ElMessage.error('库存不足，无法加入购物车')
    emit('close')
    return
  }

  try {
    const listResp = await cartApi.list()
    console.log('购物车列表', listResp)
    if (listResp.code === 200 && listResp.data) {
      const cartItems = listResp.data
      const existingItem = cartItems.find(
        (item: CartItemPayload) => item.goodsId === productDetail.value.id,
      )
      if (existingItem) {
        const totalQuantity = existingItem.num + num.value
        if (totalQuantity > maxAvailableQuantity.value) {
          ElMessage.warning(
            `该商品在购物车中已有${existingItem.num}个，可购买上限为${maxAvailableQuantity.value}个，无法继续添加${num.value}个`,
          )
          return
        }
      }
    }

    const payload = {
      goodsId: productDetail.value.id,
      num: num.value,
    }
    const addResp = await cartApi.add(payload)
    if (addResp.code === 500) {
      ElMessage.error(addResp.msg || '加入购物车失败')
      console.log('商品下架', addResp)
    } else if (addResp.code === 200) {
      console.log('加入购物车成功', addResp)
      ElMessage.success('加入购物车成功')
      emit('close')
    } else if (addResp.code === 401) {
      ElMessage.error(addResp.msg || '认证失败')
      emit('close')
    } else if (addResp.code === 403) {
      ElMessage.error(addResp.msg || '您没有此权限')
      emit('close')
    }
  } catch (error) {
    console.error('加入购物车失败', error)
    ElMessage.error('加入购物车失败: ' + ((error as { msg?: string }).msg || '请稍后重试'))
    emit('close')
  }
}

watch(num, (newVal) => {
  if (newVal > maxAvailableQuantity.value) {
    ElMessage.warning(
      `数量不能超过可购买上限（库存${productDetail.value.amount}，限购${productDetail.value.limitNum}）`,
    )
    num.value = maxAvailableQuantity.value
  }
})

const close = () => {
  emit('close')
}
</script>

<style scoped>
:root {
  --accent: #4c8df4;
  --accent-2: #7bc6ff;
  --bg-soft: #f7faff;
  --text-main: #1f2d3d;
  --text-muted: #6b7280;
}
.product-dialog :deep(.el-dialog__header) {
  border-bottom: 0;
  background: linear-gradient(135deg, rgba(124, 185, 255, 0.18), rgba(76, 141, 244, 0.12));
}
.product-dialog :deep(.el-dialog__title) {
  color: var(--text-main);
}
.product-dialog :deep(.el-dialog__body) {
  background: var(--bg-soft);
}
.dialog-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
}
.dialog-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
}
.image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  background: #eef3ff;
  box-shadow: 0 8px 20px rgba(76, 141, 244, 0.08);
}
.image-decor {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(100% 100% at 0% 0%, rgba(123, 198, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(100% 100% at 100% 100%, rgba(76, 141, 244, 0.25) 0%, rgba(255, 255, 255, 0) 60%);
  pointer-events: none;
}
.image {
  width: 100%;
  height: 100%;
}
.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 999px;
}
.info {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(18, 38, 63, 0.06);
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: linear-gradient(180deg, rgba(124, 185, 255, 0.18), rgba(124, 185, 255, 0.08));
  border: 1px solid rgba(76, 141, 244, 0.15);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.name {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
}
.stock-chip {
  border-radius: 999px;
  background: rgba(76, 141, 244, 0.12);
  color: var(--accent);
}
.price-cartoon {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-top: 14px;
  padding: 8px 16px;
}

.price-num {
  font-size: 16px;
  font-weight: 900;
  font-family: 'Arial Rounded MT Bold', 'Varela Round', sans-serif;
  line-height: 1;
}
.coin-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: linear-gradient(135deg, rgba(255, 243, 205, 0.9), rgba(255, 232, 143, 0.7));
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255, 212, 59, 0.35);
}
.purchase-limit {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  padding: 8px 14px;
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(59, 141, 255, 0.35);
}
.limit-label {
  color: #606266;
  font-size: 14px;
}
.limit-value {
  font-size: 14px;
  font-weight: 700;
}
.divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(76, 141, 244, 0),
    rgba(76, 141, 244, 0.25),
    rgba(76, 141, 244, 0)
  );
  margin: 14px 0;
}
.intro-box {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 255, 0.96));
  border: 1px solid rgba(76, 141, 244, 0.08);
  border-radius: 14px;
  padding: 14px;
}
.intro-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.intro-icon {
  color: var(--accent);
}
.intro-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-main);
}
.intro-content {
  color: var(--text-muted);
  line-height: 1.7;
  white-space: pre-wrap;
}
.actions-cartoon {
  margin-top: 18px;
  background: linear-gradient(180deg, rgba(124, 185, 255, 0.12), rgba(124, 185, 255, 0.04));
  border: 1px dashed rgba(76, 141, 244, 0.25);
  border-radius: 16px;
  padding: 14px;
}
.stepper-label {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}
.stepper-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.add-btn-cartoon {
  border-radius: 999px;
  padding: 0 18px;
  height: 42px;
  box-shadow: 0 10px 18px rgba(76, 141, 244, 0.18);
}
.btn-icon {
  margin-right: 6px;
}
@media (max-width: 900px) {
  .dialog-body {
    grid-template-columns: 1fr;
  }
}
</style>
