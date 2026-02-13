<template>
  <div class="searchbar">
    <el-input
      v-model="name"
      placeholder="搜索商品"
      size="large"
      clearable
      class="search-input"
      @keyup.enter="emitSearch"
    >
      <template #prefix>
        <el-icon class="search-icon">
          <Search />
        </el-icon>
      </template>
    </el-input>

    <template v-if="isMobile">
      <div class="mobile-filters">
        <el-select
          :model-value="type"
          size="large"
          placeholder="商品分类"
          class="mobile-select"
          @change="(value: string) => onDropdownCommand('type', value)"
        >
          <el-option
            v-for="option in typeOptions"
            :key="`type-${option.value || 'all'}`"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <el-select
          :model-value="currencyType"
          size="large"
          placeholder="货币分类"
          class="mobile-select"
          @change="(value: string) => onDropdownCommand('currencyType', value)"
        >
          <el-option
            v-for="option in currencyOptions"
            :key="`currency-${option.value || 'all'}`"
            :label="option.label"
            :value="option.value"
          >
            <span :style="option.color ? { color: option.color, fontWeight: 700 } : undefined">
              {{ option.label }}
            </span>
          </el-option>
        </el-select>

        <el-select
          :model-value="order"
          size="large"
          placeholder="商品排序"
          class="mobile-select"
          @change="(value: string) => onDropdownCommand('order', value)"
        >
          <el-option
            v-for="option in orderOptions"
            :key="`order-${option.value || 'all'}`"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>
    </template>

    <el-dropdown
      v-else
      v-for="dropdown in dropdownConfigs"
      :key="dropdown.key"
      @command="(command: string) => onDropdownCommand(dropdown.key, command)"
    >
      <el-button type="primary" plain size="large" class="dropdown-btn">
        {{ dropdown.title }}：
        <span
          :style="
            dropdown.key === 'currencyType' && dropdown.selectedColor
              ? { color: dropdown.selectedColor, fontWeight: 700 }
              : undefined
          "
        >
          {{ dropdown.selectedLabel }}
        </span>
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="option in dropdown.options"
            :key="`${dropdown.key}-${option.value || 'all'}`"
            :command="option.value"
          >
            <span :style="option.color ? { color: option.color, fontWeight: 700 } : undefined">
              {{ option.label }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-button type="primary" size="large" round class="search-button" @click="emitSearch">
      搜索
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { CoinColor, CoinName, CoinType } from '@/types/goodsInfo'
import type { OrderDirection } from '@/api/mart.api'

type DropdownKey = 'type' | 'currencyType' | 'order'

interface DropdownOption {
  label: string
  value: string
  color?: string
}

const emit = defineEmits<{
  (
    e: 'search',
    payload: {
      name: string
      type: string
      currencyType: string
      isAsc: OrderDirection
    },
  ): void
}>()

const name = ref('')
const type = ref('')
const currencyType = ref('')
const isAsc = ref<OrderDirection>(null)
const order = ref('')
const isMobile = ref(window.innerWidth <= 768)

const typeOptions: DropdownOption[] = [
  { label: '全部', value: '' },
  { label: '服装', value: '1' },
  { label: '日常用品', value: '0' },
  { label: '学习用品', value: '2' },
]

const currencyOptions: DropdownOption[] = [
  { label: '全部', value: '' },
  {
    label: CoinName[CoinType.WarmCoin],
    value: CoinType.WarmCoin,
    color: CoinColor[CoinType.WarmCoin],
  },
  {
    label: CoinName[CoinType.CareCoin],
    value: CoinType.CareCoin,
    color: CoinColor[CoinType.CareCoin],
  },
]

const orderOptions: DropdownOption[] = [
  { label: '无排序', value: '' },
  { label: '按价格升序', value: 'asc' },
  { label: '按价格降序', value: 'desc' },
]

const getSelectedLabel = (
  options: DropdownOption[],
  selectedValue: string,
  fallbackLabel: string,
) => {
  return options.find((option) => option.value === selectedValue)?.label || fallbackLabel
}

const selectedCurrencyColor = computed(() => {
  return currencyOptions.find((option) => option.value === currencyType.value)?.color
})

const dropdownConfigs = computed(() => {
  return [
    {
      key: 'type' as const,
      title: '商品分类',
      options: typeOptions,
      selectedLabel: getSelectedLabel(typeOptions, type.value, '全部'),
      selectedColor: '',
    },
    {
      key: 'currencyType' as const,
      title: '货币分类',
      options: currencyOptions,
      selectedLabel: getSelectedLabel(currencyOptions, currencyType.value, '全部'),
      selectedColor: selectedCurrencyColor.value || '',
    },
    {
      key: 'order' as const,
      title: '商品排序',
      options: orderOptions,
      selectedLabel: getSelectedLabel(orderOptions, order.value, '综合'),
      selectedColor: '',
    },
  ]
})

const onDropdownCommand = (key: DropdownKey, command: string) => {
  if (key === 'type') {
    type.value = command
  }

  if (key === 'currencyType') {
    currencyType.value = command
  }

  if (key === 'order') {
    order.value = command
    isAsc.value = command as OrderDirection
  }

  emitSearch()
}

const emitSearch = () => {
  emit('search', {
    name: name.value,
    type: type.value,
    currencyType: currencyType.value,
    isAsc: isAsc.value,
  })
}

const updateDeviceState = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  updateDeviceState()
  window.addEventListener('resize', updateDeviceState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDeviceState)
})
</script>

<style scoped>
.searchbar {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 84px;
  padding: 14px 18px;
}

.search-input {
  width: 360px;
  height: 46px;
  padding: 4px;
  max-width: 32vw;
}
.search-icon {
  color: #3a7be0;
  font-size: 18px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 9999px;
  padding: 6px 14px;
  background-color: #eef6ff;
  border: 1px solid rgba(64, 158, 255, 0.28);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
  transition:
    box-shadow 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease;
}
.search-input :deep(.is-focus .el-input__wrapper),
.search-input :deep(.el-input__wrapper:hover) {
  background-color: #e6f2ff;
  border-color: rgba(64, 158, 255, 0.48);
  box-shadow:
    0 10px 28px rgba(64, 158, 255, 0.28),
    0 0 0 3px rgba(64, 158, 255, 0.18);
}

.search-button {
  padding: 10px 18px;
  font-size: 16px;
  font-weight: 700;
  background-image: linear-gradient(90deg, #409eff, #6aa8ff);
  box-shadow:
    0 10px 28px rgba(64, 158, 255, 0.32),
    0 0 0 3px rgba(64, 158, 255, 0.18);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}
.search-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
  box-shadow:
    0 12px 32px rgba(64, 158, 255, 0.38),
    0 0 0 4px rgba(64, 158, 255, 0.22);
}

.dropdown-btn {
  width: fit-content;
  justify-content: space-between;
  white-space: nowrap;
  span {
    width: 80px;
  }
}

.mobile-filters {
  padding: 10px;
  display: flex;
  width: 100%;
  gap: 10px;
  box-sizing: border-box;
}

.mobile-select {
  flex: 1;
}

@media (max-width: 768px) {
  .searchbar {
    margin-left: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 10px 12px;
    min-height: 0;
  }

  .search-input {
    width: 100%;
    max-width: 100%;
  }

  .search-button {
    width: 100%;
    margin-top: 2px;
    border-radius: 12px;
  }
}
</style>
