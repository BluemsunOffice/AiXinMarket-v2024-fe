<template>
  <div class="flex flex-wrap items-center">
    <el-dropdown @command="handleSort">
      <el-button type="primary" size="large">
        货币分类<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 加了command -->
          <el-dropdown-item command="">全部</el-dropdown-item>
          <el-dropdown-item command="1">服装币</el-dropdown-item>
          <el-dropdown-item command="0">日用币</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

  <script lang="ts" setup>
  import { ArrowDown } from '@element-plus/icons-vue'
  // 这里加了
  import { inject, Ref } from 'vue'; // 导入 Ref 类型
  const category = inject<Ref<string>>('category');
  const handleSort = (command) => {
  category.value = command;
};
// 到这里
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
  background-color: #409EFF; 
  color: white; 
  font-weight: bold;
}

.el-button:hover {
  background-color: #3380cc;
}
  .example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  </style>