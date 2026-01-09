<template>
  <div class="home-container-layout">
    <NavBar />
    <div class="show">
      <ProductCarrousel />
    </div>
    <ProductSearch @search="handleUnifiedSearch" />
    <el-empty v-if="products.length === 0" :image-size="150" />
    <ProductShow :products="products" />
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="totalNum"
      :page-size="8"
      v-model:currentPage="currentPage"
      :pager-count="50"
      @current-change="handlePageChange"
      id="pagenation"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { ElEmpty, ElPagination } from "element-plus";
import NavBar from "@/components/NavBar/index.vue";
import ProductCarrousel from "@/views/index/ProductCarrousel/index.vue";
import ProductSearch from "@/views/index/ProductShow/ProductSearch/index.vue";
import ProductShow from "@/views/index/ProductShow/index.vue";
import {
  martApi,
  type goodListSearchParams,
  type goodListSearchResp,
  type product,
} from "@/api/mart.api";

const products = ref<product[]>([]);
const currentPage = computed({
  get: () => goodListSearchParams.value.pageNum,
  set: (val) => {
    goodListSearchParams.value.pageNum = val;
  },
});
const totalNum = ref(0); // 存储商品总数的响应式变量

const goodListSearchParams = ref<goodListSearchParams>({
  pageSize: 8,
  pageNum: 1,
  currencyType: "",
  name: "",
  type: "",
  isAsc: false,
  orderByColumn: "price",
});

// 加载商品列表
const loadProducts = () => {
  martApi
    .getGoodsList(goodListSearchParams.value)
    .then((response) => {
      const { code, msg, rows, total } = response as any as goodListSearchResp;
      console.log("API Response:", response);
      if (code === 200) {
        products.value = rows || [];
        totalNum.value = total || 0; // 更新商品总数
      } else {
        console.error("Failed to load products:", msg);
      }
    })
    .catch((error) => {
      console.error("Error loading products:", error);
    });
};

// 页码改变时重新加载商品
const handlePageChange = (newPage: number) => {
  goodListSearchParams.value.pageNum = newPage;
  loadProducts();
};

onMounted(() => {
  loadProducts();
  console.log("Initial totalNum:", totalNum.value);
});

const handleUnifiedSearch = (payload: {
  name: string;
  type: string;
  currencyType: string;
  isAsc: boolean;
}) => {
  goodListSearchParams.value.name = payload.name;
  goodListSearchParams.value.type = payload.type;
  goodListSearchParams.value.currencyType = payload.currencyType;
  goodListSearchParams.value.isAsc = payload.isAsc;
  goodListSearchParams.value.pageNum = 1;
  loadProducts();
};
</script>

<style scoped>
.home-container-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.show {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

#pagenation {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
}
.center-container {
  width: 80%;
  display: flex;
  margin-top: 20px;
}
/* 移动端适配 */
@media (max-width: 768px) {
  .center-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
