<template>
<div>
    <el-container class="layout-container-demo" style="height: 100vh">
     <!-- 侧边栏显示/隐藏按钮 -->
      <el-button class="menu-toggle" @click="toggleSidebar" v-if="isMobile">
        <el-icon v-if="sidebarVisible">
          <ArrowLeft />
        </el-icon>
        <el-icon v-else>
          <ArrowRight />
        </el-icon>
      </el-button>
      <!-- 左侧边栏 -->
    <el-aside v-if="sidebarVisible || !isMobile" :width="isMobile ? '60vw' : '16vw'" class="sidebar">
      <el-scrollbar style="height: 100%">
        <el-menu :default-active="activeMenu" :default-openeds="['1']" class="sidebar-menu">
          <!-- 侧边栏标题 -->
          <div index="0" class="sidebar-title" disabled>{{ role }}-导航</div>

          <!-- 个人中心 -->
          <el-menu-item
            index="1"
            :class="{ active: currentPage === 'personalCenter' }"
            class="menu-item"
          >
            个人中心
          </el-menu-item>

          <!-- 爱心超市 -->
          <el-menu-item
            v-show="role == '资助对象'||role=='超级管理员'"
            index="2"
            @click="handleMenuClick('superMarket')"
            :class="{ active: currentPage === 'superMarket' }"
            class="menu-item"
          >
            爱心超市
          </el-menu-item>
          <!-- 超市管理员 -->
          <el-menu-item
            v-show="role == '超市管理员'||role=='超级管理员'"
            index="3"
            @click="handleMenuClick('superMarketManage')"
            :class="{ active: currentPage === 'superMarketManage' }"
            class="menu-item"
          >
            爱心超市管理员
          </el-menu-item>

          <!-- 个人档案 -->
          <el-menu-item
            v-show="role == '资助对象'||role=='超级管理员'"
            index="4"
            @click="handleMenuClick('personalProfile')"
            :class="{ active: currentPage === 'personalProfile' }"
            class="menu-item"
          >
            个人档案
          </el-menu-item>

          <!-- 个人档案管理员端 -->
          <el-menu-item
            v-show="role == '老师'||role=='超级管理员'"
            index="5"
            @click="handleMenuClick('studentsProfile')"
            :class="{ active: currentPage === 'studentsProfile' }"
            class="menu-item"
          >
            学生档案
          </el-menu-item>

          <!-- 退出登录 -->
          <el-menu-item index="6" plain @click="outerVisible = true" class="logout-button">
            退出登录
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="title">个人中心</div>
      </el-header>

      <!-- 主内容区 -->
      <el-main>
        <div v-if="currentPage === 'personalCenter'" class="content">
          <div class="personal-container">
              <personal-box></personal-box>
              <personal-text></personal-text>
            </div>
        </div>
      </el-main>
    </el-container>
  </el-container>

  <!-- 退出登录确认模态框 -->
  <el-dialog v-model="outerVisible" title="" :before-close="handleBeforeClose">
    <div class="dialog-content">
      <span>确认退出登录吗？</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleLogout" class="confirm-btn"> 确认退出 </el-button>
      </div>
    </template>
  </el-dialog>
</div>

</template>

<script lang="ts" setup>
import { ref ,onMounted, computed,watch} from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios' 
import { useRouter} from 'vue-router'
import PersonalBox from '@/views/Framework/components/PersonalBox.vue' 
import PersonalText from '@/views/Framework/components/PersonalText.vue'
import Axios from '@/views/Axios'
import isLogin from '@/api/isLogin'
import { log } from 'console'
const roleMessage = ref('资助对象')
const router = useRouter()
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')
const sidebarVisible = ref(true);
const isMobile = ref(window.innerWidth <= 768);
const outerVisible = ref(false)
const activeMenu = ref('1')
const currentPage = ref('personalCenter') 

// 侧边栏
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// 登录状态判断，否则跳转登录页
onMounted(async () => {
//   if (!localStorage.getItem('token')) {
//     console.log('未登录')
//     router.push('/')
// }
  const isLoggedIn = await isLogin()
  if (!isLoggedIn) {
    router.push('/')
  }
  else{
    window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768;
  });
  }
})
// // 点击菜单项时的处理函数
const handleMenuClick = (page: string) => {
  if (page === 'superMarket') {
    router.push('/home')
  } else if (page === 'personalProfile') {
    router.push('/new-file')
  } else if (page === 'studentsProfile')
    router.push('/studentFiles')
  else if (page === 'superMarketManage')
    router.push('/manage')
}

