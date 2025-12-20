<!-- src/components/alerts/ActiveAlerts.vue -->
<template>
  <div class="active-alerts">
    <div class="section-header">
      <div>
        <div class="section-title">活动警报</div>
        <div class="section-subtitle">实时事件、预警趋势与即时处置</div>
      </div>
      <div class="header-actions">
        <BaseButton type="ghost" size="small" @click="refreshAlerts">
          <i class="fas fa-rotate-right"></i>
          刷新数据
        </BaseButton>
        <BaseButton type="primary" size="small" @click="acknowledgeAll">
          <i class="fas fa-check"></i>
          一键确认
        </BaseButton>
        <BaseButton type="ghost" size="small" @click="exportCsvAlerts">
          <i class="fas fa-file-csv"></i>
          CSV
        </BaseButton>
        <BaseButton type="ghost" size="small" @click="exportJsonAlerts">
          <i class="fas fa-download"></i>
          JSON
        </BaseButton>
      </div>
    </div>

    <div class="bento-grid alert-metrics">
      <div class="surface-card bento-card bento-span-3 metric-card">
        <div class="metric-label">当前警报</div>
        <div class="metric-value">{{ activeStats.total }}</div>
        <div class="metric-meta">未归档</div>
      </div>
      <div class="surface-card bento-card bento-span-3 metric-card">
        <div class="metric-label">严重告警</div>
        <div class="metric-value">{{ activeStats.critical }}</div>
        <div class="metric-meta">需立即处理</div>
      </div>
      <div class="surface-card bento-card bento-span-3 metric-card">
        <div class="metric-label">已确认</div>
        <div class="metric-value">{{ activeStats.acknowledged }}</div>
        <div class="metric-meta">确认率 {{ ackRate }}%</div>
      </div>
      <div class="surface-card bento-card bento-span-3 metric-card">
        <div class="metric-label">已静音</div>
        <div class="metric-value">{{ activeStats.muted }}</div>
        <div class="metric-meta">静音率 {{ muteRate }}%</div>
      </div>
    </div>

    <div class="surface-card severity-bar">
      <div class="severity-track">
        <span class="severity-segment critical" :style="{ width: `${severityStats.criticalPct}%` }"></span>
        <span class="severity-segment error" :style="{ width: `${severityStats.errorPct}%` }"></span>
        <span class="severity-segment warning" :style="{ width: `${severityStats.warningPct}%` }"></span>
        <span class="severity-segment info" :style="{ width: `${severityStats.infoPct}%` }"></span>
      </div>
      <div class="severity-legend">
        <span class="legend-item critical">严重 {{ severityStats.critical }}</span>
        <span class="legend-item error">错误 {{ severityStats.error }}</span>
        <span class="legend-item warning">警告 {{ severityStats.warning }}</span>
        <span class="legend-item info">信息 {{ severityStats.info }}</span>
        <span class="legend-item muted">最新更新 {{ lastUpdatedLabel }}</span>
      </div>
    </div>

    <div class="surface-card filter-panel">
      <div class="filter-grid">
        <div class="filter-group">
          <span class="filter-label">关键字</span>
          <BaseInput
            v-model="searchQuery"
            placeholder="搜索标题、来源或关键词"
          />
        </div>
        <div class="filter-group">
          <span class="filter-label">严重程度</span>
          <select v-model="levelFilter" aria-label="严重程度">
            <option value="all">全部</option>
            <option value="critical">严重</option>
            <option value="error">错误</option>
            <option value="warning">警告</option>
            <option value="info">信息</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">时间范围</span>
          <select v-model="timeFilter" aria-label="时间范围">
            <option value="all">全部时间</option>
            <option value="1h">最近1小时</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">状态筛选</span>
          <select v-model="statusFilter" aria-label="状态筛选">
            <option value="active">未归档</option>
            <option value="all">全部</option>
            <option value="archived">已归档</option>
            <option value="acknowledged">已确认</option>
            <option value="unacknowledged">未确认</option>
            <option value="muted">已静音</option>
            <option value="unmuted">未静音</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">排序方式</span>
          <select v-model="sortOrder" aria-label="排序方式">
            <option value="latest">最新优先</option>
            <option value="oldest">最早优先</option>
            <option value="severity">严重优先</option>
          </select>
        </div>
        <div class="filter-group">
          <span class="filter-label">展示数量</span>
          <select v-model="limitFilter" aria-label="展示数量">
            <option value="20">最近20条</option>
            <option value="50">最近50条</option>
            <option value="100">最近100条</option>
            <option value="200">最近200条</option>
            <option value="all">全部</option>
          </select>
        </div>
      </div>

      <div class="filter-meta">
        <span>筛选结果 {{ filteredAlerts.length }} 条</span>
        <span>时间范围：{{ timeRangeLabel }}</span>
        <span>排序：{{ sortLabel }}</span>
      </div>

      <div class="bulk-bar">
        <label class="select-all">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
          <span>全选 {{ selectedIds.length }} / {{ filteredAlerts.length }}</span>
        </label>
        <div class="bulk-actions">
          <BaseButton type="success" size="small" @click="bulkAcknowledge">
            批量确认
          </BaseButton>
          <BaseButton type="warning" size="small" @click="bulkMute">
            批量静音
          </BaseButton>
          <BaseButton type="danger" size="small" @click="bulkArchive">
            批量归档
          </BaseButton>
          <BaseButton type="ghost" size="small" @click="clearSelection">
            清空选择
          </BaseButton>
        </div>
      </div>

      <div class="filter-actions">
        <BaseButton type="ghost" size="small" @click="exportCsvAlerts">
          导出 CSV
        </BaseButton>
        <BaseButton type="ghost" size="small" @click="exportJsonAlerts">
          导出 JSON
        </BaseButton>
        <BaseButton v-if="hasActiveFilters" type="ghost" size="small" @click="resetFilters">
          重置筛选
        </BaseButton>
      </div>
    </div>

    <div class="surface-card alerts-table">
      <div v-if="!filteredAlerts.length" class="state-block empty">
        <p>暂无符合条件的警报</p>
      </div>
      <div v-else class="alert-list">
        <article
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="alert-item"
          :class="[`level-${alert.level}`, { archived: alert.archived }]"
        >
          <label class="alert-select">
            <input
              type="checkbox"
              :checked="isSelected(alert.id)"
              @change="toggleSelect(alert.id)"
            />
          </label>
          <div class="alert-main">
            <div class="alert-header">
              <span :class="['alert-level', `level-${alert.level}`]">
                {{ levelLabel(alert.level) }}
              </span>
              <span class="alert-time">{{ formatDateTime(alert.timestamp) }}</span>
            </div>
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-meta">
              <span class="meta-pill">{{ alert.source }}</span>
              <span v-if="alert.acknowledged" class="meta-pill success">已确认</span>
              <span v-if="alert.muted" class="meta-pill warning">已静音</span>
              <span v-if="alert.archived" class="meta-pill ghost">已归档</span>
            </div>
          </div>
          <div class="alert-actions">
            <BaseButton
              type="success"
              size="small"
              :disabled="alert.acknowledged"
              @click="handleAcknowledge(alert.id)"
            >
              {{ alert.acknowledged ? '已确认' : '确认' }}
            </BaseButton>
            <BaseButton type="warning" size="small" @click="handleMute(alert.id)">
              {{ alert.muted ? '解除静音' : '静音' }}
            </BaseButton>
            <BaseButton
              v-if="!alert.archived"
              type="danger"
              size="small"
              @click="handleArchive(alert.id)"
            >
              归档
            </BaseButton>
            <BaseButton
              v-else
              type="ghost"
              size="small"
              @click="handleRestore(alert.id)"
            >
              恢复
            </BaseButton>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMonitorStore } from '@/stores/monitorStore'
