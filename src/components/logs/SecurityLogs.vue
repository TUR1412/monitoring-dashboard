<!-- src/components/logs/SecurityLogs.vue -->
<template>
  <div class="logs-panel surface-card">
    <div class="panel-header">
      <div>
        <h3>安全日志</h3>
        <p>高危事件与安全设备输出</p>
      </div>
      <div class="panel-actions">
        <input v-model="keyword" type="search" placeholder="搜索来源或描述" />
        <select v-model="levelFilter">
          <option value="all">全部级别</option>
          <option value="critical">严重</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
    </div>

    <div class="log-grid">
      <div v-for="log in filteredLogs" :key="log.id" class="log-card">
        <div class="log-card-top">
          <span :class="['log-level', log.level]">{{ log.level }}</span>
          <span class="log-time">{{ log.timestamp }}</span>
        </div>
        <div class="log-title">{{ log.source }}</div>
        <div class="log-message">{{ log.message }}</div>
      </div>
      <div v-if="!filteredLogs.length" class="empty-hint">暂无安全事件</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'

const store = useMonitorStore()
const keyword = ref('')
const levelFilter = ref('all')

const filteredLogs = computed(() => {
  return store.securityLogs
    .filter(log => levelFilter.value === 'all' || log.level === levelFilter.value)
    .filter(log => log.message.includes(keyword.value) || log.source.includes(keyword.value))
    .slice()
    .reverse()
})
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

.log-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.log-card {
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-level {
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.log-level.critical,
.log-level.high {
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.4);
}

.log-level.medium {
  background: rgba(245, 158, 11, 0.12);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.4);
}

.log-level.low {
  background: rgba(56, 189, 248, 0.12);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.4);
}

.log-title {
  font-size: 0.95rem;
  color: var(--text-0);
}

.log-message {
  font-size: 0.85rem;
  color: var(--text-2);
}

.log-time {
  font-size: 0.75rem;
  color: var(--text-3);
}

.empty-hint {
  grid-column: 1 / -1;
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
