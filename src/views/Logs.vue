// src/views/Logs.vue
<template>
  <div class="logs">
    <div class="section-header">
      <div>
        <div class="section-title">日志中心</div>
        <div class="section-subtitle">统一查看运行、审计与安全事件</div>
      </div>
      <span class="pill">数据实时同步</span>
    </div>
    <div class="log-overview-grid">
      <div class="log-summary-card">
        <span class="log-summary-label">系统日志</span>
        <strong class="log-summary-value">{{ systemCount }}</strong>
        <span class="log-summary-meta">最新更新：{{ systemLatest }}</span>
      </div>
      <div class="log-summary-card is-alert">
        <span class="log-summary-label">安全日志</span>
        <strong class="log-summary-value">{{ securityCount }}</strong>
        <span class="log-summary-meta">最新更新：{{ securityLatest }}</span>
      </div>
      <div class="log-summary-card is-warning">
        <span class="log-summary-label">审计日志</span>
        <strong class="log-summary-value">{{ auditCount }}</strong>
        <span class="log-summary-meta">最新更新：{{ auditLatest }}</span>
      </div>
    </div>
    <div class="logs-nav surface-glass">
      <router-link to="/dashboard/logs/system" class="nav-link">系统日志</router-link>
      <router-link to="/dashboard/logs/security" class="nav-link">安全日志</router-link>
      <router-link to="/dashboard/logs/audit" class="nav-link">审计日志</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { formatDateTime, getLatestDate } from '@/utils/logs'

const store = useMonitorStore()

const systemCount = computed(() => store.logs?.length ?? 0)
const securityCount = computed(() => store.securityLogs?.length ?? 0)
const auditCount = computed(() => store.auditLogs?.length ?? 0)

const systemLatest = computed(() => {
  const latest = getLatestDate(store.logs ?? [])
  return latest ? formatDateTime(latest) : '暂无数据'
})

const securityLatest = computed(() => {
  const latest = getLatestDate(store.securityLogs ?? [])
  return latest ? formatDateTime(latest) : '暂无数据'
})

const auditLatest = computed(() => {
  const latest = getLatestDate(store.auditLogs ?? [])
  return latest ? formatDateTime(latest) : '暂无数据'
})
</script>

<style scoped>
.logs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.log-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.log-summary-meta {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-3);
}

.logs-nav {
  padding: 0.75rem 1rem;
  display: flex;
  gap: 1rem;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.nav-link {
  text-decoration: none;
  color: var(--text-2);
  padding: 6px 12px;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(34, 211, 238, 0.12);
  color: var(--text-0);
}

.nav-link.router-link-active {
  color: var(--text-0);
  font-weight: bold;
  background-color: rgba(34, 211, 238, 0.18);
}
</style>
