<template>
  <div id="app">
    <NavBar />
    <div class="show">
      <ProductCarrousel />
    </div>
    <div class="center-container">
      <ProductSearch />
      <SearchBox @search="handleSearch" />
    </div>
    <div v-if="displayedProducts.length === 0" style="text-align: center; ">
      <el-empty :image-size="150" />
    </div>
    <ProductShow :products="displayedProducts" />
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalNum"
      :page-size="8"
      v-model:currentPage="currentPage"
      pager-count="50"
      @current-change="handlePageChange"
      id="pagenation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch} from 'vue';
import NavBar from '@/components/NavBar/index.vue';
import ProductCarrousel from '@/views/index/ProductCarrousel/index.vue';
import SearchBox from '@/views/index/SearchBox/index.vue';
import ProductSearch from '@/views/index/ProductShow/ProductSearch/index.vue';
import ProductShow from '@/views/index/ProductShow/index.vue';

import Axios from '../Axios/index'

const displayedProducts = ref([]);
const currentPage = ref(1);
const totalNum = ref(0); // 存储商品总数的响应式变量



// 提供响应式数据
import { provide } from 'vue';
const category = ref('');
const search = ref('');
const productclass = ref('');
const isasc = ref('');
provide('category', category);
provide('searchTerm', search);
provide('productclass', productclass);
provide('isasc', isasc);

// 加载商品列表
const loadProducts = (pageNum) => {
 Axios
    .get('http://59.110.62.188:8080/market/goods/list', {
      params: {
        pageSize: 8,
        pageNum: pageNum,
        currencyType: category.value,
        name: search.value,
        type: productclass.value,
        isAsc: isasc.value,
        orderByColumn: 'price'
      },
    })
    .then(response => {
        totalNum.value = response.data.total; 
        displayedProducts.value = response.data.rows.map(product => {
        const status = product.status; 
        //判断商品status
        return {
          ...product,
          currencyType: {'0': '日用币', '1': '服装币'}[product.currencyType] || product.currencyType,
          isShelved: status === '1'
        };
      });
      })
    .catch(error => {
      console.error('加载商品失败', error);
    });
};

// 页码改变时重新加载商品
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  loadProducts(newPage);
};

onMounted(() => {
  loadProducts(currentPage.value);
  console.log('Initial totalNum:', totalNum.value); 
});

// 监听变化并重新加载商品
watch(category, (newVal) => {
  loadProducts(1); // 重置为第一页
});
watch(search, (newVal) => {
  category.value = '';
  productclass.value = '';
  isasc.value = '';
  loadProducts(1); // 重置为第一页
});
watch(productclass, (newVal) => {
  loadProducts(1); // 重置为第一页
});
watch(isasc, (newVal) => {
  loadProducts(1); // 重置为第一页
});
</script>

<style>
#app {
  display: block;
  margin: 0 auto;
  padding: 0 0;
}
.show {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

#pagenation{
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom:30px;
}
.center-container {
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