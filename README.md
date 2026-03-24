# AiXinMarket-v2024-fe

爱心超市前端项目（Vue 3 + Vite + Pinia + Element Plus）。

本项目面向多角色校园爱心超市场景，覆盖登录、商品浏览、购物车、订单、个人档案、学生档案、商品管理与进货记录等业务流程。当前仓库为前端实现，依赖后端接口完成认证、商品、订单、学生信息与个人信息等数据交互。

## 项目概览

### 主要角色

- 资助对象：登录后可进入爱心超市首页，浏览商品、加入购物车、提交订单、查看订单、查看和维护个人成长档案。
- 超市管理员：可进入商品管理、订单管理、进货记录页面，负责商品上下架、库存补充、订单核销等操作。
- 超级管理员：具备超市管理员能力，并可访问更多管理页面。
- 老师：可进入学生档案页面，查看学生信息、查看详情、导出学生资料。

### 主要业务模块

- 登录与认证：账号密码登录、记住密码、设备识别、登录态校验。
- 首页商品浏览：商品列表、分页、分类筛选、货币筛选、排序搜索、商品详情。
- 购物车：勾选结算、数量调整、库存限制校验、删除商品、重新结算。
- 用户订单：查看订单列表、取消订单、查看订单详情。
- 管理端订单：筛选状态、排序、批量核销、查看订单详情。
- 商品管理：新增商品、编辑商品、删除商品、上传图片、进货补货。
- 进货记录：分页查询补货流水、查看补货详情。
- 档案中心：个人信息展示、成长档案、奖励/处分/社会经历分页。
- 学生档案：搜索、分页、勾选导出、详情查看、学生信息导出。

## 技术栈

- `Vue 3`（`<script setup lang="ts">`）
- `Vite 6`
- `TypeScript`
- `Pinia`
- `Vue Router`
- `Element Plus`
- `Axios`
- `Sass`
- `Font Awesome`

## 目录结构

```text
src/
  api/                接口封装
  assets/             静态资源与全局样式
  components/         通用组件
  config/             请求与鉴权配置
  constants/          字典、默认值与选项常量
  core/               请求核心封装
  mixins/             全局混入
  plugins/            业务插件组件
  router/             路由与权限控制
  stores/             Pinia 状态管理
  types/              类型声明
  utils/              工具函数
  views/              页面模块
    framework/        框架页 / 账号中心
    home/             爱心超市首页与商品展示
    login/            登录页
    manage/           商品管理
    order/            管理端订单管理
    order-list/       用户订单列表
    profile/          个人成长档案
    record/           进货记录
    shop-cart/        购物车
    student/          学生档案
  App.vue
  main.ts
```

## 运行环境

建议使用以下环境：

- `Node.js >= 20`
- `npm >= 10`

如果团队需要统一环境，建议通过 `.nvmrc` 或 Volta 在本地额外约束 Node 版本。

## 安装与启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置接口地址

项目请求基地址来自环境变量 `VITE_API_BASE_URL`，默认值为 `/api`。

在本地开发时，建议新增 `.env.development`：

```bash
VITE_API_BASE_URL=http://你的后端地址
```

如果本地通过反向代理转发，也可以继续使用默认 `/api`。

### 3. 启动开发环境

```bash
npm run dev
```

默认由 Vite 启动本地开发服务。

### 4. 预览生产构建

```bash
npm run build
npm run preview
```

## 常用命令

```bash
npm run dev         # 本地开发
npm run type-check  # TypeScript + Vue 类型检查
npm run build       # 类型检查 + 生产构建
npm run build-only  # 仅执行 Vite 构建
npm run preview     # 本地预览构建产物
npm run test:unit   # 单元测试（如后续补充测试时使用）
npm run format      # 使用 Prettier 格式化 src 目录
```

## 路由与角色说明

路由定义位于 `src/router/index.ts`，核心规则如下：

- `/`：登录页
- `/home`：资助对象首页
- `/details`：商品详情
- `/cart`：购物车
- `/orderList`：资助对象订单列表
- `/manage`：商品管理（超市管理员 / 超级管理员）
- `/order`：管理端订单管理（超市管理员 / 超级管理员）
- `/record`：进货记录（超市管理员 / 超级管理员）
- `/framework`：账号中心入口
- `/framework/profile`：个人成长档案（资助对象）
- `/framework/studentFiles`：学生档案（老师 / 超级管理员）

### 登录后的默认跳转逻辑

- 超市管理员 / 超级管理员：跳转到 `/manage`
- 资助对象：跳转到 `/home`
- 老师：跳转到 `/framework/studentFiles`
- 其他角色：跳转到 `/framework`

### 页面/角色/路由对应表

