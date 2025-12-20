<!-- src/views/SystemAlerts.vue -->
<template>
  <div class="system-alerts fade-in">
    <div class="section-header">
      <div>
        <div class="section-title">系统警报</div>
        <div class="section-subtitle">风险事件、异常趋势与紧急通知</div>
      </div>
      <span class="pill">{{ store.alerts.length }} 条记录</span>
    </div>
    
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
    <div v-if="$route.matched.length === 1" class="alerts-list surface-card">
      <div v-for="alert in store.alerts" :key="alert.id" :class="['alert', alert.level]">
        <div class="alert-head">
          <span class="alert-level">{{ alert.level ? alert.level.toUpperCase() : 'UNKNOWN' }}</span>
          <span class="timestamp">{{ formatTimestamp(alert.timestamp) }}</span>
        </div>
        <div class="alert-body">{{ alert.message }}</div>
        <div class="alert-meta">{{ alert.source }}</div>
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
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
}

.alert {
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(148, 163, 184, 0.08);
}

.alert-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.alert-level {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.alert-body {
  font-size: 0.95rem;
  color: var(--text-0);
}

.alert-meta {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-3);
}

.alert.warning {
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.12);
  color: #fde68a;
}

.alert.error,
.alert.critical {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
}

.alert.info {
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.12);
  color: #bae6fd;
}

.timestamp {
  font-size: 0.75rem;
  color: var(--text-3);
}

/* 可选的导航样式 */
.alert-nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  padding: 5px 10px;
  text-decoration: none;
  color: var(--text-2);
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: rgba(148, 163, 184, 0.12);
}

.active-link {
  color: var(--accent-0);
  border-bottom: 2px solid var(--accent-0);
}
</style>
