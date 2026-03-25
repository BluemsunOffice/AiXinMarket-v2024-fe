<template>
  <div class="profile-page">
    <div class="profile-box-wrapper">
      <PersonalBox
        :student-id="ownProfile.studentId || '-'"
        :name="ownProfile.name || '-'"
        :role="roleGroup || '用户'"
        :avatar-url="userProfile.avatar || ''"
      />
    </div>
    <div class="profile-content">
      <el-tabs tab-position="top" type="border-card" class="profile-tabs">
        <el-tab-pane label="个人信息" class="tab-pane">
          <el-scrollbar height="calc(100vh - 190px)">
            <el-descriptions :column="3" border class="info-card">
              <template #extra>
                <el-button type="primary" @click="openEditDialog">编辑个人信息</el-button>
              </template>

              <el-descriptions-item v-for="item in personalInfoItems" :key="item.key">
                <template #label>
                  <div class="cell-label">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span>{{ item.label }}</span>
                  </div>
                </template>

                <el-tag v-if="item.useTag" size="small">
                  {{ getPersonalInfoValue(item) }}
                </el-tag>
                <span v-else>{{ getPersonalInfoValue(item) }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane v-for="tab in recordTabs" :key="tab.key" :label="tab.label" class="tab-pane">
          <div class="table-wrapper">
            <el-table :data="tab.rows" class="record-table" row-height="60" layout="auto">
              <el-table-column
                v-for="column in tab.columns"
                :key="`${tab.key}-${column.prop}`"
                :prop="column.prop"
                :label="column.label"
                :sortable="column.sortable"
                :flex="column.flex"
              />
              <template #empty>
                <div class="empty-box">
                  <el-empty />
                </div>
              </template>
            </el-table>

            <el-pagination
              class="tab-pagination"
              background
              layout="prev, pager, next"
              :total="tab.total"
              :page-size="tab.pageSize"
              :current-page="tab.pageNum"
              :pager-count="11"
              @current-change="(page: number) => handlePageChange(tab.key, page)"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      v-model="editDialogVisible"
      title="编辑个人信息"
      width="760px"
      destroy-on-close
      class="profile-dialog"
    >
      <div class="dialog-section-title">个人基本信息</div>
      <el-descriptions :column="2" border class="dialog-basic-card">
        <el-descriptions-item v-for="item in basicInfoItems" :key="item.label" :label="item.label">
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="dialog-section-title">更改个人信息</div>
      <el-form ref="editFormRef" :model="editFormModel" :rules="formRules" label-position="top">
        <div class="form-grid">
          <el-form-item
            v-for="field in selectFields"
            :key="field.key"
            :label="field.label"
            :prop="field.key"
          >
            <el-select v-model="editFormModel[field.key]" :placeholder="`请选择${field.label}`">
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-for="field in inputFields"
            :key="field.key"
            :label="field.label"
            :prop="field.key"
          >
            <el-input v-model="editFormModel[field.key]" :placeholder="`请输入${field.label}`" />
          </el-form-item>

          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="editFormModel.birthday"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择生日"
            />
          </el-form-item>

          <!-- <el-form-item label="入学时间" prop="admissionDate">
            <el-date-picker
              v-model="editFormModel.admissionDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择入学时间"
            />
          </el-form-item> -->
          <el-form-item label="入学时间" prop="admissionDate">
          <el-date-picker
            v-model="editFormModel.admissionDate"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择入学时间"
          />
        </el-form-item>

          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="editFormModel.telephone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item label="E-mail" prop="email">
            <el-input v-model="editFormModel.email" placeholder="请输入E-mail" />
          </el-form-item>
        </div>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfileEdit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Avatar,
  Calendar,
  House,
  Iphone,
  Location,
  MagicStick,
  Message,
  OfficeBuilding,
  Promotion,
  School,
  StarFilled,
  Sunny,
  Switch,
  Tickets,
  User,
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import PersonalBox from '@/views/framework/components/personal-box.vue'
import { useUserStore } from '@/stores/user-store'
import type { FundUserInfo, UpdateOwnProfilePayload } from '@/api/user.api'
import {
  assistLevelMap,
  collegeMap,
  collegeOptions,
  degreeMap,
  degreeOptions,
  ethnicOptions,
  ethnicMap,
  genderOptions,
  genderMap,
  majorMap,
  majorOptions,
  mapCodeToLabel,
  marryMap,
  marryOptions,
  politicalMap,
  politicalOptions,
  punishTypeMap,
  statusMap,
  statusOptions,
  fundTypeMap,
} from '@/constants/default'

type RecordTabKey = 'punish' | 'scholarship' | 'project'
type EditableFieldKey = keyof UpdateOwnProfilePayload

interface ColumnConfig {
  prop: string
  label: string
  flex?: string
  sortable?: boolean
}

interface PersonalInfoItem {
  key: keyof FundUserInfo | 'fundType'
  label: string
  icon: any
  useTag?: boolean
  formatter?: (value?: string | null) => string
}

interface EditFieldConfig {
  key: EditableFieldKey
  label: string
  options: { value: string; label: string }[]
}

const userStore = useUserStore()
const {
  roleGroup,
  userProfile,
  ownProfile,
  ownPunishList,
  ownScholarshipList,
  ownProjectList,
  punishPaging,
  scholarshipPaging,
  projectPaging,
} = storeToRefs(userStore)

const editDialogVisible = ref(false)
const editFormRef = ref<FormInstance>()
const editFormModel = reactive<UpdateOwnProfilePayload>({
  degree: '',
  grade: '',
  gender: '',
  nationality: '',
  admissionDate: '',
  political: '',
  marry: '',
  apartment: '',
  dormitory: '',
  homeAddress: '',
  college: '',
  telephone: '',
  major: '',
  email: '',
  status: '',
  birthday: '',
})

const formRules = reactive<FormRules<UpdateOwnProfilePayload>>({
  telephone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Email不能为空', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Email格式不正确',
      trigger: 'blur',
    },
  ],
})

