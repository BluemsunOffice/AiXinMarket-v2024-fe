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
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="studentId" label="学号" minWidth="180"></el-table-column>
      <el-table-column prop="name" label="姓名" minWidth="180"></el-table-column>
      <el-table-column prop="grade" label="年级" minWidth="180"> </el-table-column>
      <el-table-column prop="major" label="专业" minWidth="180">
        <template #default="{ row }">
          {{ formatMajor(row.major) }}
        </template>
      </el-table-column>
      <el-table-column prop="degree" label="学位" minWidth="180">
        <template #default="{ row }">
          {{ formatEdu(row.degree) }}
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

    <!-- 分页 -->
    <!-- 分页 -->
    <el-pagination
      background
      layout="->, sizes, prev, pager, next, jumper, total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
      class="my-pagination"
      :data-page-info="`${query.pageNum}/${Math.ceil(total / query.pageSize)}`"
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
          {{ getDisplayValue(item, fundStudentInfo) }}
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
            v-model:currentPage="currentPage2"
            pager-count="50"
            @current-change="handlePageChange2"
            :disabled="loadingStates.punish"
            id="pagenation3"
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
            v-model:currentPage="currentPage3"
            pager-count="50"
            @current-change="handlePageChange3"
            :disabled="loadingStates.scholarship"
            id="pagenation3"
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
            v-model:currentPage="currentPage"
            pager-count="50"
            @current-change="handlePageChange"
            :disabled="loadingStates.project"
            id="pagenation3"
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
import NavBar from './components/NavBar.vue'
import SearchBox from './components/SearchBox.vue'
import { onMounted, ref, provide, computed } from 'vue'
import {
  formatEthnicity,
  formatCollege,
  formatMajor,
  formatFundType,
  formatPunishType,
  formatAssistLevel,
  formatCampus,
  formatDegree,
  formatGender,
  formatMarry,
  formatPoliticalStatus,
  formatStudentStatus,
} from '@/constants/default'
import axios from 'axios'
import request from '@/api/request'
import { ElMessage } from 'element-plus'
import { getFieldDisplayValue, type FieldConfigType } from '@/utils/fieldConfig'

import { formatDay } from '@/utils/formatTime'

defineModel('fundStudentInfo', { type: Object, required: true })

// 字段配置
const fieldConfigs: FieldConfig[] = [
  { prop: 'studentId', label: '学号' },
  { prop: 'name', label: '姓名' },
  { prop: 'gender', label: '性别', formatter: formatGender },
  { prop: 'degree', label: '学历', formatter: formatDegree },
  { prop: 'status', label: '学生状态', formatter: formatStudentStatus },
  { prop: 'birthday', label: '生日', formatter: formatDay },
  { prop: 'grade', label: '年级' },
  { prop: 'nationality', label: '民族', formatter: formatEthnicity },
  { prop: 'college', label: '学院', formatter: formatCollege },
  { prop: 'major', label: '专业', formatter: formatMajor },
  { prop: 'admissionDate', label: '入学日期' },
  { prop: 'telephone', label: '手机号' },
  { prop: 'email', label: '邮箱' },
  { prop: 'apartment', label: '校区', formatter: formatCampus },
  { prop: 'dormitory', label: '公寓' },
  { prop: 'homeAddress', label: '家庭住址' },
  { prop: 'political', label: '政治面貌', formatter: formatPoliticalStatus },
  { prop: 'marry', label: '婚姻状态', formatter: formatMarry },
  { prop: 'fundType', label: '资助类型', formatter: formatAssistLevel },
]

// 提供数据
provide('userInfo', userInfo)

const tableData = ref([])
const selectedIds = ref([]) // 用来存储选中的学生ID
const handleSelectionChange = (selection) => {
  // 提取选中行的学号（ID）
  selectedIds.value = selection.map((student) => student.userId)
}
provide('selectedIds', selectedIds)

const query = ref({
  pageNum: 1,
  pageSize: 10,
})

const total = ref(0)

const loadings = ref({
  table: false,
})

const search = (params: any) => {
  getList(1, query.value.pageSize, params)
}

const objectToUrlParams = (obj: Record<string, any>): string => {
  return (
    '?' +
    Object.keys(obj)
      .map((key) => {
        if (Array.isArray(obj[key])) {
          return obj[key]
            .map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
        }
      })
      .join('&')
  )
}

