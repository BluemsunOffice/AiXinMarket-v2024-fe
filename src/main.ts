import './assets/main.css';
import { createApp, onMounted } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia' 
import router from './router/index';
import App from './App.vue';
import '../icon/iconfont/iconfont.css';
import clearLocalStorageMixin from './mixins/clearLocalStorage';
import 'amfe-flexible'
import './assets/iconfont/iconfont.css'
// main.ts

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App); 
const pinia=createPinia();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, {locale: zhCn});
// 路由
app.use(router);
app.use(pinia) 
app.mixin(clearLocalStorageMixin);
app.mount('#app');
