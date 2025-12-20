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
    <div class="logs-nav surface-glass">
      <router-link to="/dashboard/logs/system" class="nav-link">系统日志</router-link>
      <router-link to="/dashboard/logs/security" class="nav-link">安全日志</router-link>
      <router-link to="/dashboard/logs/audit" class="nav-link">审计日志</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Logs'
}
</script>

<style scoped>
.logs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
