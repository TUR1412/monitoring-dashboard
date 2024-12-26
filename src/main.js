// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useMonitorStore } from './stores/monitorStore';
import '@fortawesome/fontawesome-free/css/all.css';
import './style.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 创建 Pinia 实例
const pinia = createPinia();

// 创建 Vue 应用实例
const app = createApp(App);

// 使用插件
app.use(ElementPlus);
app.use(pinia);
app.use(router);

// 初始化 Pinia store
const store = useMonitorStore();
store.initializeTheme(); // 初始化主题
store.initializeTabs();  // 恢复标签状态

// 挂载应用
app.mount('#app');
