<template>
    <div class="nav-bar">
        <ProductClass />
        <ProductSort />
        <CurrencySort />
    </div>
</template>

<script setup name="SortDetails">
    import CurrencySort from './CurrencySort/index.vue'
    import ProductSort from './ProductSort/index.vue'
    import ProductClass from './ProductClass/index.vue'
</script>

<style scoped>
.nav-bar {
    display: flex;
    justify-content: flex-start; /* 将项目靠左排列 */
    align-items: center;
    height: 10vh;
    color: #171616;
    border-radius: 10px;
    padding: 0 10px; /* 可以添加一些内边距 */
    margin-left: 125px;
}

.nav-bar > * {
    margin-right: 10px; /* 给每个组件添加右边距作为间距 */
}

/* 移除最后一个组件的右边距 */
.nav-bar > :last-child {
    margin-right: 0;
}
/* 响应式设计 */
@media (max-width: 768px) {
    .nav-bar {
    display: flex;
    justify-content: flex-start; 
    align-items: center;
    height: 10vh;
    color: #171616;
    border-radius: 10px;
    padding: 0 10px;
    margin-left: 0px;
}
}
</style>