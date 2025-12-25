<template>
  <div class="header">
    <h1 class="title">个人成长档案</h1>
    <button class="exit-btn" @click="goToFramework">返回</button>
  </div>
</template>

<script setup>
import Axios from "@/views/Axios";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const goToFramework = () => {
  router.push("/framework");
};

const handleLogout = async () => {
  try {
    const response = await Axios.post(
      "http://59.110.62.188:8080/auth/logout ",
      {}
    );
    if (response.data.code === 200) {
      ElMessage.success("退出成功！");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("client_id");

      setTimeout(() => {
        router.push("/");
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
/* 基础重置和字体大小使用vw单位 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  background-color: rgba(255, 255, 255, 0.39);
  color: #007bff;
  text-align: center;
  padding: 1.2vw 0;
  font-size: clamp(16px, 1.8vw, 22px);
  box-shadow: 0 0.2vw 0.4vw rgba(0, 0, 0, 0.1);
  border-radius: 0.5vw;
  position: relative;
  width: 100%;
  line-height: clamp(45px, 4.5vw, 60px);
  min-height: clamp(50px, 6vw, 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  margin: 0;
  font-size: clamp(22px, 2.8vw, 36px);
  font-weight: 600;
  padding: 0 2vw;
  word-break: break-word;
  letter-spacing: 0.05vw;
  /* 确保标题真正居中 */
  text-align: center;
}

.exit-btn {
  position: absolute;
  top: 50%;
  right: clamp(15px, 2.5vw, 40px);
  transform: translateY(-50%);
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: clamp(5px, 0.8vw, 10px) clamp(10px, 1.2vw, 16px);
  font-size: clamp(11px, 1.1vw, 16px);
  border-radius: 0.5vw;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: clamp(50px, 6vw, 80px);
  min-height: clamp(28px, 3.2vw, 40px);
  white-space: nowrap;
}

.exit-btn:hover {
  background-color: #c0392b;
  /* transform: translateY(-50%) scale(1.05); */
}

.exit-btn:active {
  background-color: #a93226;
  /* transform: translateY(-50%) scale(0.98); */
}

/* 移动端优化 - 按钮放在标题旁边 */
@media (max-width: 768px) {
  .header {
    padding: 1.5vh 0;
    line-height: clamp(35px, 6vh, 50px);
    min-height: clamp(45px, 8vh, 60px);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: clamp(18px, 5.5vw, 26px);
    padding: 0 12vw; /* 给按钮留出空间 */
    margin: 0 auto;
  }

  .exit-btn {
    position: absolute;
    right: auto;
    left: 5vw; /* 放在左侧 */
    top: 50%;
    transform: translateY(-50%);
    margin-top: 0;
    width: auto; /* 自动宽度 */
    min-width: clamp(60px, 15vw, 80px); /* 减小宽度 */
    padding: 0.8vh 1.5vh; /* 减小内边距 */
    font-size: clamp(12px, 3.2vw, 15px);
    min-height: clamp(25px, 5vh, 35px);
  }
}

/* 超小屏幕设备（手机竖屏） */
@media (max-width: 480px) {
  .header {
    line-height: 6vh;
    min-height: 10vh;
    padding: 1vh 0;
  }

  .title {
    font-size: clamp(16px, 6.5vw, 22px);
    padding: 0 14vw; /* 给按钮留更多空间 */
  }

  .exit-btn {
    left: 4vw; /* 稍微靠近边缘 */
    min-width: clamp(50px, 12vw, 70px); /* 进一步减小宽度 */
    padding: 0.6vh 1.2vh; /* 减小内边距 */
    font-size: clamp(11px, 3vw, 14px);
    min-height: clamp(22px, 4.5vh, 30px);
  }
}

/* 平板设备优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .header {
    line-height: clamp(45px, 6vw, 60px);
    min-height: clamp(55px, 7vw, 75px);
  }

  .title {
    font-size: clamp(20px, 3.2vw, 26px);
  }

  .exit-btn {
    right: clamp(25px, 3.5vw, 35px);
    padding: 1vw 1.8vw;
    font-size: clamp(12px, 1.3vw, 16px);
    min-width: clamp(45px, 5vw, 70px);
  }
}

/* 大屏幕优化（电视、大显示器） */
@media (min-width: 1920px) {
  .header {
    padding: 1vw 0;
    line-height: 4vw;
    min-height: 5vw;
  }

  .title {
    font-size: 2.5vw;
  }

  .exit-btn {
    font-size: 0.9vw;
    padding: 0.6vw 1.5vw;
    border-radius: 0.4vw;
    min-width: 5vw;
  }
}

/* 超宽屏优化 */
@media (min-width: 2560px) {
  .header {
    max-width: 2560px;
    margin: 0 auto;
  }

  .title {
    font-size: 2.2vw;
  }

  .exit-btn {
    font-size: 0.8vw;
  }
}

/* 超小按钮额外优化 */
@media (max-width: 320px) {
  .title {
    font-size: 17px;
    padding: 0 15vw; /* 给按钮留足够空间 */
  }

  .exit-btn {
    left: 3vw;
    min-width: clamp(45px, 10vw, 60px); /* 更小的宽度 */
    font-size: 11px;
    padding: 0.5vh 1vh;
  }
}

/* 横屏模式优化 */
@media (orientation: landscape) and (max-width: 768px) {
  .header {
    min-height: 12vh;
    padding: 1vh 0;
  }

  .title {
    font-size: clamp(16px, 4vw, 20px);
    padding: 0 10vw;
  }

  .exit-btn {
    left: 3vw;
    min-width: clamp(50px, 10vw, 70px);
    font-size: clamp(11px, 2.5vw, 14px);
  }
}
</style>
