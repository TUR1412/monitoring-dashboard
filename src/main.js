// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useThemeStore } from './stores/theme';
import { useTabsStore } from './stores/tabs';
import { useAuthStore } from './stores/auth';
import './style.css';

// 创建 Pinia 实例
const pinia = createPinia();

// 创建 Vue 应用实例
const app = createApp(App);

// 使用插件
app.use(pinia);
app.use(router);

// 初始化 Pinia stores（演示工程：主题/标签/登录态）
useThemeStore().initializeTheme();
useTabsStore().initializeTabs();
useAuthStore().hydrate();

// 挂载应用
app.mount('#app');