const punishRows = computed(() =>
  ownPunishList.value.map((item) => ({
    ...item,
    category: mapCodeToLabel(punishTypeMap, item.category),
  }))
)

const scholarshipRows = computed(() =>
  ownScholarshipList.value.map((item) => ({
    ...item,
    type: mapCodeToLabel(fundTypeMap, item.type),
  }))
)

const selectFields: EditFieldConfig[] = [
  { key: 'gender', label: '性别', options: genderOptions },
  { key: 'nationality', label: '民族', options: ethnicOptions },
  { key: 'marry', label: '婚姻状况', options: marryOptions },
  { key: 'major', label: '专业', options: majorOptions },
  { key: 'degree', label: '学历', options: degreeOptions },
  { key: 'political', label: '政治面貌', options: politicalOptions },
  { key: 'college', label: '学院', options: collegeOptions },
  { key: 'status', label: '状态', options: statusOptions },
]

const inputFields: Array<{ key: EditableFieldKey; label: string }> = [
  { key: 'apartment', label: '公寓' },
  { key: 'dormitory', label: '宿舍号' },
  { key: 'homeAddress', label: '家庭住址' },
  { key: 'grade', label: '年级' },
]

const personalInfoItems: PersonalInfoItem[] = [
  { key: 'name', label: '姓名', icon: User },
  { key: 'studentId', label: '学号', icon: Avatar },
  {
    key: 'gender',
    label: '性别',
    icon: User,
    formatter: (value) => mapCodeToLabel(genderMap, value),
  },
  { key: 'grade', label: '年级', icon: Iphone },
  { key: 'birthday', label: '生日', icon: Calendar },
  {
    key: 'degree',
    label: '学历',
    icon: Tickets,
    useTag: true,
    formatter: (value) => mapCodeToLabel(degreeMap, value),
  },
  {
    key: 'college',
    label: '学院',
    icon: School,
    formatter: (value) => mapCodeToLabel(collegeMap, value),
  },
  {
    key: 'major',
    label: '专业',
    icon: OfficeBuilding,
    formatter: (value) => mapCodeToLabel(majorMap, value),
  },
  {
    key: 'nationality',
    label: '民族',
    icon: StarFilled,
    formatter: (value) => mapCodeToLabel(ethnicMap, value, '未知民族'),
  },
  { key: 'admissionDate', label: '入学时间', icon: Calendar },
  { key: 'email', label: 'E-mail', icon: Message },
  { key: 'apartment', label: '公寓', icon: OfficeBuilding },
  { key: 'dormitory', label: '宿舍', icon: House },
  { key: 'telephone', label: '电话', icon: Iphone },
  {
    key: 'political',
    label: '政治面貌',
    icon: Sunny,
    formatter: (value) => mapCodeToLabel(politicalMap, value),
  },
  {
    key: 'marry',
    label: '婚姻状况',
    icon: Switch,
    formatter: (value) => mapCodeToLabel(marryMap, value),
  },
  {
    key: 'fundType',
    label: '资助等级',
    icon: Promotion,
    formatter: (value) => mapCodeToLabel(assistLevelMap, value),
  },
  {
    key: 'status',
    label: '状态',
    icon: MagicStick,
    formatter: (value) => mapCodeToLabel(statusMap, value),
  },
  { key: 'homeAddress', label: '家庭住址', icon: Location },
]

const basicInfoItems = computed(() => [
  { label: '姓名', value: ownProfile.value.name || '无' },
  { label: '性别', value: mapCodeToLabel(genderMap, ownProfile.value.gender) },
  { label: '学号', value: ownProfile.value.studentId || '无' },
  { label: '年级', value: ownProfile.value.grade || '无' },
  { label: '学历', value: mapCodeToLabel(degreeMap, ownProfile.value.degree) },
  { label: '资助等级', value: mapCodeToLabel(assistLevelMap, ownProfile.value.fundType) },
])

