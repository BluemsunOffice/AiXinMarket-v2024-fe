<template>
    <div class="step" >
      <el-steps direction="vertical" :active="1">
        <el-step title="Step 1 查看商品"></el-step>
        <el-step title="Step 2 加入购物车"></el-step>
        <el-step title="Step 3 结算"></el-step>
      </el-steps>
    </div>
</template>
<style scoped>
    .step{
        margin-left:4vw;
        margin-right:1vw;
        height: 300px; 
        max-width: 600px;
        background-color: rgb(224, 227, 227);
        border-radius: 10px;
        width:25vw;
    }
</style>