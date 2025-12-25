<template>
  <main>
      <Nav/>
      <div class="form" style="width: 1300px;">
          <div class="form_top">
              <h2>商品信息列表</h2>
              <div>
              <span >
                  <el-popconfirm title="确定删除？" @confirm="deleteALl">
                  <template #reference>
                  <el-button type="primary" size="large"  style="padding: 10px; font-size:16px">批量删除</el-button>
                  </template>
              </el-popconfirm>
              </span>
              <span style="margin: 0 20px;">
                  <el-button type="primary" size="large" @click="addAll" style="padding: 10px; font-size:16px">新增商品</el-button>
              </span>
          </div>
          </div>
          <div class="form_main">
          <el-table :data="items" @selection-change="selected" border style="width: 1260px; margin:3px 0;">
              <el-table-column type="selection" width="50"/>
              <el-table-column prop="name" label="商品名称" width="210" />
              <el-table-column label="商品图片" width="278" height="120">
                  <template #default="scope">
                      <el-image style="width: auto; height: 100px" :src="scope.row.imageUrlUrl" />
                  </template>
              </el-table-column>
              <el-table-column prop="amount" label="商品库存" width="210"/>
              <el-table-column prop="price" label="商品价格" width="210"/>
              <el-table-column label="操作" width="300" >
              <template #default="scope">
              <el-popconfirm title="确定删除？" @confirm="deleteItem(scope.$index)">
                  <template #reference>
                  <el-button text type="primary" class="table-btn ml10">
                          删除货物
                  </el-button>
                  </template>
              </el-popconfirm>
                      <el-button text type="primary" class="table-btn" @click="addGoodsRecord(scope.$index)">
                          增加货物
                      </el-button><el-button text type="primary" class="table-btn ml10" @click="modifyItem(scope.$index)">
                          修改货物
                      </el-button><el-button text type="primary" class="table-btn ml10" @click="detail(scope.$index)">
                          查看详情
                      </el-button>
                  </template>
              </el-table-column>
          </el-table>
          </div>
          <div class="bottom">
              <el-pagination layout="prev,pager,next,jumper,total" :page-size="5" :total="pagetotal" v-model="currentPage" :pager-count="5" @current-change="handlePageChange"/>
          </div>
      </div>
      <!-- 增加进货记录 -->
      <el-dialog v-model="addRecords" title="增加货物库存" width="500" center="true" align-center >
      <el-form :model="form1" ref="formRef" :rules="rules1">
        <el-form-item label="商品名称：" :label-width="formLabelWidth" style="padding-bottom: 20px;" prop="name">
         <span style="width:340px" class="over">{{name}}</span>
        </el-form-item>
        <el-form-item label="进货数量：" :label-width="formLabelWidth" prop="amount2">
          <el-input v-model="form1.amount2" autocomplete="off" style="width:340px"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel2" class="elbutns">取消</el-button>
          <el-button type="primary" @click="submitForm1()" class="elbutns" style="margin-left: 25px;">
            确认
          </el-button>
        </div>
      </template>
  <!-- 增加商品 -->
    </el-dialog>
      <el-dialog  v-model="addItems" :title="alter_title" width="500" center="true" align-center header-class="ml80">
          <el-form
              ref="ruleFormRef"
              style="max-width: 400px"
              :model="ruleForm"
              :rules="rules"
              label-width="auto"
              class="demo-ruleForm"
              :size="formSize"
              status-icon
      >
      <el-form-item label="名称：" prop="name" class="custom-form-item">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="价格：" prop="price" class="custom-form-item">
          <el-input v-model="ruleForm.price" />
      </el-form-item>
          <el-form-item label="商品类型：" prop="type" class="custom-form-item">
          <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option label="日用品" value="0" style="padding-left: 10px;"/>
          <el-option label="服装" value="1" style="padding-left: 10px;"/>
          <el-option label="学习用品" value="2" style="padding-left: 10px;"/>

        </el-select>
      </el-form-item>
      <el-form-item label="货币类型：" prop="currencyType" class="custom-form-item">
          <el-select v-model="ruleForm.currencyType" placeholder="请选择">
          <el-option label="日用币" value="0" style="padding-left: 10px;"/>
          <el-option label="服装币" value="1" style="padding-left: 10px;"/>
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态：" prop="status" class="custom-form-item">
        <el-segmented v-model="ruleForm.status" :options="statusoption" />
      </el-form-item>
      <el-form-item label="限额：" prop="limitNum" class="custom-form-item">
          <el-input v-model="ruleForm.limitNum" />
      </el-form-item>
      <el-form-item label="限制类型：" prop="limitType" class="custom-form-item">
        <el-radio-group v-model="ruleForm.limitType">
          <el-radio value="0">一个月</el-radio>
          <el-radio value="1" style="padding-left: 20px;">一学期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="alter_title=='修改货物'" label="库存：" prop="amount" class="custom-form-item">
          <el-input v-model="ruleForm.amount" />
      </el-form-item>
      <el-form-item label="介绍：" prop="intro" class="custom-form-item">
        <el-input v-model="ruleForm.intro" type="textarea" resize="none"/>
      </el-form-item>
      <el-form-item label="图片：" prop="imageUrl" class="custom-form-item">
          <img :src="imageUrlUrl" v-if="alter_title=='修改货物'" class="detailimag" style="margin-left: 20px;" @click="handleFileChange2">
      <input type="file" @change="handleFileChange"  ref="fileInput"  style="display: none;">
        <el-button  v-if="alter_title=='增加货物'" :disabled="!loadflag" class="ml-3" type="primary" @click="triggerFileInput" style="padding: 10px;">
          {{loadtitle}}
        </el-button>
  </el-form-item>
      <el-form-item>
       <div class="btn">
        <el-button @click="resetForm(ruleFormRef)" class="elbutns" style="margin-left: 170px;">取消</el-button>
         <el-button type="primary"  @click="submitForm(ruleFormRef)" class="elbutns" style="margin-left: 25px;">
          提交
        </el-button>
       </div>
      </el-form-item>
    </el-form>
    </el-dialog>
    <!-- 查看详情 -->
     <el-dialog v-model="centerDialogVisibledetail" title="查看商品详情" width="850"   center="true" align-center >
        <el-descriptions title=" " border>
      <el-descriptions-item
        :rowspan="3"
        :width="100"
        label="商品图片"
        
      >
        <el-image
          style="width: auto; height: 100px"
          :src="imageUrlUrl"
        />
      </el-descriptions-item>
      <el-descriptions-item label="名称" :width="100" class-name="my-class">{{ruleForm.name}}</el-descriptions-item>
      <el-descriptions-item label="商品类型" :width="100" class-name="my-class">{{ruleForm.type}}</el-descriptions-item>
      <el-descriptions-item label="价格" :width="100" class-name="my-class">{{ruleForm.price}}</el-descriptions-item>
       <el-descriptions-item label="货币类型" :width="100" class-name="my-class">{{ruleForm.currencyType}}</el-descriptions-item>
      <el-descriptions-item label="限额" :width="100" class-name="my-class">{{ruleForm.limitNum}}</el-descriptions-item>
      <el-descriptions-item label="库存" :width="100">
        {{ruleForm.amount}}
      </el-descriptions-item>
      <!-- <el-descriptions-item label="限制类型" :width="100">{{ruleForm.limitType}}</el-descriptions-item> -->
      <el-descriptions-item label="状态" :width="100" class-name="my-class">
      {{ruleForm.status}}
      </el-descriptions-item>
      <el-descriptions-item label="介绍" :width="100" truncated class-name="my-class" label-class-name="my-label">
      {{ ruleForm.intro }}
    </el-descriptions-item>
    </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisibledetail = false" class="elbutns">取消</el-button>
          <el-button type="primary" @click="centerDialogVisibledetail = false" style="margin-left:25px" class="elbutns" >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </main>
  </template>
  
  <script setup lang="ts">
  // import OSS from 'ali-oss';
  import Nav from '@/components/ManagerNav/index.vue'
  import {reactive,ref,computed} from 'vue';
  import { onMounted } from 'vue';
  import {ElMessage} from 'element-plus';
  import type { ComponentSize, FormInstance, FormRules, UploadInstance  } from 'element-plus'
  import axios from 'axios';
  import Axios from '../Axios/index';
  // import axios from 'axios';
  const name = ref('(*^▽^*)');
  const price = ref();
  const currencyType = ref('1');
  const type = ref('日常');
  const status = ref('0');
  const barcode = ref('1 ');
  const intro = ref('你好');
  const limitNum = ref();
  const limitType = ref('每月');
  const amount=ref()
  const quantifier = ref('1');
  const imageUrl=ref('')
  const imageUrlUrl = ref('');
  const id=ref('')
  const campus=ref('')
  const displayed=ref('none')
  const displayed2=ref('none')
  const pagetotal=ref(0)
  const addItems=ref(false)
  const alter_title=ref('增加货物')
  const formRef = ref(null);
  const addRecords = ref(false);
  const loadtitle=ref('上传图片')
  const loadflag=ref(true)
  const centerDialogVisibledetail=ref(false)
  const uploading = ref(false);
  // 进货记录
  const form1 = reactive({
    name: '',
    amount2: ''
  });
  const formLabelWidth = '100px';
  
  
  const rules1 = {
    amount2: [
      { required: true, message: '请输入进货数量', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          // 首先检查值是否存在且为数字
          if (!value || isNaN(value)) {
            callback(new Error('必须是个大于0的数字'));
            return;
          }
          // 将值转换为数字（以防它是字符串形式的数字）
          const age = Number(value);
          // 检查值是否为大于0的整数
          if (!Number.isInteger(age) ||age <= 0) {
            callback(new Error('必须是个大于0的整数'));
          } else {
            callback();
          }
        },
        trigger: 'blur' // 触发验证的事件类型
      }
    ]
  };
  
  const submitForm1 = () => {
    if (formRef.value) {
      formRef.value.validate((valid) => {
        if (valid) {
          // 表单验证通过，执行添加记录的逻辑
          addRecord(indexx);
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    } else {
      console.log('formRef is null');
    }
  };
  
  
  interface RuleForm {
    name: string
    price: number
    currencyType:string[]
    limitNum: number
    limitType: string[]
    amount: number
    status: string[]
    intro: string
    imageUrl: string
    type:string
  }
  const formSize = ref<ComponentSize>('default')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    name: name.value,
    currencyType: [],
    price: price.value,
    limitNum: limitNum.value,
    limitType: [],
    amount: amount.value,
    status: [],
    intro: intro.value,
    imageUrl: imageUrl.value,
    type:type.value
  })
  const currencyTypeoption=['日用币','服装币']
  const statusoption = ['上架中','下架']
  
  const rules = reactive<FormRules<RuleForm>>({
    name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
    ],
    imageUrl: [
  { required: true, message: '请上传商品图片', trigger: 'change' },
],

    currencyType: [
      {
        required: true,
        message: '请选择货币类型',
        trigger: 'change',
      },
    ],
    price: [
      {
        required: true,
        message: '请输入商品价格',
        trigger: 'blur',
      },
      // { type: 'number', message: 'Age must be a number', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          // 首先检查值是否存在且为数字
          if (!value || isNaN(value)) {
            callback(new Error('必须是个大于0的数字'));
            return;
          }
          // 将值转换为数字（以防它是字符串形式的数字）
          const price = Number(value);
          // 检查值是否为大于0的整数
          // !Number.isInteger(age) || 
          if (price <= 0) {
            callback(new Error('必须是个大于0的数字'));
          } else {
            callback();
          }
        },
        trigger: 'blur' // 触发验证的事件类型
      }
    ],
    limitNum: [
      {
        required: true,
        message: '请输入限额',
        trigger: 'blur',
      },
    // { type: 'number', message: 'Age must be a number', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          // 首先检查值是否存在且为数字
          if (!value || isNaN(value)) {
            callback(new Error('必须是个大于0的数字'));
            return;
          }
          // 将值转换为数字（以防它是字符串形式的数字）
          const limitNum = Number(value);
          // 检查值是否为大于0的整数
          if (!Number.isInteger(limitNum) ||limitNum <= 0) {
            callback(new Error('必须是个大于0的整数'));
          } else {
            callback();
          }
        },
        trigger: 'blur' // 触发验证的事件类型
      }
    ],
    limitType: [
      {
        required: true,
        message: '请选择限制类型',
        trigger: 'change',
      },
    ],
    amount: [
      {
        required: true,
        message: '请输入库存',
        trigger: 'blur',
      },
      {
        validator: (rule, value, callback) => {
          // 首先检查值是否存在且为数字
          if (!value || isNaN(value)) {
            callback(new Error('必须是个大于0的数字'));
            return;
          }
          // 将值转换为数字（以防它是字符串形式的数字）
          const age = Number(value);
          // 检查值是否为大于0的整数
          if (!Number.isInteger(age) ||age <= 0) {
            callback(new Error('必须是个大于0的整数'));
          } else {
            callback();
          }
        },
        trigger: 'blur' // 触发验证的事件类型
      }
    ],
    status: [
      {
        required: true,
        message: '请选择状态',
        trigger: 'change',
      },
    ],
    type: [
      { required: true, message: '请选择商品类型', trigger: 'change' },
    ],
    intro: [
      { required: true, message: '请输入商品介绍', trigger: 'blur' },
    ],
  })
  
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
          addItem()
          cancel()
      } else {
        console.log('error submit!', fields)
      }
    })
  }
  
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    cancel()
  }
  
  const options = Array.from({ length: 10000 }).map((_, idx) => ({
    value: `${idx + 1}`,
    label: `${idx + 1}`,
  }))
  // 使用 ref 创建每个字段的响应式引用
  const itemsTableRef = ref(null);
  const checkAll = ref(false); // 全选状态
  const multipleSelection = ref([]); // 当前选中的行
  
  // 一个货物
  interface Item {
    id: string;
    name: string;
    imageUrlUrl: string;
    amount: number;
    price: number;
    currencyType:string,
    checked: boolean; // 用于单选框状态
  }
  const items = ref<Item[]>([
      ]);
  let typeValue = '0';
