<template>
  <div class="search-box">
    <el-form :model="searchForm" class="search-form" label-width="auto">
      <el-form-item class="search-form-item" prop="grade">
        <el-input
          v-model="searchForm.grade"
          class="search-input"
          placeholder="请输入年级"
          clearable
        />
      </el-form-item>
      <el-form-item class="search-form-item" prop="name">
        <el-input
          v-model="searchForm.name"
          class="search-input"
          placeholder="请输入名字"
          clearable
        />
      </el-form-item>
      <el-form-item class="search-form-item" prop="studentId">
        <el-input
          v-model="searchForm.studentId"
          class="search-input"
          placeholder="请输入学号"
          clearable
        />
      </el-form-item>
      <el-form-item class="search-form-item" prop="major">
        <el-input v-model="searchForm.major" class="search-input" placeholder="专业" clearable />
      </el-form-item>
      <el-form-item class="search-form-item" prop="degree">
        <el-select v-model="searchForm.degree" class="search-input" placeholder="学位" clearable>
          <el-option label="本科" value="0" />
          <el-option label="研究生" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="button-row">
      <el-button @click="resetSearchForm" type="primary" class="action-btn">
        <font-awesome-icon
          icon="fa-solid fa-arrow-rotate-right"
          style="color: #ffffff; margin-right: 4px"
        />
        重置
      </el-button>
      <el-button @click="submitSearch" type="primary" class="action-btn">
        <font-awesome-icon
          icon="fa-solid fa-magnifying-glass"
          style="color: #ffffff; margin-right: 4px"
        />
        搜索
      </el-button>
      <el-tooltip
        :disabled="hasSelectedItems"
        effect="dark"
        content="请先在列表中选择要导出的条目"
        placement="top"
      >
        <el-button
          @click="openExportPreview"
          type="primary"
          class="export-btn"
          :disabled="!hasSelectedItems"
        >
          <font-awesome-icon
            icon="fa-solid fa-download"
            style="color: #ffffff; margin-right: 4px"
          />
          导出信息
        </el-button>
      </el-tooltip>
    </div>

    <el-dialog v-model="exportPreviewVisible" title="导出预览" width="800px" :append-to-body="true">
      <el-table :data="selectedStudentRows" border max-height="420" class="preview-table">
        <el-table-column prop="studentId" label="学号" min-width="160" />
        <el-table-column prop="name" label="姓名" min-width="140" />
        <el-table-column prop="grade" label="年级" min-width="120" />
        <el-table-column prop="major" label="专业" min-width="180" />
        <el-table-column label="学位" min-width="120">
          <template #default="{ row }">
            {{ formatDegreeText(row.degree) }}
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <div class="preview-footer">
          <span class="preview-count">共 {{ selectedStudentRows.length }} 条待导出</span>
          <div>
            <el-button @click="exportPreviewVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmExport" :disabled="!selectedStudentRows.length"
              >确认导出</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '@/stores/student-store'

const studentStore = useStudentStore()
const exportPreviewVisible = ref(false)

const { searchForm, hasSelectedItems, selectedStudentRows } = storeToRefs(studentStore)

const { resetSearchForm, submitSearch, exportSelectedStudentInfo } = studentStore

const formatDegreeText = (degree?: string) => {
  if (degree === '0') {
    return '本科'
  }
  if (degree === '1') {
    return '研究生'
  }
  return degree || '-'
}

const openExportPreview = () => {
  if (!hasSelectedItems.value) {
    return
  }
  exportPreviewVisible.value = true
}

const confirmExport = async () => {
  const ids = selectedStudentRows.value.map((student) => student.userId)
  await exportSelectedStudentInfo(ids)
  exportPreviewVisible.value = false
}
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: clamp(6px, 1.2vh, 14px);
  padding: clamp(10px, 1.8vh, 18px);
  background-color: #f0f4f8;
  border-radius: clamp(5px, 0.8vh, 8px);
  width: 100%;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(6px, 1.2vh, 12px);
  width: 100%;
}

.search-form-item {
  flex: 1 1 calc(50% - clamp(3px, 0.6vh, 6px));
  min-width: 0;
  margin-bottom: 0;
}

.search-input {
  width: 100%;
  min-width: 0;
}

.search-input :deep(.el-input__wrapper),
.search-input :deep(.el-select__wrapper) {
  width: 100%;
  height: clamp(34px, 4.5vh, 42px);
  padding: 0 clamp(6px, 0.8vh, 10px);
  border-radius: clamp(3px, 0.4vh, 5px);
}

