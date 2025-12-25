<template>
  <section id="productDetailModal" class="modal">
    <div class="modal-content">
      <div class="title">
        <h2 id="productName">商品详情</h2>
        <span class="close" @click="close">&times;</span>
      </div>
      <div class="all-content">
        <img id="productImage" :src="productDetail.imageUrlUrl" alt="商品图片">
        <div class="intro">
          <h2 id="productDescription">{{ productDetail.name }}</h2>
          <br>
          <span id="name"><el-text class="mx-1" size="large">商品介绍:<br /><div class="product-intro">{{ productDetail.intro }}</div></el-text></span>
          <br>
          <span id="number"><el-text class="mx-1" type="danger" size="large">库存:{{ productDetail.amount }}</el-text></span>
          <br>
          <span id="con-price"><el-text class="mx-1">价格:{{ productDetail.currencyType }} {{ productDetail.price }}</el-text></span>
          <br>
          <div class="count">
            <div class="update">
              <span><el-text class="mx-1">数量：</el-text></span>
            <el-input-number
            size="small"
            v-model="num"
            :min="1"
            :max="productDetail.amount > 0 ? productDetail.amount : 1"
            :disabled="productDetail.amount === 0"
            @change="handleChange" />
            <el-button class="add" type="primary" round :disabled="productDetail.amount === 0" @click="addToCart">加入购物车</el-button>
            </div>
          </div>
          <br>
          <div class="btn-box">
            <div class="mb-4">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';
import Axios from '../Axios/index';
import { ElMessage } from 'element-plus';

const num = ref(1)
const handleChange = (value) => {
  console.log(value)
}

const emit = defineEmits();

const props = defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
});

const productDetail = ref(props.productDetail);

watch(() => props.productDetail, (newVal) => {
  productDetail.value = newVal;
}, { immediate: true });

const addToCart = () => {
  if (productDetail.value.amount > 0) {
    // 首先检查购物车中是否已有此商品及其数量
    Axios.get('http://59.110.62.188:8080/market/cart/list')
      .then(response => {
        if (response.data.code === 200 && response.data.data) {
          const cartItems = response.data.data;
          const existingItem = cartItems.find(item => item.goodsId === productDetail.value.id);
          
          // 如果购物车已有该商品
          if (existingItem) {
            // 计算当前数量加上要添加的数量是否超过库存
            const totalQuantity = existingItem.num + num.value;
            
            if (totalQuantity > productDetail.value.amount) {
              // 超过库存，显示提示
              ElMessage.warning(`该商品在购物车中已有${existingItem.num}个，库存仅剩${productDetail.value.amount}个，无法继续添加${num.value}个`);
              return;
            }
          }
          
          // 可以添加商品到购物车
          const payload = {
            goodsId: productDetail.value.id,
            num: num.value
          };
          
          Axios.post('http://59.110.62.188:8080/market/cart', payload)
            .then(response => {
              if (response.data.code === 500) {
                ElMessage.error(response.data.msg);
                console.log('商品下架', response);
              } 
              else if(response.data.code === 200){
                console.log('加入购物车成功', response);
                ElMessage.success('加入购物车成功');
                emit('close');
              }
              else if(response.data.code === 401){
                ElMessage.error('认证失败');
                emit('close');
              }
              else if(response.data.code === 403){
                ElMessage.error('您没有此权限');
                emit('close');
              }
            })
            .catch(error => {
              console.error('加入购物车失败', error);
              ElMessage.error('加入购物车失败');
              emit('close');
            });
        }
      })
      .catch(error => {
        console.error('获取购物车信息失败', error);
        ElMessage.error('获取购物车信息失败');
        emit('close');
      });
  } 
  else {
    ElMessage.error('库存不足，无法加入购物车');
    emit('close');
  }
};

// 监听数量变化，确保不超过库存
watch(num, (newVal) => {
  if (newVal > productDetail.value.amount) {
    ElMessage.warning(`数量不能超过库存(${productDetail.value.amount})`);
    num.value = productDetail.value.amount;
  }
});

// 关闭弹框的方法
const close = () => {
  emit('close'); 
};


</script>

<style scoped>
body {
  font-family: 'Open Sans', sans-serif;
  background-color: #f4f4f4;
  color: #333;
}

.modal {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(22, 22, 22, 0.469);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 85%;
    max-width: 700px;
}
.all-content{
  display:flex;
  flex-direction: row;
}
.intro{
  display:flex;
  flex-direction: column;
  margin-left:30px;
  margin-bottom:0px;
  width:64%;
}
.count{
  display:flex;
  flex-direction: row;
}

#productImage {
  width: 240px; /* 或者其他固定宽度 */
  height: 240px;
  border-radius: 4px;
  margin-bottom: 0; /* 移除底部边距 */
  margin-top:10px;
}

#productDescription, #name, #number, #con-price {
  font-size: 16px;
  color: #333;
  /* margin-bottom: 10px; */
}

.count, .btn-box {
  margin-top: 0; /* 移除顶部边距 */
}

.update {
  margin-right: 10px;
}

.el-input-number {
  width: auto; /* 自适应宽度 */
}

.el-button {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  width: auto; /* 自适应宽度 */
}

.el-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
.add{
  margin-left:60px;
}
.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: rgb(51.2, 126.4, 204);
    text-decoration: none;
    cursor: pointer;
}
/* #productName{
  width:200px;
} */
.title{
  display:flex;
  flex-direction: row;
  justify-content: space-between;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 60%;
    margin: 50px auto;
  }
  .modal{
    height:100vh;
  }
  .all-content{
    flex-direction: column;
    align-items: center;
  }

  .intro{
    margin-left:0px;
  }

  .count{
    justify-content: center;
  }

  .add{
    margin-left:0px;
    margin-top:10px;
  }
  .product-intro {
  width: 300px;
  height:auto;
  word-wrap: break-word; /* 允许在单词内换行 */
  white-space: normal;   /* 允许文本正常换行 */
  max-width: 250px;      /* 设置最大宽度，可根据需要调整 */
  display: inline-block;/* 确保文本块可以应用宽度和换行规则 */
}
}
</style>