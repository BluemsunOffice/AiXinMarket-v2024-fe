<template>
  <div class="search-box">
    <div class="input-row">
      <el-input
        v-model="searchData.grade"
        class="search-input"
        placeholder="年级"
        clearable
      />
      <el-input
        v-model="searchData.name"
        class="search-input"
        placeholder="名字"
        clearable
      />
    </div>
    <div class="input-row">
      <el-input
        v-model="searchData.studentId"
        class="search-input"
        placeholder="学号"
        clearable
      />
      <el-input
        v-model="searchData.major"
        class="search-input"
        placeholder="专业"
        clearable
      />
    </div>
    <div class="input-row">
      <el-select
        v-model="searchData.degree"
        class="search-input"
        placeholder="学位"
        clearable
      >
        <el-option label="本科" value="0" />
        <el-option label="研究生" value="1" />
      </el-select>
      <!-- 移除搜索未知专业的复选框 -->
    </div>
    <div class="button-row">
      <el-button @click="reset" type="primary" class="action-btn"
        >重置</el-button
      >
      <el-button @click="onSearch" type="primary" class="action-btn"
        >搜索</el-button
      >
      <el-tooltip
        :disabled="hasSelectedItems"
        effect="dark"
        content="请先在列表中选择要导出的条目"
        placement="top"
      >
        <el-button
          @click="exportInfo"
          type="primary"
          class="export-btn"
          :disabled="!hasSelectedItems"
        >
          导出信息
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, inject, ref, computed } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";

const authToken = localStorage.getItem("token");
const token = `Bearer ${authToken}`;
const emit = defineEmits(["search"]);

const searchData = reactive({
  grade: "",
  name: "",
  studentId: "",
  major: "",
  degree: "",
});

// 移除搜索未知专业的复选框相关变量
const selectedIds = ref(inject("selectedIds", []));

// 计算是否有选中的条目
const hasSelectedItems = computed(() => {
  return selectedIds.value && selectedIds.value.length > 0;
});

const reset = () => {
  searchData.grade = "";
  searchData.name = "";
  searchData.studentId = "";
  searchData.major = "";
  searchData.degree = "";
};

const onSearch = () => {
  // 创建一个新的对象，用于发送给后端
  const dataToSend: any = { ...searchData };

  // ========== 专业字段核心逻辑 ==========
  if (dataToSend.major === "未知") {
    // 1. 输入"未知" → 传空字符串
    dataToSend.major = "";
  } else if (dataToSend.major === "") {
    // 2. 输入框为空 → 删除字段，不传
    delete dataToSend.major;
  }
  // 3. 输入其他内容 → 保留原值，正常传

  // ========== 其他字段处理逻辑 ==========
  // 空字符串则删除字段，不传；有值则保留
  ["grade", "name", "studentId", "degree"].forEach((key) => {
    if (dataToSend[key] === "") {
      delete dataToSend[key];
    }
  });

  emit("search", dataToSend);
};

const exportInfo = async () => {
  // 如果没有选中的条目，提示用户并返回
  if (!hasSelectedItems.value) {
    ElMessage.warning("请先在列表中选择要导出的条目");
    return;
  }

  try {
    const config = {
      headers: {
        Authorization: token,
        clientid: localStorage.getItem("client_id"),
        "Content-Type": "application/json",
      },
    };
    const params = {
      userId: selectedIds.value,
    };
    const response = await axios.post(
      "http://59.110.62.188:8080/grow/userOwnInfo/exportOne",
      params,
      {
        ...config,
        responseType: "blob",
      }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers["content-disposition"];
    let fileName = "exported_file.xlsx";
    if (disposition) {
      const fileNameMatch = disposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1];
      }
    }

    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功！");
  } catch (error) {
    console.error("导出信息时出错:", error);
    ElMessage.error("导出失败，请重试");
  }
};
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

.input-row {
  display: flex;
  gap: clamp(6px, 1.2vh, 12px);
  width: 100%;
}

.search-input {
  flex: 1;
  min-width: 0;
}

.search-input :deep(.el-input__inner) {
  width: 100%;
  height: clamp(34px, 4.5vh, 42px);
  font-size: clamp(13px, 1.1vw, 15px);
  padding: 0 clamp(6px, 0.8vh, 10px);
  border-radius: clamp(3px, 0.4vh, 5px);
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

/* 桌面端 (大于1024px) */
@media screen and (min-width: 1024px) {
  .search-box {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .input-row {
    flex: 0 0 auto;
    width: auto;
  }

  .search-input {
    width: clamp(110px, 16vh, 160px);
  }

  .search-input :deep(.el-input__inner) {
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

  .input-row {
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
  .search-box {
    gap: clamp(8px, 1.5vh, 12px);
    padding: clamp(10px, 2vh, 16px);
  }

  .input-row {
    gap: clamp(8px, 1.8vh, 12px);
  }

  .search-input :deep(.el-input__inner) {
    height: clamp(36px, 5.5vh, 44px);
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
  .input-row {
    gap: clamp(6px, 1.5vh, 10px);
  }

  .search-input :deep(.el-input__inner) {
    height: clamp(38px, 6.5vh, 46px);
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

  .input-row {
    gap: clamp(5px, 1.2vh, 8px);
  }

  .search-input :deep(.el-input__inner) {
    height: clamp(36px, 7vh, 44px);
    font-size: clamp(10px, 4vw, 12px);
    padding: 0 clamp(4px, 1vh, 8px);
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

  .input-row {
    gap: clamp(4px, 0.8vh, 6px);
  }

  .search-input :deep(.el-input__inner) {
    height: clamp(32px, 7vh, 38px);
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

  .input-row {
    gap: 1vh;
  }

  .search-input :deep(.el-input__inner) {
    height: 3vh;
    font-size: 0.9vw;
    border-radius: 0.3vh;
    padding: 0 0.8vh;
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

  .search-input :deep(.el-input__inner) {
    border: 1.5px solid #007bff;
  }

  .export-btn {
    border-width: 1.5px;
  }
}
</style>