| 页面模块 | 路由 | 可访问角色 | 说明 |
| --- | --- | --- | --- |
| 登录页 | `/` | 全部用户 | 系统登录入口 |
| 爱心超市首页 | `/home` | 资助对象 | 商品浏览、筛选、分页 |
| 商品详情 | `/details` | 资助对象 | 查看商品介绍与详情 |
| 购物车 | `/cart` | 资助对象 | 购物车勾选、删改、结算 |
| 用户订单 | `/orderList` | 资助对象 | 查看个人订单、取消订单、查看详情 |
| 商品管理 | `/manage` | 超市管理员、超级管理员 | 商品新增、编辑、删除、进货 |
| 管理端订单 | `/order` | 超市管理员、超级管理员 | 订单筛选、核销、查看详情 |
| 进货记录 | `/record` | 超市管理员、超级管理员 | 查看商品补货记录 |
| 账号中心 | `/framework` | 超市管理员、资助对象、老师、超级管理员 | 个人中心框架页 |
| 个人成长档案 | `/framework/profile` | 资助对象 | 个人信息、奖励、处分、社会经历 |
| 学生档案 | `/framework/studentFiles` | 老师、超级管理员 | 查询学生、查看详情、导出资料 |

## 使用手册

### 资助对象使用流程

1. 使用资助对象账号登录系统。
2. 登录后进入首页，按名称、类型、货币类型、排序方式筛选商品。
3. 点击商品进入详情，或直接在首页进行购买相关操作。
4. 在购物车中调整数量、勾选商品并结算。
5. 在订单页查看订单状态、取消未完成订单、查看订单明细。
6. 在账号中心查看个人资料、成长档案，并在档案页维护部分个人信息。

### 超市管理员使用流程

1. 使用管理员账号登录系统。
2. 进入商品管理页维护商品：新增、编辑、删除、补货、上传图片。
3. 进入订单管理页按状态筛选订单、排序订单、批量核销或单个核销。
4. 进入进货记录页查看库存补货流水与详情。

### 老师使用流程

1. 使用老师账号登录系统。
2. 进入学生档案页，按学号、姓名、年级、专业、学历进行检索。
3. 勾选多名学生后导出选中信息。
4. 打开学生详情后可查看处分、奖励、社会经历，并导出个人信息。

## 新同学 10 分钟上手清单

### 第 1 步：安装并启动

```bash
npm install
npm run dev
```

### 第 2 步：确认接口地址

- 检查是否已配置 `VITE_API_BASE_URL`
- 如果页面能打开但数据为空，优先确认后端服务、代理和环境变量是否正确

### 第 3 步：用测试账号走一遍主流程

建议至少验证 3 个角色：

- 资助对象：登录 -> `/home` -> `/cart` -> `/orderList` -> `/framework/profile`
- 超市管理员：登录 -> `/manage` -> `/order` -> `/record`
- 老师：登录 -> `/framework/studentFiles`

### 第 4 步：理解代码主入口

建议先按这个顺序阅读：

1. `src/main.ts`：应用挂载、Pinia、Router、Element Plus 注册
2. `src/router/index.ts`：路由、角色权限、登录后跳转逻辑
3. `src/stores/user-store.ts`：登录态、角色、个人信息、导航数据
4. `src/views/`：按业务查看首页、购物车、订单、管理端页面
5. `src/api/`：对应页面的数据来源与接口结构

### 第 5 步：开始改代码前先记住两个约定

- 读 store 数据统一使用 `storeToRefs(store)`
- 调用 store 方法直接使用 `store.method()` 或从 store 实例解构 action

### 第 6 步：提交前做最低验证

```bash
npm run type-check
npm run build
```

### 第 7 步：遇到问题优先排查这几项

- 是否拿到了正确的 token 和角色
- 路由 `meta.role` 是否配置正确
- 接口返回字段是否与 store/页面使用一致
- 是否把 store 的状态直接解构，导致响应式丢失

## 开发手册

### 状态管理约定

项目使用 Pinia setup store 模式，store 位于 `src/stores/`。

当前统一约定如下：

- 组件中读取 store 的状态、计算属性、配置型数据时，统一使用 `storeToRefs(store)`。
- 组件中调用 store 的行为方法时，直接从 `store` 实例解构或通过 `store.xxx()` 调用。

推荐写法：

```ts
const userStore = useUserStore()
const { userProfile, roleGroup, campusName } = storeToRefs(userStore)
const { getProfile, logout } = userStore
```

不推荐直接解构状态：

```ts
const { userProfile } = userStore
```

原因：setup store 直接解构状态容易丢失响应式，后续维护也更容易出现“有的要 `storeToRefs`，有的不用”的混用问题。

### 接口组织方式

- `src/api/*.api.ts`：按业务域划分接口，如用户、订单、购物车、商品、学生档案。
- `src/api/request.ts`：Axios 实例与通用请求拦截。
- `src/config/request.config.ts`：请求基地址、超时、鉴权字段配置。
- `src/utils/auth.ts`：token、角色、clientId 的存取与登录态校验。