.search-input :deep(.el-input__inner),
.search-input :deep(.el-select__selected-item),
.search-input :deep(.el-select__placeholder) {
  font-size: clamp(13px, 1.1vw, 15px);
}

.search-input :deep(.el-input__inner::placeholder) {
  font-size: clamp(12px, 1vw, 14px);
}

.button-row {
  display: flex;
  gap: clamp(6px, 1.2vh, 12px);
  width: 100%;
  margin-top: clamp(4px, 0.8vh, 8px);
}

.action-btn,
.export-btn {
  flex: 1;
  height: clamp(34px, 4.5vh, 42px);
  font-size: clamp(13px, 1.1vw, 15px);
  padding: 0 clamp(10px, 1.2vh, 16px);
  border-radius: clamp(3px, 0.4vh, 5px);
  white-space: nowrap;
  min-width: 0;
}

.export-btn {
  background-color: #67c23a;
  border-color: #67c23a;
}

.export-btn:hover {
  background-color: #5daf34;
  border-color: #5daf34;
}

/* 禁用状态样式 */
.export-btn:disabled {
  background-color: #c2c2c2;
  border-color: #c2c2c2;
  color: #999;
  cursor: not-allowed;
}

.export-btn:disabled:hover {
  background-color: #c2c2c2;
  border-color: #c2c2c2;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.preview-count {
  color: #606266;
  font-size: 14px;
}

/* 桌面端 (大于1024px) */
@media screen and (min-width: 1024px) {
  .search-box {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .search-form {
    flex: 0 0 auto;
    width: auto;
  }

  .search-form-item {
    flex: 0 0 auto;
    width: clamp(110px, 16vh, 160px);
  }

  .search-input {
    width: 100%;
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    height: clamp(34px, 4.5vh, 42px);
    border-radius: clamp(3px, 0.4vh, 5px);
  }

  .button-row {
    margin-left: auto;
    width: auto;
    margin-top: 0;
    flex: 0 0 auto;
    justify-content: flex-end;
  }

  .action-btn,
  .export-btn {
    width: auto;
    min-width: clamp(70px, 8vh, 90px);
    height: clamp(34px, 4.5vh, 42px);
  }
}

/* 平板端 (768px - 1023px) */
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .search-box {
    flex-direction: column;
  }

  .search-form {
    gap: clamp(8px, 1.5vh, 14px);
  }

  .button-row {
    gap: clamp(8px, 1.5vh, 14px);
    margin-top: clamp(6px, 1vh, 10px);
  }

  .action-btn,
  .export-btn {
    font-size: clamp(12px, 1.3vw, 14px);
  }
}

/* 移动端 (480px - 767px) - 一行两个输入框 */
@media screen and (max-width: 767px) {
  .preview-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .preview-count {
    font-size: 13px;
  }

  .search-box {
    gap: clamp(8px, 1.5vh, 12px);
    padding: clamp(10px, 2vh, 16px);
  }

  .search-form {
    gap: clamp(8px, 1.8vh, 12px);
  }

  .search-form-item {
    flex-basis: calc(50% - clamp(4px, 0.9vh, 6px));
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    height: clamp(36px, 5.5vh, 44px);
  }

  .search-input :deep(.el-input__inner),
  .search-input :deep(.el-select__selected-item),
  .search-input :deep(.el-select__placeholder) {
    font-size: clamp(12px, 1.3vw, 14px);
  }

  .button-row {
    gap: clamp(8px, 1.8vh, 12px);
    margin-top: clamp(6px, 1vh, 10px);
  }

  .action-btn,
  .export-btn {
    height: clamp(36px, 5.5vh, 44px);
    font-size: clamp(12px, 1.3vw, 14px);
    padding: 0 clamp(8px, 1.5vh, 12px);
  }
}

