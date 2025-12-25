<template>
  <el-header height="85px">
    <div class="header-content">
      <div class="top_hello">
        <span
          style="
            margin-left: 40px;
            font-family: 隶书;
            font-weight: 700;
            font-size: 40px;
            color: #409eff;
          "
        >
          爱心超市
        </span>
      </div>
      <div class="header_menu">
        <span class="cloud"></span>
        <ul class="menuList" style="font-family: 黑体">
          <li
            :class="{ active: activeIndex === 0 }"
            @click="navigateToIndex(0)"
            class=""
          >
            <span style="vertical-align: middle; margin-right: 5px"
              ><el-icon :size="22"><Box /></el-icon></span
            >货物管理
          </li>
          <li
            :class="{ active: activeIndex === 1 }"
            @click="navigateToIndex(1)"
          >
            <span style="vertical-align: middle; margin-right: 5px"
              ><el-icon :size="22"><ShoppingCartFull /></el-icon></span
            >进货记录
          </li>
          <li
            :class="{ active: activeIndex === 2 }"
            @click="navigateToIndex(2)"
          >
            <span style="vertical-align: middle; margin-right: 5px"
              ><el-icon :size="22"><Document /></el-icon></span
            >订单管理
          </li>
        </ul>
      </div>
      <el-button
        type="primary"
        size="large"
        style="font-family: 黑体; font-weight: 700"
        @click="centerDialogVisible = true"
        >退出登录</el-button
      >
      <el-row class="demo-avatar demo-basic">
        <el-col :span="12">
          <div class="demo-basic--circle">
            <div class="block">
              <el-avatar :size="65" :src="avatarUrl" />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-dialog
        v-model="centerDialogVisible"
        title="确认退出吗？"
        width="370"
        center
        align-center
      >
        <template #footer>
          <div class="dialog-footer">
            <el-button
              @click="centerDialogVisible = false"
              style="margin-left: 15px; padding: 19px; font-size: 16px"
              >取消</el-button
            >
            <el-button
              type="primary"
              @click="handleLogout()"
              style="padding: 19px; font-size: 16px; margin-left: 20px"
            >
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useNavBarData } from "@/stores/useNavBarData";
import { Box, ShoppingCartFull, Document } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import Axios from "@/views/Axios";
const router = useRouter();

const authToken = localStorage.getItem("token");
onMounted(() => {
  if (!localStorage.getItem("token")) {
    router.push("/");
  }
});
const token = `${authToken}`;
const activeIndex = ref(0);
const centerDialogVisible = ref(false);
// 使用自定义 Hook 获取数据
const { generalBalance, clothingBalance, campusName, avatarUrl } =
  useNavBarData(token);

// 初始化第一个菜单项为激活状态
onMounted(() => {
  const pathToIndexMap: Record<string, number> = {
    "/manage": 0,
    "/record": 1,
    "/order": 2,
    "/": 3,
  };

  // 修复路径判断：使用 router.currentRoute.value.path
  const currentPath = router.currentRoute.value.path;
  activeIndex.value = pathToIndexMap[currentPath] ?? 0;
});

const navigateToIndex = (index: number) => {
  activeIndex.value = index; // 更新激活项
  // 根据索引跳转到相应的路由
  const path = ["manage", "record", "order", "/"][index];
  router.push(`/${path}`);
};
const role = localStorage.getItem("role");
const handleLogout = async () => {
  console.log("退出登录");
  try {
    const response = await Axios.post(
      "http://59.110.62.188:8080/auth/logout",
      {}
    );
    if (response.data.code === 200) {
      ElMessage.success("退出成功！");

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("client_id");
      // 等待2秒跳转到登录
      setTimeout(() => {
        // window.location.href = `http://localhost:5173`
        navigateToIndex(3);
      }, 60);
    } else {
      ElMessage.error(response.data.msg + "!");
    }
  } catch (error) {
    ElMessage.error("请求失败！");
  }
};
</script>
<style scoped>
/* 弹框修改*/
::v-deep .el-dialog__title {
  margin-left: 55px !important;
}
.header-content {
  width: 1300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 85px;
  margin: auto;
  border-bottom: 1px solid rgb(243.9, 244.2, 244.8);
  box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.top_hello,
.money {
  font-size: 18px;
}

.top_hello span {
  font-size: 30px;
  margin-right: 1.5vw;
  letter-spacing: 0.1em;
}

.top_hello .campus {
  margin-right: 1vw;
  font-size: 20px;
}

.money span {
  margin: 0 1vw;
}

.menuList {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menuList li {
  cursor: pointer;
  height: 85px;
  line-height: 85px;
  font-size: 20px;
  display: inline-block;
  padding: 0 3vw;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s, border-bottom-color 0.3s;
  margin: 0 1vw;
}

.menuList li.active {
  color: black;
  border-bottom: 4px solid #409eff; /* 激活项的样式 */
}

.menuList li:hover:not(.active) {
  border-bottom: 4px solid #409eff; /* 鼠标悬停时的样式 */
}

.demo-avatar {
  margin-right: 20px;
}
</style>
