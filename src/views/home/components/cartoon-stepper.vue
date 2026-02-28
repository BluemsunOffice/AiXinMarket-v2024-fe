<template>
  <div class="cartoon-stepper-box">
    <button class="stepper-btn" @click="decrease" :disabled="modelValue <= min || disabled">
      <el-icon><Minus /></el-icon>
    </button>
    <input
      class="stepper-input"
      type="text"
      :value="modelValue"
      @blur="handleInput"
      @keyup.enter="handleInput"
      :disabled="disabled"
    />
    <button class="stepper-btn" @click="increase" :disabled="modelValue >= max || disabled">
      <el-icon><Plus /></el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const decrease = () => {
  if (props.modelValue > props.min) {
    emit("update:modelValue", props.modelValue - 1);
  }
};

const increase = () => {
  if (props.modelValue < props.max) {
    emit("update:modelValue", props.modelValue + 1);
  }
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value = parseInt(target.value);

  if (isNaN(value)) {
    value = props.min;
  }

  // 限制范围
  if (value < props.min) {
    value = props.min;
  } else if (props.max > 0 && value > props.max) {
    value = props.max;
    ElMessage.warning(`数量不能超过最大值(${props.max})`);
  }

  emit("update:modelValue", value);
  // 强制更新输入框的值
  target.value = value.toString();
};
</script>

<style scoped>
.cartoon-stepper-box {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  gap: 2px;
  height: 40px;
  box-sizing: border-box;
}
.stepper-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.stepper-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: var(--text-main);
}
.stepper-btn:active:not(:disabled) {
  transform: scale(0.9);
  background: #cbd5e1;
}
.stepper-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.stepper-input {
  width: 40px;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  color: var(--text-main);
  font-family: 'Arial Rounded MT Bold', 'Varela Round', sans-serif;
  outline: none;
  padding: 0;
}
.stepper-input:focus {
  color: var(--accent);
}
</style>
