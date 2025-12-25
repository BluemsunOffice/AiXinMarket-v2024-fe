<template>
  <div class="goods-disaplay">
    <slot></slot>
    <slot name="title"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script setup lang="ts" name="Goods">
defineProps(["name"]);
</script>

<style scoped>
.goods-disaplay {
  /* background-color: #fff; */
  background-color: rgb(252, 250, 250);
  border-radius: 8px;
  padding: 1vw;
  width: 18vw;
  height: 320px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

h2 {
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: rgb(122, 121, 121);
  margin-bottom: 5px;
  margin-top: 5px;
}

.goods-disaplay button {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  /* padding: 6px 20px; */
  cursor: pointer;
  transition: background-color 0.3s;
}

.goods-disaplay button:hover {
  background-color: #337ecc; /* 按钮悬停时的背景颜色 */
}
@media (max-width: 768px) {
  .goods-disaplay {
    padding: 1vw;
    width: 150px;
    height: 250px;
  }
  h2 {
    font-size: 20px; /* 增加字体大小以适应大屏幕 */
  }
}
@media (min-width: 1300px) {
  /* 大屏幕 */
  .goods-disaplay {
    /* background-color: #fff; */
    background-color: rgb(252, 250, 250);
    border-radius: 8px;
    padding: 1vw;
    width: 18vw;
    height: 380px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }
}

@media (min-width: 768px) and (max-width: 1299px) {
  /* 小屏幕 */
  .goods-disaplay {
    /* background-color: #fff; */
    background-color: rgb(252, 250, 250);
    border-radius: 8px;
    padding: 1vw;
    width: 18vw;
    height: 320px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease-in-out;
    overflow: hidden;
  }
}
</style>
