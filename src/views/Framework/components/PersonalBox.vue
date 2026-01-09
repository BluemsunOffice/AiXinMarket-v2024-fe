<template>
  <div class="user-card-horizontal">
    <!-- 头像上传区域 -->
    <div class="avatar-section">
      <div class="avatar-container" @click="triggerFileInput">
        <img v-if="avatarUrl" :src="avatarUrl" alt="用户头像" class="avatar" />
        <div v-else class="avatar-placeholder">
          {{ defaultAvatarText }}
        </div>
        <div class="avatar-overlay">
          <span class="upload-icon">更换头像</span>
        </div>
      </div>
      <input
        type="file"
        ref="fileInput"
        @change="handleAvatarUpload"
        accept="image/*"
        class="file-input"
        hidden
      />
    </div>

    <!-- 用户信息区域 -->
    <div class="info-section">
      <div class="info-row">
        <span class="info-label">学号：</span>
        <span class="info-value">{{ studentId }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">校区：</span>
        <span class="info-value">{{ campus }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">角色：</span>
        <span class="role-badge">{{ role }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

// 定义Props接口
interface Props {
  studentId?: string;
  campus?: string;
  role?: string;
  avatarUrl?: string;
}

const studentId = defineModel("studentId", {
  default: "-" as string,
  required: false,
});
const campus = defineModel("campus", {
  default: "-" as string,
  required: false,
});
const role = defineModel("role", {
  default: "学生" as string,
  required: false,
});
const avatarUrl = defineModel("avatarUrl", {
  default: "" as string | null,
  required: false,
});

// 定义Emits
const emit =
  defineEmits<
    (e: "avatar-changed", payload: { file: File; dataUrl: string }) => void
  >();

// 响应式数据
const localAvatarUrl = ref<string>(avatarUrl.value || "");
const fileInput = ref<HTMLInputElement | null>(null);

// 计算属性
const defaultAvatarText = computed(() => {
  // 根据角色生成默认头像文字
  return campus.value.charAt(0);
});

// 方法
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // 验证文件类型
  if (!file.type.startsWith("image/")) {
    alert("请选择图片文件");
    return;
  }

  // 验证文件大小（限制10MB）
  if (file.size > 10 * 1024 * 1024) {
    alert("图片大小不能超过10MB");
    return;
  }

  // 创建本地预览URL
  const reader = new FileReader();
  reader.onload = (e) => {
    const result = e.target?.result as string;
    localAvatarUrl.value = result;

    // 触发上传事件给父组件
    emit("avatar-changed", {
      file,
      dataUrl: result,
    });
  };
  reader.readAsDataURL(file);

  // 清空input，以便再次选择同一文件
  target.value = "";
};

// 监听props.avatarUrl变化
watch(
  () => avatarUrl.value,
  (newVal) => {
    localAvatarUrl.value = newVal;
  },
);

// 如果需要暴露给父组件使用的方法，可以使用defineExpose
defineExpose({
  triggerFileInput,
});
</script>

<style scoped>
.user-card-horizontal {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}

/* 头像区域样式 */
.avatar-section {
  flex-shrink: 0;
}

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #f0f0f0;
}

.avatar-container:hover {
  transform: scale(1.05);
  border-color: #409eff;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 28px;
  font-weight: bold;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-icon {
  color: white;
  font-size: 12px;
  font-weight: 500;
}

/* 信息区域样式 */
.info-section {
  flex: 1;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  font-size: 14px;
  min-width: 40px;
  font-weight: 400;
}

.info-value {
  color: #333;
  font-size: 15px;
  font-weight: 500;
}

.role-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e8f4ff;
  color: #409eff;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .user-card-horizontal {
    gap: 15px;
    padding: 12px;
  }

  .avatar-container {
    width: 70px;
    height: 70px;
  }

  .info-label {
    font-size: 13px;
  }

  .info-value {
    font-size: 14px;
  }
}
</style>