import { AlertLevel, TimeFilter } from '@/types/alerts'
import { exportCsv, exportJson, formatDateTime, getLatestDate, sortByTimestamp } from '@/utils/logs'
import { notify } from '@/utils/notify'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const monitorStore = useMonitorStore()
const { alerts } = storeToRefs(monitorStore)

const STORAGE_KEY = 'monitoring-dashboard:active-alerts:filters'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const defaultFilters = {
  levelFilter: 'all',
  timeFilter: '24h',
  searchQuery: '',
  statusFilter: 'active',
  sortOrder: 'latest',
  limitFilter: '50'
}

const readFilters = () => {
  if (!canUseStorage) return { ...defaultFilters }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultFilters }
    const parsed = JSON.parse(raw)
    return { ...defaultFilters, ...parsed }
  } catch (error) {
    console.warn('读取警报筛选配置失败', error)
    return { ...defaultFilters }
  }
}

const initialFilters = readFilters()

const levelFilter = ref<AlertLevel | 'all'>(initialFilters.levelFilter ?? defaultFilters.levelFilter)
const timeFilter = ref<TimeFilter>((initialFilters.timeFilter ?? defaultFilters.timeFilter) as TimeFilter)
const searchQuery = ref(initialFilters.searchQuery ?? defaultFilters.searchQuery)
const statusFilter = ref(initialFilters.statusFilter ?? defaultFilters.statusFilter)
const selectedIds = ref<string[]>([])
const sortOrder = ref(initialFilters.sortOrder ?? defaultFilters.sortOrder)
const limitFilter = ref(initialFilters.limitFilter ?? defaultFilters.limitFilter)

