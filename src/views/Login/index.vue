<template>
  <div :class="container">
    <form v-if="isPc" class="pc">
      <div class="form_left">
        <h1>资助统一身份认证</h1>
        <div class="uname">
          <div>
            <el-icon :size="24"><User /></el-icon>
          </div>
          <input type="text" placeholder="学号/账号" v-model="uname" />
        </div>
        <div class="password">
          <div>
            <el-icon :size="24"><Unlock /></el-icon>
          </div>
          <input type="password" placeholder="密码" v-model="password" />
        </div>
        <div class="remenber">
          <el-checkbox
            v-model="remenber"
            label="记住密码"
            size="large"
            fill="#f5f5f5"
          />
        </div>
        <div class="btn">
          <button class="log" @click.prevent="log">登录</button>
        </div>
      </div>
    </form>
    <form v-if="!isPc" class="mobile">
      <h1>资助统一身份认证</h1>
      <div class="uname">
        <div>
          <el-icon :size="24"><User /></el-icon>
        </div>
        <input type="text" placeholder="学号/账号" v-model="uname" />
      </div>
      <div class="password">
        <div>
          <el-icon :size="24"><Unlock /></el-icon>
        </div>
        <input type="password" placeholder="密码" v-model="password" />
      </div>
      <div class="remenber" style="margin-left: 45%; margin-top: -3%">
        <el-checkbox
          v-model="remenber"
          label="记住密码"
          size="large"
          fill="#f5f5f5"
        />
      </div>
      <div class="btn">
        <button class="log" @click.prevent="log">登录</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { User, Unlock } from "@element-plus/icons-vue";
import isLogin from "@/api/isLogin";

const router = useRouter();

// 表单数据与状态
const uname = ref("");
const password = ref("");
const remenber = ref(false);
const loading = ref(false);

const clientId = ref("");
let isPc = ref(true);
let container = ref("");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const redirect = router.currentRoute.value.query.redirect;

const savedUsername = localStorage.getItem("savedUsername") || "";
const savedPassword = localStorage.getItem("savedPassword") || "";

// 登录判断与跳转
onMounted(async () => {
  detectDeviceType();
  setClientId();
  // 设置 container 类名，避免抖动
  container.value = isPc.value
    ? "container container1"
    : "container container2";

  if (savedPassword && savedUsername) {
    uname.value = savedUsername;
    password.value = savedPassword;
    remenber.value = true;
  }
  // 检查登录状态
  const isLoggedIn = await isLogin();
  if (!isLoggedIn) {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  }
  if (localStorage.getItem("token") && localStorage.getItem("role")) {
    router.push("/framework");
  }
});

// 检测设备类型并设置 isPc
const detectDeviceType = () => {
  const userAgent = navigator.userAgent;
  const mobileAgents = [
    /android/i,
    /iphone|ipad|ipod/i,
    /windows phone/i,
    /blackberry/i,
    /opera mini/i,
    /mobile/i,
    /touch/i,
  ];

  // 默认认为是 PC
  isPc.value = true;

  // 如果匹配到移动设备的特征，则认为是移动端
  for (let agent of mobileAgents) {
    if (agent.test(userAgent)) {
      isPc.value = false;
      break;
    }
  }
};

// 根据设备类型设置 clientId
const setClientId = () => {
  clientId.value = isPc.value
    ? "e5cd7e4891bf95d1d19206ce24a7b32e"
    : "428a8310cd442757ae699df5d894f051";
  localStorage.setItem("client_id", clientId.value);
};

// 登录处理
const log = async () => {
  try {
    loading.value = true;
    const config = {
      headers: {
        "content-language": "zh_CN",
      },
    };
    let flag = true;
    if (password.value.length > 20 || password.value.length < 5) {
      ElMessage.error("用户密码长度必须在5到28个字符之间");
      flag = false;
    } else if (password.value.trim() == "") {
      ElMessage.error("密码不能为空");
      flag = false;
    } else if (uname.value.trim() == "") {
      ElMessage.error("用户名不能为空");
      flag = false;
    }
    if (flag == true) {
      const response = await axios.post(
        "http://59.110.62.188:8080/auth/login",
        {
          tenantId: "000000",
          username: uname.value,
          password: password.value,
          rememberMe: remenber.value,
          clientId: clientId.value,
          grantType: "password",
        },
        config
      );

      if (response.data.code === 200) {
        ElMessage.success("登录成功");
        localStorage.setItem("token", response.data.data.access_token);
        localStorage.setItem("role", response.data.data.roles[0].roleName);

        // 如果勾选了“记住密码”，将用户名和密码保存到 localStorage
        if (remenber.value) {
          localStorage.setItem("savedUsername", uname.value);
          localStorage.setItem("savedPassword", password.value);
        } else {
          // 如果没有勾选记住密码，清除之前保存的密码
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
        }

        router.push("/framework");
      } else {
        ElMessage.error(response.data.msg);
      }
    }
  } catch (error) {
    loading.value = false;
    ElMessage.error("登录失败，请稍后重试");
  }
};
</script>