const getList = async (pageNum = 1, pageSize = query.value.pageSize, queryData: any = {}) => {
  try {
    const params = {
      pageNum,
      pageSize,
      ...queryData,
    }
    loadings.value.table = true
    tableData.value = []
    const res = await request.get(
      'http://59.110.62.188:8080/grow/userInfo/listAll' + objectToUrlParams(params),
    )
    if (res.data.rows) {
      const { rows } = res.data
      query.value.pageNum = pageNum
      query.value.pageSize = pageSize
      tableData.value = rows
      total.value = res.data.total
    }
  } catch (err) {
    console.log(err)
  } finally {
    loadings.value.table = false
  }
}
const token = localStorage.getItem('token')
// 导出学生信息
const viewedUserId = ref('') // 创建一个响应式变量来存储查看的学生的userId

const handleViewDetail = async (row: any) => {
  viewedUserId.value = row.userId // 获取点击的学生的userId
  const res = await request.get(
    'http://59.110.62.188:8080/grow/userInfo/detail?userId=' + row.userId,
  )

  studentRow.value = res.data.data.fundUserInfoVo
  fundProjectVo.value = res.data.data.fundProjectVo
  fundScholarshipVo.value = res.data.data.fundScholarshipVo
  fundPunishVo.value = res.data.data.fundPunishVo
  // 更新总记录数
  totalNum.value = fundProjectVo.value.length
  totalNum2.value = fundPunishVo.value.length
  totalNum3.value = fundScholarshipVo.value.length
  // 重置页码
  currentPage.value = 1
  currentPage2.value = 1
  currentPage3.value = 1
  visible.value = true
}

