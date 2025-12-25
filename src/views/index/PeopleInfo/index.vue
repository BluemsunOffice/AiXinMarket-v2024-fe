<template>
    <div class="demo-type">
      <div>
        <div class="person">
           <el-avatar style="width:80px;height: 80px;font-size: 40px;" :icon="UserFilled" />
        </div>
        <div class="welcom">欢迎XXX!</div>
        <div class="currency">
            <ul>
                <li>日用币:100</li>
                <li>服装币:200</li>
            </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { UserFilled } from '@element-plus/icons-vue'
  </script>
  
  <style scoped>
  *{
    margin:0;
    padding:0;
  }
  .person{
    display: flex;
    width:100%;
    justify-content: center;
  }
  .demo-type {
    width:20vw;
    border-radius: 10px;
    padding-top:2vh;
    background-color:  rgb(224, 227, 227);
  }
  .welcom{
    font-size: 25px;
    margin-top:2vh;
  }
  .currency{
    margin-top:5vh;
  }
  .currency li{
    list-style: none;
    margin-bottom:1vh;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  </style>
  