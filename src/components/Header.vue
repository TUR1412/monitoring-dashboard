<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <h1>监控仪表盘</h1>
    <div class="header-actions">
      <button @click="toggleTheme">
        <i :class="themeIcon"></i> 切换主题
      </button>
      <button @click="logout">退出</button>
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
}

.header-actions button {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 1em;
  margin-left: 10px;
  display: flex;
  align-items: center;
}

.header-actions button:hover {
  color: var(--neon-blue);
}

.header i {
  margin-right: 5px;
}
</style>
