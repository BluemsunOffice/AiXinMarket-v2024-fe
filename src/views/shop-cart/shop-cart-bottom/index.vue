<template>
  <footer class="cart-footer">
    <div class="footer-left">
      <el-checkbox :model-value="isAllSelected" @change="onToggleAll">全选</el-checkbox>
    </div>

    <div class="footer-right">
      <div class="amount-display">
        <div class="coin-line">
          <Coins :coin-type="CoinType.CareCoin" :amount="dailyTotal" />
        </div>
        <div class="coin-line">
          <Coins :coin-type="CoinType.WarmCoin" :amount="clothingTotal" />
        </div>
      </div>
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
import { CoinType } from '@/types/goods-info'
import Coins from '@/components/coins/index.vue'
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
  width: 140px;
  font-weight: 600;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.checkout-button {
  width: 100%;
}
</style>
