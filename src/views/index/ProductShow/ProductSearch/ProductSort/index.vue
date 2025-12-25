<template>
    <div class="flex flex-wrap items-center">
      <el-dropdown @command="handleSort">
        <el-button type="primary" size="large">
          商品排序<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="">综合</el-dropdown-item>
            <el-dropdown-item command="asc">按价格升序</el-dropdown-item>
            <el-dropdown-item command="desc">按价格降序</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ArrowDown } from '@element-plus/icons-vue'
  import { inject, Ref } from 'vue'; // 导入 Ref 类型
  const isasc = inject<Ref<string>>('isasc');
  const handleSort = (command) => {
  isasc.value = command;
};
  </script>
  <style scoped>
 .example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  .el-button{
  transition: all 0.3s ease;
  background-color: #cce8ff; 
  color: #409EFF;
  font-weight: bold;
}

.el-button:hover {
  background-color: #409EFF;
  color: white;
}


  </style>