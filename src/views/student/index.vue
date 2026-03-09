<template>
  <div class="student-file">
    <SearchBox />
    <el-table
      :data="tableData"
      row-key="userId"
      class="student-table"
      @selection-change="handleSelectionChange"
      v-loading="loadings.table"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true" />
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
        <el-tab-pane v-for="tab in detailTabConfigs" :key="tab.section" :label="tab.label">
          <el-table :data="tab.rows" height="350">
            <el-table-column
              v-for="column in tab.columns"
              :key="column.key"
              :prop="column.prop"
              :label="column.label"
              :min-width="column.minWidth"
            >
              <template #default="{ row }" v-if="column.formatter">
                {{ column.formatter(row) }}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="tab.total"
            :page-size="detailPageSize"
            :current-page="tab.currentPage"
            pager-count="50"
            @current-change="setDetailPage(tab.section, $event)"
            class="pagination"
          />
        </el-tab-pane>
        <el-button
          style="display: block; margin: 0px auto; padding: 10px 20px"
          :loading="exportingStudentInfo"
          @click="exportStudentInfo()"
        >
          <font-awesome-icon
            icon="fa-solid fa-download"
            style="color: rgb(116, 192, 252); margin-right: 4px"
          />
          导出信息
        </el-button>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SearchBox from './components/search-box.vue'
import { onActivated, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '@/stores/student-store'

const studentStore = useStudentStore()

const {
  getDisplayValue,
  handleSelectionChange,
  handleViewDetail,
  closeDialog,
  exportStudentInfo,
  handleSizeChange,
  handleCurrentChange,
  setDetailPage,
  initPage,
} = studentStore

const {
  fieldConfigs,
  tableColumns,
  tableData,
  query,
  total,
  loadings,
  exportingStudentInfo,
  studentRow,
  visible,
  detailPageSize,
  detailTabConfigs,
} = storeToRefs(studentStore)

onMounted(() => {
  void initPage()
})

onActivated(() => {
  if (!tableData.value.length) {
    void initPage()
  }
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