switch (ruleForm.type) {
  case '日用品':
    typeValue = '0';
    break;
  case '服装':
    typeValue = '1';
    break;
  case '学习用品':
    typeValue = '2';
    break;
  default:
    typeValue = '0';
}
  //发送获取列表的请求
  const fetchGoods = async (current) => {
    try {
  
      const response = await Axios.get('http://59.110.62.188:8080/market/goods/list',{
          params:{
              pageSize:5,
              pageNum:current
          }
      }) 
      pagetotal.value=response.data.total
      items.value = response.data.rows;
      for(let i=0;i<response.data.rows.length;i++){
          if(items.value[i].currencyType=='0'){
              items.value[i].currencyType='日常'
          }
          else{
              items.value[i].currencyType='服装'
          }
      }    
    } catch (error) {
      console.error('请求商品数据失败:', error);
    }
  };
  
  // 挂载时获取列表
  onMounted(()=>{
      fetchGoods(currentPage.value)
  })
  
  //发送增加的请求
  const putimg=ref('点击提交图片')
  const addAll=()=>{
      loadflag.value=true
      addItems.value=true
      ruleForm.name=''
      ruleForm.price=null
      ruleForm.type=''
      ruleForm.currencyType=[]
      ruleForm.status=[]
      ruleForm.limitNum=null
      ruleForm.limitType=[]
      ruleForm.amount=null
      ruleForm.intro=''
      ruleForm.imageUrl=''
      loadtitle.value='上传图片'
      alter_title.value='增加货物'
  }
  const addItem=()=>{
    
          if(alter_title.value==='增加货物'){
              if (!ruleForm.imageUrl) {
                 ElMessage.error('请先上传商品图片');
              return; 
             }
               if (uploading.value) {
                  ElMessage.warning('图片正在上传中，请稍后再试');
              return;
              }
              addGoods()
              fetchGoods(currentPage.value)
          }
          else{
              modifyGoods(indexx.value)
              fetchGoods(currentPage.value)
              
              
          }
  }
  const cancel=()=>{
      addItems.value=false
  }
  const addGoods = async () => {
      console.log(ruleForm.status);
      
      status.value=(ruleForm.status==='上架中'?'0':'1')
      try {
      const requestData = {
          name: ruleForm.name,
          price: ruleForm.price,
          currencyType: ruleForm.currencyType,
          type: ruleForm.type,
          status: status.value,
          barcode: barcode.value,
          intro: ruleForm.intro,
          limitNum: ruleForm.limitNum,
          limitType: ruleForm.limitType,
          quantifier: quantifier.value,
          imageUrl:ruleForm.imageUrl,
          };
          const response = await Axios.post(`http://59.110.62.188:8080/market/goods`,requestData) 
          fetchGoods(currentPage.value)
          if(response.data.code===200)
              ElMessage.success('增加商品成功')
          else
              ElMessage.error('增加商品失败，'+response.data.msg)
      } catch (error) {
          console.error('请求商品数据失败:', error);
          ElMessage.error('增加商品失败')
  }
  };
  
  let idArr=ref([])
  const selected=(data)=>{
      idArr.value=[]
      data.forEach((value)=>{
          idArr.value.push(value.id)
      })
  }
  
  // 删除功能
  // 删除指定项
  const deleteItem = (index: number) => {
      delectGoods(items.value[index].id)
  fetchGoods(currentPage.value)
  };
  // 删除请求
  const delectGoods = async (idArr) => {
      try {
      const response = await Axios.delete(`http://59.110.62.188:8080/market/goods/${idArr}`) // 请求商品数据
      if(response.data.code===200)
              ElMessage.success('删除成功')
      else
              ElMessage.error(response.data.msg)
      fetchGoods(currentPage.value)
      // ElMessage.success('删除成功')
      } catch (error) {
          console.error('请求商品数据失败:', error);
          ElMessage.error('删除失败')
  }   
  };
  // 删除全部
  const deleteALl=()=>{    
      delectGoods(idArr.value)
      checkAll.value=false
  }
  
  
  // 修改功能
  // 1.处理文件选择
  const selectedFile = ref(null);
  const fileInput = ref(null);
  // 上传文件
  const handleFileChange = (event) => { 
    uploading.value = true;  
    const formData = new FormData();
    const imageFile = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; 
    if (imageFile) {
      if (!allowedTypes.includes(imageFile.type)) {
      ElMessage.error('只能上传 JPG, PNG 或 GIF 格式的图片');
      uploading.value = false;
      return; // 如果文件类型不符合要求，直接返回
    }
      formData.append('file', imageFile);
      addFile(formData)
  };
  }
  const addFile = async (formData) => {
    try {
          const authToken=localStorage.getItem('token')
    const clientId=localStorage.getItem('client_id')
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`; 
    axios.defaults.headers.common['clientId'] = clientId;
      const response = await axios.post('http://59.110.62.188:8080/resource/oss/upload', formData);
      ruleForm.imageUrl=response.data.data.ossId
      getimag(ruleForm.imageUrl)
      if(response.data.code===200){
        ElMessage.success('上传图片成功')
        loadtitle.value='上传成功'
        loadflag.value=false
      }
      else
        ElMessage.error('上传图片失败')
    } catch (error) {
      ElMessage.error('上传图片失败')
    }
    uploading.value = false; 
  };
  // 图片回显
  const getimag=async (ossIds)=>{
      const response = await Axios.get(`http://59.110.62.188:8080/resource/oss/listByIds/${ossIds}`)
      imageUrlUrl.value=response.data.data[0].url
      ruleForm.imageUrl = response.data.data[0].ossId
      console.log(response.data.data[0].url);
  }
  // 上传图片的两个点击事件
  const handleFileChange2=(event)=>{
  fileInput.value.click();
  }
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  // 修改商品的接口的接口
  const modifyGoods = async (indexx) => {
      ruleForm.status=ruleForm.status==='上架中'?'0':'1'
  try {
      let requestData = {
      id:items.value[indexx].id,
      name: ruleForm.name,
      price: ruleForm.price,
      currencyType: ruleForm.currencyType==='日用币'?'0':'1',
      type: typeValue,
      status: ruleForm.status,
      barcode: barcode.value,
      intro: ruleForm.intro,
      limitNum: ruleForm.limitNum,
      limitType: ruleForm.limitType,
      quantifier: quantifier.value,
      imageUrl: ruleForm.imageUrl,
      amount:ruleForm.amount
      };
      const response = await Axios.put(`http://59.110.62.188:8080/market/goods`,requestData)
      if(response.data.code===200) 
          ElMessage.success('修改成功')
      else
          ElMessage.error('修改失败')
  } catch (error) {
      console.error('请求商品数据失败:', error);
      ElMessage.error('修改失败')
      }
       fetchGoods(currentPage.value)
  };
  const indexx=ref(0)
  const modifyItem = (index: number) => {
      indexx.value=index
      alter_title.value="修改货物"
      addItems.value=true
      datailGoods(items.value[index].id,index)
  };
  
  
  // 查看详情功能
  const detail=(index:number)=>{
      centerDialogVisibledetail.value=true
      datailGoods(items.value[index].id,index)
  }
  const datailGoods = async (id,index) => {
    try {
      const response = await Axios.get(`http://59.110.62.188:8080/market/goods/${id}`)
      if(response.data.code!=200)
        ElMessage.error('查看该商品失败')
      console.log(response.data.data.status);
      
      ruleForm.name=response.data.data.name
      ruleForm.price=response.data.data.price
      ruleForm.currencyType=response.data.data.currencyType==='0'?'日用币':'服装币'
      ruleForm.type=response.data.data.type==='0'?'日用品':'学习用品'
      ruleForm.status=response.data.data.status=='0'?'上架中':'下架'
      barcode.value=response.data.data.barcode
      ruleForm.intro=response.data.data.intro
      ruleForm.limitNum=response.data.data.limitNum
      ruleForm.limitType=response.data.data.limitType
      quantifier.value=response.data.data.quantifier
      ruleForm.imageUrl=response.data.data.imageUrl
      campus.value=response.data.data.campus
      imageUrlUrl.value=response.data.data.imageUrlUrl
      ruleForm.imageUrl=response.data.data.imageUrl
      ruleForm.amount=response.data.data.amount
    } catch (error) {
      console.error('请求商品数据失败:', error);
      ElMessage.error('查看商品失败')
    }
  };
  const defines=()=>{
      displayed2.value="none"
  }
  
  
  // 分页器
  // 页码改变时重新加载商品
  const currentPage=ref(1)
  const handlePageChange = (newPage) => {
   currentPage.value = newPage;
   fetchGoods(currentPage.value)
   checkAll.value=false
  };
  
  
  // 增加进货记录
  // 使用 ref 创建每个字段的响应式引用
  const goodsId = ref('1');
  const amount2 = ref(null);
  const displayed3=ref('none')
  const addGoodsRecord=(index)=>{
      form1.amount2=null
      addRecords.value=true
      name.value=items.value[index].name
      goodsId.value=items.value[index].id    
      // console.log(items.value[index].id);
  }
  const cancel2=()=>{
      addRecords.value=false
  }
  const addRecord = async (index) => {
      addRecords.value = false;
      try {
      const requestData = {
          goodsId:goodsId.value,
          amount:form1.amount2
          };
          const response = await Axios.post(`http://59.110.62.188:8080/market/restock`,requestData)
          if(response.data.code===200) 
              ElMessage.success('增加进货成功')
          else
          ElMessage.success('增加进货失败')
      } catch (error) {
          console.error('请求商品数据失败:', error);
          ElMessage.success('增加进货失败')
  }
  displayed3.value="none"
  fetchGoods(currentPage.value)
  };
  

  </script>
  
  <style scoped>
  
  ::v-deep  .el-descriptions-item__content {
    max-width: 100px;  
  }

  ::v-deep .my-label {
  width: 100px;
  color: #999;
  font-weight: normal;
  background: #fff;
}
  ::v-deep .my-class {
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
  .custom-form-item {
    margin-left: 30px;
    margin-bottom:20px; /* 调整这个值以改变间距 */
    font-size: 18px;
    width: 400px;
  }
  .elbutns{
      padding: 18px;
      font-size: 16px;
      margin-top: 20px;
  }
  .btn{
      width: 500px;
      float: left;
  }
  .over{
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  }
  * {
      padding: 0;
      margin: 0;
      /* 改盒子高度和长度的计算 */
      box-sizing: border-box;
  }
  .detailimag{
      width: auto;
      height: 100px;
      vertical-align: text-top;
      border-radius: 20px;
  }
  
  /*分页器*/
  .bottom{
      position: absolute;
      width: 280px;
      height: 30px;
      bottom: 25px;
      right: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
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
      height: 1600px;
      width: 1300px;
      position: relative;
  }
  
  main .form .form_main table tr input[type="button"] {
      margin: 5px;
  }
  
  main .form .form_main .tr img {
      width: 20%;
      height: 50%;
  }
  #checkall,.ck{
      margin: 20px;
      width: 20px;
      height: 20px;
  }
  /* 表单 */
  
  main .form {
      border-radius: 10px;
      width: 1200px;
      height: 850px;
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
      color:#409eff;
  }
  
  main .form .form_top span {
      height: 100px;
      line-height: 100px;
  }
  main .form .form_main {
      margin: 0 20px;
  }
.el-dialog__header .el-dialog__title{
  margin-left: 100px !important;
}
  </style>