<style scoped>
input {
  -webkit-box-shadow: 0 0 0 1000px #f5f5f5 inset;
  border: 0;
  outline: none;
}

* {
  padding: 0;
  margin: 0;
  /* 改盒子高度和长度的计算 */
  box-sizing: border-box;
}

img {
  /* 除掉图片底端的空隙 */
  border: 0;
  /* 图片和文字中心对齐 */
  vertical-align: middle;
}

button {
  /* 让鼠标变小手 */
  cursor: pointer;
}

p,
h1,
h2,
h3,
h4,
h5,
span,
form {
  cursor: default;
}

button,
input {
  font-family: 微软雅黑;
}
input[type="text"]:focus {
  background-color: #f5f5f5;
}
.clearfix::after {
  visibility: hidden;
  clear: both;
  display: block;
  content: "";
  height: 0;
}

.container {
  width: 100vw;
  height: 100vh;

  display: flex;
  /* 交叉轴：竖直 */
  align-items: center;
  /* 主轴水平 */
  justify-content: center;
}
.container1 {
  background: url(./../../../image/pc登录背景.jpg) no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
.container2 {
  background: url(./../../../image/mobile登录背景.jpg) fixed no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
.container::-webkit-scrollbar {
  display: none !important;
}
.container .pc {
  width: 430px;
  height: 400px;
  backdrop-filter: blur(80px);
  background-color: #fff;
  border-radius: 5px;
}
.container .pc .form_left {
  width: 100%;
  height: 100%;
  float: right;
  margin-top: 30px;
}
.container .pc .form_left h1 {
  font-size: 24px;
  text-align: center;
  letter-spacing: 0.05em;
  padding-bottom: 15px;
}
.container .pc .form_left h3 {
  font-size: 20px;
  text-align: center;
  padding-top: 15px;
  letter-spacing: 0.05em;
}

.container .uname,
.password {
  background-color: #f5f5f5;
  width: 70%;
  height: 12%;
  margin: 6% auto;
  padding: 0;
  border-radius: 5px;
  vertical-align: middle;
}
.remenber {
  width: 34%;
  height: 2%;
  float: right;
}
.el-checkbox.el-checkbox--large {
  height: 24px;
}
.container .pc .form_left .uname input,
.password input {
  width: 80%;
  border: none;
  outline: none;
  background-color: #f5f5f5;
}
input:focus {
  background-color: #f5f5f5 !important;
}
.container .pc .form_left .uname span,
.password span {
  height: 120%;
  width: 40%;
}
.btn {
  margin: auto;
  width: 70%;
  height: 12%;
  margin: 11% 15%;
}
.log {
  width: 100%;
  height: 100%;
  background-color: #003685;
  border-radius: 5px;
  color: #fff;
  letter-spacing: 0.05em;
  outline: none;
  border: none;
  font-size: 16px;
}
.uname div,
.password div {
  display: inline-block;
  width: 15%;
  vertical-align: middle;
  padding: 10px;
}

/* 移动端 */
.mobile {
  background-color: #fff;
  border-radius: 10px;
  width: 250px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mobile h1 {
  font-size: 22px;
  text-align: center;
  line-height: 24px;
  padding: 20px 0;
}

.mobile .uname,
.mobile .password {
  background-color: #f5f5f5;
  width: 80%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.mobile .uname input,
.mobile .password input {
  width: 80%;
  border: none;
  outline: none;
  background-color: transparent;
  padding-left: 10px;
}

.mobile .btn {
  width: 100%;
  margin-top: 12%;
  text-align: center;
}

.mobile .btn .log {
  width: 80%;
  background-color: #003685;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: none;
}
</style>
