<template>
  <main>
    <Nav />
    <div class="form">
      <div class="form_top">
        <h2>订单列表</h2>
        <div class="classes">
          <div class="flex flex-wrap items-center">
            
    <el-dropdown>
      <el-button type="primary" style="padding: 19px; margin-top:32px;  margin-right:20px;">
        {{classestitle}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="orderstatus=null;classestitle='全部'">全部</el-dropdown-item>
          <el-dropdown-item @click="orderstatus=0;classestitle='待处理'">待处理</el-dropdown-item>
          <el-dropdown-item @click="orderstatus=1;classestitle='失败'">失败</el-dropdown-item>
          <el-dropdown-item @click="orderstatus=2;classestitle='成功'">成功</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown>
      <el-button type="primary" style="padding: 19px; margin-top:32px;">
       {{classestitle2}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="ordertime=1;classestitle2='按时间升序'">按时间升序</el-dropdown-item>
          <el-dropdown-item @click="ordertime=0;classestitle2='按时间降序'">按时间降序</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span style="margin: 0 20px;">
          <el-popconfirm title="确定删除？" @confirm="delectOrdersAll">
                <template #reference>
                <el-button type="primary" size="large"  style="padding: 10px;" :disabled="orderstatus!==0">批量核销</el-button>
                </template>
            </el-popconfirm>
        </span>
  </div>
        </div>
        
      </div>
      <div class="form_main">
        <el-table :data="orders" @selection-change="selected" border style="width: 1280px; margin:3px 0;">
            <el-table-column type="selection" width="50"/>
            <el-table-column prop="createTime" label="订单时间" width="220"/>
            <el-table-column prop="status" label="订单状态" width="190">
      <template #default="scope">
        <el-tag
          :type="getTagType(scope.row.status)"
          style="padding: 15px; font-size:15px"
        >
          {{ getStatusText(scope.row.status) }}
        </el-tag>
      </template>
    </el-table-column>
            <el-table-column prop="names" label="商品名称" width="220" show-overflow-tooltip="true"/>
            <el-table-column  label="订单总价" width="219">
              <template #default="scope">
                服装币:{{scope.row.clothingBalance}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日用币:{{scope.row.generalBalance}}
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名称" width="160"/>
            <el-table-column label="操作" width="200" >
            <template #default="scope">
              <!-- {{console.log(scope.row.id)}} -->
            <el-popconfirm v-if="getStatusText(scope.row.status)==='待处理'" title="确定核销？" @confirm="delectOrders(scope.row.id)">
                <template #reference>
                <el-button text type="primary" class="table-btn ml10">
                        核销订单
                </el-button>
                </template>
            </el-popconfirm>
            <el-button text type="primary" class="table-btn ml10" @click="detail(scope.$index)">
                        查看详情
            </el-button>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <el-pagination layout="prev,pager,next,jumper,total" :page-size="9" :total="orderTotal" v-model="currentPage" :pager-count="5" @current-change="handlePageChange"/>
      </div>
    </div>
    <!-- 查看详情弹窗 -->
     <el-dialog v-model="centerDialogVisible" title="查看详情" width="840" center >
        <el-descriptions title="" border>
    <el-descriptions-item
      :rowspan="2"
      :width="140"
      label="商品图片"
      align-center
    >
      <el-image
        style="width: auto; height: 100px;"
        :src="imageUrl"
      />
    </el-descriptions-item>
    <el-descriptions-item label="名称" :width="100" class-name="my-class">{{goodsName}}</el-descriptions-item>
    <el-descriptions-item label="价格" :width="100" class-name="my-class">{{price}}</el-descriptions-item>
    <el-descriptions-item label="货币类型" :width="100" class-name="my-class">{{currencyType}}</el-descriptions-item>
    <el-descriptions-item label="数量" :width="100" class-name="my-class">{{amount}}
    </el-descriptions-item>
    <el-descriptions-item label="商品介绍" class-name="my-class" label-class-name="my-label" :width="100">
      {{intro}}
    </el-descriptions-item>
  </el-descriptions>
  <el-pagination layout="prev, pager, next" :total="detailTotal" v-model="currentPage2"  :page-size="1"
          @current-change="handlePageChange2" id="pagenation"/>
  </el-dialog>
  </main>
</template>

<script setup lang="ts">
import Nav from '@/components/ManagerNav/index.vue'
import { reactive, ref,watch } from 'vue';
import Axios from '../Axios/index';
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { ArrowDown, Orange } from '@element-plus/icons-vue'
interface Order {
  id: string;
  status: string;
  checked: boolean; 
  userId: string;
  username: string;
  createTime: string;
  clothingBalance: string;
  generalBalance: string;
  names:[]
}
const orders = ref<Order[]>([]);
const currentPage = ref(1);
const orderId = ref(1);
const goodsId = ref(0);
const amount = ref(1);
const currencyType = ref('日常');
const price = ref('1');
const goodsName = ref('1 ' );
const imageUrl = ref('你好');
const displayed2 = ref('none');
const currentPage2 = ref(1);
const orderTotal = ref(0); 
const detailTotal=ref(0)
const checkall = ref(false);
const centerDialogVisible = ref(false)
const orderstatus=ref(null)
const ordertime=ref(null)
const classestitle=ref('订单分类')
const classestitle2=ref('按时间排序')
const intro=ref('')
let orderID;
let idArr=ref([])
const selected=(data)=>{
    idArr.value=[]
    data.forEach((value)=>{
        idArr.value.push(value.id)
    })
}
const getTagType = (status) => {
  switch (status) {
    case '0':
      return 'primary';
    case '1':
      return 'danger';
    default:
      return 'success';
  }
};
 
const getStatusText = (status) => {
  switch (status) {
    case '0':
      return '待处理';
    case '1':
      return '失败';
    default:
      return '成功';
  }
};
// 查看详情
const detail = (index: number) => { 
  centerDialogVisible.value = true
  orderID = orders.value[index].id;
  datailOrder(orderID, currentPage2.value);
};
const datailOrder = async (id, current) => {
  try {

    const response = await Axios.get(`http://59.110.62.188:8080/market/orderInfo/page`, {
      params: {
        orderId: id,
        pageSize: 1,
        pageNum: current
      }
    });
    detailTotal.value = response.data.total;
    goodsName.value = response.data.rows[0].goodsName;
    price.value = response.data.rows[0].price;
    currencyType.value = response.data.rows[0].currencyType === '0' ? '日常币' : '服装币';
    amount.value = response.data.rows[0].amount;
    orderId.value = response.data.rows[0].orderId;
    goodsId.value = response.data.rows[0].goodsId;
    imageUrl.value = response.data.rows[0].imageUrl;
    intro.value=response.data.rows[0].intro
  } catch (error) {
    console.error('请求商品数据失败:', error);
  }
};
const defines = () => {
  displayed2.value = "none";
};

// 获取列表渲染
watch(orderstatus, (newValue, oldValue) => {
  fetchOrder(currentPage.value)
});
watch(ordertime, (newValue, oldValue) => {
  fetchOrder(currentPage.value)
});
const fetchOrder = async (current) => {
  try {
    const response = await Axios.get('http://59.110.62.188:8080/market/order/adminlist', {
      params: {
        pageSize: 9,
        pageNum: current,
        status:orderstatus.value,
        isAsc:ordertime.value
      }
    });
    orders.value = response.data.rows; 
    orderTotal.value = response.data.total; // 更新总订单数
    console.log(response.data.total);
    console.log(response.data.rows);

     
  } catch (error) {
    console.error('请求商品数据失败:', error);
  }
};
// 挂载时
onMounted(() => {
  fetchOrder(currentPage.value);
});


// 核销商品
const delectOrdersAll=()=>{
  delectOrders(idArr.value)
  // checkall.value=false
}
const delectOrders = async (idArr) => {
  
  try {

    const res=await Axios.post(`http://59.110.62.188:8080/market/order/check/${idArr}`);
    if(res.data.code===200){
      ElMessage.success('核销成功')
    }
    else{
      ElMessage.error('核销失败')
    }
    fetchOrder(currentPage.value);
  }catch (error) {
    console.error('请求商品数据失败:', error);
  }
};

// 分页器
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchOrder(currentPage.value);
  checkall.value = false;
};
const handlePageChange2 = (newPage) => {
  currentPage2.value = newPage;
  datailOrder(orderID, currentPage2.value);
};
</script>

<style scoped>
  ::v-deep  .el-descriptions-item__content {
    max-width: 100px;  
  }

  ::v-deep .my-label {
  height: 62px;
  width: 100px;
  color: #999;
  font-weight: normal;
  background: #fff;
}
  ::v-deep .my-class {
  height: 62px;
  max-width: 100px; 
  word-break: break-all; 
  word-wrap: break-word;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
  /* 弹框修改*/
  ::v-deep .el-dialog__title{ 
  margin-left: 65px !important;
}
.classes{
  float: right;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
/*分页器*/
.bottom{
    position: absolute;
    width: 280px;
    height: 30px;
    bottom: 25px;
   right: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
}
#pagenation{
    margin-bottom: 0px;
}
.detailimag{
    width: 200px;
    height: 100px;
    vertical-align: text-top;
    border-radius: 20px;
}

* {
    padding: 0;
    margin: 0;
    /* 改盒子高度和长度的计算 */
    box-sizing: border-box;
}
img {
    /* 除掉图片底端的空隙 */
    border: 0;
    /* 图片和文字中心对齐 */
    vertical-align: middle;
}
button {
    /* 让鼠标变小手 */
    cursor: pointer;
}
a {
    color: #409EFF;
    text-decoration: none;
}
a:hover {
    color: #f5d6d4;
}
span,
div,
h2 {
    cursor: default;
}
.w {
    width: 1300px;
    margin: 0 auto;
}
main .form {
    height: 800px;
}

main .form .form_main table tr input[type="button"] {
    margin: 5px;
}

main .form .form_main .tr img {
    width: 40%;
    height: 60%;
}
#checkall,.ck{
    margin: 20px;
    width: 20px;
    height: 20px;
}
/* 表单 */

main .form {
    border-radius: 10px;
    width: 1300px;
    height: 760px;
    margin: auto;
    background-color: #fff;
    position: relative;
    margin-top: 50px;
    border: 1px solid gray;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, .4);
}

main .form .form_top {
    height: 100px;
    display: flex;
    justify-content: space-between;
}

main .form .form_top h2 {
    line-height: 100px;
    margin-left: 20px;
    color: #409eff;
}

main .form .form_top span {
    height: 100px;
    line-height: 100px;
}


main .form .form_main {
    margin: 0 20px;
}


</style>