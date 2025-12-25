<template>
    <el-dialog
      title="商品详情"
      :visible.sync="visible"
      width="50%"
      @close="closeDialog"
    >
      <div v-if="product">
        <p><strong>商品名称:</strong> {{ product.name }}</p>
        <p><strong>价格:</strong> {{ product.price }}</p>
        <p><strong>描述:</strong> {{ product.description }}</p>
        <!-- 其他商品详情 -->
      </div>
    </el-dialog>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    product: Object,
    visible: Boolean
  });
  const emits = defineEmits(['update:visible']);
  
  const closeDialog = () => {
    emits('update:visible', false);
  };
  </script>