### 鉴权与登录态说明

项目在本地存储以下关键字段：

- `auth_token`
- `client_id`
- `role`
- `roleGroup`

其中：

- `Authorization` 请求头由 `auth_token` 注入。
- `clientid` 请求头由本地 `client_id` 注入。
- 路由守卫优先依据 `roleGroup`，其次依据 `role` 判断访问权限。

### 页面开发建议

新增页面或重构页面时，建议遵循以下原则：

- 页面容器统一放在 `src/views/` 下的对应业务目录。
- 通用组件沉淀到 `src/components/`，避免在页面目录内重复实现。
- 业务页面尽量只负责“组合状态 + 绑定交互”，数据获取和状态变化优先放进 store。
- 与后端字段映射、枚举格式化优先集中在 `src/constants/` 和 `src/utils/`。
- 新增角色控制页面时，务必同步更新 `src/router/index.ts` 的 `meta.role`。

### 新增一个业务模块时建议步骤

1. 在 `src/api/` 新增对应业务接口文件。
2. 在 `src/types/` 或接口文件中补齐类型定义。
3. 在 `src/stores/` 新增对应 store，封装状态和行为。
4. 在 `src/views/` 新增页面，并通过 `storeToRefs + action` 的方式接入。
5. 在 `src/router/index.ts` 中补充路由与角色权限。
6. 执行 `npm run type-check` 和 `npm run build` 验证。

## 维护手册

### 日常维护建议

- 合并代码前至少执行一次：

```bash
npm run type-check
npm run build
```

- 若改动了接口、角色、登录逻辑，需手动验证以下流程：
  - 登录
  - 退出登录
  - 路由跳转
  - 角色页面访问权限
  - Token 失效后的跳转行为

- 若改动了商品、订单、购物车、学生档案等核心流程，建议按真实角色至少走一遍主路径。

### 常见维护点

#### 1. 修改接口地址

修改环境变量 `VITE_API_BASE_URL`，或调整代理配置。

#### 2. 清理异常登录态

如果出现登录后页面权限异常、角色不匹配、旧 token 干扰等问题，可清空浏览器本地存储后重新登录。

项目使用的本地缓存主要包括：

- `auth_token`
- `client_id`
- `role`
- `roleGroup`
- `savedUsername`
- `savedPassword`

#### 3. 新增角色

如果后端新增角色：

- 更新 `src/router/index.ts` 的角色访问控制
- 更新登录后默认跳转逻辑 `resolveHomePathByRole`
- 检查导航栏与框架页菜单是否需要展示对应入口

#### 4. 调整商品、订单或档案字段

如果后端调整返回字段：

- 优先修改对应 `api` 类型定义
- 再同步 `store` 中的状态映射逻辑
- 最后更新页面展示组件

避免直接在模板里硬编码兜底字段，防止后续同类页面出现不一致。

#### 4.1 订单批量核销接口升级说明

订单批量核销接口已从“路径拼接多个订单 ID”升级为“请求体提交订单 ID 列表”。

旧版调用方式：

```ts
post(`/market/order/check/${orderIds.join(',')}`)
```

新版调用方式：

```ts
post('/market/order/check', { orderIds })
```

请求体结构示例：

```json
{
  "orderIds": [1, 2, 3, 4, 5]
}
```

联调或后续维护时请注意：

- 不要再通过 URL 拼接订单 ID
- 前端批量核销、单个核销已统一复用该接口
- 如果后端对 `orderIds` 的元素类型有强约束（如必须为数字），需再同步校验前端传参类型

#### 5. 图片上传问题排查

商品管理中的图片上传依赖后端上传接口与 OSS 资源查询接口：

- 先检查上传接口是否成功返回 `ossId`
- 再检查资源查询接口是否成功返回 `url`
- 最后检查页面是否正确写入 `formModel.imageUrl` 与 `formModel.imageUrlUrl`

### 建议的提交流程

```bash
git checkout -b feat/xxx
npm install
npm run type-check
npm run build
```

提交前建议检查：

- 是否有未使用文件或无效 import
- 是否破坏角色权限逻辑
- 是否引入了 store 数据读取方式混用
- 是否补充了必要文档说明

## 测试账号密码

超市管理员：

- 净月：`jyadmin` / `123456`
- 本部：`bbadmin` / `123456`

资助对象：

- 净月：`zgs` / `1234567890`
- 本部：`cplee` / `123456`

老师：

- `testTeacher` / `123456`

## 联调与接口文档

- Apifox：`https://s.apifox.cn/4b447af6-9818-4835-b112-c4b500317932/api-226200045`

## 当前已完成的基础整理

- `src` 内文件/目录命名统一为小写 `kebab-case`
- `views` 页面按业务重新分组
- 清理了初始化模板残留和冗余目录
- 修复了 import 路径与构建链路
- 统一了部分 store 的响应式使用模式
