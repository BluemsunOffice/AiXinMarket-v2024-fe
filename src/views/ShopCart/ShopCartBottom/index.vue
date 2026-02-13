<template>
  <footer class="cart-footer">
    <div class="footer-left">
      <el-checkbox :model-value="isAllSelected" @change="onToggleAll">全选</el-checkbox>
    </div>

    <div class="footer-middle">
      <div class="coin-line">
        <span class="iconfont icon-qianbao" />
        <span>日用币：{{ dailyTotal.toFixed(2) }}</span>
      </div>
      <div class="coin-line">
        <span class="iconfont icon-yifu" />
        <span>服装币：{{ clothingTotal.toFixed(2) }}</span>
      </div>
    </div>

    <div class="footer-right">
      <el-button
        :type="selectedCount ? 'success' : 'info'"
        class="checkout-button"
        :disabled="!selectedCount"
        @click="emit('checkout')"
      >
        结算 {{ selectedCount ? `(${selectedCount})` : '' }}
      </el-button>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Props {
  isAllSelected: boolean
  dailyTotal: number
  clothingTotal: number
  selectedCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  'toggle-all': [checked: boolean]
  checkout: []
}>()

const onToggleAll = (checked: string | number | boolean) => {
  emit('toggle-all', Boolean(checked))
}
</script>

<style scoped>
.cart-footer {
  margin-top: 20px;
  padding: 16px 18px;
  border: 1px solid #eceff5;
  border-radius: 12px;
  background: #fafbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.footer-middle {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.coin-line {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #303133;
  font-weight: 600;
}

.coin-line .iconfont {
  color: #409eff;
}

.checkout-button {
  min-width: 140px;
  font-weight: 600;
}

@media (max-width: 900px) {
  .cart-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-right {
    width: 100%;
  }

  .checkout-button {
    width: 100%;
  }
}
</style>