const recordTabs = computed(() => [
  {
    key: 'punish' as const,
    label: '个人处分',
    rows: punishRows.value,
    total: punishPaging.value.total,
    pageSize: punishPaging.value.pageSize,
    pageNum: punishPaging.value.pageNum,
    columns: [
      { prop: 'category', label: '处罚类型', flex: '1' },
      { prop: 'punishTime', label: '处罚时间', flex: '1', sortable: true },
      { prop: 'reason', label: '处罚原因', flex: '3' },
    ] as ColumnConfig[],
  },
  {
    key: 'scholarship' as const,
    label: '个人奖励',
    rows: scholarshipRows.value,
    total: scholarshipPaging.value.total,
    pageSize: scholarshipPaging.value.pageSize,
    pageNum: scholarshipPaging.value.pageNum,
    columns: [
      { prop: 'type', label: '奖励类型', flex: '1' },
      { prop: 'grantDate', label: '授予时间', flex: '1', sortable: true },
      { prop: 'amount', label: '奖励金额', flex: '1' },
    ] as ColumnConfig[],
  },
  {
    key: 'project' as const,
    label: '社会经历',
    rows: ownProjectList.value,
    total: projectPaging.value.total,
    pageSize: projectPaging.value.pageSize,
    pageNum: projectPaging.value.pageNum,
    columns: [
      { prop: 'startDate', label: '开始时间', flex: '1', sortable: true },
      { prop: 'endDate', label: '结束时间', flex: '1', sortable: true },
      { prop: 'experience', label: '社会经历', flex: '3' },
    ] as ColumnConfig[],
  },
])

const getPersonalInfoValue = (item: PersonalInfoItem) => {
  const rawValue = ownProfile.value[item.key as keyof FundUserInfo] as string | undefined
  if (item.formatter) {
    return item.formatter(rawValue)
  }
  return rawValue || '无'
}

const syncEditForm = () => {
  editFormModel.degree = ownProfile.value.degree || ''
  editFormModel.grade = ownProfile.value.grade || ''
  editFormModel.gender = ownProfile.value.gender || ''
  editFormModel.nationality = ownProfile.value.nationality || ''
  editFormModel.admissionDate = ownProfile.value.admissionDate || ''
  editFormModel.political = ownProfile.value.political || ''
  editFormModel.marry = ownProfile.value.marry || ''
  editFormModel.apartment = ownProfile.value.apartment || ''
  editFormModel.dormitory = ownProfile.value.dormitory || ''
  editFormModel.homeAddress = ownProfile.value.homeAddress || ''
  editFormModel.college = ownProfile.value.college || ''
  editFormModel.telephone = ownProfile.value.telephone || ''
  editFormModel.major = ownProfile.value.major || ''
  editFormModel.email = ownProfile.value.email || ''
  editFormModel.status = ownProfile.value.status || ''
  editFormModel.birthday = ownProfile.value.birthday || ''
}

watch(
  () => ownProfile.value,
  () => {
    syncEditForm()
  },
  { immediate: true, deep: true }
)

const openEditDialog = () => {
  syncEditForm()
  editDialogVisible.value = true
}

const saveProfileEdit = async () => {
  if (!editFormRef.value) {
    return
  }

  await editFormRef.value.validate()
  try {
    const payload: UpdateOwnProfilePayload = { ...editFormModel }
    // if (payload.admissionDate && !payload.admissionDate.includes(' ')) {
    //   payload.admissionDate = `${payload.admissionDate} 00:00:00`
    // }
    const response = await userStore.updateOwnProfile(payload)
    if (response.code === 200) {
      ElMessage.success('信息更新成功')
      editDialogVisible.value = false
    } else {
      ElMessage.error(response.msg || '信息更新失败')
    }
  } catch (error) {
    ElMessage.error(`请求失败：${error}`)
  }
}

const handlePageChange = async (tabKey: RecordTabKey, pageNum: number) => {
  if (tabKey === 'punish') {
    await userStore.updateOwnPunishPage(pageNum)
    return
  }

  if (tabKey === 'scholarship') {
    await userStore.updateOwnScholarshipPage(pageNum)
    return
  }

  await userStore.updateOwnProjectPage(pageNum)
}

const setResponsivePageSize = () => {
  if (window.innerWidth >= 1300) {
    userStore.setOwnProfilePageSize(10)
    return
  }

  if (window.innerWidth <= 768) {
    userStore.setOwnProfilePageSize(6)
    return
  }

  userStore.setOwnProfilePageSize(8)
}

const handleResize = () => {
  setResponsivePageSize()
}

onMounted(async () => {
  setResponsivePageSize()
  window.addEventListener('resize', handleResize)
  await userStore.fetchOwnProfilePageData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
}

.profile-content {
  padding: 12px 18px 18px;
}

.profile-tabs {
  border: none;
  box-shadow: none;
  background: var(--el-bg-color-overlay);
}

.tab-pane {
  min-height: calc(100vh - 170px);
}

.info-card {
  margin: 10px 6px;
}

.cell-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - 250px);
}

.record-table {
  flex: 1;
}

.empty-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-pagination {
  display: flex;
  justify-content: center;
  padding-bottom: 4px;
}

.dialog-section-title {
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.dialog-basic-card {
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .profile-box-wrapper {
    padding: 10px 10px 0;
  }

  .profile-content {
    padding: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .tab-pane {
    min-height: calc(100vh - 210px);
  }
}
</style>