const exportStudentInfo = async () => {
  try {
    const config = {
      headers: {
        Authorization: 'Bear ' + token,
        clientid: localStorage.getItem('client_id'),
        'Content-Type': 'application/json',
      },
    }
    const params = {
      userId: viewedUserId.value, // 使用查看的学生的userId
    }
    const response = await axios.get('http://59.110.62.188:8080/grow/userOwnInfo/exportAll', {
      ...config,
      params,
      responseType: 'blob',
    })

    const blob = new Blob([response.data], {
      type: 'application/vnd.ms-excel',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'student_info.xlsx' // 可以修改为从响应头中获取的文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出信息时出错:', error)
  }
}
const handleSizeChange = (val: number) => {
  getList(query.value.pageNum, val)
}

const handleCurrentChange = (val: number) => {
  getList(val, query.value.pageSize)
}

onMounted(() => {
  getList()
})

const studentRow = ref({})
// 个人处分
const fundPunishVo = ref([])
// 个人奖励
const fundScholarshipVo = ref([])
// 社会经历
const fundProjectVo = ref([])
const visible = ref(false)

// 分页器相关变量
const currentPage = ref(1) // 当前页码
const totalNum = ref(0) // 总记录数
const currentPage2 = ref(1) // 第二个分页器的当前页码
const totalNum2 = ref(0) // 第二个分页器的总记录数
const currentPage3 = ref(1) // 第三个分页器的当前页码
const totalNum3 = ref(0) // 第三个分页器的总记录数

// 定义分页器的每页显示条数
const pageSize = ref(8)

// 加载状态
const loadingStates = ref({
  project: false,
  punish: false,
  scholarship: false,
})

// 修改表格数据为计算属性，实现前端分页
const paginatedProjectVo = computed(() => {
  const start = (currentPage.value - 1) * 6
  return fundProjectVo.value.slice(start, start + 6)
})

const paginatedPunishVo = computed(() => {
  const start = (currentPage2.value - 1) * 6
  return fundPunishVo.value.slice(start, start + 6)
})

const paginatedScholarshipVo = computed(() => {
  const start = (currentPage3.value - 1) * 6
  return fundScholarshipVo.value.slice(start, start + 6)
})

// 定义分页器的页码变化处理函数（带错误处理）
const handlePageChange = async (val: number) => {
  try {
    loadingStates.value.project = true
    currentPage.value = val
  } catch (error) {
    console.error('页码切换失败:', error)
    ElMessage.error('加载社会经历数据失败')
  } finally {
    loadingStates.value.project = false
  }
}

const handlePageChange2 = async (val: number) => {
  try {
    loadingStates.value.punish = true
    currentPage2.value = val
  } catch (error) {
    console.error('页码切换失败:', error)
    ElMessage.error('加载处分数据失败')
  } finally {
    loadingStates.value.punish = false
  }
}

const handlePageChange3 = async (val: number) => {
  try {
    loadingStates.value.scholarship = true
    currentPage3.value = val
  } catch (error) {
    console.error('页码切换失败:', error)
    ElMessage.error('加载奖励数据失败')
  } finally {
    loadingStates.value.scholarship = false
  }
}

// 生日
const formatBirthday = (birthday: string): string => {
  return birthday.substring(0, 10)
}
</script>

<style scoped>
.student-file {
  width: 100%;
  max-width: 1400px;
  min-width: 300px;
  margin: 0 auto;
  padding: 0 clamp(10px, 1.5vw, 20px);
  box-sizing: border-box;
}

.student-table {
  width: 100%;
  height: auto;
  min-height: clamp(300px, 40vh, 600px);
  margin-top: clamp(15px, 2vh, 25px);
  overflow-x: auto;
  border-spacing: 0;
  border-collapse: collapse;
}

/* 优化表格行间距 */
:deep(.el-table__row) {
  height: clamp(45px, 6vh, 60px);
}

/* 优化表格单元格内边距 - 左右紧凑 */
:deep(.el-table__cell) {
  padding: clamp(6px, 0.8vh, 10px) clamp(4px, 0.5vw, 8px);
}

/* 表格字体使用vw单位 - 响应式 */
:deep(.el-table),
:deep(.el-table th > .cell),
:deep(.el-table td > .cell) {
  font-size: clamp(12px, 0.9vw, 14px);
}

/* 查看详情按钮字体与表格一致 */
:deep(.el-button--small) {
  font-size: clamp(12px, 0.9vw, 14px) !important;
}

.my-pagination {
  margin-top: clamp(15px, 2vh, 25px);
  width: 100%;
  overflow-x: auto;
  padding: clamp(5px, 0.8vh, 10px) 0;
}

/* 桌面端完整分页器样式 */
:deep(.el-pagination) {
  height: clamp(36px, 5vh, 44px);
  font-size: clamp(12px, 0.9vw, 14px);
}

/* 模态框移动端适配 */
:deep(.el-dialog) {
  width: 90% !important;
  max-width: 1000px !important;
}

:deep(.el-dialog__body) {
  padding: clamp(12px, 1.5vh, 20px) clamp(15px, 2vw, 25px);
  max-height: 70vh;
  overflow-y: auto;
}

/* 模态框标题 */
:deep(.el-dialog__title) {
  font-size: clamp(16px, 1.2vw, 20px);
}

/* 模态框描述列表适配 */
:deep(.el-descriptions__label),
:deep(.el-descriptions__content) {
  font-size: clamp(12px, 0.9vw, 14px);
}

/* 模态框标签页适配 */
:deep(.el-tabs__item) {
  font-size: clamp(12px, 0.9vw, 14px);
  padding: 0 clamp(10px, 1vw, 15px);
}

/* 模态框内表格适配 */
:deep(.el-dialog .el-table),
:deep(.el-dialog .el-table th > .cell),
:deep(.el-dialog .el-table td > .cell) {
  font-size: clamp(12px, 0.9vw, 14px);
}

/* 模态框内分页器适配 */
:deep(.el-dialog .el-pagination) {
  font-size: clamp(12px, 0.9vw, 14px);
  height: clamp(32px, 4.5vh, 40px);
}

/* 导出按钮适配 */
:deep(.el-dialog .el-button) {
  font-size: clamp(13px, 1vw, 16px);
  padding: clamp(8px, 1vh, 12px) clamp(15px, 1.5vw, 20px);
}

/* 移动设备适配 - 重点优化 */
@media screen and (max-width: 768px) {
  .student-file {
    padding: 0 clamp(4px, 1vw, 8px);
  }

  .student-table {
    margin-top: clamp(8px, 1.5vh, 12px);
    min-height: clamp(200px, 35vh, 350px);
  }

  /* 表格字体响应式 - 手机端调整到合适大小 */
  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(13px, 1.8vw, 15px);
  }

  /* 查看详情按钮字体与表格一致 */
  :deep(.el-button--small) {
    font-size: clamp(13px, 1.8vw, 15px) !important;
    padding: clamp(2px, 0.3vh, 3px) clamp(3px, 0.8vw, 5px) !important;
    min-height: clamp(22px, 3.5vh, 26px);
    line-height: 1.2;
  }

  /* 表格极致紧凑 */
  :deep(.el-table__cell) {
    padding: clamp(4px, 0.6vh, 6px) clamp(2px, 0.5vw, 4px) !important;
    max-width: clamp(65px, 16vw, 80px) !important;
  }

  :deep(.el-table__header-cell) {
    padding: clamp(6px, 0.9vh, 8px) clamp(2px, 0.5vw, 4px) !important;
    max-width: clamp(65px, 16vw, 80px) !important;
  }

  /* 操作列特殊处理 */
  :deep(.el-table__cell:last-child) {
    max-width: clamp(45px, 12vw, 55px) !important;
  }

  /* 手机端分页器 - 最简化：只显示 < 1/5 > */
  .my-pagination {
    margin-top: clamp(6px, 1vh, 10px);
    padding: clamp(3px, 0.5vh, 5px) 0;
  }

  /* 隐藏所有复杂元素 */
  :deep(.my-pagination .el-pagination__total),
  :deep(.my-pagination .el-pagination__sizes),
  :deep(.my-pagination .el-pagination__jump),
  :deep(.my-pagination .el-pagination__pager),
  :deep(.my-pagination .el-pagination__pager li) {
    display: none !important;
  }

  /* 只显示上一页和下一页，中间显示当前页/总页数 */
  :deep(.my-pagination .el-pagination__prev),
  :deep(.my-pagination .el-pagination__next) {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    width: clamp(28px, 8vw, 34px) !important;
    height: clamp(28px, 8vw, 34px) !important;
    min-width: clamp(28px, 8vw, 34px) !important;
    line-height: clamp(28px, 8vw, 34px) !important;
    margin: 0 clamp(4px, 1.2vw, 6px);
    font-size: clamp(12px, 2vw, 14px);
  }

  /* 添加自定义的页码显示 */
  :deep(.my-pagination .el-pagination::after) {
    content: attr(data-page-info);
    display: inline-block;
    margin: 0 clamp(6px, 1.5vw, 9px);
    font-size: clamp(12px, 2vw, 14px);
    color: #606266;
    vertical-align: middle;
  }

  /* 模态框移动端适配 */
  :deep(.el-dialog) {
    width: 95% !important;
    max-width: 95% !important;
    margin: clamp(5px, 1vh, 10px) !important;
  }

  :deep(.el-dialog__header) {
    padding: clamp(12px, 1.5vh, 18px) clamp(12px, 2vw, 18px) clamp(8px, 1vh, 12px);
  }

  :deep(.el-dialog__title) {
    font-size: clamp(16px, 2.5vw, 20px);
  }

  :deep(.el-dialog__body) {
    padding: clamp(10px, 1.2vh, 16px) clamp(10px, 1.5vw, 16px);
    max-height: 80vh;
  }

  /* 模态框描述列表移动端适配 */
  :deep(.el-descriptions) {
    font-size: clamp(12px, 1.8vw, 14px);
  }

  :deep(.el-descriptions__label),
  :deep(.el-descriptions__content) {
    font-size: clamp(12px, 1.8vw, 14px);
    padding: clamp(6px, 0.8vh, 10px) clamp(6px, 1vw, 10px);
  }

  /* 移动端描述列表单列显示 */
  @media screen and (max-width: 480px) {
    :deep(.el-descriptions__table) {
      width: 100%;
    }

    :deep(.el-descriptions__cell) {
      display: block;
      width: 100%;
      border: none;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    :deep(.el-descriptions__label) {
      width: 40% !important;
      display: inline-block;
      vertical-align: top;
      border: none;
    }

    :deep(.el-descriptions__content) {
      width: 60% !important;
      display: inline-block;
      vertical-align: top;
      border: none;
    }
  }

  /* 模态框标签页移动端适配 */
  :deep(.el-tabs__item) {
    font-size: clamp(12px, 1.8vw, 14px);
    padding: 0 clamp(8px, 1.2vw, 12px);
  }

  :deep(.el-tabs__nav-wrap) {
    overflow-x: auto;
  }

  /* 模态框内表格移动端适配 */
  :deep(.el-dialog .el-table),
  :deep(.el-dialog .el-table th > .cell),
  :deep(.el-dialog .el-table td > .cell) {
    font-size: clamp(11px, 1.6vw, 13px);
  }

  /* 模态框内分页器简化 */
  :deep(.el-dialog .el-pagination__total),
  :deep(.el-dialog .el-pagination__sizes),
  :deep(.el-dialog .el-pagination__jump) {
    display: none !important;
  }

  /* 导出按钮移动端适配 */
  :deep(.el-dialog .el-button) {
    font-size: clamp(12px, 1.8vw, 14px);
    padding: clamp(6px, 0.8vh, 10px) clamp(12px, 2vw, 16px);
    width: 100%;
    max-width: 200px;
    margin: 10px auto;
    display: block;
  }
}

/* iPhone 6/7/8 (375px) 特别优化 */
@media screen and (max-width: 375px) {
  .student-file {
    padding: 0 clamp(3px, 1vw, 5px);
  }

  .student-table {
    font-size: clamp(11px, 2.5vw, 13px);
    margin-top: clamp(6px, 1.2vh, 8px);
  }

  /* 更小的字体 - 但仍然可读 */
  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(12px, 2.2vw, 14px);
  }

  /* 查看详情按钮 */
  :deep(.el-button--small) {
    font-size: clamp(12px, 2.2vw, 14px) !important;
    padding: clamp(1px, 0.2vh, 2px) clamp(2px, 0.6vw, 3px) !important;
    min-height: clamp(20px, 3vh, 24px);
  }

  :deep(.el-table__cell) {
    padding: clamp(3px, 0.5vh, 4px) clamp(1px, 0.4vw, 2.5px) !important;
    max-width: clamp(55px, 15vw, 65px) !important;
  }

  :deep(.el-table__header-cell) {
    padding: clamp(4px, 0.7vh, 5px) clamp(1px, 0.4vw, 2.5px) !important;
    max-width: clamp(55px, 15vw, 65px) !important;
  }

  :deep(.el-table__cell:last-child) {
    max-width: clamp(35px, 10vw, 45px) !important;
  }

  /* 更小的分页器 */
  :deep(.my-pagination .el-pagination__prev),
  :deep(.my-pagination .el-pagination__next) {
    width: clamp(24px, 7vw, 28px) !important;
    height: clamp(24px, 7vw, 28px) !important;
    min-width: clamp(24px, 7vw, 28px) !important;
    line-height: clamp(24px, 7vw, 28px) !important;
    margin: 0 clamp(3px, 0.8vw, 4px);
    font-size: clamp(11px, 2.2vw, 13px);
  }

  :deep(.my-pagination .el-pagination::after) {
    font-size: clamp(11px, 2.2vw, 13px);
    margin: 0 clamp(4px, 1vw, 6px);
  }

  /* 模态框进一步适配 */
  :deep(.el-dialog) {
    width: 98% !important;
    margin: clamp(3px, 0.8vh, 5px) !important;
  }

  :deep(.el-dialog__title) {
    font-size: clamp(14px, 3vw, 18px);
  }

  :deep(.el-descriptions__label),
  :deep(.el-descriptions__content) {
    font-size: clamp(11px, 2.2vw, 13px);
    padding: clamp(4px, 0.6vh, 6px) clamp(4px, 0.8vw, 6px);
  }
}

/* 极小屏幕 */
@media screen and (max-width: 320px) {
  .student-file {
    padding: 0 clamp(2px, 0.8vw, 3px);
  }

  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(11px, 2.4vw, 13px);
  }

  /* 查看详情按钮 */
  :deep(.el-button--small) {
    font-size: clamp(11px, 2.4vw, 13px) !important;
    padding: clamp(1px, 0.2vh, 2px) clamp(1px, 0.4vw, 2px) !important;
    min-height: clamp(18px, 2.5vh, 22px);
  }

  :deep(.el-table__cell) {
    padding: clamp(2px, 0.4vh, 3px) clamp(1px, 0.3vw, 2px) !important;
    max-width: clamp(48px, 13vw, 55px) !important;
  }

  :deep(.el-table__header-cell) {
    padding: clamp(3px, 0.6vh, 4px) clamp(1px, 0.3vw, 2px) !important;
    max-width: clamp(48px, 13vw, 55px) !important;
  }

  :deep(.el-table__cell:last-child) {
    max-width: clamp(28px, 8vw, 35px) !important;
  }

  /* 最小分页器 */
  :deep(.my-pagination .el-pagination__prev),
  :deep(.my-pagination .el-pagination__next) {
    width: clamp(22px, 6vw, 26px) !important;
    height: clamp(22px, 6vw, 26px) !important;
    min-width: clamp(22px, 6vw, 26px) !important;
    line-height: clamp(22px, 6vw, 26px) !important;
    margin: 0 clamp(2px, 0.6vw, 3px);
    font-size: clamp(10px, 2.4vw, 12px);
  }

  :deep(.my-pagination .el-pagination::after) {
    font-size: clamp(10px, 2.4vw, 12px);
    margin: 0 clamp(3px, 0.8vw, 4px);
  }

  /* 模态框极致适配 */
  :deep(.el-dialog__title) {
    font-size: clamp(13px, 3.5vw, 16px);
  }

  :deep(.el-tabs__item) {
    font-size: clamp(10px, 2.2vw, 12px);
    padding: 0 clamp(6px, 1vw, 10px);
  }
}

