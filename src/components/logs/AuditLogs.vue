<!-- src/components/logs/AuditLogs.vue -->
<template>
  <div class="logs-panel surface-card">
    <div class="panel-header">
      <div>
        <h3>审计日志</h3>
        <p>关键操作与权限轨迹追踪</p>
      </div>
      <div class="panel-actions">
        <input v-model="keyword" type="search" placeholder="搜索用户或操作" />
        <select v-model="actionFilter">
          <option value="all">全部动作</option>
          <option value="login">登录</option>
          <option value="logout">登出</option>
          <option value="create">创建</option>
          <option value="update">更新</option>
          <option value="delete">删除</option>
        </select>
      </div>
    </div>

    <div class="timeline">
      <div v-for="log in filteredLogs" :key="log.id" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-user">{{ log.username }}</span>
            <span class="timeline-action">{{ actionLabel(log.action) }}</span>
            <span class="timeline-time">{{ log.timestamp }}</span>
          </div>
          <div class="timeline-message">{{ log.message }}</div>
          <div class="timeline-details">{{ formatDetails(log.details) }}</div>
        </div>
      </div>
      <div v-if="!filteredLogs.length" class="empty-hint">暂无审计记录</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'

const store = useMonitorStore()
const keyword = ref('')
const actionFilter = ref('all')

const filteredLogs = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return store.auditLogs
    .filter(log => actionFilter.value === 'all' || log.action === actionFilter.value)
    .filter(log => {
      if (!query) return true
      return log.username.toLowerCase().includes(query) || log.message.toLowerCase().includes(query)
    })
    .slice()
    .reverse()
})

const actionLabel = (action) => {
  const map = {
    login: '登录',
    logout: '登出',
    create: '创建',
    update: '更新',
    delete: '删除'
  }
  return map[action] || action
}

const formatDetails = (details = {}) => {
  const entries = Object.entries(details)
  if (!entries.length) return '无附加细节'
  return entries.map(([key, value]) => `${key}: ${value}`).join(' · ')
}
</script>

<style scoped>
.logs-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
}

.panel-header p {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-2);
}

.panel-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.panel-actions input,
.panel-actions select {
  min-width: 180px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 1rem;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(34, 211, 238, 0.6);
  margin-top: 6px;
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.5);
}

.timeline-content {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(148, 163, 184, 0.08);
}

.timeline-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.timeline-user {
  color: var(--text-0);
  font-weight: 600;
}

.timeline-action {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.15);
  color: var(--text-1);
  font-size: 0.75rem;
}

.timeline-time {
  margin-left: auto;
  color: var(--text-3);
  font-size: 0.75rem;
}

.timeline-message {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  color: var(--text-0);
}

.timeline-details {
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-3);
}

.empty-hint {
  text-align: center;
  color: var(--text-3);
  padding: 1.5rem 0;
}

@media (max-width: 900px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .panel-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
