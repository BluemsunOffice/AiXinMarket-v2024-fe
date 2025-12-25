<template>
  <div class="all-goods">
    <div class="content">
      <div class="item" v-for="product in productlist" :key="product.id" @click="openProductDetail(product)">
        <ProductInfo :name="product.name" :img-url="product.imageUrlUrl" :is-shelved="product.isShelved">
          <template #default>
            <img :src="product.imageUrlUrl" :class="{ 'image-darken': product.isShelved }" />
          </template>
          <template #title>
            <div v-if="product.isShelved">
              <el-tag type="danger">已下架</el-tag>
            </div>
            <div v-if="!product.isShelved">
              <el-tag type="success">已上架</el-tag>
            </div>
            <div class="title">
              <el-text class="w-150px mb-2" size="large" truncated>{{ product.name }}</el-text>
            </div>
          </template>
          <template #footer>
            <div class="details">
              <div class="price"><el-text class="mx-1" size="large">{{ product.currencyType }}:{{ product.price }}</el-text></div>
              <div class="num"><el-text class="mx-1" size="large">库存：{{ product.amount }}</el-text></div>
            </div>
          </template>
        </ProductInfo>
      </div>
    </div>
  </div>
  <GoodsDetails v-if="detailModalVisible" :productDetail="currentProduct" @close="closeModal" />
</template>

<script setup name="index">
import { ref, watch } from 'vue';
import ProductInfo from '@/plugins/ProductInfo/index.vue';
import GoodsDetails from '@/views/index/GoodsDetails.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
  }
});

const productlist = ref([]);
productlist.value = props.products;

const detailModalVisible = ref(false);
const currentProduct = ref(null);

watch(() => props.products, (newProducts) => {
  productlist.value = newProducts;
}, { immediate: true });

const openProductDetail = (product) => {
  if (!product.isShelved) {
    currentProduct.value = product;
    detailModalVisible.value = true;
  }
};

function closeModal() {
  detailModalVisible.value = false;
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 21px;
  font-weight: 800;
  color: rgb(122, 121, 121);
  margin-bottom: 5px;
  margin-top: 5px;
}

.all-goods {
  padding: 30px;
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* gap: 1px;  */
}
.item {
  width: calc(25% - 30px);
  margin-bottom: 30px;
  box-sizing: border-box; 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  justify-content: center; 
  text-align: center; 
}

img {
  width: 100%;
  height:135px;
  border-top-left-radius: 8px; /* 圆角 */
  border-top-right-radius: 8px; /* 圆角 */
}

img:hover {
  transform: scale(1.1);
  transition: all 0.2s;
}

.details {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*padding: 8px;*/
  /* margin-top:1vw; */
  padding:13px;
  background-color: rgb(235.9, 245.3, 255); 
  border-bottom-left-radius: 8px; 
  border-bottom-right-radius: 8px; 
}

.price,
.num {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  margin-bottom: 8px;
}

.btn {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px;
  
}

.image-darken {
  filter: grayscale(100%) opacity(0.5); 
}
@media (max-width: 768px) { /* 针对手机端的样式调整 */
  .item {
    width: 155px; /* 手机端占满整个屏幕宽度 */
    margin: 5px;
  }

  .title {
    font-size: 15px; 
  }

  img {
    height: 90px; /* 手机端图片高度固定 */
  }
  .details {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background-color: rgb(235.9, 245.3, 255); 
  border-bottom-left-radius: 8px; 
  border-bottom-right-radius: 8px; 
  font-size: 5px;
  }
  .price{
    margin:0px;
    font-size:5px;
  }
}
@media (min-width: 1300px) { /* 大屏幕 */
  .item {
    width: calc(20% - 30px); /* 一行五个 */
    margin: 15px;
  }
  img {
    width: 100%;
    height:160px;
    border-top-left-radius: 8px; /* 圆角 */
    border-top-right-radius: 8px; /* 圆角 */
  }
  .details {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    margin-top:25px;
    background-color: rgb(235.9, 245.3, 255); 
    border-bottom-left-radius: 8px; 
    border-bottom-right-radius: 8px; 
  }
}

@media (max-width: 767px) { /* 更小屏幕 */
  .item {
    width: calc(50% - 30px); /* 一行两个 */
    margin: 15px;
  }
}
</style>
