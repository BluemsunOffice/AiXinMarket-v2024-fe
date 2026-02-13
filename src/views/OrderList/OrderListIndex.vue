<template>
  <div>
    <NavBar />
    <div class="order-list">
      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%; height: 500px"
        v-loading="loadings.table"
      >
        <el-table-column prop="status" label="订单状态" minWidth="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)"
              >{{ statusMap[row.status] || '-' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" minWidth="140" />
        <el-table-column prop="generalBalance" label="日用币" minWidth="140" />
        <el-table-column prop="clothingBalance" label="服装币" minWidth="140" />
        <el-table-column prop="operate" label="操作" width="150">
          <template #default="{ row }">
            <!-- 使用 v-show 仅当状态为1（失败）时，显示取消订单按钮，但仍保持占位 -->
            <el-popconfirm
              title="确定取消订单?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="cancelOrder(row)"
              placement="top"
            >
              <template #reference>
                <el-button v-show="row.status === '0'" text type="primary" class="table-btn">
                  取消订单
                </el-button>
              </template>
            </el-popconfirm>
            <el-button text type="primary" class="table-btn ml10" @click="showDetail(row)">
              订单详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="custom-pagination">
        <span class="page-size-label">每页显示：</span>
        <el-select
          v-model="query.pageSize"
          size="small"
          class="page-size-select"
          @change="handleSizeChange"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="size in pageSizes.filter((s) => s !== query.pageSize)"
            :key="size"
            :label="`${size}`"
            :value="size"
          />
        </el-select>
        <span class="current-page-size">条/页</span>
        <el-pagination
          background
          size="small"
          :page-size="query.pageSize"
          :page-sizes="[]"
          layout="->, prev, pager, next, jumper, total"
          v-model:current-page="query.pageNum"
          @current-change="handleCurrentChange"
          :total="total"
          class="my-pagination"
        />
      </div>

      <!-- 订单详情弹窗 -->
      <el-dialog
        v-model="visible"
        :title="`订单详情`"
        width="950"
        top="10vh"
        :close-on-click-modal="false"
      >
        <div>
          <el-table :data="detailTableData" height="500" v-loading="loadings.detail">
            <el-table-column property="goodsImg" width="150" align="center">
              <template #default="{ row }">
                <el-image :src="row.imageUrl" class="goods-img"></el-image>
              </template>
            </el-table-column>
            <el-table-column property="goodsName" label="商品名称" minWidth="200" />
            <el-table-column property="currentType" label="消耗币类型" minWidth="140">
              <template #default="{ row }">
                <Coins :coinType="row.currencyType" />
              </template>
            </el-table-column>
            <el-table-column property="amount" label="数量" minWidth="140" />
            <el-table-column property="price" label="消耗币" minWidth="150" />
          </el-table>

          <div class="total-num">共 {{ detailTableDataTotal }} 条数据</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import NavBar from '@/components/NavBar/index.vue'
import { useOrderStore } from '@/stores/orderStore'
import Coins from '@/components/coins/index.vue'

const orderStore = useOrderStore()
const {
  tableData,
  detailTableData,
  detailTableDataTotal,
  query,
  pageSizes,
  total,
  loadings,
  statusMap,
  visible,
} = storeToRefs(orderStore)
const { setPageSize, setPageNum, cancelOrder, showDetail, initPage } = orderStore

const getStatusTagType = (status: string) => {
  switch (status) {
    case '2':
      return 'success'
    case '1':
      return 'danger'
    default:
      return ''
  }
}

const handleSizeChange = (val: number) => {
  setPageSize(val)
}
const handleCurrentChange = (val: number) => {
  setPageNum(val)
}

// 在组件挂载时调用isPC函数
onMounted(() => {
  initPage()
})
</script>

<style scoped>
.order-list {
  margin-top: 2vh;
  padding: 30px 40px;
}

.table-btn {
  padding-left: 0;
  padding-right: 0;
}

.ml10 {
  margin-left: 10px;
}

.my-pagination {
  margin-top: 20px;
  text-align: right;
}

.goods-img {
  width: 80px;
  height: 80px;
}

.total-num {
  margin: 10px 0;
  text-align: right;
}

.custom-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  justify-content: flex-end;
}

.page-size-label {
  color: var(--el-text-color-regular);
  font-size: 13px;
  line-height: 32px;
}

.current-page-size {
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 13px;
  line-height: 32px;
}

.page-size-select {
  width: 88px;
}

.page-size-select :deep(.el-input__wrapper) {
  min-height: 32px;
}

.my-pagination :deep(.el-pagination__total),
.my-pagination :deep(.el-pagination__jump),
.my-pagination :deep(.el-pagination__sizes),
.my-pagination :deep(.number),
.my-pagination :deep(.btn-prev),
.my-pagination :deep(.btn-next) {
  font-size: 13px;
  line-height: 32px;
}

.my-pagination :deep(.el-pagination__editor .el-input__inner) {
  height: 28px;
  font-size: 13px;
}
</style>