const TIME_FILTERS: Record<TimeFilter, number> = {
  all: Number.POSITIVE_INFINITY,
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000
}

const normalizedId = (id: string | number) => String(id)

const severityOrder = {
  critical: 4,
  error: 3,
  warning: 2,
  info: 1
}

const filteredAlerts = computed(() => {
  const now = Date.now()
  const keyword = searchQuery.value.trim().toLowerCase()
  let data = alerts.value.filter((alert) => {
    if (statusFilter.value === 'active' && alert.archived) return false
    if (statusFilter.value === 'archived' && !alert.archived) return false
    if (statusFilter.value === 'acknowledged' && !alert.acknowledged) return false
    if (statusFilter.value === 'unacknowledged' && alert.acknowledged) return false
    if (statusFilter.value === 'muted' && !alert.muted) return false
    if (statusFilter.value === 'unmuted' && alert.muted) return false
    if (levelFilter.value !== 'all' && alert.level !== levelFilter.value) return false

    const alertTime = typeof alert.timestamp === 'number'
      ? alert.timestamp
      : new Date(alert.timestamp).getTime()
    if (timeFilter.value !== 'all' && now - alertTime > TIME_FILTERS[timeFilter.value]) return false
    if (keyword) {
      const haystack = `${alert.title} ${alert.message} ${alert.source}`.toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })

  if (sortOrder.value === 'severity') {
    data = [...data].sort((a, b) => {
      const levelDiff = (severityOrder[b.level] || 0) - (severityOrder[a.level] || 0)
      if (levelDiff !== 0) return levelDiff
      const timeSorted = sortByTimestamp([a, b], 'desc', (item) => item.timestamp)
      return timeSorted[0]?.id === a.id ? -1 : 1
    })
  } else if (sortOrder.value === 'oldest') {
    data = sortByTimestamp(data, 'asc', (alert) => alert.timestamp)
  } else {
    data = sortByTimestamp(data, 'desc', (alert) => alert.timestamp)
  }

  const limit = limitFilter.value === 'all' ? Number.POSITIVE_INFINITY : Number(limitFilter.value) || 50
  return Number.isFinite(limit) ? data.slice(0, limit) : data
})

const activeStats = computed(() => {
  const activeAlerts = alerts.value.filter(alert => !alert.archived)
  return {
    total: activeAlerts.length,
    critical: activeAlerts.filter(alert => alert.level === 'critical').length,
    error: activeAlerts.filter(alert => alert.level === 'error').length,
    warning: activeAlerts.filter(alert => alert.level === 'warning').length,
    info: activeAlerts.filter(alert => alert.level === 'info').length,
    acknowledged: activeAlerts.filter(alert => alert.acknowledged).length,
    muted: activeAlerts.filter(alert => alert.muted).length
  }
})

const ackRate = computed(() => {
  if (!activeStats.value.total) return 0
  return Math.round((activeStats.value.acknowledged / activeStats.value.total) * 100)
})

const muteRate = computed(() => {
  if (!activeStats.value.total) return 0
  return Math.round((activeStats.value.muted / activeStats.value.total) * 100)
})

const severityStats = computed(() => {
  const total = activeStats.value.total || 1
  return {
    total: activeStats.value.total,
    critical: activeStats.value.critical,
    error: activeStats.value.error,
    warning: activeStats.value.warning,
    info: activeStats.value.info,
    criticalPct: Math.round((activeStats.value.critical / total) * 100),
    errorPct: Math.round((activeStats.value.error / total) * 100),
    warningPct: Math.round((activeStats.value.warning / total) * 100),
    infoPct: Math.round((activeStats.value.info / total) * 100)
  }
})

const lastUpdatedLabel = computed(() => {
  const latest = getLatestDate(alerts.value ?? [], (alert) => alert.timestamp)
  return latest ? formatDateTime(latest) : '暂无数据'
})

const timeRangeLabel = computed(() => {
  const map: Record<TimeFilter, string> = {
    all: '全部',
    '1h': '最近1小时',
    '24h': '最近24小时',
    '7d': '最近7天',
    '30d': '最近30天'
  }
  return map[timeFilter.value] || '全部'
})

const sortLabel = computed(() => {
  if (sortOrder.value === 'severity') return '严重优先'
  if (sortOrder.value === 'oldest') return '最早优先'
  return '最新优先'
})

const hasActiveFilters = computed(() =>
  searchQuery.value.trim() ||
  levelFilter.value !== defaultFilters.levelFilter ||
  timeFilter.value !== defaultFilters.timeFilter ||
  statusFilter.value !== defaultFilters.statusFilter ||
  sortOrder.value !== defaultFilters.sortOrder ||
  limitFilter.value !== defaultFilters.limitFilter
)

const isSelected = (id: string | number) => selectedIds.value.includes(normalizedId(id))
const isAllSelected = computed(() =>
  filteredAlerts.value.length > 0 &&
  selectedIds.value.length === filteredAlerts.value.length
)

const toggleSelect = (id: string | number) => {
  const value = normalizedId(id)
  if (selectedIds.value.includes(value)) {
    selectedIds.value = selectedIds.value.filter(item => item !== value)
  } else {
    selectedIds.value = [...selectedIds.value, value]
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filteredAlerts.value.map(alert => normalizedId(alert.id))
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

const handleAcknowledge = (alertId: string | number) => {
  monitorStore.acknowledgeAlert(alertId)
  notify.success('警报已确认')
}

const handleMute = (alertId: string | number) => {
  monitorStore.muteAlert(alertId)
  notify.info('静音状态已更新')
}

const handleArchive = (alertId: string | number) => {
  monitorStore.archiveAlert(alertId)
  notify.success('警报已归档')
}

const handleRestore = (alertId: string | number) => {
  monitorStore.restoreAlert(alertId)
  notify.info('警报已恢复')
}

const acknowledgeAll = () => {
  const ids = alerts.value.filter(alert => !alert.archived).map(alert => alert.id)
  if (!ids.length) {
    notify.info('暂无可确认的警报')
    return
  }
  monitorStore.acknowledgeAlerts(ids)
  notify.success('已全部确认')
}

const bulkAcknowledge = () => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要确认的警报')
    return
  }
  monitorStore.acknowledgeAlerts(selectedIds.value)
  notify.success(`已确认 ${selectedIds.value.length} 条警报`)
  clearSelection()
}

const bulkMute = () => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要静音的警报')
    return
  }
  monitorStore.muteAlerts(selectedIds.value, true)
  notify.success(`已静音 ${selectedIds.value.length} 条警报`)
  clearSelection()
}

