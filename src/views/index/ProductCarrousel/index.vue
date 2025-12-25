<template>
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item
      v-for="(item, index) in images"
      :key="index"
      @click="handleClick(item.link)"
    >
      <div
        class="carousel-image"
        :style="{ 'background-image': `url(${item.url})` }"
      ></div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { ref } from "vue";

const images = ref([
  { url: "image/爱心超市4.png", link: "https://www.nenu.edu.cn/" },
  { url: "image/爱心超市2.jpg", link: "#" },
  { url: "image/爱心超市1.png", link: "https://clzc.nenu.edu.cn/" },
  { url: "image/爱心超市3.png", link: "#" },
]);

const handleClick = (url) => {
  window.open(url, "_blank");
};
</script>

<style scoped>
.el-carousel {
  width: 90vw;
  height: 400px;
  margin: 0 auto;
  padding-bottom: 20px;
  padding-top: 50px;
}

.el-carousel__item {
  height: 400px; /* 设置轮播项的高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.carousel-image {
  height: 100%;
  width: 90vw;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
@media (max-width: 768px) {
  /* 针对手机端的样式调整 */
  .el-carousel {
    width: 90vw;
    height: 150px;
    margin: 0 auto;
    padding-bottom: 20px;
    padding-top: 50px;
  }
  .el-carousel__item {
    height: 150px; /* 降低高度以适应手机屏幕 */
  }
  .carousel-image {
    height: 150px; /* 降低高度以适应手机屏幕 */
  }
}
</style>
