<template>
  <div class="form-container" v-if="studentInfo">
    <h2>学生信息</h2>
    <div class="form-item">
      <div class="field">
        <label>姓名：</label>
        <span>{{ studentInfo.name || "未知" }}</span>
      </div>
      <div class="field">
        <label>学号：</label>
        <span>{{ studentInfo.studentId || "未知" }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="field">
        <label>学位：</label>
        <span>{{ formatDegree(studentInfo.degree) || "未知" }}</span>
      </div>
      <div class="field">
        <label>年级：</label>
        <span>{{ studentInfo.grade || "未知" }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="field">
        <label>生日：</label>
        <span>{{ formattedBirthday || "未知" }}</span>
      </div>
      <div class="field">
        <label>入学时间：</label>
        <span>{{ studentInfo.admissionDate || "未知" }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="field">
        <label>学院：</label>
        <span>{{ formatCollege(studentInfo.college) || "未知" }}</span>
      </div>
      <div class="field">
        <label>专业：</label>
        <span>{{ formatMajor(studentInfo.major) || "未知" }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="field">
        <label>公寓：</label>
        <span>{{ studentInfo.apartment || "未知" }}</span>
      </div>
      <div class="field">
        <label>宿舍：</label>
        <span>{{ studentInfo.dormitory || "未知" }}</span>
      </div>
    </div>
    <div class="form-item">
      <div class="field">
        <label>民族：</label>
        <span>{{ formatEthnicity(studentInfo.nationality) || "未知" }}</span>
      </div>
      <div class="field">
        <label>家庭住址：</label>
        <span>{{ studentInfo.homeAddress || "未知" }}</span>
      </div>
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { defineEmits } from "vue";
import { computed } from "vue";
// 定义父组件传递的事件
const emit = defineEmits(["roleName"]);

// 定义响应式数据存储学生信息
const studentInfo = ref(null);
const defaultStudentInfo = {
  name: "未知",
  studentId: "未知",
  degree: "未知",
  grade: "未知",
  birthday: "未知",
  admissionDate: "未知",
  college: "未知",
  major: "未知",
  nationality: "未知",
  dormitory: "未知",
  apartment: "未知",
  homeAddress: "未知",
};

// 获取Token和ClientID
const token = localStorage.getItem("token");
const clientid = localStorage.getItem("client_id");

// 获取学生信息的函数
const fetchStudentInfo = async () => {
  try {
    const response = await axios.get(
      "http://59.110.62.188:8080/system/user/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`, // 将Token加入请求头
          clientid: clientid,
        },
      }
    );
    studentInfo.value = response.data.data.fundUserInfo;
    emit("roleName", response.data.data.roleGroup);
    // 存储字典接口相关的字段
    // const degreeDictCode = studentInfo.value.degree    // 学位字典编码
    // const collegeDictCode = studentInfo.value.college   // 学院字典编码
    // const nationalityDictCode = studentInfo.value.nationality // 民族字典编码
    // const majorDictCode = studentInfo.value.major    // 专业字典编码
    // const apartmentDictCode = studentInfo.value.apartment // 公寓字典编码

    //     // 获取字典信息
    //     fetchDictData(degreeDictCode, 'degree')
    //     fetchDictData(collegeDictCode, 'college')
    //     fetchDictData(nationalityDictCode, 'nationality')
    //     fetchDictData(majorDictCode, 'major')
    //      fetchDictData(apartmentDictCode, 'apartment')
  } catch (error) {
    console.error("获取学生信息失败:", error);
    studentInfo.value = defaultStudentInfo;
  }
};
// 生日格式
const formattedBirthday = computed(() => {
  if (!studentInfo.value.birthday) return "";

  const birthday = new Date(studentInfo.value.birthday);
  const year = birthday.getFullYear();

  // 获取月份，如果月份小于10则直接取月份数字
  const month = birthday.getMonth() + 1;
  const day = birthday.getDate();

  return `${year}年${month}月${day}日`;
});

// // 获取字典数据的函数
// const fetchDictData = async (dictCode, type) => {
//   try {
//     const response = await axios.get(`http://59.110.62.188:8080/system/dict/data/${dictCode}`, {
//       headers: {
//         Authorization: `Bearer ${token}`, // 使用存储的 Token
//         clientid: clientid
//       }
//     })
//     const dictLabel = response.data.data.dictLabel // 获取字典标签
//     if (type === 'degree') {
//       studentInfo.value.degree = dictLabel // 设置学位
//     } else if (type === 'college') {
//       studentInfo.value.college = dictLabel // 设置学院
//     } else if (type === 'nationality') {
//       studentInfo.value.nationality = dictLabel // 设置民族
//     } else if (type === 'major') {
//       studentInfo.value.major = dictLabel // 设置专业
//     } else if (type === 'apartment') {
//       studentInfo.value.apartment = dictLabel // 设置公寓
//     }
//   } catch (error) {
//     console.error(`${type} 字典数据获取失败`, error)
//   }
// }
// 学历
const formatDegree = (degree: string): string => {
  switch (degree) {
    case "0":
      return "本科";
    case "1":
      return "研究生";
    default:
      return "未知";
  }
};
// 民族
const formatEthnicity = (code: string): string => {
  switch (code) {
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
      return "未知";
  }
};
// 学院
const formatCollege = (collegeCode: string): string => {
  switch (collegeCode) {
    case "10":
      return "数学与统计学院";
    case "19":
      return "国际汉学院";
    case "18":
      return "传媒科学学院";
    case "17":
      return "体育学院";
    case "16":
      return "环境学院";
    case "15":
      return "地理科学学院";
    case "14":
      return "生命科学学院";
    case "13":
      return "化学学院";
    case "12":
      return "物理学院";
    case "11":
      return "信息科学与技术学院";
    case "0":
      return "教育学部";
    case "9":
      return "马克思主义学部";
    case "8":
      return "美术学院";
    case "7":
      return "音乐学院";
    case "6":
      return "外国语学院";
    case "5":
      return "历史文化学院";
    case "4":
      return "文学院";
    case "3":
      return "经济与管理学院";
    case "2":
      return "政法学院";
    case "1":
      return "心理学院";
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
// 在组件挂载时调用
onMounted(() => {
  fetchStudentInfo();
});
</script>

<style scoped>
/* 设置表单容器 */
.form-container {
  background-color: #fff;
  color: #333;
  width: 100%;
  height: 100%;
  padding: 0px 0px;
}
/* 标题样式 */
h2 {
  text-align: center;
  font-size: 2.1vw;
  margin-bottom: 6vh;
  color: #2d4059;
  font-weight: 600;
}

/* 表单项布局 */
.form-item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 3.2vh;
  padding: 0.7vw;
  border-bottom: 1px solid #e0e0e0;
}

.form-item:last-child {
  border-bottom: none;
}

.field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 45%;
  margin-right: 5%;
}

.field:last-child {
  margin-right: 0;
}

.field label {
  font-size: 1.1vw;
  font-weight: 500;
  color: #555;
  width: 7vw;
  white-space: nowrap;
}

.field span {
  font-size: 1.1vw;
  color: #333;
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
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
    padding: 10px;
    width: 180%;
  }

  h2 {
    font-size: 4vw;
    margin-bottom: 2vh;
  }

  .field label {
    font-size: 3.2vw;
    line-height: 4vw;
  }

  .field span {
    width: 50%;
    font-size: 3.2vw;
    line-height: 4vw;
    text-align: left;
    margin-left: 8vw;
  }
}
</style>
