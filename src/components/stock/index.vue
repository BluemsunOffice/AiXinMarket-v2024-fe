<template>
  <div class="stock-line">
    <font-awesome-icon icon="fa-solid fa-boxes-stacked" style="color: rgba(255, 212, 59, 1)" />
    <span class="label">库存</span>
    <span v-if="amount !== undefined && amount >= 0" class="amount">{{ amount }}</span>
    <div class="stock"></div>
  </div>
</template>

<script setup lang="ts">
defineModel('amount', {
  default: -1 as number,
  required: false,
})
</script>

<style scoped>
.stock-line {
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
