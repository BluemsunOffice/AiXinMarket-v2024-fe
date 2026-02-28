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

    const currentPage = ref(1)
    const totalNum = ref(0)
    const currentPage2 = ref(1)
    const totalNum2 = ref(0)
    const currentPage3 = ref(1)
    const totalNum3 = ref(0)

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

    const search = async (params: Record<string, any>) => {
        await getList(1, query.pageSize, params)
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

            totalNum.value = fundProjectVo.value.length
            totalNum2.value = fundPunishVo.value.length
            totalNum3.value = fundScholarshipVo.value.length

            currentPage.value = 1
            currentPage2.value = 1
            currentPage3.value = 1
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

    const handlePageChange = (val: number) => {
        currentPage.value = val
    }

    const handlePageChange2 = (val: number) => {
        currentPage2.value = val
    }

    const handlePageChange3 = (val: number) => {
        currentPage3.value = val
    }

    return {
        getDisplayValue,
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

        getList,
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
    }
})
