import "@/assets/main.css";
import { createApp } from "vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import zhCn from "element-plus/es/locale/lang/zh-cn";
import { createPinia } from "pinia";
import router from "./router/index";
import App from "./App.vue";
import clearLocalStorageMixin from "./mixins/clearLocalStorage";
import "amfe-flexible";
import "./assets/iconfont/iconfont.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

const app = createApp(App);
const pinia = createPinia();

app
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(ElementPlus, { locale: zhCn })
  .use(router)
  .use(pinia)
  .mixin(clearLocalStorageMixin)
  .mount("#app");
