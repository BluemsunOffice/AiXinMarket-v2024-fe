import '@/assets/main.css';
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'
import router from './router/index';
import App from './App.vue';
import clearLocalStorageMixin from './mixins/clearLocalStorage';
import 'amfe-flexible'
import './assets/iconfont/iconfont.css'

const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus, { locale: zhCn })
  .use(router)
  .use(pinia)
  .mixin(clearLocalStorageMixin)
  .mount('#app');