/* 小屏幕手机 (小于480px) - 一行两个输入框，按钮一行三个 */
@media screen and (max-width: 479px) {
  .search-form {
    gap: clamp(6px, 1.5vh, 10px);
  }

  .search-form-item {
    flex-basis: calc(50% - clamp(3px, 0.8vh, 5px));
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    height: clamp(38px, 6.5vh, 46px);
  }

  .search-input :deep(.el-input__inner),
  .search-input :deep(.el-select__selected-item),
  .search-input :deep(.el-select__placeholder) {
    font-size: clamp(11px, 3.5vw, 13px);
  }

  .search-input :deep(.el-input__inner::placeholder) {
    font-size: clamp(10px, 3vw, 12px);
  }

  .button-row {
    display: flex;
    flex-wrap: nowrap;
    gap: clamp(6px, 1.5vh, 10px);
    margin-top: clamp(8px, 1.5vh, 12px);
  }

  .action-btn,
  .export-btn {
    height: clamp(38px, 6.5vh, 46px);
    font-size: clamp(11px, 3.5vw, 13px);
    padding: 0 clamp(6px, 1.2vh, 10px);
    flex: 1;
    min-width: 0;
  }

  /* 确保按钮文字在小屏幕上不会太长 */
  .action-btn span,
  .export-btn span {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* 超小屏幕手机 (小于360px) */
@media screen and (max-width: 359px) {
  .search-box {
    padding: clamp(8px, 1.5vh, 12px);
    gap: clamp(5px, 1vh, 8px);
  }

  .search-form {
    gap: clamp(5px, 1.2vh, 8px);
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    height: clamp(36px, 7vh, 44px);
    padding: 0 clamp(4px, 1vh, 8px);
  }

  .search-input :deep(.el-input__inner),
  .search-input :deep(.el-select__selected-item),
  .search-input :deep(.el-select__placeholder) {
    font-size: clamp(10px, 4vw, 12px);
  }

  .search-input :deep(.el-input__inner::placeholder) {
    font-size: clamp(9px, 3.5vw, 11px);
  }

  .button-row {
    gap: clamp(5px, 1.2vh, 8px);
    margin-top: clamp(6px, 1.2vh, 10px);
  }

  .action-btn,
  .export-btn {
    height: clamp(36px, 7vh, 44px);
    font-size: clamp(10px, 4vw, 12px);
    padding: 0 clamp(4px, 1vh, 8px);
  }
}

/* 横屏模式优化 */
@media screen and (orientation: landscape) and (max-height: 600px) {
  .search-box {
    padding: clamp(5px, 0.8vh, 8px);
    gap: clamp(4px, 0.8vh, 6px);
  }

  .search-form {
    gap: clamp(4px, 0.8vh, 6px);
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    height: clamp(32px, 7vh, 38px);
  }

  .search-input :deep(.el-input__inner),
  .search-input :deep(.el-select__selected-item),
  .search-input :deep(.el-select__placeholder) {
    font-size: clamp(11px, 2vw, 13px);
  }

  .button-row {
    gap: clamp(4px, 0.8vh, 6px);
    margin-top: clamp(3px, 0.6vh, 5px);
  }

  .action-btn,
  .export-btn {
    height: clamp(32px, 7vh, 38px);
    font-size: clamp(11px, 2vw, 13px);
  }
}

/* 超大屏幕 (大于1920px) */
@media screen and (min-width: 1920px) {
  .search-box {
    padding: 1.2vh;
    gap: 1vh;
    border-radius: 0.6vh;
  }

  .search-form {
    gap: 1vh;
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    height: 3vh;
    border-radius: 0.3vh;
    padding: 0 0.8vh;
  }

  .search-input :deep(.el-input__inner),
  .search-input :deep(.el-select__selected-item),
  .search-input :deep(.el-select__placeholder) {
    font-size: 0.9vw;
  }

  .search-input :deep(.el-input__inner::placeholder) {
    font-size: 0.85vw;
  }

  .button-row {
    gap: 1vh;
    margin-top: 0.5vh;
  }

  .action-btn,
  .export-btn {
    height: 3vh;
    font-size: 0.9vw;
    border-radius: 0.3vh;
    padding: 0 1vh;
  }

  .search-input {
    width: 14vh;
  }
}

/* 按钮文字溢出保护 */
@media screen and (max-width: 320px) {
  .action-btn,
  .export-btn {
    padding: 0 4px;
    font-size: 10px;
  }

  /* 在超小屏幕上，如果文字太长，使用省略号 */
  .action-btn span,
  .export-btn span {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .search-box {
    background-color: #e6edf5;
    border: 1px solid #007bff;
  }

  .search-input :deep(.el-input__wrapper),
  .search-input :deep(.el-select__wrapper) {
    border: 1.5px solid #007bff;
  }

  .export-btn {
    border-width: 1.5px;
  }
}
</style>
