<template>
  <div class="header-container">
    <div class="title-wrapper">
      <h1 class="title">个人成长档案</h1>
    </div>
    <button class="return-btn" @click="showConfirmDialog">
      <span class="btn-icon">&lt;</span>
      <span class="btn-text">返回首页</span>
    </button>

    <!-- 确认弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      width="400px"
      :close-on-click-modal="false"
      center
    >
      <div class="dialog-content">
        <el-icon :size="40" color="#3498db"><QuestionFilled /></el-icon>
        <p>确定要返回首页吗？</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" class="cancel-btn"
            >取消</el-button
          >
          <el-button type="primary" @click="handleReturn" class="confirm-btn">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { QuestionFilled } from "@element-plus/icons-vue";
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, ElDialog } from "element-plus";

const router = useRouter();
const dialogVisible = ref(false);

const showConfirmDialog = () => {
  dialogVisible.value = true;
};

const handleReturn = () => {
  dialogVisible.value = false;
  router.push("/framework");
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  /* border-radius: 12px; */
  height: 3.8vh;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.return-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  color: #3498db;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
}

.return-btn:hover {
  background: #3498db;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 弹窗样式 */
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
}

.dialog-content p {
  margin: 0;
  font-size: 16px;
  color: #606266;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
}

.cancel-btn {
  padding: 8px 20px;
  border-radius: 6px;
  background: #f0f2f5;
  border: none;
  color: #606266;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #606266;
}

.confirm-btn {
  padding: 8px 20px;
  border-radius: 6px;
  background: #3498db;
  border: none;
  transition: all 0.3s;
}

.confirm-btn:hover {
  background: #2980b9;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  /* border-radius: 12px; */
  position: relative; /* 添加相对定位 */
}

.title-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap; /* 防止文字换行 */
}

/* 保持返回按钮的样式不变 */
.return-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 5px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  color: #3498db;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
  margin-left: auto; /* 确保按钮靠右 */
}

/* 响应式设计调整 */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .title-wrapper {
    position: static;
    transform: none;
    order: -1;
  }

  .title {
    font-size: 20px;
  }

  .return-btn {
    padding: 8px 16px;
    font-size: 14px;
    margin-left: 0;
  }
}
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .title {
    font-size: 20px;
  }

  .return-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  :deep(.el-dialog) {
    width: 90% !important;
  }
}
.el-tabs__nav-next,
.el-tabs__nav-prev {
  color: var(--el-text-color-secondary);
  cursor: pointer;
  font-size: 12px;
  line-height: 60px;
  position: absolute;
  text-align: center;
  width: 20px;
}

@media (min-width: 1300px) {
  .header-container {
    height: 4.8vh;
  }

  .title {
    font-size: 26px;
  }
}
</style>
