<template>
  <div class="coin-line">
    <font-awesome-icon
      icon="fa-solid fa-coins"
      :style="{
        color: CoinColor[coinType],
      }"
    />
    <span class="label">{{ CoinName[coinType] }}</span>
    <span v-if="amount !== undefined && amount >= 0" class="amount">{{ amount }}</span>
  </div>
</template>

<script setup lang="ts">
import { CoinType, CoinColor, CoinName } from '@/types/goodsInfo'

defineModel('coinType', {
  default: CoinType.CareCoin,
  required: true,
})
defineModel('amount', {
  default: -1 as number,
  required: false,
})
</script>

<style scoped>
.coin-line {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  width: fit-content;
  font-size: 13px;
  line-height: 1.2;
  color: #606266;
}

.label {
  min-width: 52px;
  text-align: left;
}

.amount {
  min-width: 20px;
  text-align: left;
  font-weight: 600;
}
</style>
