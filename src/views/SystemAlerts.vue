<!-- src/views/SystemAlerts.vue -->
<template>
  <div class="system-alerts">
    <h1 class="page-title">系统警报</h1>
    
    <!-- 子路由导航（可选，如果需要在这里添加导航） -->
    <!--
    <nav class="alert-nav mb-6">
      <router-link to="/dashboard/system-alerts/active" class="nav-link" :class="{ 'active-link': isActive('active') }">
        活动警报
      </router-link>
      <router-link to="/dashboard/system-alerts/history" class="nav-link" :class="{ 'active-link': isActive('history') }">
        警报历史
      </router-link>
      <router-link to="/dashboard/system-alerts/settings" class="nav-link" :class="{ 'active-link': isActive('settings') }">
        警报设置
      </router-link>
    </nav>
    -->

    <!-- 始终渲染子路由组件 -->
    <router-view />

    <!-- 如果没有子路由激活，显示默认的警报列表 -->
    <div v-if="$route.matched.length === 1" class="card alerts-list">
      <div v-for="alert in store.alerts" :key="alert.id" :class="['alert-row', alert.level]">
        <div class="alert-dot" :class="alert.level"></div>
        <div class="alert-content">
          <div class="alert-title">{{ alert.title || '系统警报' }}</div>
          <div class="alert-message">{{ alert.message }}</div>
        </div>
        <span class="timestamp">{{ formatTimestamp(alert.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useMonitorStore } from '@/stores/monitorStore'
import { onMounted } from 'vue'

export default {
  name: 'SystemAlerts',
  setup() {
    const store = useMonitorStore()

    onMounted(() => {
      store.fetchAlerts()
    })

    const formatTimestamp = (timestamp) => {
      let date
      if (typeof timestamp === 'number') {
        date = new Date(timestamp)
      } else {
        date = new Date(timestamp)
      }
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      store,
      formatTimestamp
    }
  }
}
</script>

<style scoped>
.system-alerts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts-list {
  display: grid;
  gap: 0.85rem;
}

.alert-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(12, 17, 24, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--neon-blue);
}

.alert-dot.warning {
  background: var(--neon-yellow);
}

.alert-dot.error,
.alert-dot.critical {
  background: var(--neon-red);
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.alert-title {
  font-size: 0.95rem;
  color: var(--text-strong);
  font-weight: 600;
}

.alert-message {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.timestamp {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 可选的导航样式 */
.alert-nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  padding: 5px 10px;
  text-decoration: none;
  color: #666;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.active-link {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}
</style>
