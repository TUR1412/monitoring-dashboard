<!-- src/components/logs/SystemLogs.vue -->
<template>
  <div class="logs-panel surface-card">
    <div class="panel-header">
      <div>
        <h3>系统日志</h3>
        <p>关键事件与运行状态变更</p>
      </div>
      <div class="panel-actions">
        <BaseInput
          v-model="keyword"
          type="search"
          placeholder="搜索日志内容"
          aria-label="搜索日志内容"
        />
        <select v-model="levelFilter" aria-label="日志级别">
          <option value="all">全部级别</option>
          <option value="info">信息</option>
          <option value="warning">警告</option>
          <option value="error">错误</option>
        </select>
        <select v-model="rangeFilter" aria-label="时间范围">
          <option value="all">全部时间</option>
          <option value="24h">最近24小时</option>
          <option value="7d">最近7天</option>
          <option value="30d">最近30天</option>
        </select>
        <select v-model="limitFilter" aria-label="展示数量">
          <option value="20">最近20条</option>
          <option value="50">最近50条</option>
          <option value="100">最近100条</option>
          <option value="200">最近200条</option>
          <option value="all">全部</option>
        </select>
        <select v-model="sortOrder" aria-label="排序方式">
          <option value="desc">最新优先</option>
          <option value="asc">最早优先</option>
        </select>
        <BaseButton type="ghost" size="small" @click="exportCsvLogs">
          <i class="fas fa-file-csv"></i>
          CSV
        </BaseButton>
        <BaseButton type="ghost" size="small" @click="exportJsonLogs">
          <i class="fas fa-download"></i>
          JSON
        </BaseButton>
        <BaseButton v-if="hasActiveFilters" type="ghost" size="small" @click="resetFilters">
          <i class="fas fa-undo"></i>
          重置
        </BaseButton>
      </div>
    </div>

    <div class="log-summary-grid">
      <div class="log-summary-card">
        <span class="log-summary-label">日志总量</span>
        <strong class="log-summary-value">{{ summary.total }}</strong>
      </div>
      <div class="log-summary-card is-info">
        <span class="log-summary-label">信息</span>
        <strong class="log-summary-value">{{ summary.info }}</strong>
      </div>
      <div class="log-summary-card is-warning">
        <span class="log-summary-label">警告</span>
        <strong class="log-summary-value">{{ summary.warning }}</strong>
      </div>
      <div class="log-summary-card is-danger">
        <span class="log-summary-label">错误</span>
        <strong class="log-summary-value">{{ summary.error }}</strong>
      </div>
      <div class="log-summary-card is-muted">
        <span class="log-summary-label">最新更新</span>
        <strong class="log-summary-value">{{ latestLabel }}</strong>
      </div>
    </div>

    <div class="log-meta">
      <span>筛选结果 {{ filteredLogs.length }} 条</span>
      <span>时间范围：{{ rangeLabel }}</span>
      <span>排序：{{ sortOrderLabel }}</span>
    </div>

    <div class="log-list">
      <div v-for="log in filteredLogs" :key="log.id" class="log-item">
        <span :class="['log-level', log.level]">{{ log.level }}</span>
        <div class="log-content">
          <div class="log-message">{{ log.message }}</div>
          <div class="log-time">{{ formatDateTime(log.timestamp) }}</div>
        </div>
      </div>
      <div v-if="!filteredLogs.length" class="empty-state">
        <div>暂无匹配日志</div>
        <BaseButton type="ghost" size="small" @click="resetFilters">清除筛选</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { exportCsv, exportJson, filterByRange, formatDateTime, getLatestDate, sortByTimestamp } from '@/utils/logs'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const store = useMonitorStore()
const keyword = ref('')
const levelFilter = ref('all')
const rangeFilter = ref('all')
const limitFilter = ref('50')
const sortOrder = ref('desc')

const csvColumns = [
  { key: 'timestamp', label: '时间' },
  { key: 'level', label: '级别' },
  { key: 'message', label: '内容' }
]

const summary = computed(() => {
  const data = store.logs ?? []
  return {
    total: data.length,
    info: data.filter(item => item.level === 'info').length,
    warning: data.filter(item => item.level === 'warning').length,
    error: data.filter(item => item.level === 'error').length
  }
})

const latestLabel = computed(() => {
  const latest = getLatestDate(store.logs ?? [])
  return latest ? formatDateTime(latest) : '暂无数据'
})

const rangeLabel = computed(() => {
  const map = {
    all: '全部',
    '24h': '最近24小时',
    '7d': '最近7天',
    '30d': '最近30天'
  }
  return map[rangeFilter.value] || '全部'
})

const sortOrderLabel = computed(() => (sortOrder.value === 'asc' ? '最早优先' : '最新优先'))

const hasActiveFilters = computed(() =>
  keyword.value.trim() ||
  levelFilter.value !== 'all' ||
  rangeFilter.value !== 'all' ||
  limitFilter.value !== '50' ||
  sortOrder.value !== 'desc'
)

const filteredLogs = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  let data = (store.logs ?? [])
    .filter(log => levelFilter.value === 'all' || log.level === levelFilter.value)
    .filter(log => {
      if (!query) return true
      const message = log.message?.toLowerCase?.() || ''
      const time = log.timestamp?.toLowerCase?.() || ''
      return message.includes(query) || time.includes(query)
    })

  data = filterByRange(data, rangeFilter.value, (log) => log.timestamp)

  const ordered = sortByTimestamp(data, sortOrder.value, (log) => log.timestamp)
  const limit = limitFilter.value === 'all' ? Number.POSITIVE_INFINITY : Number(limitFilter.value) || 50
  return Number.isFinite(limit) ? ordered.slice(0, limit) : ordered
})

const exportJsonLogs = () => exportJson(filteredLogs.value, 'system-logs')
const exportCsvLogs = () => exportCsv(filteredLogs.value, csvColumns, 'system-logs')

const resetFilters = () => {
  keyword.value = ''
  levelFilter.value = 'all'
  rangeFilter.value = 'all'
  limitFilter.value = '50'
  sortOrder.value = 'desc'
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
  flex-wrap: wrap;
}

.panel-actions input,
.panel-actions select,
.panel-actions .base-input-wrapper {
  min-width: 180px;
}

.log-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.log-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: var(--text-3);
  font-size: 0.75rem;
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

.empty-state {
  text-align: center;
  color: var(--text-3);
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
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
