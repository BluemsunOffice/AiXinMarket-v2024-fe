# AiXinMarket-v2024-fe

爱心超市前端项目（Vue 3 + Vite + Pinia + Element Plus）。

本次已完成一轮代码审查与结构优化，重点包括：

- `src` 内文件/目录命名统一为小写 kebab-case。
- `views` 页面分组重构，首页模块从 `views/index` 调整为 `views/home`。
- 清理未使用模板文件与冗余目录（如 Vue 初始化示例组件等）。
- 路由与全量 import 路径同步修复。
- 构建链路修复（补充 `run-p` 对应依赖，`npm run build` 可直接执行）。

## 技术栈

- Vue 3 (`<script setup lang=ts>`)
- Vite 6
- Pinia
- Vue Router
- Element Plus
- Axios

## 目录结构（核心）

```text
src/
	api/
	assets/
	components/
	config/
	constants/
	core/
	mixins/
	plugins/
	router/
	stores/
	types/
	utils/
	views/
		framework/
		home/
		login/
		manage/
		order/
		order-list/
		profile/
		record/
		shop-cart/
		student/
	app.vue
	main.ts
```

## 本地开发

```bash
npm install
npm run dev
```

## 类型检查与构建

```bash
npm run type-check
npm run build
```

## 测试账号密码

超市管理员：

- 净月：`jyadmin` / `123456`
- 本部：`bbadmin` / `123456`

资助对象：

- 净月：`zgs` / `1234567890`
- 本部：`cplee` / `123456`

老师：

- `testTeacher` / `123456`

## 接口文档

- https://s.apifox.cn/4b447af6-9818-4835-b112-c4b500317932/api-226200045