const bulkArchive = () => {
  if (!selectedIds.value.length) {
    notify.info('请先选择需要归档的警报')
    return
  }
  monitorStore.archiveAlerts(selectedIds.value)
  notify.success(`已归档 ${selectedIds.value.length} 条警报`)
  clearSelection()
}

const refreshAlerts = () => {
  monitorStore.fetchAlerts()
  notify.info('警报数据已刷新')
}

const levelLabel = (level: AlertLevel) => {
  if (level === 'critical') return '严重'
  if (level === 'error') return '错误'
  if (level === 'warning') return '警告'
  return '信息'
}

const csvColumns = [
  { key: 'timestamp', label: '时间', format: (value) => formatDateTime(value) },
  { key: 'level', label: '级别', format: (value) => levelLabel(value) },
  { key: 'title', label: '标题' },
  { key: 'message', label: '内容' },
  { key: 'source', label: '来源' },
  { key: 'acknowledged', label: '已确认', format: (value) => (value ? '是' : '否') },
  { key: 'muted', label: '已静音', format: (value) => (value ? '是' : '否') },
  { key: 'archived', label: '已归档', format: (value) => (value ? '是' : '否') }
]

const exportCsvAlerts = () => {
  exportCsv(filteredAlerts.value, csvColumns, 'active-alerts')
  notify.success('已导出 CSV')
}

const exportJsonAlerts = () => {
  exportJson(filteredAlerts.value, 'active-alerts')
  notify.success('已导出 JSON')
}