const handleBeforeClose = (done: Function) => {
  done()
}

// 退出登录处理函数
const handleLogout = async () => {
  try {
    const response = await Axios.post('http://59.110.62.188:8080/auth/logout', {})
    if (response.data.code === 200) {
      ElMessage.success('退出成功！')
      outerVisible.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('client_id')
      setTimeout(() => {
        router.push('/')
        outerVisible.value = false
      }, 500)
    } else {
      ElMessage.error(response.data.msg + '!')
    }
  } catch (error) {
    ElMessage.error('请求失败！')
  }
}

</script>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-container-demo .el-header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #333;
}
.header {
  height: 8vh;
}

.title {
  color: #2d4059;
  font-family: 'Arial', sans-serif;
  font-size: 2vw;
  font-weight: bold;
  margin: 1.3vh auto;
  text-align: center;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 左侧边栏 - 深色背景 */
.layout-container-demo .el-aside {
  background-color: #283142;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #ecf0f1;
}

/* 侧边栏标题样式 */
.sidebar-title {
  background-color: #1f2739;
  text-align: center;
  font-weight: bold;
  height: 8vh;
  line-height: 8vh;
  font-size: 1.3vw;
  color: #ecf0f1;
}

/* 侧边栏菜单项 */
.menu-item {
  font-weight: 700;
  font-size: 1.1vw;
  color: #bdc3c7;
  padding-left: 1vw;
  background-color: #283142;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 侧边栏菜单项 hover */
.menu-item:hover {
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

/* 选中时的菜单项样式 */
.menu-item.active {
  background-color: #3498db;
  color: white;
}

.logout-button {
  margin-top: auto;
  font-size: 1.1vw;
  color: #e74c3c;
  padding-left: 2vw;
  background-color: #283142;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.logout-button:hover {
  background-color: #f7d7d7;
  color: #e74c3c;
  cursor: pointer;
}

.layout-container-demo .el-main {
  padding: 1.5vw;
  background-color: #f4f4f4;
}

.el-menu-item {
  padding: 2vw 4vh;
}

/* 模态框 */
.el-dialog {
  border-radius: 1vw;
  background-color: #f9f9f9;
}

.el-dialog__header {
  background-color: #3498db;
  color: #fff;
  font-size: 1.4vw;
  font-weight: bold;
}

.el-dialog__body {
  font-size: 1.28vw;
  color: #333;
  text-align: center;
}

.el-dialog__footer {
  display: flex;
  justify-content: space-between;
  padding: 0.8vw 3.2vh;
}
.el-dialog__width{
  width:450px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.8vw;
}

.cancel-btn {
  background-color: #e1e1e1;
  color: #333;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #bdc3c7;
}

.confirm-btn {
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover {
  background-color: #2980b9;
}

.menu-toggle {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: #3498db;
  color: white;
  padding: 10px;
}

.personal-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

@media (max-width: 768px) {
  .content{
    display:block;
  }
  .personal-container {
    flex-direction: column;
    padding: 0; 
    gap:0px;
  }

  .sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50vw; /* 增加边栏宽度，使其适应移动端 */
    background: #283142;
    transition: all 0.3s ease;
  }

  .sidebar-title {
    font-size: 5vw;
    height: auto;
    padding: 0vw;
  }

  .menu-item {
    font-size: 4vw; /* 增加字体大小，适应小屏幕 */
    padding-left: 5vw;
    padding-right: 5vw;
  }

  .logout-button {
    font-size: 4vw;
    padding-left: 5vw;
  }

  .el-header {
    height: auto;
    padding: 3vw;
  }

  .title {
    font-size: 6vw;
    margin: 0;
  }

  .el-dialog__header {
    font-size: 5vw;
  }

  .el-dialog__body {
    font-size: 5vw;
  }

  .el-dialog__footer {
    font-size: 4vw;
    padding: 20vw;
  }
  .menu-toggle {
  top: 0.5vw;
  left: 0.5vw;
  z-index: 1000;
  background: #3498db;
  color: white;
  padding: 1vw;
}
}

</style>