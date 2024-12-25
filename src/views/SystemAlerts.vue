<!-- src/views/SystemAlerts.vue -->
<template>
  <div class="system-alerts">
    <h1 class="text-2xl font-bold mb-6">系统警报</h1>
    
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
    <div v-if="$route.matched.length === 1" class="alerts-list">
      <div v-for="alert in store.alerts" :key="alert.id" :class="['alert', alert.level]">
        <strong>{{ alert.level ? alert.level.toUpperCase() : 'UNKNOWN' }}:</strong> {{ alert.message }}
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
  padding: 20px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.alerts-list {
  margin-top: 20px;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
}

.alert.warning {
  background-color: #fff3cd;
  color: #856404;
}

.alert.error {
  background-color: #f8d7da;
  color: #721c24;
}

.alert.info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.alert.critical {
  background-color: #f8d7da;
  color: #721c24;
}

.timestamp {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.8em;
  color: #6c757d;
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
