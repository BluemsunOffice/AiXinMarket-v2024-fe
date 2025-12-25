<template>
  <main>
    <Nav />
    <div class="form">
      <div class="form_top">
        <h2>进货记录</h2>
        <div>
          <span>
            <!-- <input type="button" value="新增" id="add" @click="addAll"> -->
          </span>
        </div>
      </div>
      <div class="form_main" style="font-size: 16px">
        <el-table :data="items" border style="width: 1280px">
          <el-table-column prop="name" label="商品名称" width="250" />
          <el-table-column label="商品图片" width="310" height="80">
            <template #default="scope">
              <el-image
                style="width: auto; height: 100px"
                :src="scope.row.imageUrl"
              />
              <!-- <img :src="scope.row.imageUrlUrl" alt="商品图片" /> -->
            </template>
          </el-table-column>
          <el-table-column prop="originAmount" label="货物起始" width="224" />
          <el-table-column prop="amount" label="货物库存" width="224" />
          <el-table-column label="操作" width="250">
            <template #default="scope">
              <el-button
                text
                type="primary"
                class="table-btn ml10"
                @click="detail(scope.$index)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <el-pagination
          layout="prev,pager,next,jumper,total"
          :page-size="6"
          :total="total"
          v-model="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog
      v-model="centerDialogVisible"
      title="进货记录详情"
      width="820"
      center
    >
      <el-descriptions title="" border>
        <el-descriptions-item
          :rowspan="2"
          :width="80"
          label="商品图片"
          align="center"
          align-center
        >
          <el-image style="width: auto; height: 80px" :src="imageUrl" />
        </el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ name }}</el-descriptions-item>
        <el-descriptions-item label="起始数量">{{
          originAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="现存数量">{{
          endAmount
        }}</el-descriptions-item>
        <el-descriptions-item label="增加数量">
          <el-tag size="small" style="padding: 10px">{{
            endAmount - originAmount
          }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="centerDialogVisible = false"
            style="padding: 20px; font-size: 16px"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="centerDialogVisible = false"
            style="padding: 20px; font-size: 16px; margin-left: 25px"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </main>
</template>

<script setup lang="ts">
import Nav from "@/components/ManagerNav/index.vue";
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import Axios from "../Axios/index";
interface Item {
  id: number;
  name: string;
  amount: number;
  goodsId: number;
  originAmount: number;
  endAmount: number;
  imageUrl: string;
}
const total = ref(10);
const name = ref("");
const amount = ref(0);
const endAmount = ref(0);
const originAmount = ref(0);
const imageUrl = ref("");
const displayed2 = ref("none");
const centerDialogVisible = ref(false);
const items = ref<Item[]>([]);
// 查看详情功能
const detail = (index: number) => {
  centerDialogVisible.value = true;
  datailGoods(items.value[index].id, index);
};
const datailGoods = async (id, index) => {
  try {
    const response = await Axios.get(
      `http://59.110.62.188:8080/market/restock/info/${id}`
    );
    console.log(response.data);
    amount.value = response.data.data.amount;
    endAmount.value = response.data.data.endAmount;
    imageUrl.value = response.data.data.imageUrl;
    name.value = response.data.data.name;
    originAmount.value = response.data.data.originAmount;
  } catch (error) {
    console.error("请求商品数据失败:", error);
    ElMessage.error("查看商品失败");
  }
};
const defines = () => {
  displayed2.value = "none";
};
// 获取进货记录列表
const fetchRecord = async (current) => {
  try {
    const response = await Axios.get(
      "http://59.110.62.188:8080/market/restock/list",
      {
        params: {
          pageSize: 5,
          pageNum: current,
        },
      }
    );

    items.value = response.data.rows;
    total.value = response.data.total;
    console.log(response.data);
    console.log(total.value);
  } catch (error) {
    console.error("请求商品数据失败:", error);
    ElMessage.error("查看进货流标失败");
  }
};

// 挂载时渲染页面
onMounted(() => {
  fetchRecord(currentPage.value);
});

// 分页器
// 页码改变时重新加载商品
const currentPage = ref(1);
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchRecord(currentPage.value);
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  /* 改盒子高度和长度的计算 */
  box-sizing: border-box;
}
/*分页器*/
.bottom {
  position: absolute;
  width: 280px;
  height: 30px;
  bottom: 25px;
  right: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.detailimag {
  width: 200px;
  height: 100px;
  vertical-align: text-top;
  border-radius: 20px;
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
  color: #409eff;
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
  height: 1600px;
}

main .form .form_main table tr input[type="button"] {
  margin: 5px;
}

main .form .form_main .tr img {
  width: 40%;
  height: 60%;
}
#checkall,
.ck {
  margin: 20px;
  width: 20px;
  height: 20px;
}
/* 表单 */

main .form {
  border-radius: 10px;
  width: 1300px;
  height: 850px;
  margin: auto;
  background-color: #fff;
  position: relative;
  margin-top: 50px;
  border: 1px solid gray;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.4);
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

main .form .form_top input {
  width: 120px;
  height: 45px;
  margin: auto 20px;
  border: #fff 1px solid;
  background-color: rgb(51.2, 126.4, 204);
  color: #fff;
  font-size: 17px;
  border-radius: 10px;
}

main .form .form_main {
  margin: 0 20px;
}
</style>
