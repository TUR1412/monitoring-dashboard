<!-- src/components/logs/AuditLogs.vue -->
<template>
  <div class="logs-panel surface-card">
    <div class="panel-header">
      <div>
        <h3>审计日志</h3>
        <p>关键操作与权限轨迹追踪</p>
      </div>
      <div class="panel-actions">
        <BaseInput
          v-model="keyword"
          type="search"
          placeholder="搜索用户或操作"
          aria-label="搜索用户或操作"
        />
        <select v-model="actionFilter" aria-label="审计动作">
          <option value="all">全部动作</option>
          <option value="login">登录</option>
          <option value="logout">登出</option>
          <option value="create">创建</option>
          <option value="update">更新</option>
          <option value="delete">删除</option>
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
        <span class="log-summary-label">审计记录</span>
        <strong class="log-summary-value">{{ summary.total }}</strong>
      </div>
      <div class="log-summary-card is-info">
        <span class="log-summary-label">登录</span>
        <strong class="log-summary-value">{{ summary.login }}</strong>
      </div>
      <div class="log-summary-card is-muted">
        <span class="log-summary-label">登出</span>
        <strong class="log-summary-value">{{ summary.logout }}</strong>
      </div>
      <div class="log-summary-card is-warning">
        <span class="log-summary-label">创建</span>
        <strong class="log-summary-value">{{ summary.create }}</strong>
      </div>
      <div class="log-summary-card is-alert">
        <span class="log-summary-label">更新</span>
        <strong class="log-summary-value">{{ summary.update }}</strong>
      </div>
      <div class="log-summary-card is-danger">
        <span class="log-summary-label">删除</span>
        <strong class="log-summary-value">{{ summary.delete }}</strong>
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

    <div class="timeline">
      <div v-for="log in filteredLogs" :key="log.id" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-user">{{ log.username }}</span>
            <span class="timeline-action">{{ actionLabel(log.action) }}</span>
            <span class="timeline-time">{{ formatDateTime(log.timestamp) }}</span>
          </div>
          <div class="timeline-message">{{ log.message }}</div>
          <div class="timeline-details">{{ formatDetails(log.details) }}</div>
        </div>
      </div>
      <div v-if="!filteredLogs.length" class="empty-state">
        <div>暂无审计记录</div>
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
const actionFilter = ref('all')
const rangeFilter = ref('all')
const limitFilter = ref('50')
const sortOrder = ref('desc')

const summary = computed(() => {
  const data = store.auditLogs ?? []
  return {
    total: data.length,
    login: data.filter(item => item.action === 'login').length,
    logout: data.filter(item => item.action === 'logout').length,
    create: data.filter(item => item.action === 'create').length,
    update: data.filter(item => item.action === 'update').length,
    delete: data.filter(item => item.action === 'delete').length
  }
})

const latestLabel = computed(() => {
  const latest = getLatestDate(store.auditLogs ?? [])
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
  actionFilter.value !== 'all' ||
  rangeFilter.value !== 'all' ||
  limitFilter.value !== '50' ||
  sortOrder.value !== 'desc'
)

const filteredLogs = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  let data = (store.auditLogs ?? [])
    .filter(log => actionFilter.value === 'all' || log.action === actionFilter.value)
    .filter(log => {
      if (!query) return true
      const username = log.username?.toLowerCase?.() || ''
      const message = log.message?.toLowerCase?.() || ''
      return username.includes(query) || message.includes(query)
    })

  data = filterByRange(data, rangeFilter.value, (log) => log.timestamp)

  const ordered = sortByTimestamp(data, sortOrder.value, (log) => log.timestamp)
  const limit = limitFilter.value === 'all' ? Number.POSITIVE_INFINITY : Number(limitFilter.value) || 50
  return Number.isFinite(limit) ? ordered.slice(0, limit) : ordered
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

const csvColumns = [
  { key: 'timestamp', label: '时间' },
  { key: 'username', label: '用户' },
  { key: 'action', label: '动作', format: (value) => actionLabel(value) },
  { key: 'message', label: '描述' },
  { key: 'details', label: '细节', format: (value) => formatDetails(value) }
]

const exportJsonLogs = () => exportJson(filteredLogs.value, 'audit-logs')
const exportCsvLogs = () => exportCsv(filteredLogs.value, csvColumns, 'audit-logs')

const resetFilters = () => {
  keyword.value = ''
  actionFilter.value = 'all'
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

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

.log-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: var(--text-3);
  font-size: 0.75rem;
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