/* 平板设备适配 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .student-file {
    padding: 0 clamp(8px, 1.2vw, 12px);
  }

  .student-table {
    font-size: clamp(12px, 1.4vw, 14px);
  }

  /* 平板字体 */
  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(12px, 1.4vw, 14px);
  }

  /* 查看详情按钮 */
  :deep(.el-button--small) {
    font-size: clamp(12px, 1.4vw, 14px) !important;
  }

  /* 平板显示简化分页器 */
  :deep(.my-pagination .el-pagination__pager) {
    display: flex !important;
  }

  /* 只显示部分页码 */
  :deep(.my-pagination .el-pagination__pager li.number) {
    display: none;
  }

  :deep(
    .my-pagination .el-pagination__pager li:first-child,
    .my-pagination .el-pagination__pager li:last-child,
    .my-pagination .el-pagination__pager li.active,
    .my-pagination .el-pagination__pager li.active + li,
    .my-pagination .el-pagination__pager li.active - li
  ) {
    display: inline-block !important;
  }
}

/* 桌面端恢复完整分页器 */
@media screen and (min-width: 1025px) {
  :deep(.my-pagination .el-pagination__total),
  :deep(.my-pagination .el-pagination__sizes),
  :deep(.my-pagination .el-pagination__jump),
  :deep(.my-pagination .el-pagination__pager) {
    display: inline-block !important;
  }

  :deep(.my-pagination .el-pagination__pager li) {
    display: inline-block !important;
  }

  /* 桌面端字体 */
  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(13px, 0.9vw, 15px);
  }

  /* 查看详情按钮 */
  :deep(.el-button--small) {
    font-size: clamp(13px, 0.9vw, 15px) !important;
  }
}

