<template>
    <div class="not-found">
      <h1>404</h1>
      <p>当前页面不存在。</p>
      <el-button type="primary" @click="goHome">返回主页</el-button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  const router = useRouter();

  
  const goHome = () => {
        // window.location.href='http://localhost:5173/'
        router.push('/')
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: #f4f4f4;
  }
  
  .not-found h1 {
    font-size: 6rem;
    margin: 0;
    color: #ff6b6b;
  }
  
  .not-found p {
    font-size: 1.5rem;
    margin: 1rem 0;
    color: #333;
  }
  
  .not-found .el-button {
    margin-top: 1.5rem;
  }
  </style>
  