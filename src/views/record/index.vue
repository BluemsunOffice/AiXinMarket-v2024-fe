<template>
  <main class="record-page">
    <NavBar />

    <section class="record-container">
      <header class="record-header">
        <div>
          <h2>进货记录</h2>
          <p>查看商品补货流水与库存变化</p>
        </div>
        <div class="header-actions">
          <el-input
            :model-value="keyword"
            class="search-input"
            placeholder="请输入商品名称进行模糊搜索"
            clearable
            @update:model-value="handleKeywordChange"
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </div>
      </header>

      <el-table :data="items" border v-loading="loading" class="record-table">
        <el-table-column prop="name" label="商品名称" min-width="180" />
        <el-table-column label="商品图片" width="120">
          <template #default="{ row }">
            <el-image class="record-image" :src="row.imageUrl" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="originAmount" label="起始库存" width="120" />
        <el-table-column prop="endAmount" label="当前库存" width="120" />
        <el-table-column prop="amount" label="进货数量" width="120" />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          :model-value="pager.pageNum"
          layout="prev,pager,next,jumper,total"
          :page-size="pager.pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </section>

    <el-dialog
      v-model="detailVisible"
      title="进货记录详情"
      width="520"
      align-center
      @close="closeDetail"
    >
      <el-skeleton :loading="detailLoading" animated>
        <el-descriptions border :column="1" class="detail-descriptions">
          <el-descriptions-item label="商品图片">
            <el-image class="detail-image" :src="detail.imageUrl" fit="cover" />
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">{{ detail.name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="起始库存">{{ detail.originAmount }}</el-descriptions-item>
          <el-descriptions-item label="当前库存">{{ detail.endAmount }}</el-descriptions-item>
          <el-descriptions-item label="增加数量">
            <el-tag size="small" type="success">{{ increaseAmount }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-skeleton>

      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Search } from '@element-plus/icons-vue'
import NavBar from '@/components/nav-bar/index.vue'
import { useRecordStore } from '@/stores/record-store'

const recordStore = useRecordStore()
const { loading, items, total, pager, keyword, detailVisible, detailLoading, detail, increaseAmount } =
  storeToRefs(recordStore)

const { fetchRecords, changePage, updateKeyword, searchRecords, openDetail, closeDetail } =
  recordStore

const handlePageChange = (newPage: number) => {
  changePage(newPage)
}

const handleKeywordChange = (value: string | number | null | undefined) => {
  updateKeyword(String(value ?? ''))
}

const handleSearch = () => {
  searchRecords()
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.record-page {
  min-height: 100vh;
}

.record-container {
  max-width: 1320px;
  margin: 20px auto;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.record-header h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.record-header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #909399;
}

.record-table :deep(.el-table__cell) {
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 260px;
}

.record-image {
  width: 72px;
  height: 72px;
  border-radius: 6px;
}

.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.detail-descriptions {
  margin-top: 4px;
}

.detail-image {
  width: 96px;
  height: 96px;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .record-container {
    margin: 12px;
    padding: 12px;
  }

  .record-header h2 {
    font-size: 20px;
  }

  .record-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .search-input {
    flex: 1;
  }

  .pagination-wrap {
    justify-content: center;
  }
}
</style>
