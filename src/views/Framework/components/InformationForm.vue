<template>
  <div class="form-container" v-if="studentInfo">
    <div v-for="(field, fieldIndex) in fieldConfig" :key="fieldIndex" class="form-item">
      <label>
        <font-awesome-icon
          :icon="`fa-solid fa-${field.icon}`"
          style="color: #3498db; margin-right: 12px"
        />
        {{ field.label }}：
      </label>
      <span>{{ getFieldDisplayValue(field, studentInfo) }}</span>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  formatCollege,
  formatEthnicity,
  formatMajor,
  formatDegree,
} from '../../../constants/default'
import { userApi, type FundUserInfo } from '@/api/user.api'
import { formatDay } from '@/utils/formatTime'
import { type FieldConfigType, getFieldDisplayValue } from '@/utils/fieldConfig'
// 定义父组件传递的事件
const emit = defineEmits(['roleName'])

// 使用 defineModel 定义响应式数据
const studentInfo = defineModel<FundUserInfo>({
  default: () => ({
    name: '未知',
    studentId: '未知',
    degree: '未知',
    grade: '未知',
    birthday: '未知',
    admissionDate: '未知',
    college: '未知',
    major: '未知',
    nationality: '未知',
    dormitory: '未知',
    apartment: '未知',
    homeAddress: '未知',
  }),
  required: false,
})

const fieldConfig = [
  { prop: 'name', label: '姓名', formatter: null, icon: 'user' },
  { prop: 'studentId', label: '学号', formatter: null, icon: 'id-card' },
  {
    prop: 'degree',
    label: '学位',
    formatter: formatDegree,
    icon: 'graduation-cap',
  },
  { prop: 'grade', label: '年级', formatter: null, icon: 'calendar-alt' },
  {
    prop: 'birthday',
    label: '生日',
    formatter: formatDay,
    icon: 'birthday-cake',
  },
  {
    prop: 'admissionDate',
    label: '入学时间',
    formatter: formatDay,
    icon: 'university',
  },
  {
    prop: 'college',
    label: '学院',
    formatter: formatCollege,
    icon: 'building',
  },
  { prop: 'major', label: '专业', formatter: formatMajor, icon: 'book' },
  { prop: 'apartment', label: '公寓', formatter: null, icon: 'home' },
  { prop: 'dormitory', label: '宿舍', formatter: null, icon: 'door-open' },
  {
    prop: 'nationality',
    label: '民族',
    formatter: formatEthnicity,
    icon: 'users',
  },
  {
    prop: 'homeAddress',
    label: '家庭住址',
    formatter: null,
    icon: 'map-marker-alt',
  },
]

// 获取学生信息的函数
const fetchStudentInfo = async () => {
  try {
    const { data } = await userApi.getCurrentUser()
    studentInfo.value = data.fundUserInfo
    emit('roleName', data.roleGroup)
  } catch (error) {
    console.error('获取学生信息失败:', error)
  }
}

// 在组件挂载时调用
onMounted(() => {
  fetchStudentInfo()
})
</script>

<style scoped>
/* 设置表单容器 */
.form-container {
  background-color: #fff;
  color: #333;
  width: 100%;
  height: 100%;
  padding: 0px 0px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-radius: 8px;
  background-color: #fafbfc;
  border: 1px solid #f0f0f0;
  transition: all 0.25s ease;
}

.form-item:hover {
  background-color: #f7f9fc;
  border-color: #e0e6f0;
  transform: translateY(-2px);
}

.form-item label {
  height: 100%;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  line-height: 1.5;
  display: flex;
  align-items: center;
  min-width: 100px;
  flex-shrink: 0;
}

.form-item span {
  height: 100%;
  font-size: 15px;
  display: flex;
  align-items: center;
  color: #1a1a1a;
  font-weight: 400;
  line-height: 1.5;
  word-break: break-word;
  flex: 1;
}

/* 加载中的提示 */
.loading {
  text-align: center;
  font-size: 1.34vw;
  color: #999;
}

/* 响应式*/
@media (max-width: 768px) {
  .form-container {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0;
  }

  .form-item {
    max-width: 100%;
    padding: 12px;
    gap: 6px;
  }

  .form-item label {
    min-width: 0;
    font-size: 13px;
  }

  .form-item span {
    font-size: 14px;
  }
}
</style>
