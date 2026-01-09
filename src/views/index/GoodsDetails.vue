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
          <el-tag class="stock-chip" size="small" type="success" v-if="productDetail.amount > 0">
            库存 {{ productDetail.amount }}
          </el-tag>
        </div>
        <div
          class="price-cartoon"
          :style="{ '--coin-color': CoinColor[productDetail.currencyType] }"
        >
          <span class="value-label">价格</span>
          <div class="coin-pill">
            <span class="coin-name">{{ CoinName[productDetail.currencyType] }}</span>
          </div>
          <span class="price-num">{{ productDetail.price }}</span>
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
              :max="productDetail.amount"
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
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled, ShoppingCart } from '@element-plus/icons-vue'
import { martApi } from '@/api/mart.api'
import { CoinColor, CoinName } from '@/types/goodsInfo'
import CartoonStepper from './components/CartoonStepper.vue'
import type { goodItem, Product } from '@/api/mart.api'

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
    const listResp = await martApi.cartList()
    console.log('购物车列表', listResp)
    if (listResp.code === 200 && listResp.data) {
      const cartItems = listResp.data
      const existingItem = cartItems.find(
        (item: goodItem) => item.goodsId === productDetail.value.id,
      )
      if (existingItem) {
        const totalQuantity = existingItem.num + num.value
        if (totalQuantity > productDetail.value.amount) {
          ElMessage.warning(
            `该商品在购物车中已有${existingItem.num}个，库存仅剩${productDetail.value.amount}个，无法继续添加${num.value}个`,
          )
          return
        }
      }
    }

    const payload = {
      goodsId: productDetail.value.id,
      num: num.value,
    }
    const addResp = await martApi.addCartItem(payload)
    if (addResp.code === 500) {
      ElMessage.error(addResp.message)
      console.log('商品下架', addResp)
    } else if (addResp.code === 200) {
      console.log('加入购物车成功', addResp)
      ElMessage.success('加入购物车成功')
      emit('close')
    } else if (addResp.code === 401) {
      ElMessage.error('认证失败')
      emit('close')
    } else if (addResp.code === 403) {
      ElMessage.error('您没有此权限')
      emit('close')
    }
  } catch (error) {
    console.error('加入购物车失败', error)
    ElMessage.error('加入购物车失败')
    emit('close')
  }
}

// 监听数量变化，确保不超过库存
watch(num, (newVal) => {
  if (newVal > productDetail.value.amount) {
    ElMessage.warning(`数量不能超过库存(${productDetail.value.amount})`)
    num.value = productDetail.value.amount
  }
})

// 关闭弹框的方法
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
  gap: 8px;
  margin-top: 14px;
  padding: 8px 16px;
}
.value-label {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-muted);
  margin-right: 4px;
}
.coin-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--coin-color);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 14px;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.15);
}
.price-num {
  font-size: 28px;
  font-weight: 900;
  color: var(--coin-color);
  margin-left: 8px;
  font-family: 'Arial Rounded MT Bold', 'Varela Round', sans-serif;
  letter-spacing: -1px;
  line-height: 1;
}
.divider {
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(76, 141, 244, 0.25),
    rgba(0, 0, 0, 0)
  );
  margin: 12px 0;
}
.intro-box {
  margin-top: 12px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 12px;
  position: relative;
}
.intro-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.intro-icon {
  color: var(--accent);
  font-size: 16px;
}
.intro-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: 0.5px;
}
.intro-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  background: #fff;
  padding: 8px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}
.actions-cartoon {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  .stepper-label {
    width: 100%;
    font-size: 14px;
    font-weight: 800;
    color: var(--text-main);
  }
  .stepper-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: between;
    gap: 12px;
    .add-btn-cartoon {
      flex: 1;
      height: 40px;
      border-radius: 12px !important;
      font-size: 16px !important;
      font-weight: 800 !important;
      letter-spacing: 1px;
      background-color: #4c8df4 !important; /* 强制使用蓝色背景 */
      border: none !important;
      box-shadow: 0 4px 0 #3272d9 !important;
      color: #ffffff !important; /* 强制使用白色文字 */
      transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 4px;
    }
  }
}
.add-btn-cartoon:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #3272d9 !important;
}
.add-btn-cartoon:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #3272d9 !important;
}
@media (max-width: 768px) {
  .dialog-body {
    grid-template-columns: 1fr;
  }
  .image-wrap {
    aspect-ratio: 4 / 3;
  }
}
</style>