/* 横屏优化 */
@media screen and (orientation: landscape) and (max-width: 768px) {
  .student-table {
    font-size: clamp(12px, 1.6vw, 14px);
  }

  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(12px, 1.6vw, 14px);
  }

  :deep(.el-button--small) {
    font-size: clamp(12px, 1.6vw, 14px) !important;
  }

  :deep(.el-table__cell) {
    max-width: clamp(70px, 10vw, 80px) !important;
  }

  /* 横屏时模态框可以显示更多列 */
  :deep(.el-descriptions__cell) {
    display: table-cell !important;
  }
}

/* 高分辨率屏幕适配 */
@media screen and (min-width: 1920px) {
  .student-file {
    max-width: 1800px;
    padding: 0 clamp(20px, 2vw, 40px);
  }

  .student-table {
    font-size: clamp(15px, 0.9vw, 18px);
  }

  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(14px, 0.8vw, 16px);
  }

  /* 查看详情按钮 */
  :deep(.el-button--small) {
    font-size: clamp(14px, 0.8vw, 16px) !important;
  }
}

/* 超大屏幕适配 */
@media screen and (min-width: 2560px) {
  :deep(.el-table),
  :deep(.el-table th > .cell),
  :deep(.el-table td > .cell) {
    font-size: clamp(15px, 0.7vw, 18px);
  }

  /* 查看详情按钮 */
  :deep(.el-button--small) {
    font-size: clamp(15px, 0.7vw, 18px) !important;
  }
}

/* 打印样式 */
@media print {
  .student-file {
    width: 100%;
    padding: 0;
  }

  .my-pagination,
  #pagenation3,
  .exit-btn,
  .search-box {
    display: none !important;
  }
}
</style>
