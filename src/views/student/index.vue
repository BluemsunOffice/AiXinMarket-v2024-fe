<template>
  <NavBar />

  <div class="student-file">
    <SearchBox @search="search" />

    <el-table
      :data="tableData"
      class="student-table"
      @selection-change="handleSelectionChange"
      v-loading="loadings.table"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="column in tableColumns"
        :key="column.key"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
      >
        <template #default="{ row }" v-if="column.formatter">
          {{ column.formatter(row[column.prop], row) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleViewDetail(row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="->, sizes, prev, pager, next, jumper, total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
      class="my-pagination"
    />

    <el-dialog
      v-model="visible"
      title="学生信息"
      width="1000"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-descriptions :column="4" border class="custom-descriptions">
        <el-descriptions-item v-for="item in fieldConfigs" :key="item.prop" :label="item.label">
          {{ getDisplayValue(item, studentRow) }}
        </el-descriptions-item>
      </el-descriptions>
      <el-tabs type="border-card" style="margin-top: 20px">
        <el-tab-pane label="个人处分">
          <el-table :data="paginatedPunishVo" height="350">
            <el-table-column prop="category" label="类别" minWidth="180">
              <template #default="{ row }">
                {{ formatPunishType(+row.category) }}
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" minWidth="180"></el-table-column>
            <el-table-column prop="punishTime" label="处分时间" minWidth="180"></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalNum2"
            :page-size="6"
            v-model:current-page="currentPage2"
            pager-count="50"
            @current-change="handlePageChange2"
            class="pagination"
          />
        </el-tab-pane>
        <el-tab-pane label="个人奖励">
          <el-table :data="paginatedScholarshipVo" height="350">
            <el-table-column prop="category" label="类型" minWidth="180">
              <template #default="{ row }">
                {{ formatFundType(+row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="grantDate" label="授予日期" minWidth="180"></el-table-column>
            <el-table-column prop="amount" label="金额" minWidth="180"></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalNum3"
            :page-size="6"
            v-model:current-page="currentPage3"
            pager-count="50"
            @current-change="handlePageChange3"
            class="pagination"
          />
        </el-tab-pane>
        <el-tab-pane label="社会经历">
          <el-table :data="paginatedProjectVo" height="350">
            <el-table-column prop="startDate" label="开始日期" minWidth="180"></el-table-column>
            <el-table-column prop="endDate" label="结束日期" minWidth="180"></el-table-column>
            <el-table-column prop="experience" label="经历描述" minWidth="180"></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalNum"
            :page-size="6"
            v-model:current-page="currentPage"
            pager-count="50"
            @current-change="handlePageChange"
            class="pagination"
          />
        </el-tab-pane>
        <el-button
          style="display: block; margin: 0px auto; padding: 10px 20px"
          @click="exportStudentInfo()"
          >导出信息</el-button
        >
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/nav-bar.vue'
import SearchBox from './components/search-box.vue'
import { onMounted, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { formatFundType, formatPunishType } from '@/constants/default'
import { useStudentStore } from '@/stores/student-store'

const studentStore = useStudentStore()

const {
  getDisplayValue,
  search,
  handleSelectionChange,
  handleViewDetail,
  closeDialog,
  exportStudentInfo,
  handleSizeChange,
  handleCurrentChange,
  handlePageChange,
  handlePageChange2,
  handlePageChange3,
  getList,
} = studentStore

const {
  tableColumns,
  fieldConfigs,
  tableData,
  selectedIds,
  query,
  total,
  loadings,
  studentRow,
  visible,
  totalNum,
  totalNum2,
  totalNum3,
  currentPage,
  currentPage2,
  currentPage3,
  paginatedProjectVo,
  paginatedPunishVo,
  paginatedScholarshipVo,
} = storeToRefs(studentStore)

provide('selectedIds', selectedIds)

onMounted(() => {
  getList()
})
</script>

<style scoped>
.student-file {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(12px, 2vw, 20px);
}

.student-table {
  width: 100%;
  margin-top: 16px;
}

:deep(.el-table__row) {
  height: 50px;
}

:deep(.el-table__cell) {
  padding: 10px 8px;
}

:deep(.el-table),
:deep(.el-table th > .cell),
:deep(.el-table td > .cell) {
  font-size: 14px;
}

:deep(.el-button--small) {
  font-size: 14px !important;
}

.my-pagination {
  margin-top: 16px;
}

:deep(.el-pagination) {
  font-size: 14px;
}

:deep(.el-dialog) {
  width: min(1000px, 92vw) !important;
}

:deep(.el-dialog__body) {
  padding: 16px 20px;
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-dialog__title) {
  font-size: 18px;
}

:deep(.el-descriptions__label),
:deep(.el-descriptions__content) {
  font-size: 14px;
}

:deep(.el-tabs__item) {
  font-size: 14px;
}

:deep(.el-dialog .el-table),
:deep(.el-dialog .el-table th > .cell),
:deep(.el-dialog .el-table td > .cell) {
  font-size: 13px;
}

:deep(.el-dialog .el-button) {
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .student-file {
    padding: 0 8px;
  }

  .student-table {
    margin-top: 12px;
  }

  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: 13px;
  }

  :deep(.el-button--small) {
    font-size: 13px !important;
  }

  :deep(.el-table__cell) {
    padding: 8px 6px;
  }

  .my-pagination {
    margin-top: 12px;
  }

  :deep(.my-pagination .el-pagination__total),
  :deep(.my-pagination .el-pagination__sizes),
  :deep(.my-pagination .el-pagination__jump) {
    display: none !important;
  }

  :deep(.el-dialog) {
    width: 96vw !important;
  }

  :deep(.el-dialog__body) {
    padding: 12px;
    max-height: 80vh;
  }

  :deep(.el-descriptions__label),
  :deep(.el-descriptions__content) {
    font-size: 12px;
    padding: 8px;
  }

  :deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 10px;
  }

  :deep(.el-dialog .el-table),
  :deep(.el-dialog .el-table th > .cell),
  :deep(.el-dialog .el-table td > .cell) {
    font-size: 12px;
  }

  :deep(.el-dialog .el-button) {
    font-size: 13px;
    width: 100%;
    max-width: 200px;
    margin: 10px auto;
    display: block;
  }
}

@media print {
  .my-pagination,
  .exit-btn,
  .search-box {
    display: none !important;
  }
}
</style>
