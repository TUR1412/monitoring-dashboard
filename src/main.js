// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useMonitorStore } from './stores/monitorStore' // 引入 Pinia store
import '@fortawesome/fontawesome-free/css/all.css' // 引入 Font Awesome 样式
import './style.css' // 引入全局样式

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const store = useMonitorStore()
store.initializeTheme() // 初始化主题，确保在挂载前应用主题类

// 设置全局路由守卫
router.beforeEach((to, from, next) => {
  // 不需要在每次守卫中重新调用 useMonitorStore
  // 因为 store 已在上方初始化
  // const store = useMonitorStore()

  // 如果用户已登录但访问登录页，则重定向到仪表盘
  if (to.name === 'Login' && store.user) {
    next({ name: 'Dashboard' })
    return
  }

  // 如果路由需要认证且用户未登录，则重定向到登录页
  if (to.meta.requiresAuth && !store.user) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

app.mount('#app')
