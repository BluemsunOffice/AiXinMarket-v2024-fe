<template>
  <el-carousel :interval="4000" type="card" height="400px">
    <el-carousel-item v-for="(item, index) in images" :key="index" @click="handleClick(item.link)">
      <el-image :src="item.url" alt="轮播图片" class="carousel-image" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
import { ElCarousel, ElCarouselItem } from "element-plus";
import { ref } from "vue";
import martImage1 from "@/assets/image/mart-1.png";
import martImage2 from "@/assets/image/mart-2.jpg";
import martImage3 from "@/assets/image/mart-3.png";
import martImage4 from "@/assets/image/mart-4.png";

const images = ref([
  { url: martImage1, link: "https://www.nenu.edu.cn/" },
  { url: martImage2, link: "#" },
  { url: martImage3, link: "https://clzc.nenu.edu.cn/" },
  { url: martImage4, link: "https://clzc.nenu.edu.cn/" },
]);

const handleClick = (url: string) => {
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

:deep(.el-carousel__item) {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  background: #fff;
}

.carousel-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 16px;
}
@media (max-width: 768px) {
  /* 针对手机端的样式调整 */
  .el-carousel {
    width: 90vw;
    height: 180px;
    margin: 0 auto;
    padding-bottom: 20px;
    padding-top: 30px;
  }
  :deep(.el-carousel__item) {
    height: 180px;
    border-radius: 12px;
  }
  .carousel-image {
    height: 180px;
    border-radius: 12px;
  }
}
</style>
