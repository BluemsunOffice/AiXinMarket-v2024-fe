<template>
  <div class="password-form-container">
    <div class="form-title">修改密码</div>

    <el-form :model="form" :rules="rules" ref="formRef" label-width="10vw" class="password-form">
      <el-form-item label="旧密码" prop="oldPassword">
        <template #label>
          <span class="required-label">旧密码</span>
        </template>
        <el-input
          v-model="form.oldPassword"
          :type="passwordTypes.oldPassword"
          placeholder="请输入旧密码"
        >
          <template #append>
            <el-icon @click="togglePasswordType('oldPassword')">
              <View v-if="passwordTypes.oldPassword === 'text'" />
              <Hide v-if="passwordTypes.oldPassword === 'password'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <template #label>
          <span class="required-label">新密码</span>
        </template>
        <el-input
          v-model="form.newPassword"
          :type="passwordTypes.newPassword"
          placeholder="长度应为5-20位"
        >
          <template #append>
            <el-icon @click="togglePasswordType('newPassword')">
              <View v-if="passwordTypes.newPassword === 'text'" />
              <Hide v-if="passwordTypes.newPassword === 'password'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="确认新密码" prop="confirmPassword">
        <template #label>
          <span class="required-label">确认新密码</span>
        </template>
        <el-input
          v-model="form.confirmPassword"
          :type="passwordTypes.confirmPassword"
          placeholder="长度应为5-20位"
        >
          <template #append>
            <el-icon @click="togglePasswordType('confirmPassword')">
              <View v-if="passwordTypes.confirmPassword === 'text'" />
              <Hide v-if="passwordTypes.confirmPassword === 'password'" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item class="button-group">
        <el-button type="primary" class="save-button" @click="handleSave">保存</el-button>
        <el-button type="danger" class="close-button" @click="handleClose">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElIcon, ElMessage } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import axios from 'axios'
import Axios from 'axios'

// 获取对表单的引用
const formRef = ref(null)

// 表单数据
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码类型状态
const passwordTypes = ref({
  oldPassword: 'password',
  newPassword: 'password',
  confirmPassword: 'password',
})

// 切换密码类型
const togglePasswordType = (passwordType) => {
  passwordTypes.value[passwordType] =
    passwordTypes.value[passwordType] === 'password' ? 'text' : 'password'
}

// 确认新密码验证
const confirmPasswordValidator = (rule, value, callback) => {
  if (value !== form.value.newPassword) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: confirmPasswordValidator, trigger: 'blur' },
  ],
})
// 重置密码
const resetPassword = async (oldPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    const clientid = localStorage.getItem('client_id')
    const response = await axios.put(
      'http://59.110.62.188:8080/system/user/profile/updatePwd',
      JSON.stringify({ 
        oldPassword,
        newPassword,
      }),
      {
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}`,
          clientid:clientid
        },
      },
    );

    if (response.data.code === 200) {
      ElMessage.success('密码重置成功！');

      form.value.oldPassword = ''
      form.value.newPassword = ''
      form.value.confirmPassword = ''
    } else {
      ElMessage.error(response.data.msg+'!');
    }
  } catch (error) {
    console.error('请求错误', error);
    ElMessage.error('密码重置请求失败');
  }
}

// 保存操作
const handleSave = async () => {
  try {
    await formRef.value.validate() 
    await resetPassword(form.value.oldPassword, form.value.newPassword)
  } catch (error) {
    console.error('表单验证失败', error);
  }
}

// 关闭操作
const handleClose = () => {
  form.value.oldPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.password-form-container {
  width: 100%;
  padding-top: 4.5vh;
  margin: 0px auto;
}

.form-title {
  font-size: 2.1vw;
  font-weight: bold;
  text-align: center;
  margin-bottom: 4vh;
  color: #2d4059;
}

.password-form {
  background-color: white;
  padding: 3vh 0vw;
  padding-right: 5vw;
}

.el-form-item {
  margin-bottom: 4vh;
 
}
.required-label{
  line-height:5.5vh;
  font-size: 2vh;
}
.el-input {
  width: 100%;
  height: 5.5vh;
  font-size: 2vh;
  border-radius: 20%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-input:focus {
  box-shadow: 0 0 5px 2px rgba(72, 128, 239, 0.5);
  border-color: #409eff;
}

.el-button {
  width: 4vw;
  height: 2.3vw;
  font-size: 1vw;
  font-weight: 700;
  border-radius: 8px;
  margin-right: 4%;
}

.el-button--primary {
  background-color: #5ab2ecf7;
  border: none;
  color: white;
}

.el-button--danger {
  background-color: #e23e57;
  border: none;
  color: white;
}

.el-button:hover {
  opacity: 0.9;
}

.el-button:active {
  opacity: 0.8;
}

.el-form-item .el-input__inner {
  border-radius: 8px;
  font-size: 1.1vw;
}

.el-form-item.is-error .el-input__inner {
  border-color: #f56c6c;
}

:deep(.el-form-item__error){
  font-size: 0.85vw;
}

.el-form-item label {
  font-weight: 500;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 1.6vh;
  width:55%;
}

:deep(.el-icon) {
  cursor: pointer;
  font-size: 1.3vw;
}
@media screen and (max-width: 768px) {
  .password-form-container{
    width:180%;
    padding-top:0;
  }
  .form-title {
    font-size: 4vw;
    margin-bottom: 2vh;
  }

  .password-form {
    padding: 0vw;
  }

  .el-input {
    font-size: 4vw;
    height: 6vh;
  }

  .el-button {
    width: 30vw;
    height: 6vh;
    font-size: 4vw;
  }

  .button-group {
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .button-group .el-button {
    margin-bottom: 0vw;
    width: 40%;
  }

  .required-label {
    font-size: 3.5vw;
  }

  :deep(.el-icon) {
    font-size: 5vw;
  }

  :deep(.el-form-item__error) {
    font-size: 3vw;
  }
  :deep(.el-form-item__label){
    font-size: 3vw;
    flex:0.3 0 auto;
  }
}

</style>