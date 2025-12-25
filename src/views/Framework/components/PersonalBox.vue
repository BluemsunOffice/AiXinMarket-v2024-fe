
<template>
  <div class="profile-container">
    <div class="profile-box">
      <!-- 头像 -->
      <div class="avatar">
        <el-row justify="center" align="middle">
          <el-col :span="24">
            <div class="avatar-wrapper" @mouseenter="isHover = true" @mouseleave="isHover = false" @click="triggerFileInput">
              <el-avatar 
                :size="avatarSize"
                :src="circleUrl" 
                class="avatar-image"
              />

              <div v-if="isHover" class="avatar-overlay">
                <div class="overlay-text">上传头像</div>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                class="file-input" 
                @change="handleFileChange"
                accept="image/*"
              />
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 个人信息 -->
      <div class="info">
        <h2 class="name">{{ name }}</h2>
        <div class="info-item">
          <i class="iconfont icon-studentId "></i>
          <span><strong>学号:</strong> {{ studentId }}</span>
        </div>

        <div class="info-item">
          <i class="iconfont icon-deptName"></i>
          <span><strong>校区:</strong> {{ deptName }}</span>
        </div>
        <div class="info-item">
          <i class="iconfont icon-role"></i>
          <span><strong>角色:</strong> {{ role }}</span>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'
import { reactive, toRefs,computed,watch } from 'vue'
import { ElMessage } from 'element-plus'
const avatarSize = ref(100);

const handleResize = () => {
  const width = window.innerWidth;
  if (width < 768) {
    avatarSize.value = 50;
  } else if (width < 1200) {
    avatarSize.value = 100;
  } else {
    avatarSize.value = 140;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

watch(() => window.innerWidth, handleResize);

const state = reactive({
  circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  isHover: false
})

const { circleUrl,isHover } = toRefs(state)
const name = ref('')
const studentId = ref('')
const deptName = ref('')
const role = ref('')

const token = localStorage.getItem('token')
const clientid = localStorage.getItem('client_id')

const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`http://59.110.62.188:8080/system/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        clientid:clientid
      },
    })

    const data = {}
    data.value = response.data.data.user
    circleUrl.value = data.value.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    name.value = data.value.nickName || '未知'
    studentId.value = data.value.userName || '未知'
    deptName.value = data.value.deptName || '未知'
    role.value = data.value.roles[0].roleName || '未知'
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

// 组件挂载时请求数据
onMounted(() => {
  fetchUserInfo()
})


// 上传头像
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image')) {
    const reader = new FileReader()
    reader.onload = () => {
      circleUrl.value = reader.result
    }
    reader.readAsDataURL(file)
    uploadAvatar(file)
  }
}

// 调用接口上传头像
const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatarfile', file)

  try {
    const response = await axios.post('http://59.110.62.188:8080/system/user/profile/avatar', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        clientid:clientid,
      },
    })
    if (response.data.code === 200) {
      ElMessage.success('头像上传成功！');
    } else {
      ElMessage.error(response.data.msg+'!');
    }
  } catch (error) {
    ElMessage.error('头像上传请求失败！');
  }
}

const triggerFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]')
  fileInput.click()
}
</script>

<style scoped>

/* 头像外部包裹容器 */
.avatar-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

/* 头像的样式 */
.avatar-image {
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

/* Hover效果：头像透明度 */
.avatar-wrapper:hover .avatar-image {
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

/* 显示“上传头像”文本的层 */
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1.4vw;
  font-weight: bold;
  border-radius: 50%;
  padding: 0.7vw;
  transition: opacity 0.6s ease;
}

/* 隐藏文件输入框 */
.file-input {
  display: none;
}

/* 结束 */

/* 背景渐变 */
.profile-container {
  margin-top: 1.5vw;
}

/* 个人信息盒子 */
.profile-box {
  width: 20vw;
  padding: 2.3vw;
  border-radius: 20px;
  margin-left:2vw;
  background-color: #fff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  overflow: hidden;
  transform: translateY(-20px);
  transition: all 0.3s ease-in-out;
}

.profile-box:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);

}

/* 头像 */
.avatar {
  margin-bottom: 1.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-basic {
  text-align: center;
}
.demo-basic .sub-title {
  margin-bottom: 1.5vw;
  font-size: 1.1vw;
  color: var(--el-text-color-secondary);
}
.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demo-basic .block:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
.demo-basic .block {
  flex: 1;
}
.demo-basic .el-col:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
/* 个人信息区域 */
.info {
  margin-top: 1.1vw;
  color: #333;
}

/* 姓名样式 */
.name {
  font-size: 1.85vw;
  font-weight: bold;
  color: #2d4059;
  margin-bottom:4vh;
}

/* 信息项 */
.info-item {
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 2vh;
  font-size: 1.18vw;
  color: #555;
}

.info-item i {
  font-size: 1.5vw;
  margin-right: 0.5vw;
  color: #3f72af;
}

strong {
  color: #333;
  font-weight: bold;
}

/* Iconfont 样式 */
.icon-studentId::before {
  content: '\e67e';
}
.icon-sex::before {
  content: '\e7f8';
}
.icon-deptName::before {
  content: '\e76c';
}
.icon-role::before {
  content: '\e689';
}
.icon-phonenumber::before {
  content: '\e840';
}
.icon-email::before {
  content: '\e605';
}
@font-face {
  font-family: 'iconfont';
  src: url('../../assets/iconfont.woff2') format('woff2'),
       url('../../assets/iconfont.woff') format('woff'),
       url('../../assets/iconfont.ttf') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@media (max-width: 768px) {

  .profile-box {
    width: 95%;
    margin-left:0vw;
    margin-bottom:2vw;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* 无圆角和阴影 */
    border-radius: 0;
    box-shadow: none;
    transform: none;
  }
  .profile-box:hover {
     transform: none;
     box-shadow:none;
  }
  .name {
    font-size: 3.5vw;
    margin-bottom: 1.1vh;
  }

  .info-item {
    font-size: 3vw;
  }

  .info-item i {
    font-size: 3vw;
  }
}
</style>
