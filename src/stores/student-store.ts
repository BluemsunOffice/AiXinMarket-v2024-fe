import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { getFieldDisplayValue, type FieldConfigType } from '@/utils/field-config'
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
  MAJOR_MAP,
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

interface DetailColumn {
  key: string
  prop: string
  label: string
  minWidth: number
  formatter?: (row: Record<string, any>) => string
}

interface DetailTabConfig {
  section: DetailSection
  label: string
  rows: any[]
  total: number
  currentPage: number
  columns: DetailColumn[]
}

export const useStudentStore = defineStore('student', () => {
  const getDisplayValue = getFieldDisplayValue
  const formatEdu = formatDegree

  const tableColumns = ref<StudentTableColumn[]>([
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
  ])

  const fieldConfigs = ref<FieldConfigType[]>([
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
  ])

  const tableData = ref<StudentRow[]>([])
  const selectedIds = ref<string[]>([])
  const selectedRowMap = ref<Record<string, StudentRow>>({})
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
  const exportingStudentInfo = ref(false)
  const studentRow = ref<Record<string, any>>({})
  const fundPunishVo = ref<any[]>([])
  const fundScholarshipVo = ref<any[]>([])
  const fundProjectVo = ref<any[]>([])
  const visible = ref(false)

  const detailPageSize = ref(6)
  const projectPage = ref(1)
  const punishPage = ref(1)
  const scholarshipPage = ref(1)

  const paginatedProjectVo = computed(() => {
    const start = (projectPage.value - 1) * detailPageSize.value
    return fundProjectVo.value.slice(start, start + detailPageSize.value)
  })

  const paginatedPunishVo = computed(() => {
    const start = (punishPage.value - 1) * detailPageSize.value
    return fundPunishVo.value.slice(start, start + detailPageSize.value)
  })

  const paginatedScholarshipVo = computed(() => {
    const start = (scholarshipPage.value - 1) * detailPageSize.value
    return fundScholarshipVo.value.slice(start, start + detailPageSize.value)
  })

  const projectTotal = computed(() => fundProjectVo.value.length)
  const punishTotal = computed(() => fundPunishVo.value.length)
  const scholarshipTotal = computed(() => fundScholarshipVo.value.length)

  const detailTabConfigs = computed<DetailTabConfig[]>(() => [
    {
      section: 'punish',
      label: '个人处分',
      rows: paginatedPunishVo.value,
      total: punishTotal.value,
      currentPage: punishPage.value,
      columns: [
        {
          key: 'category',
          prop: 'category',
          label: '类别',
          minWidth: 180,
          formatter: (row) => formatPunishType(Number(row.category)),
        },
        { key: 'reason', prop: 'reason', label: '原因', minWidth: 180 },
        { key: 'punishTime', prop: 'punishTime', label: '处分时间', minWidth: 180 },
      ],
    },
    {
      section: 'scholarship',
      label: '个人奖励',
      rows: paginatedScholarshipVo.value,
      total: scholarshipTotal.value,
      currentPage: scholarshipPage.value,
      columns: [
        {
          key: 'type',
          prop: 'type',
          label: '类型',
          minWidth: 180,
          formatter: (row) => formatFundType(Number(row.type)),
        },
        { key: 'grantDate', prop: 'grantDate', label: '授予日期', minWidth: 180 },
        { key: 'amount', prop: 'amount', label: '金额', minWidth: 180 },
      ],
    },
    {
      section: 'project',
      label: '社会经历',
      rows: paginatedProjectVo.value,
      total: projectTotal.value,
      currentPage: projectPage.value,
      columns: [
        { key: 'startDate', prop: 'startDate', label: '开始日期', minWidth: 180 },
        { key: 'endDate', prop: 'endDate', label: '结束日期', minWidth: 180 },
        { key: 'experience', prop: 'experience', label: '经历描述', minWidth: 180 },
      ],
    },
  ])

  const hasSelectedItems = computed(() => selectedIds.value.length > 0)
  const selectedStudentRows = computed(() =>
    selectedIds.value
      .map((id) => selectedRowMap.value[id])
      .filter((row): row is StudentRow => Boolean(row)),
  )

  const handleSelectionChange = (selection: StudentRow[]) => {
    const currentPageIds = new Set(tableData.value.map((student) => student.userId))

    currentPageIds.forEach((id) => {
      delete selectedRowMap.value[id]
    })

    selection.forEach((student) => {
      if (!student.userId) {
        return
      }
      selectedRowMap.value[student.userId] = student
    })

    selectedIds.value = Object.keys(selectedRowMap.value)
  }

  const clearSelectedStudents = () => {
    selectedIds.value = []
    selectedRowMap.value = {}
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
    clearSelectedStudents()
  }

  const buildSearchParams = () => {
    const params: Record<string, any> = {
      grade: searchForm.grade,
      name: searchForm.name,
      studentId: searchForm.studentId,
      major: searchForm.major,
      degree: searchForm.degree,
    }

    // 处理专业：如果是专业名称，则转换为 ID
    if (params.major) {
      // 如果不是纯数字（即不是 ID），则尝试通过名称查找 ID
      if (isNaN(Number(params.major))) {
        const majorId = Object.keys(MAJOR_MAP).find(
          (key) => MAJOR_MAP[Number(key)] === params.major,
        )
        if (majorId !== undefined) {
          params.major = majorId
        }
      }
    }

    if (params.major === '未知' || params.major === '') {
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
    clearSelectedStudents()
    await getList(1, query.pageSize, buildSearchParams())
  }

  const exportSelectedStudentInfo = async (ids?: string[]) => {
    const idsToExport = ids?.length ? ids : selectedIds.value

    if (!idsToExport.length) {
      ElMessage.warning('请先在列表中选择要导出的条目')
      return
    }

    try {
      const response = await studentFilesApi.exportSelectedStudentInfo(idsToExport)
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

    exportingStudentInfo.value = true
    const exportingMessage = ElMessage({
      type: 'info',
      message: '正在导出中，请稍候...',
      duration: 0,
      showClose: true,
    })

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
    } finally {
      exportingStudentInfo.value = false
      exportingMessage.close()
    }
  }

  const handleSizeChange = async (val: number) => {
    await getList(query.pageNum, val)
  }

  const handleCurrentChange = async (val: number) => {
    await getList(val, query.pageSize)
  }

  const initPage = async () => {
    await getList(1, query.pageSize)
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
    selectedStudentRows,
    searchForm,
    query,
    total,
    loadings,
    exportingStudentInfo,
    hasSelectedItems,
    studentRow,
    visible,
    detailPageSize,
    detailTabConfigs,

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
    initPage,
    setDetailPage,
  }
})
