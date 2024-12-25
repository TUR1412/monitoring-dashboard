import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMonitorStore } from './stores/monitorStore'
import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 1. 首先创建 app 实例
const app = createApp(App)

// 2. 创建 pinia 实例
const pinia = createPinia()

// 3. 使用插件
app.use(ElementPlus)  // 移动到 app 创建之后
app.use(pinia)
app.use(router)

// 4. 初始化 store
const store = useMonitorStore(pinia)
store.initializeTheme()

// 5. 最后挂载应用
app.mount('#app')