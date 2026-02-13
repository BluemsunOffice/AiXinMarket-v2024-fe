<template>
  <main class="manage-page">
    <NavBar />

    <section class="manage-container">
      <header class="manage-header">
        <div>
          <h2>商品管理</h2>
          <p>支持商品新增、编辑、删除与进货操作</p>
        </div>

        <div class="header-actions">
          <el-popconfirm title="确认删除选中的商品吗？" @confirm="handleBatchDelete">
            <template #reference>
              <el-button type="danger" :icon="Delete">批量删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" :icon="Plus" @click="openCreate">新增商品</el-button>
        </div>
      </header>

      <el-table
        :data="goodsList"
        border
        v-loading="loading"
        @selection-change="setSelectedRows"
        class="manage-table"
      >
        <el-table-column type="selection" width="48" />
        <el-table-column prop="name" label="商品名称" min-width="160" />
        <el-table-column label="商品图片" width="120">
          <template #default="{ row }">
            <el-image class="goods-image" :src="row.imageUrlUrl" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="类型" width="110">
          <template #default="{ row }">{{ formatGoodsType(row.type) }}</template>
        </el-table-column>
        <el-table-column label="货币" width="95">
          <template #default="{ row }">{{ formatCurrencyType(row.currencyType) }}</template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="90" />
        <el-table-column prop="amount" label="库存" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === '0' ? 'success' : 'info'">
              {{ row.status === '0' ? '上架中' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :icon="Edit" @click="openEdit(row)">编辑</el-button>
            <el-button link type="success" :icon="Plus" @click="openRestock(row)">进货</el-button>
            <el-popconfirm title="确认删除该商品吗？" @confirm="() => handleDeleteOne(row.id)">
              <template #reference>
                <el-button link type="danger" :icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          :model-value="pager.pageNum"
          :page-size="pager.pageSize"
          layout="prev,pager,next,jumper,total"
          :total="total"
          @current-change="changePage"
        />
      </div>
    </section>

    <el-dialog
      v-model="formDialogVisible"
      :title="isEditing ? '编辑商品' : '新增商品'"
      width="560"
      align-center
      destroy-on-close
    >
      <el-form label-width="92px" class="goods-form">
        <el-form-item label="商品名称">
          <el-input v-model="formModel.name" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="formModel.price" :min="0" :precision="2" :step="1" />
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="formModel.type" class="w-full">
            <el-option label="日用品" value="0" />
            <el-option label="服装" value="1" />
            <el-option label="学习用品" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="货币类型">
          <el-select v-model="formModel.currencyType" class="w-full">
            <el-option label="日用币" value="0" />
            <el-option label="服装币" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-radio-group v-model="formModel.status">
            <el-radio value="0">上架中</el-radio>
            <el-radio value="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="限购数量">
          <el-input-number v-model="formModel.limitNum" :min="1" :step="1" />
        </el-form-item>
        <el-form-item label="限购周期">
          <el-radio-group v-model="formModel.limitType">
            <el-radio value="0">一个月</el-radio>
            <el-radio value="1">一学期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isEditing" label="库存">
          <el-input-number v-model="formModel.amount" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input
            v-model="formModel.intro"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="商品图片">
          <div class="image-uploader">
            <input
              ref="imageInputRef"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="handleImageChange"
            />
            <el-button :icon="Upload" @click="triggerImageInput">上传图片</el-button>
            <el-image
              v-if="formModel.imageUrlUrl"
              class="preview-image"
              :src="formModel.imageUrlUrl"
              fit="cover"
            />
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitGoods">
          {{ isEditing ? '保存修改' : '确认新增' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="restockDialogVisible" title="增加库存" width="420" align-center>
      <el-form label-width="90px">
        <el-form-item label="商品名称">
          <span>{{ restockGoodsName }}</span>
        </el-form-item>
        <el-form-item label="进货数量">
          <el-input-number v-model="restockAmount" :min="1" :step="1" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="restockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRestock">确认</el-button>
      </template>
    </el-dialog>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Delete, Edit, Plus, Upload } from '@element-plus/icons-vue'
import NavBar from '@/components/NavBar/index.vue'
import { useManageGoodsStore } from '@/stores/manageGoodsStore'
import type { GoodsCurrencyType, GoodsType, ManageGoodsItem } from '@/api/manageGoods.api'

const manageGoodsStore = useManageGoodsStore()

const {
  goodsList,
  loading,
  total,
  pager,
  selectedIds,
  formDialogVisible,
  restockDialogVisible,
  submitting,
  formModel,
  restockGoodsName,
  restockAmount,
  isEditing,
} = storeToRefs(manageGoodsStore)

const {
  fetchGoods,
  changePage,
  setSelectedRows,
  deleteGoods,
  openCreateDialog,
  openEditDialog,
  uploadImage,
  submitGoods,
  openRestockDialog,
  submitRestock,
} = manageGoodsStore

const imageInputRef = ref<HTMLInputElement | null>(null)

const goodsTypeMap: Record<GoodsType, string> = {
  '0': '日用品',
  '1': '服装',
  '2': '学习用品',
}

const currencyTypeMap: Record<GoodsCurrencyType, string> = {
  '0': '日用币',
  '1': '服装币',
}

const formatGoodsType = (value: GoodsType) => goodsTypeMap[value] || '未知类型'
const formatCurrencyType = (value: GoodsCurrencyType) => currencyTypeMap[value] || '未知货币'

const openCreate = () => {
  openCreateDialog()
}

const openEdit = (item: ManageGoodsItem) => {
  openEditDialog(item)
}

const openRestock = (item: ManageGoodsItem) => {
  openRestockDialog(item)
}

const handleDeleteOne = async (id: string) => {
  await deleteGoods([id])
}

const handleBatchDelete = async () => {
  await deleteGoods(selectedIds.value)
}

const triggerImageInput = () => {
  imageInputRef.value?.click()
}

const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) {
    return
  }

  await uploadImage(file)
  target.value = ''
}

onMounted(() => {
  fetchGoods()
})
</script>

<style scoped>
.manage-page {
  min-height: 100vh;
}

.manage-container {
  max-width: 1320px;
  margin: 20px auto;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #ebeef5;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.manage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.manage-header h2 {
  margin: 0;
  font-size: 22px;
  color: #303133;
}

.manage-header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.manage-table :deep(.el-table__cell) {
  font-size: 14px;
}

.goods-image {
  width: 72px;
  height: 72px;
  border-radius: 6px;
}

.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.goods-form {
  padding-right: 8px;
}

.w-full {
  width: 100%;
}

.image-uploader {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hidden-input {
  display: none;
}

.preview-image {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

@media (max-width: 900px) {
  .manage-container {
    margin: 12px;
    padding: 12px;
  }

  .manage-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .pagination-wrap {
    justify-content: center;
  }
}
</style>
