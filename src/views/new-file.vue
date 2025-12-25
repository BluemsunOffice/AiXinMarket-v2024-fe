<template>
  <div>
    <NavBar_back />
    <div class="background1">
      <el-tabs
        tabPosition="top"
        type="border-card"
        style="height: 90vh; border: none"
        class="demo-tabs"
      >
        <el-tab-pane label="个人信息" class="tab-content">
          <el-scrollbar height="70vh">
            <el-descriptions size="large" class="margin-top" :column="3" border>
              <template #extra>
                <el-button type="primary" @click="showEditDialog = true"
                  >编辑个人信息</el-button
                >
              </template>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><user /></el-icon>姓名
                  </div>
                </template>
                {{ studentInfo.name || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><Avatar /></el-icon>学号
                  </div>
                </template>
                {{ studentInfo.studentId || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><user /></el-icon>性别
                  </div>
                </template>
                {{ formatSex(studentInfo.gender) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><iphone /></el-icon>年级
                  </div>
                </template>
                {{ studentInfo.grade || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><Calendar /></el-icon>生日
                  </div>
                </template>
                {{ studentInfo.birthday || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><tickets /> </el-icon>学历
                  </div>
                </template>
                <el-tag size="small">{{
                  formatEducation(studentInfo.degree) || "无"
                }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><School /> </el-icon>学院
                  </div>
                </template>
                {{ formatPoliticalAppearance(studentInfo.college) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><OfficeBuilding /></el-icon>专业
                  </div>
                </template>
                {{ formatMajor(studentInfo.major) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"> <StarFilled /> </el-icon> 民族
                  </div>
                </template>
                {{ formatEthnicGroup(studentInfo.nationality) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><Calendar /></el-icon>入学时间
                  </div>
                </template>
                {{ studentInfo.admissionDate || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><Message /></el-icon>e-mail
                  </div>
                </template>
                {{ studentInfo.email || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><OfficeBuilding /></el-icon>公寓
                  </div>
                </template>
                {{ studentInfo.apartment || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><House /></el-icon>宿舍
                  </div>
                </template>
                {{ studentInfo.dormitory || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><iphone /></el-icon>电话
                  </div>
                </template>
                {{ studentInfo.telephone || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"> <Sunny /> </el-icon> 政治面貌
                  </div>
                </template>
                {{ politicalAppearance(studentInfo.political) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"> <SwitchFilled /> </el-icon
                    >婚姻状况
                  </div>
                </template>
                {{ formatMarry(studentInfo.marry) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><Promotion /></el-icon> 资助等级
                  </div>
                </template>
                {{ formatAssistLevel(studentInfo.fundType) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><MagicStick /></el-icon>状态
                  </div>
                </template>
                {{ formatStatus(studentInfo.status) || "无" }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon :style="iconStyle"><Location /></el-icon>家庭住址
                  </div>
                </template>
                {{ studentInfo.homeAddress || "无" }}
              </el-descriptions-item>
            </el-descriptions>
            <!-- 个人信息编辑对话框 -->
            <div v-if="showEditDialog" class="overlay">
              <div v-if="showEditDialog" class="edit-dialog">
                <div class="dialog-content">
                  <p id="dialog-title">编辑个人信息</p>
                  <h3>个人基本信息</h3>
                  <div class="basicIn">
                    <el-descriptions :column="2" width="100%" border>
                      <el-descriptions-item
                        label="姓名"
                        label-align="center"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        :width="150"
                      >
                        {{ studentInfo.name || "无" }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        label="性别"
                        label-align="center"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        :width="150"
                      >
                        {{ formatSex(studentInfo.gender) || "无" }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        label="学号"
                        label-align="center"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        :width="150"
                      >
                        {{ studentInfo.studentId || "无" }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        label="年级"
                        label-align="center"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        :width="150"
                      >
                        {{ studentInfo.grade || "无" }}
                      </el-descriptions-item>
                      <el-descriptions-item
                        label="学历"
                        label-align="center"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        :width="150"
                      >
                        <el-tag size="small">{{
                          formatEducation(studentInfo.degree) || "无"
                        }}</el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item
                        label="资助等级"
                        label-align="center"
                        align="center"
                        label-class-name="my-label"
                        class-name="my-content"
                        :width="150"
                      >
                        {{ formatAssistLevel(studentInfo.fundType) || "无" }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                  <h3 class="changeInfomation">更改个人信息</h3>
                  <div class="change">
                    <!-- 婚姻状况下拉框 -->
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>婚姻状况：</span>
                        </div>
                        <el-select
                          v-model="editInfo.marry"
                          placeholder="婚姻状况"
                          style="width: 150px"
                        >
                          <el-option
                            v-for="item in marryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <!-- 公寓 -->
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>公</span>
                          <span>寓：</span>
                        </div>
                        <el-input
                          v-model="editInfo.apartment"
                          style="width: 150px"
                          placeholder="公寓"
                        />
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>宿</span>
                          <span>舍</span>
                          <span>号：</span>
                        </div>
                        <el-input
                          v-model="editInfo.dormitory"
                          style="width: 150px"
                          placeholder="宿舍号"
                        />
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>家庭住址：</span>
                        </div>
                        <el-input
                          v-model="editInfo.homeAddress"
                          style="width: 150px"
                          placeholder="家庭住址"
                        />
                      </el-form-item>
                    </div>

                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>专</span>
                          <span>业：</span>
                        </div>
                        <el-select
                          v-model="editInfo.major"
                          placeholder="专业"
                          class="select-width"
                          style="width: 150px"
                        >
                          <el-option
                            v-for="item in majorOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>学</span>
                          <span>历：</span>
                        </div>
                        <el-select
                          v-model="editInfo.degree"
                          placeholder="学历"
                          class="select-width"
                          style="width: 150px"
                        >
                          <el-option
                            v-for="item in degreeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>

                    <!-- 添加生日选择框 -->
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>生</span>
                          <span>日：</span>
                        </div>
                        <el-date-picker
                          v-model="editInfo.birthday"
                          type="date"
                          placeholder="选择日期"
                          value-format="YYYY-MM-DD"
                          :size="size"
                          style="width: 150px"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>政治面貌：</span>
                        </div>
                        <el-select
                          v-model="editInfo.political"
                          placeholder="政治面貌"
                          style="width: 150px"
                        >
                          <el-option
                            v-for="item in politicalOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>学</span>
                          <span>院：</span>
                        </div>
                        <el-select
                          v-model="editInfo.college"
                          placeholder="学院"
                          style="width: 150px"
                        >
                          <el-option
                            v-for="item in collegeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item style="font-size: 20px">
                        <div class="label-container">
                          <span>状</span>
                          <span>态：</span>
                        </div>
                        <el-select
                          v-model="editInfo.status"
                          placeholder="状态"
                          style="width: 150px"
                        >
                          <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <!-- 手机号输入框 -->
                  <el-form :model="editInfo" :rules="rules" ref="editForm">
                    <div class="changeInfor">
                      <el-form-item prop="telephone">
                        <div class="label-container">
                          <span style="color: red">*</span>
                          <span>手</span>
                          <span>机</span>
                          <span>号：</span>
                        </div>
                        <!-- <template #label class="label-container">
                                <span style="font-size: 20px;">手&nbsp;机&nbsp;号&nbsp;:&nbsp;</span>
                                
                              </template> -->

                        <el-input
                          v-model="editInfo.telephone"
                          style="width: 150px"
                          placeholder="手机号"
                        />
                      </el-form-item>
                    </div>
                    <div class="changeInfor">
                      <el-form-item prop="email">
                        <div class="label-container">
                          <span style="color: red">*</span>
                          <span>E-mail</span>
                          <span>：</span>
                        </div>
                        <!-- <template #label>
                                <span style="font-size: 20px;">&nbsp;E-mail&nbsp;：</span>
                              </template> -->
                        <el-input
                          v-model="editInfo.email"
                          style="width: 150px"
                          placeholder="e-mail"
                        />
                      </el-form-item>
                    </div>
                  </el-form>
                  <el-button
                    class="btn"
                    type="primary"
                    plain
                    @click="saveEditInfo"
                    >保存</el-button
                  >
                  <el-button
                    class="btn"
                    type="primary"
                    plain
                    @click="showEditDialog = false"
                    >取消</el-button
                  >
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="个人处分" class="tab-content">
          <el-table
            :data="fundPunishVo"
            style="width: 100%; height: 98.7%"
            row-height="60"
          >
            <el-table-column prop="category" label="处罚类型" flex="1" />
            <el-table-column
              prop="punishTime"
              label="处罚时间"
              flex="1"
              sortable
            />
            <el-table-column prop="reason" label="处罚原因" flex="3" />
            <template #empty>
              <div
                style="width: 100%; height: 100%"
                class="flex items-center justify-center h-100%"
              >
                <el-empty />
              </div>
            </template>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalNum2"
            :page-size="pageSize2"
            v-model:currentPage="currentPage2"
            pager-count="50"
            @current-change="handlePageChange2"
            id="pagenation2"
          />
        </el-tab-pane>

        <el-tab-pane label="个人奖励" class="tab-content">
          <el-table
            :data="fundScholarshipVo"
            style="width: 100%; height: 98.7%"
            row-height="60"
            layout="auto"
          >
            <el-table-column prop="type" label="奖励类型" />
            <el-table-column prop="grantDate" label="授予时间" sortable />
            <el-table-column prop="amount" label="奖励金额" />
            <template #empty>
              <div
                style="width: 100%; height: 100%"
                class="flex items-center justify-center h-100%"
              >
                <el-empty />
              </div>
            </template>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalNum3"
            :page-size="pageSize3"
            v-model:currentPage="currentPage3"
            pager-count="50"
            @current-change="handlePageChange3"
            id="pagenation2"
          />
        </el-tab-pane>
        <el-tab-pane label="社会经历" class="tab-content">
          <el-table
            :data="socialExperienceData"
            style="width: 100%; height: 98.7%"
            layout="auto"
          >
            <el-table-column
              prop="startDate"
              label="开始时间"
              flex="1"
              sortable
            />
            <el-table-column
              prop="endDate"
              label="结束时间"
              flex="1"
              sortable
            />
            <el-table-column prop="experience" label="社会经历" flex="3" />
            <template #empty>
              <div
                style="width: 100%; height: 100%"
                class="flex items-center justify-center h-100%"
              >
                <el-empty />
              </div>
            </template>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalNum"
            :page-size="pageSize"
            v-model:currentPage="currentPage"
            pager-count="50"
            @current-change="handlePageChange"
            id="pagenation2"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import NavBar_back from "./Student/components/NavBar_back.vue";
import NavBar from "./Student/components/NavBar.vue";
import { computed, ref, onMounted, reactive, onBeforeUnmount } from "vue";
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from "@element-plus/icons-vue";
import type { ComponentSize } from "element-plus";
import { ElMessage, ElMessageBox, ElDialog } from "element-plus";
const currentPage = ref(1);
const totalNum = ref(0); // 存储商品总数的响应式变量
const currentPage2 = ref(1);
const totalNum2 = ref(0); // 存储商品总数的响应式变量
const currentPage3 = ref(1);
const totalNum3 = ref(0); // 存储商品总数的响应式变量

// 响应式页面大小
const pageSize = ref(8);
const pageSize2 = ref(8);
const pageSize3 = ref(8);

// 检测屏幕宽度并更新pageSize
const updatePageSize = () => {
  if (window.innerWidth >= 1300) {
    pageSize.value = 10;
    pageSize2.value = 10;
    pageSize3.value = 10;
  } else if (window.innerWidth <= 768) {
    pageSize.value = 6;
    pageSize2.value = 6;
    pageSize3.value = 6;
  } else {
    pageSize.value = 8;
    pageSize2.value = 8;
    pageSize3.value = 8;
  }
};

// 添加和移除resize事件监听器
onMounted(() => {
  updatePageSize();
  window.addEventListener("resize", updatePageSize);
  fetchStudentInfo();
  fetchSocialExperience();
  fetchPunishInfo();
  fetchScholarshipInfo();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updatePageSize);
});

const size = ref<ComponentSize>("default");
const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px",
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  };
});
const rules = reactive({
  telephone: [
    { required: true, message: "手机号不能为空", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
  email: [
    { required: true, message: "Email不能为空", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Email格式不正确",
      trigger: "blur",
    },
  ],
});
//个人信息
const studentInfo = ref({});
const showEditDialog = ref(false); // 控制编辑对话框显示
const fundPunishVo = ref([]);
const fundScholarshipVo = ref([]); // 奖学金信息
const socialExperienceData = ref<SocialExperience[]>([]); //社会经历
const newExperience = ref({
  startDate: "",
  endDate: "",
  experience: "",
});
const showAddExperienceDialog = ref(false); // 初始值为 false

// 初始化 editInfo 对象
const editInfo = reactive({
  degree: "",
  grade: "",
  political: "",
  marry: "",
  apartment: "",
  dormitory: "",
  homeAddress: "",
  college: "",
  telephone: "",
  major: "",
  email: "",
  status: "",
  birthday: "",
  fundType: "",
});
const authToken = localStorage.getItem("token");
axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
const fetchStudentInfo = async () => {
  try {
    const response = await axios.get(
      "http://59.110.62.188:8080/grow/userOwnInfo/list",
      {
        params: {},
      }
    );
    if (response.data.code === 200) {
      studentInfo.value = response.data.data.fundUserInfoVo;
      fundPunishVo.value = response.data.data.fundPunishVo.map((item) => ({
        ...item,
        category: formatPunishType(item.category),
      }));
      fundScholarshipVo.value = response.data.data.fundScholarshipVo.map(
        (item) => ({
          ...item,
          type: formatFundType(item.type),
        })
      );
      (socialExperienceData.value = response.data.data.fundProjectVo),
        // 初始化 editInfo 对象
        (editInfo.degree = studentInfo.value.degree || "");
      editInfo.grade = studentInfo.value.grade || "";
      editInfo.political = studentInfo.value.political || "";
      editInfo.marry = studentInfo.value.marry || "";
      editInfo.apartment = studentInfo.value.apartment || "";
      editInfo.dormitory = studentInfo.value.dormitory || "";
      editInfo.homeAddress = studentInfo.value.homeAddress || "";
      editInfo.college = studentInfo.value.college || "";
      editInfo.telephone = studentInfo.value.telephone || "";
      editInfo.major = studentInfo.value.major || "";
      editInfo.email = studentInfo.value.email || "";
      editInfo.status = studentInfo.value.status || "";
      editInfo.birthday = studentInfo.value.birthday || "";
      editInfo.fundType = studentInfo.value.fundType || "";
      // 更新其他信息
      newExperience.value = {
        startDate: newExperience.value.startDate || "",
        endDate: newExperience.value.endDate || "",
        experience: newExperience.value.experience || "",
      };
    }
  } catch (error) {
    console.error("获取学生信息失败", error);
  }
};
fetchStudentInfo();
// 个人奖励分页
const fetchScholarshipInfo = async () => {
  try {
    const response = await axios.get(
      "http://59.110.62.188:8080/grow/userOwnInfo/list",
      {
        params: {
          pageNum: currentPage3.value,
          pageSize: pageSize3.value,
        },
      }
    );
    if (response.data.code === 200) {
      fundScholarshipVo.value = response.data.data.fundScholarshipVo.map(
        (item) => ({
          ...item,
          //type: formatScholarshipType(item.type) // 格式化奖励类型
          type: formatFundType(item.type),
        })
      );
      totalNum3.value = response.data.data.scholarshipTotal; // 更新总记录数
    } else {
      console.error("获取个人奖励信息失败", response.data.msg);
    }
  } catch (error) {
    console.error("获取个人奖励信息失败", error);
  }
};
// 监听页码变化
const handlePageChange3 = (newPage: number) => {
  currentPage3.value = newPage;
  fetchScholarshipInfo(); // 重新获取数据
};
onMounted(() => {
  fetchScholarshipInfo();
});
//学生惩罚分页
const fetchPunishInfo = async () => {
  try {
    const response = await axios.get(
      "http://59.110.62.188:8080/grow/userOwnInfo/list",
      {
        params: {
          pageNum: currentPage2.value,
          pageSize: pageSize2.value,
        },
      }
    );
    if (response.data.code === 200) {
      fundPunishVo.value = response.data.data.fundPunishVo.map((item) => ({
        ...item,
        category: formatPunishType(item.category), // 格式化处罚类型
      }));
      totalNum2.value = response.data.data.punishTotal; // 更新总记录数
    } else {
      console.error("获取个人处分信息失败", response.data.msg);
    }
  } catch (error) {
    console.error("获取个人处分信息失败", error);
  }
};

// 监听页码变化
const handlePageChange2 = (newPage: number) => {
  currentPage2.value = newPage; // 更新当前页码
  fetchPunishInfo(); // 重新获取数据
};

// 在组件加载时获取数据
onMounted(() => {
  fetchPunishInfo();
});
// 社会经历分页
const fetchSocialExperience = async () => {
  try {
    const response = await axios.get(
      "http://59.110.62.188:8080/grow/userOwnInfo/list",
      {
        params: {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
        },
      }
    );
    if (response.data.code === 200) {
      socialExperienceData.value = response.data.data.fundProjectVo; // 社会经历数据
      totalNum.value = response.data.data.projectTotal; // 总记录数
    } else {
      console.error("获取数据失败", response.data.msg);
    }
  } catch (error) {
    console.error("获取数据失败", error);
  }
};

onMounted(() => {
  fetchSocialExperience(); // 在组件加载时获取数据
});

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage; // 更新当前页码
  fetchSocialExperience(); // 重新获取数据
};
//编辑个人信息
interface User {
  type1: any;
  type2: any;
  content1: any;
  content2: any;
}
const editForm = ref(null);

const saveEditInfo = async () => {
  if (editForm.value) {
    try {
      await editForm.value.validate();
      const dataToSubmit = {
        degree: editInfo.degree,
        grade: editInfo.grade,
        college: editInfo.college,
        email: editInfo.email,
        apartment: editInfo.apartment,
        dormitory: editInfo.dormitory,
        telephone: editInfo.telephone,
        homeAddress: editInfo.homeAddress,
        political: editInfo.political,
        birthday: editInfo.birthday,
        major: editInfo.major,
        marry: editInfo.marry,
        status: editInfo.status,
      };
      const response = await axios.post(
        "http://59.110.62.188:8080/grow/userInfo/updateUserInfo",
        dataToSubmit
      );
      if (response.data.code === 200) {
        ElMessage.success("信息更新成功");
        await fetchStudentInfo();
        showEditDialog.value = false;
      } else {
        console.error("信息更新失败", response.data.msg);
        ElMessage.error(response.data.msg);
      }
    } catch (error) {
      console.error("请求失败", error);
      ElMessage.error("请求失败");
    }
  }
};

//社会经历
const addExperience = async () => {
  try {
    const response = await axios.post(
      "http://59.110.62.188:8080/grow/project/addProject",
      {
        pageSize: 8,
        pageNum: pageNum,
        startDate: newExperience.value.startDate,
        endDate: newExperience.value.endDate,
        experience: newExperience.value.experience,
      }
    );
    if (response.data.code === 200) {
      ElMessage.success("社会经历添加成功");
      await fetchStudentInfo();
      showAddExperienceDialog.value = false;
    } else {
      ElMessage.error("社会经历添加成功");
      console.error("信息更新失败", response.data.msg);
    }
  } catch (error) {
    console.error("请求失败", error);
  }
};

// 婚姻状况选项
const marryOptions = ref([
  { value: "0", label: "未婚" },
  { value: "1", label: "已婚" },
]);

// 状态选项
const statusOptions = ref([
  { value: "0", label: "在校" },
  { value: "1", label: "肄业" },
  { value: "2", label: "离校" },
  { value: "3", label: "未知" },
]);
const majorOptions = ref([
  { value: "51", label: "图书馆学" },
  { value: "61", label: "生物技术" },
  { value: "60", label: "生物科学" },
  { value: "59", label: "应用化学" },
  { value: "58", label: "化学" },
  { value: "57", label: "电气工程及其自动化" },
  { value: "56", label: "电子信息科学与技术" },
  { value: "55", label: "材料物理" },
  { value: "54", label: "物理学" },
  { value: "53", label: "智能科学与技术" },
  { value: "52", label: "信息资源管理" },
  { value: "62", label: "药学" },
  { value: "50", label: "软件工程" },
  { value: "49", label: "计算机科学与技术" },
  { value: "48", label: "教育技术学" },
  { value: "47", label: "应用统计学" },
  { value: "46", label: "经济统计学" },
  { value: "45", label: "数据科学与大数据技术" },
  { value: "44", label: "统计学" },
  { value: "43", label: "数学与应用数学" },
  { value: "42", label: "社会学" },
  { value: "72", label: "运动训练" },
  { value: "81", label: "汉语言" },
  { value: "80", label: "广播电视学" },
  { value: "79", label: "数字媒体技术" },
  { value: "78", label: "播音与主持艺术" },
  { value: "77", label: "广播电视编导" },
  { value: "76", label: "广告学" },
  { value: "75", label: "新闻学" },
  { value: "74", label: "冰雪运动" },
  { value: "73", label: "武术与民族传统体育" },
  { value: "41", label: "社会工作" },
  { value: "71", label: "体育教育" },
  { value: "70", label: "环境生态工程" },
  { value: "69", label: "环境工程" },
  { value: "68", label: "环境科学" },
  { value: "67", label: "生态学" },
  { value: "66", label: "自然地理与资源环境" },
  { value: "65", label: "地理信息科学" },
  { value: "64", label: "人文地理与城乡规划" },
  { value: "63", label: "地理科学" },
  { value: "10", label: "物流管理" },
  { value: "20", label: "汉语言文学" },
  { value: "19", label: "工商管理" },
  { value: "18", label: "财务管理" },
  { value: "17", label: "人力资源管理" },
  { value: "16", label: "会计学" },
  { value: "15", label: "市场营销" },
  { value: "14", label: "国际经济与贸易" },
  { value: "13", label: "金融学" },
  { value: "12", label: "财政学" },
  { value: "11", label: "经济学" },
  { value: "21", label: "汉语国际教育" },
  { value: "9", label: "政治学与行政学" },
  { value: "8", label: "行政管理" },
  { value: "7", label: "思想政治教育" },
  { value: "6", label: "国际政治" },
  { value: "5", label: "法学" },
  { value: "4", label: "心理学" },
  { value: "3", label: "公共事业管理" },
  { value: "2", label: "小学教育" },
  { value: "1", label: "学前教育" },
  { value: "31", label: "舞蹈编导" },
  { value: "40", label: "哲学" },
  { value: "39", label: "数字媒体艺术" },
  { value: "38", label: "表演" },
  { value: "37", label: "产品设计" },
  { value: "36", label: "服装与服饰设计" },
  { value: "35", label: "环境设计" },
  { value: "34", label: "视觉传达设计" },
  { value: "33", label: "雕塑" },
  { value: "32", label: "美术学" },
  { value: "0", label: "教育学" },
  { value: "30", label: "音乐学" },
  { value: "29", label: "德语" },
  { value: "28", label: "商务英语" },
  { value: "27", label: "日语" },
  { value: "26", label: "俄语" },
  { value: "25", label: "英语" },
  { value: "24", label: "考古学" },
  { value: "23", label: "旅游管理" },
  { value: "22", label: "历史学" },
]);
const politicalOptions = ref([
  { value: "0", label: "共青团员" },
  { value: "1", label: "中共党员" },
  { value: "2", label: "中共预备党员" },
  { value: "3", label: "民革党员" },
  { value: "4", label: "民盟盟员" },
  { value: "5", label: "民建会员" },
  { value: "6", label: "民进会员" },
  { value: "7", label: "农工党党员" },
  { value: "8", label: "致公党党员" },
  { value: "9", label: "九三学社社员" },
  { value: "10", label: "台盟盟员" },
  { value: "11", label: "无党派人士" },
  { value: "12", label: "群众" },
]);

const collegeOptions = ref([
  { value: "0", label: "教育学部" },
  { value: "1", label: "心理学院" },
  { value: "2", label: "政法学院" },
  { value: "3", label: "经济与管理学院" },
  { value: "4", label: "文学院" },
  { value: "5", label: "历史文化学院" },
  { value: "6", label: "外国语学院" },
  { value: "7", label: "音乐学院" },
  { value: "8", label: "美术学院" },
  { value: "9", label: "马克思主义学部" },
  { value: "10", label: "数学与统计学院" },
  { value: "11", label: "信息科学与技术学院" },
  { value: "12", label: "物理学院" },
  { value: "13", label: "化学学院" },
  { value: "14", label: "生命科学学院" },
  { value: "15", label: "地理科学学院" },
  { value: "16", label: "环境学院" },
  { value: "17", label: "体育学院" },
  { value: "18", label: "传媒科学学院" },
  { value: "19", label: "国际汉学院" },
  { value: "99", label: "未知学院" },
]);
const degreeOptions = ref([
  { value: "0", label: "本科" },
  { value: "1", label: "研究生" },
  { value: "99", label: "未知" }, // 假设 '99' 或其他特定值用于表示未知学历
]);
//奖学金
const formatFundType = (fundType: string): string => {
  switch (fundType) {
    case "0":
      return "国家奖学金";
    case "1":
      return "国家励志奖学金";
    case "2":
      return "学校励志奖学金";
    case "3":
      return "励志学子";
    case "4":
      return "宝钢奖学金";
    case "5":
      return "小米奖学金";
    case "6":
      return "小米特等奖";
    case "7":
      return "恒兴助学奖学金";
    case "8":
      return "小米助学金";
    case "9":
      return "理想与成才";
    default:
      return "未知";
  }
};
// 处罚类型
const formatPunishType = (punishType: string): string => {
  switch (punishType) {
    case "0":
      return "警告";
    case "1":
      return "严重警告";
    case "2":
      return "记过";
    case "3":
      return "留校察看";
    case "4":
      return "开除学籍";
    default:
      return "未知";
  }
};
// 婚烟状态
const formatMarry = (marry: string): string => {
  switch (marry) {
    case "0":
      return "未婚";
    case "1":
      return "已婚";
    default:
      return "未知";
  }
};
// 资助等级
const formatAssistLevel = (assistLevel: string): string => {
  switch (assistLevel) {
    case "0":
      return "经济关注对象";
    case "1":
      return "特别资助对象";
    case "2":
      return "重点资助对象";
    case "3":
      return "一般资助对象";
    case "4":
      return "公费师范生";
    default:
      return "未知";
  }
};
//专业
const formatMajor = (majorCode: string): string => {
  switch (majorCode) {
    case "51":
      return "图书馆学";
    case "61":
      return "生物技术";
    case "60":
      return "生物科学";
    case "59":
      return "应用化学";
    case "58":
      return "化学";
    case "57":
      return "电气工程及其自动化";
    case "56":
      return "电子信息科学与技术";
    case "55":
      return "材料物理";
    case "54":
      return "物理学";
    case "53":
      return "智能科学与技术";
    case "52":
      return "信息资源管理";
    case "62":
      return "药学";
    case "50":
      return "软件工程";
    case "49":
      return "计算机科学与技术";
    case "48":
      return "教育技术学";
    case "47":
      return "应用统计学";
    case "46":
      return "经济统计学";
    case "45":
      return "数据科学与大数据技术";
    case "44":
      return "统计学";
    case "43":
      return "数学与应用数学";
    case "42":
      return "社会学";
    case "72":
      return "运动训练";
    case "81":
      return "汉语言";
    case "80":
      return "广播电视学";
    case "79":
      return "数字媒体技术";
    case "78":
      return "播音与主持艺术";
    case "77":
      return "广播电视编导";
    case "76":
      return "广告学";
    case "75":
      return "新闻学";
    case "74":
      return "冰雪运动";
    case "73":
      return "武术与民族传统体育";
    case "41":
      return "社会工作";
    case "71":
      return "体育教育";
    case "70":
      return "环境生态工程";
    case "69":
      return "环境工程";
    case "68":
      return "环境科学";
    case "67":
      return "生态学";
    case "66":
      return "自然地理与资源环境";
    case "65":
      return "地理信息科学";
    case "64":
      return "人文地理与城乡规划";
    case "63":
      return "地理科学";
    case "10":
      return "物流管理";
    case "20":
      return "汉语言文学";
    case "19":
      return "工商管理";
    case "18":
      return "财务管理";
    case "17":
      return "人力资源管理";
    case "16":
      return "会计学";
    case "15":
      return "市场营销";
    case "14":
      return "国际经济与贸易";
    case "13":
      return "金融学";
    case "12":
      return "财政学";
    case "11":
      return "经济学";
    case "21":
      return "汉语国际教育";
    case "9":
      return "政治学与行政学";
    case "8":
      return "行政管理";
    case "7":
      return "思想政治教育";
    case "6":
      return "国际政治";
    case "5":
      return "法学";
    case "4":
      return "心理学";
    case "3":
      return "公共事业管理";
    case "2":
      return "小学教育";
    case "1":
      return "学前教育";
    case "31":
      return "舞蹈编导";
    case "40":
      return "哲学";
    case "39":
      return "数字媒体艺术";
    case "38":
      return "表演";
    case "37":
      return "产品设计";
    case "36":
      return "服装与服饰设计";
    case "35":
      return "环境设计";
    case "34":
      return "视觉传达设计";
    case "33":
      return "雕塑";
    case "32":
      return "美术学";
    case "0":
      return "教育学";
    case "30":
      return "音乐学";
    case "29":
      return "德语";
    case "28":
      return "商务英语";
    case "27":
      return "日语";
    case "26":
      return "俄语";
    case "25":
      return "英语";
    case "24":
      return "考古学";
    case "23":
      return "旅游管理";
    case "22":
      return "历史学";
    default:
      return "未知";
  }
};
// 政治面貌
const politicalAppearance = (political: string): string => {
  switch (political) {
    case "0":
      return "共青团员";
    case "1":
      return "中共党员";
    case "2":
      return "中共预备党员";
    case "3":
      return "民革党员";
    case "4":
      return "民盟盟员";
    case "5":
      return "民建会员";
    case "6":
      return "民进会员";
    case "7":
      return "农工党党员";
    case "8":
      return "致公党党员";
    case "9":
      return "九三学社社员";
    case "10":
      return "台盟盟员";
    case "11":
      return "无党派人士";
    case "12":
      return "群众";
    default:
      return "未知";
  }
};
//民族
const formatEthnicGroup = (ethnicGroup: string): string => {
  switch (ethnicGroup) {
    case "0":
      return "汉族";
    case "1":
      return "蒙古族";
    case "2":
      return "回族";
    case "3":
      return "藏族";
    case "4":
      return "维吾尔族";
    case "5":
      return "苗族";
    case "6":
      return "彝族";
    case "7":
      return "壮族";
    case "8":
      return "布依族";
    case "9":
      return "朝鲜族";
    case "10":
      return "满族";
    case "11":
      return "侗族";
    case "12":
      return "瑶族";
    case "13":
      return "白族";
    case "14":
      return "土家族";
    case "15":
      return "哈尼族";
    case "16":
      return "哈萨克族";
    case "17":
      return "傣族";
    case "18":
      return "黎族";
    case "19":
      return "傈僳族";
    case "20":
      return "佤族";
    case "21":
      return "畲族";
    case "22":
      return "高山族";
    case "23":
      return "拉祜族";
    case "24":
      return "水族";
    case "25":
      return "东乡族";
    case "26":
      return "纳西族";
    case "27":
      return "景颇族";
    case "28":
      return "柯尔克孜族";
    case "29":
      return "土族";
    case "30":
      return "达斡尔族";
    case "31":
      return "仫佬族";
    case "32":
      return "羌族";
    case "33":
      return "布朗族";
    case "34":
      return "撒拉族";
    case "35":
      return "毛难族";
    case "36":
      return "仡佬族";
    case "37":
      return "锡伯族";
    case "38":
      return "阿昌族";
    case "39":
      return "普米族";
    case "40":
      return "塔吉克族";
    case "41":
      return "怒族";
    case "42":
      return "乌孜别克族";
    case "43":
      return "俄罗斯族";
    case "44":
      return "鄂温克族";
    case "45":
      return "崩龙族";
    case "46":
      return "保安族";
    case "47":
      return "裕固族";
    case "48":
      return "京族";
    case "49":
      return "塔塔尔族";
    case "50":
      return "独龙族";
    case "51":
      return "鄂伦春族";
    case "52":
      return "赫哲族";
    case "53":
      return "门巴族";
    case "54":
      return "珞巴族";
    case "55":
      return "基诺族";
    default:
      return "未知民族";
  }
};
//状态
const formatStatus = (Status: string): string => {
  switch (Status) {
    case "0":
      return "在校";
    case "1":
      return "肄业";
    case "2":
      return "离校";
    default:
      return "未知";
  }
};
//学历
const formatEducation = (assistLevel: string): string => {
  switch (assistLevel) {
    case "0":
      return "本科";
    case "1":
      return "研究生";
    default:
      return "未知";
  }
};
//性别
const formatSex = (sex: string): string => {
  switch (sex) {
    case "0":
      return "男";
    case "1":
      return "女";
    default:
      return "未知";
  }
};
//学院
const formatPoliticalAppearance = (political: string): string => {
  switch (political) {
    case "0":
      return "教育学部";
    case "1":
      return "心理学院";
    case "2":
      return "政法学院";
    case "3":
      return "经济与管理学院";
    case "4":
      return "文学院";
    case "5":
      return "历史文化学院";
    case "6":
      return "外国语学院";
    case "7":
      return "音乐学院";
    case "8":
      return "美术学院";
    case "9":
      return "马克思主义学部";
    case "10":
      return "数学与统计学院";
    case "11":
      return "信息科学与技术学院";
    case "12":
      return "物理学院";
    case "13":
      return "化学学院";
    case "14":
      return "生命科学学院";
    case "15":
      return "地理科学学院";
    case "16":
      return "环境学院";
    case "17":
      return "体育学院";
    case "18":
      return "传媒科学学院";
    case "19":
      return "国际汉学院";
    default:
      return "未知学院";
  }
};
</script>

<style>
:deep(.my-label) {
  background: var(--el-color-success-light-9) !important;
}
:deep(.my-content) {
  background: var(--el-color-danger-light-9);
}
.el-table tr {
  background-color: var(--el-table-tr-bg-color);
  height: 55px;
}

.tab-content {
  max-height: 75vh;
  max-width: 90vw;
  width: 84vw;
  height: 94%;
  margin-left: 2vw;
  margin-right: 2vw;
  overflow: auto;
  /* background-color:#fafafa; */
}
.el-descriptions {
  margin-top: 20px;
  margin-left: 1vw;
  margin-right: 1vw;
}
.background1 {
  background: #ebf0fc;
}
.el-tabs--border-card {
  background: var(--el-bg-color-overlay);
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: var(--el-bg-color-overlay);
  border-left-color: var(--el-border-color);
  border-right-color: var(--el-border-color);
  border-bottom-color: var(--el-border-color);
  color: var(--el-color-primary);
}
.el-tabs {
  --el-tabs-header-height: 55px;
  display: flex;
}
.el-radio-button {
  height: 150px;
}
.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
.el-tabs--top {
  margin-left: 4vw;
  margin-right: 4vw;
  margin-top: 3px;
}
.el-descriptions__cell {
  width: 10px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
.tab-content1 {
  width: 77vw;
  height: 80vh;
  max-height: 75vh;
  overflow: auto;
  overflow-x: hidden;
  /* background-color:#ffffff; */
}
/* 编辑个人信息 */
/* 编辑对话框样式 */

.edit-dialog {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 680px;
  width: 100%;
  overflow: hidden;
}
.el-table--fit .el-table__inner-wrapper:before {
  width: 90%;
}
.el-form {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}
/* 遮罩层样式 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-content {
  max-height: 80vh;
  overflow-y: auto;
}

#dialog-title {
  line-height: 50px;
  font-size: 25px;
  font-weight: bold;
  color: #0d5ccb;
  width: 153px;
  margin-right: 0px;
  padding-right: 0px;
}
.dialog-content h3 {
  text-align: center;
}
.changeInfomation {
  margin: 3vh;
}
.basicIn {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  /* border-bottom: #a5a6a6 4px double; */
}
.context {
  width: 21vw;
  margin-right: 0;
  padding: 10px;
}
h3 {
  padding-top: 5px;
}

.change {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-direction: row;
  /* margin-bottom:15px; */
}
.changeInfor {
  /* width: 200px; */
  width: 260px;
  margin-left: 30px;
  height: 45px;
}
.change2 {
  display: flex;
  flex-direction: column;
  margin-left: 2vw;
}
.changeInfor2 {
  /* width: 60vw; */
  height: 50%;
  margin-top: 10px;
}
.btn {
  float: right;
  margin: 10px;
}
/* 编辑个人信息基本信息 */
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.emailchange {
  margin-left: 20px;
}
/* 个人处罚 */
.el-table-v2__main {
  background-color: var(--el-bg-color);
  display: flex;
  flex-direction: column-reverse;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 90%;
}
.button1 {
  float: right;
  margin-bottom: 10px;
  margin-top: 10px;
}
.biaoge {
  margin-top: 20px;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.add-dialog {
  width: 600px;
  border-radius: 10px;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: rgb(51.2, 126.4, 204);
  text-decoration: none;
  cursor: pointer;
}
.biaoti {
  display: flex;
  justify-content: space-between;
}

.el-table-v2__main {
  background-color: var(--el-bg-color);
  display: flex;
  flex-direction: column-reverse;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  margin-left: 20px;
  margin-right: 20px;
  max-height: 100vh;
  max-width: 100vw;
  overflow: auto;
  width: 100%;
}
.el-descriptions--large
  .el-descriptions__body
  .el-descriptions__table.is-bordered
  .el-descriptions__cell {
  width: 120px;
}

element.style {
  position: relative;
  overflow: hidden;
  will-change: transform;
  direction: ltr;
  height: 100%;
  width: 100%;
}
#pagenation2 {
  position: fixed;
  bottom: 1.5vh;
  width: 84vw;
  text-align: center;
  display: flex;
  justify-content: center;
}
.label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px; /* 根据需要调整宽度 */
  font-size: 20px; /* 保持与字体大小一致 */
  color: var(--el-text-color-regular);
}
#label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100px; /* 根据需要调整宽度 */
  font-size: 20px; /* 保持与字体大小一致 */
  color: var(--el-text-color-regular);
}
</style>
