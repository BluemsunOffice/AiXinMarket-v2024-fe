<template>
  <el-dialog
    :model-value="visible"
    title="查看详情"
    width="840"
    center
    @update:model-value="handleVisibleChange"
  >
    <el-skeleton :loading="loading" animated>
      <el-descriptions border>
        <el-descriptions-item :rowspan="2" :width="140" label="商品图片" align-center>
          <el-image style="width: auto; height: 100px" :src="detail?.imageUrl" />
        </el-descriptions-item>

        <el-descriptions-item
          v-for="item in descriptionItems"
          :key="item.label"
          :label="item.label"
          :width="100"
          class-name="my-class"
        >
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-skeleton>

    <el-pagination
      id="detail-pagination"
      layout="prev, pager, next"
      :total="total"
      :model-value="pageNum"
      :page-size="1"
      @current-change="handlePageChange"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderInfoItem } from '@/api/order.api'
import { CoinName } from '@/types/goods-info'

const props = defineProps<{
  visible: boolean
  loading: boolean
  detail: OrderInfoItem | null
  total: number
  pageNum: number
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'page-change': [pageNum: number]
}>()

const handleVisibleChange = (value: boolean) => {
  emit('update:visible', value)
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const descriptionItems = computed(() => {
  const detail = props.detail
  if (!detail) {
    return [
      { label: '名称', value: '-' },
      { label: '价格', value: '-' },
      { label: '货币类型', value: '-' },
      { label: '数量', value: '-' },
      { label: '商品介绍', value: '-' },
    ]
  }

  return [
    { label: '名称', value: detail.goodsName },
    { label: '价格', value: detail.price },
    { label: '货币类型', value: CoinName[detail.currencyType] || '-' },
    { label: '数量', value: detail.amount },
    { label: '商品介绍', value: detail.intro },
  ]
})
</script>

<style scoped>
::v-deep .my-class {
  height: 62px;
  max-width: 100px;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#detail-pagination {
  margin-top: 12px;
}
</style>
