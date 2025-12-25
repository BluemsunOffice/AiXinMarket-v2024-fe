<template>
  <div class="tab-contain">
    <el-tabs v-model="activeTab" class="custom-tabs" type="card">
      <el-tab-pane v-if="role === '资助对象'" label="基本信息" name="tab1">
        <div class="text-content">
          <information-form></information-form>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="修改密码" name="tab2">
        <div class="text-content">
          <password-form></password-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import InformationForm from './InformationForm.vue'
import PasswordForm from './PasswordForm.vue'

// const props = defineProps({
//   message: String
// })
// const role = ref(props.message)
const role = localStorage.getItem('role')
const activeTab = ref(role === '资助对象' ? 'tab1' : 'tab2')
// watch(() => props.message, (newMessage) => {
//   role.value = newMessage
//   activeTab.value = role.value === '资助对象' ? 'tab1' : 'tab2'
// })
</script>

<style scoped>
/* Tab 整体容器 */
.tab-contain {
  max-width: 51vw;
  margin: 0vw 1.5vw;
  margin-left:1vw;
  padding: 1.6vw;
  background-color: white;
  /* background-color:red; */
  z-index: 100;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  height:77vh;
}

/* 自定义 Tab 栏样式 */
:deep(.custom-tabs .el-tabs__header) {
  padding: 0.4vw;
  padding-bottom: 0vw;
  height:5vh;
  border-bottom: 1px solid #ccc;
}

:deep(.custom-tabs .el-tabs__item) {
  font-weight: bold;
  color: #000;
  /* padding: 0.9vw 1.5vw; */
  background-color: transparent;
  transition: all 0.3s ease;
  height:5vh;
  font-size: 1vw;
} 

:deep(.custom-tabs .el-tabs__item:hover) {
  background-color: rgba(0, 123, 255, 0.1);
  cursor: pointer;
}

:deep(.custom-tabs .el-tabs__item.is-active) {
  background-color: #5ab2ecf7;
  color: #fff;
}

:deep(.custom-tabs .el-tabs__nav) {
  border-bottom: none;
}

/* Tab 内容区样式 */
.text-content {
  border-radius: 10px;
  margin-top: 2vh;
  height: 68vh;
  width: 45vw;

}
@media (max-width: 768px) {
  .tab-contain {
    max-width: 100%; 
    padding: 0.2rem; 
    height: auto; 
    margin: 0;
    margin-left: 0;
    border-radius: 0;
    box-shadow: none;
  }

  :deep(.custom-tabs .el-tabs__header) {
    height: 40px;
  }

  :deep(.custom-tabs .el-tabs__item) {
    font-size: 12px;
    height: 40px;
  }

  .text-content {
    height: auto;
  }}
</style>
