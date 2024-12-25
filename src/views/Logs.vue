// src/views/Logs.vue
<template>
  <div class="logs">
    <h1>系统日志</h1>
    <div class="logs-nav">
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
  padding: 20px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.logs-nav {
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-active {
  color: var(--primary-color);
  font-weight: bold;
  background-color: rgba(var(--primary-color-rgb), 0.1);
}
</style>