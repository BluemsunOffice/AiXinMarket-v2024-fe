import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { getFieldDisplayValue, type FieldConfigType } from '@/utils/field-config'
import {
  formatEthnicity,
  formatCollege,
  formatMajor,
  formatAssistLevel,
  formatCampus,
  formatDegree,
  formatGender,
  formatMarry,
  formatPoliticalStatus,
  formatStudentStatus,
} from '@/constants/default'
import { formatDay } from '@/utils/format-time'
import { studentFilesApi } from '@/api/student-files.api'

export interface StudentRow {
  userId: string
  studentId?: string
  name?: string
  grade?: string
  major?: string
  degree?: string
  [key: string]: any
}

interface StudentTableColumn {
  key: string
  label: string
  minWidth: number
  prop: keyof StudentRow
  formatter?: (value: any, row: StudentRow) => string
}

type DetailSection = 'project' | 'punish' | 'scholarship'

export const useStudentStore = defineStore('student', () => {
  const getDisplayValue = getFieldDisplayValue
  const formatEdu = formatDegree

  const tableColumns: StudentTableColumn[] = [
    { key: 'studentId', prop: 'studentId', label: '学号', minWidth: 180 },
    { key: 'name', prop: 'name', label: '姓名', minWidth: 180 },
    { key: 'grade', prop: 'grade', label: '年级', minWidth: 180 },
    {
      key: 'major',
      prop: 'major',
      label: '专业',
      minWidth: 180,
      formatter: (value) => formatMajor(value),
    },
    {
      key: 'degree',
      prop: 'degree',
      label: '学位',
      minWidth: 180,
      formatter: (value) => formatEdu(value),
    },
  ]

  const fieldConfigs: FieldConfigType[] = [
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

  const tableData = ref<StudentRow[]>([])
  const selectedIds = ref<string[]>([])
  const searchForm = reactive({
    grade: '',
    name: '',
    studentId: '',
    major: '',
    degree: '',
  })
  const query = reactive({
    pageNum: 1,
    pageSize: 10,
  })
  const total = ref(0)
  const loadings = reactive({
    table: false,
  })

  const viewedUserId = ref('')
  const studentRow = ref<Record<string, any>>({})
  const fundPunishVo = ref<any[]>([])
  const fundScholarshipVo = ref<any[]>([])
  const fundProjectVo = ref<any[]>([])
  const visible = ref(false)

  const detailPageSize = 6
  const projectPage = ref(1)
  const punishPage = ref(1)
  const scholarshipPage = ref(1)

  const paginatedProjectVo = computed(() => {
    const start = (projectPage.value - 1) * detailPageSize
    return fundProjectVo.value.slice(start, start + detailPageSize)
  })

  const paginatedPunishVo = computed(() => {
    const start = (punishPage.value - 1) * detailPageSize
    return fundPunishVo.value.slice(start, start + detailPageSize)
  })

  const paginatedScholarshipVo = computed(() => {
    const start = (scholarshipPage.value - 1) * detailPageSize
    return fundScholarshipVo.value.slice(start, start + detailPageSize)
  })

  const projectTotal = computed(() => fundProjectVo.value.length)
  const punishTotal = computed(() => fundPunishVo.value.length)
  const scholarshipTotal = computed(() => fundScholarshipVo.value.length)

  const hasSelectedItems = computed(() => selectedIds.value.length > 0)

  const handleSelectionChange = (selection: StudentRow[]) => {
    selectedIds.value = selection.map((student) => student.userId)
  }

  const getList = async (
    pageNum = query.pageNum,
    pageSize = query.pageSize,
    queryData: Record<string, any> = {},
  ) => {
    loadings.table = true
    try {
      const params = {
        pageNum,
        pageSize,
        ...queryData,
      }
      const res = await studentFilesApi.getStudentList(params)
      const rows = res.data?.rows || []

      query.pageNum = pageNum
      query.pageSize = pageSize
      tableData.value = rows
      total.value = res.data?.total || 0
    } catch (error) {
      tableData.value = []
      total.value = 0
      ElMessage.error('学生列表加载失败，请稍后重试')
    } finally {
      loadings.table = false
    }
  }

  const resetSearchForm = () => {
    searchForm.grade = ''
    searchForm.name = ''
    searchForm.studentId = ''
    searchForm.major = ''
    searchForm.degree = ''
  }

  const buildSearchParams = () => {
    const params: Record<string, any> = {
      grade: searchForm.grade,
      name: searchForm.name,
      studentId: searchForm.studentId,
      major: searchForm.major,
      degree: searchForm.degree,
    }

    if (params.major === '未知') {
      params.major = ''
    } else if (params.major === '') {
      delete params.major
    }

    ;['grade', 'name', 'studentId', 'degree'].forEach((key) => {
      if (params[key] === '') {
        delete params[key]
      }
    })

    return params
  }

  const submitSearch = async () => {
    await getList(1, query.pageSize, buildSearchParams())
  }

  const exportSelectedStudentInfo = async () => {
    if (!hasSelectedItems.value) {
      ElMessage.warning('请先在列表中选择要导出的条目')
      return
    }

    try {
      const response = await studentFilesApi.exportSelectedStudentInfo(selectedIds.value)
      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const disposition = response.headers['content-disposition']
      let fileName = 'exported_file.xlsx'
      if (disposition) {
        const fileNameMatch = disposition.match(/filename="(.+)"/)
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1]
        }
      }

      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(url)
      ElMessage.success('导出成功！')
    } catch (error) {
      ElMessage.error('导出失败，请重试')
    }
  }

  const handleViewDetail = async (row: StudentRow) => {
    viewedUserId.value = row.userId
    try {
      const res = await studentFilesApi.getStudentDetail(row.userId)
      const detailData = res.data?.data || {}

      studentRow.value = detailData.fundUserInfoVo || {}
      fundProjectVo.value = detailData.fundProjectVo || []
      fundScholarshipVo.value = detailData.fundScholarshipVo || []
      fundPunishVo.value = detailData.fundPunishVo || []

      projectPage.value = 1
      punishPage.value = 1
      scholarshipPage.value = 1
      visible.value = true
    } catch (error) {
      ElMessage.error('学生详情加载失败，请稍后重试')
    }
  }

  const closeDialog = () => {
    visible.value = false
  }

  const exportStudentInfo = async () => {
    if (!viewedUserId.value) {
      ElMessage.warning('请先查看学生详情后再导出')
      return
    }

    try {
      const response = await studentFilesApi.exportStudentInfo(viewedUserId.value)

      const blob = new Blob([response.data], {
        type: 'application/vnd.ms-excel',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'student_info.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('导出成功')
    } catch (error) {
      ElMessage.error('导出失败，请稍后重试')
    }
  }

  const handleSizeChange = async (val: number) => {
    await getList(query.pageNum, val)
  }

  const handleCurrentChange = async (val: number) => {
    await getList(val, query.pageSize)
  }

  const setDetailPage = (section: DetailSection, page: number) => {
    if (section === 'project') {
      projectPage.value = page
      return
    }
    if (section === 'punish') {
      punishPage.value = page
      return
    }
    scholarshipPage.value = page
  }

  return {
    getDisplayValue,
    tableColumns,
    fieldConfigs,
    tableData,
    selectedIds,
    searchForm,
    query,
    total,
    loadings,
    hasSelectedItems,
    studentRow,
    visible,
    detailPageSize,
    projectTotal,
    punishTotal,
    scholarshipTotal,
    projectPage,
    punishPage,
    scholarshipPage,
    paginatedProjectVo,
    paginatedPunishVo,
    paginatedScholarshipVo,

    getList,
    resetSearchForm,
    submitSearch,
    exportSelectedStudentInfo,
    handleSelectionChange,
    handleViewDetail,
    closeDialog,
    exportStudentInfo,
    handleSizeChange,
    handleCurrentChange,
    setDetailPage,
  }
})
