<!-- src/components/logs/SystemLogs.vue -->
<template>
  <div class="logs-panel surface-card">
    <div class="panel-header">
      <div>
        <h3>系统日志</h3>
        <p>关键事件与运行状态变更</p>
      </div>
      <div class="panel-actions">
        <input v-model="keyword" type="search" placeholder="搜索日志内容" />
        <select v-model="levelFilter">
          <option value="all">全部级别</option>
          <option value="info">信息</option>
          <option value="warning">警告</option>
          <option value="error">错误</option>
        </select>
        <button class="btn btn-ghost" @click="exportLogs">
          <i class="fas fa-download"></i>
          导出
        </button>
      </div>
    </div>

    <div class="log-list">
      <div v-for="log in filteredLogs" :key="log.id" class="log-item">
        <span :class="['log-level', log.level]">{{ log.level }}</span>
        <div class="log-content">
          <div class="log-message">{{ log.message }}</div>
          <div class="log-time">{{ log.timestamp }}</div>
        </div>
      </div>
      <div v-if="!filteredLogs.length" class="empty-hint">暂无匹配日志</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { saveAs } from 'file-saver'

const store = useMonitorStore()
const keyword = ref('')
const levelFilter = ref('all')

const filteredLogs = computed(() => {
  return store.logs
    .filter(log => levelFilter.value === 'all' || log.level === levelFilter.value)
    .filter(log => log.message.includes(keyword.value))
    .slice()
    .reverse()
})

const exportLogs = () => {
  const blob = new Blob([JSON.stringify(filteredLogs.value, null, 2)], { type: 'application/json' })
  saveAs(blob, `system-logs-${Date.now()}.json`)
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

.panel-header h3 {
  margin: 0;
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

.log-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(148, 163, 184, 0.08);
}

.log-level {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.log-level.info {
  background: rgba(56, 189, 248, 0.12);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.4);
}

.log-level.warning {
  background: rgba(245, 158, 11, 0.12);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.4);
}

.log-level.error {
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.4);
}

.log-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.log-message {
  color: var(--text-0);
  font-size: 0.95rem;
}

.log-time {
  color: var(--text-3);
  font-size: 0.75rem;
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
