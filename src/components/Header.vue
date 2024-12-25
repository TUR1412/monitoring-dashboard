<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <h1>监控仪表盘</h1>
    <div class="header-actions">
      <button class="button-neon" @click="toggleTheme">
        <i :class="themeIcon" class="button-icon"></i> 切换主题
      </button>
      <button class="button-neon" @click="logout">退出</button>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'

export default {
  name: 'Header',
  setup() {
    const store = useMonitorStore()
    const router = useRouter()

    const themeIcon = computed(() => (store.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'))

    const toggleTheme = () => {
      store.toggleTheme()
    }

    const logout = () => {
      store.logout()
      router.push({ name: 'Login' })
    }

    return {
      themeIcon,
      toggleTheme,
      logout
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--dark-purple);
  color: var(--text-color);
  padding: 10px 20px;
  border-bottom: 2px solid var(--neon-pink);
  box-shadow: 0 2px 8px rgba(255, 110, 199, 0.3), 0 0 20px rgba(31, 142, 241, 0.3);
  position: relative;
}

.header-actions button {
  /* 使用 button-neon 类，无需额外样式 */
}

.header i {
  margin-right: 5px;
}
</style>