const resetFilters = () => {
  searchQuery.value = defaultFilters.searchQuery
  levelFilter.value = defaultFilters.levelFilter as AlertLevel | 'all'
  timeFilter.value = defaultFilters.timeFilter as TimeFilter
  statusFilter.value = defaultFilters.statusFilter
  sortOrder.value = defaultFilters.sortOrder
  limitFilter.value = defaultFilters.limitFilter
  clearSelection()
}

watch(filteredAlerts, (next) => {
  const visible = new Set(next.map(alert => normalizedId(alert.id)))
  selectedIds.value = selectedIds.value.filter(id => visible.has(id))
})

watch(
  [searchQuery, levelFilter, timeFilter, statusFilter, sortOrder, limitFilter],
  ([query, level, time, status, sort, limit]) => {
    if (!canUseStorage) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          searchQuery: query,
          levelFilter: level,
          timeFilter: time,
          statusFilter: status,
          sortOrder: sort,
          limitFilter: limit
        })
      )
    } catch (error) {
      console.warn('写入警报筛选配置失败', error)
    }
  }
)

onMounted(() => {
  monitorStore.fetchAlerts()
})
</script>

<style scoped>
.active-alerts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.alert-metrics {
  align-items: stretch;
}

.severity-bar {
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.severity-track {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.15);
}

.severity-segment {
  height: 100%;
}

.severity-segment.critical {
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.5));
}

.severity-segment.error {
  background: linear-gradient(90deg, rgba(248, 113, 113, 0.75), rgba(248, 113, 113, 0.45));
}

.severity-segment.warning {
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.8), rgba(245, 158, 11, 0.45));
}

.severity-segment.info {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0.45));
}

.severity-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  font-size: 0.75rem;
  color: var(--text-2);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
}

.legend-item.critical {
  border-color: rgba(239, 68, 68, 0.45);
  color: #fecaca;
}

.legend-item.error {
  border-color: rgba(248, 113, 113, 0.45);
  color: #fecaca;
}

.legend-item.warning {
  border-color: rgba(245, 158, 11, 0.45);
  color: #fde68a;
}

.legend-item.info {
  border-color: rgba(56, 189, 248, 0.45);
  color: #bae6fd;
}

.legend-item.muted {
  border-color: rgba(148, 163, 184, 0.45);
  color: var(--text-3);
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  justify-content: center;
}

.metric-label {
  color: var(--text-2);
  font-size: 0.8rem;
}

.metric-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-0);
}

.metric-meta {
  color: var(--text-3);
  font-size: 0.75rem;
}

.filter-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.filter-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-3);
}

.bulk-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
}

.select-all {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-2);
  font-size: 0.85rem;
}

.bulk-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: flex-end;
  border-top: 1px dashed var(--border);
  padding-top: 0.75rem;
}

.alerts-table {
  padding: 1.5rem;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.alert-item:hover {
  transform: translateY(-2px);
  border-color: rgba(34, 211, 238, 0.45);
}

.alert-item.archived {
  opacity: 0.7;
}

.alert-select {
  display: flex;
  align-items: flex-start;
  padding-top: 0.2rem;
}

.alert-select input {
  accent-color: var(--accent-0);
}

.alert-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.alert-level {
  font-size: 0.7rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.alert-level.level-critical,
.alert-level.level-error {
  background: rgba(239, 68, 68, 0.18);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.45);
}

.alert-level.level-warning {
  background: rgba(245, 158, 11, 0.18);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.45);
}

.alert-level.level-info {
  background: rgba(56, 189, 248, 0.18);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.45);
}

.alert-time {
  font-size: 0.75rem;
  color: var(--text-3);
}

.alert-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-0);
  margin-top: 0.35rem;
}

.alert-message {
  font-size: 0.85rem;
  color: var(--text-2);
  margin-top: 0.4rem;
}

.alert-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.6rem;
}

.meta-pill {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  border: 1px solid var(--border);
  color: var(--text-2);
}

.meta-pill.success {
  border-color: rgba(34, 197, 94, 0.4);
  color: #bbf7d0;
}

.meta-pill.warning {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fde68a;
}

.meta-pill.ghost {
  border-color: rgba(148, 163, 184, 0.4);
  color: var(--text-3);
}

.alert-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.state-block {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: var(--text-2);
}

.state-block.empty {
  color: var(--text-3);
}

@media (max-width: 1100px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .alert-item {
    grid-template-columns: auto 1fr;
  }

  .alert-actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 720px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }

  .alert-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
