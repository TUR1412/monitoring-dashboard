<!-- src/views/SystemAlerts.vue -->
<template>
  <div class="system-alerts fade-in">
    <div class="section-header">
      <div>
        <div class="section-title">系统警报</div>
        <div class="section-subtitle">风险事件、异常趋势与紧急通知</div>
      </div>
      <span class="pill">{{ totalCount }} 条记录</span>
    </div>

    <section class="bento-grid alert-insights">
      <div class="surface-card bento-card bento-span-3 insight-card">
        <div class="insight-label">未归档警报</div>
        <div class="insight-value">{{ activeCount }}</div>
        <div class="insight-meta">总计 {{ totalCount }} 条</div>
      </div>
      <div class="surface-card bento-card bento-span-3 insight-card">
        <div class="insight-label">确认率 (SLA)</div>
        <div class="insight-value">{{ slaRate }}%</div>
        <div class="insight-meta">{{ ackWithinLabel }}</div>
      </div>
      <div class="surface-card bento-card bento-span-3 insight-card">
        <div class="insight-label">平均响应 MTTA</div>
        <div class="insight-value">{{ mttaLabel }}</div>
        <div class="insight-meta">目标 ≤ 15 分钟</div>
      </div>
      <div class="surface-card bento-card bento-span-3 insight-card">
        <div class="insight-label">平均恢复 MTTR</div>
        <div class="insight-value">{{ mttrLabel }}</div>
        <div class="insight-meta">目标 ≤ 2 小时</div>
      </div>
    </section>

    <section class="surface-card severity-bar">
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
    </section>

    <section class="surface-card export-panel">
      <div class="export-header">
        <div>
          <h3>态势摘要与导出</h3>
          <p>导出当前警报、SLA 与响应效率报告</p>
        </div>
        <div class="export-actions">
          <BaseButton type="ghost" size="small" @click="exportSummary">
            导出摘要
          </BaseButton>
          <BaseButton type="primary" size="small" @click="exportCsvAlerts">
            导出 CSV
          </BaseButton>
          <BaseButton type="ghost" size="small" @click="exportJsonAlerts">
            导出 JSON
          </BaseButton>
        </div>
      </div>
      <div class="export-grid">
        <div class="export-card">
          <span>严重告警</span>
          <strong>{{ criticalCount }}</strong>
        </div>
        <div class="export-card">
          <span>已确认</span>
          <strong>{{ acknowledgedCount }}</strong>
        </div>
        <div class="export-card">
          <span>已归档</span>
          <strong>{{ archivedCount }}</strong>
        </div>
        <div class="export-card">
          <span>静音中</span>
          <strong>{{ mutedCount }}</strong>
        </div>
      </div>
    </section>

    <section class="surface-card filter-panel">
      <div class="filter-grid">
        <div class="filter-group">
          <span class="filter-label">关键字</span>
          <BaseInput v-model="searchQuery" placeholder="搜索标题、内容或来源" />
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
          <span class="filter-label">时间范围</span>
          <select v-model="timeFilter" aria-label="时间范围">
            <option value="all">全部时间</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
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

      <div class="filter-actions">
        <BaseButton type="ghost" size="small" @click="exportFilteredCsv">
          导出 CSV
        </BaseButton>
        <BaseButton type="ghost" size="small" @click="exportFilteredJson">
          导出 JSON
        </BaseButton>
        <BaseButton v-if="hasActiveFilters" type="ghost" size="small" @click="resetFilters">
          重置筛选
        </BaseButton>
      </div>
    </section>

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

    <router-view />

    <div v-if="$route.matched.length === 1" class="alerts-list surface-card">
      <div v-if="!filteredAlerts.length" class="empty-state">
        暂无符合条件的警报记录
      </div>
      <div
        v-for="alert in filteredAlerts"
        :key="alert.id"
        :class="['alert', `level-${alert.level}`, { archived: alert.archived }]"
      >
        <div class="alert-head">
          <span class="alert-level">{{ levelLabel(alert.level) }}</span>
          <div class="alert-tags">
            <span v-if="alert.acknowledged" class="tag success">已确认</span>
            <span v-if="alert.muted" class="tag warning">已静音</span>
            <span v-if="alert.archived" class="tag ghost">已归档</span>
          </div>
          <span class="timestamp">{{ formatDateTime(alert.timestamp) }}</span>
        </div>
        <div class="alert-body">{{ alert.title || alert.message }}</div>
        <div v-if="alert.title && alert.message" class="alert-description">{{ alert.message }}</div>
        <div class="alert-meta">
          <span>{{ alert.source }}</span>
          <span>{{ formatDateTime(alert.timestamp) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { exportCsv, exportJson, formatDateTime, getLatestDate, sortByTimestamp } from '@/utils/logs'
import { notify } from '@/utils/notify'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const store = useMonitorStore()

onMounted(() => {
  store.fetchAlerts()
})

const STORAGE_KEY = 'monitoring-dashboard:system-alerts:filters'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
const defaultFilters = {
  levelFilter: 'all',
  timeFilter: '30d',
  statusFilter: 'active',
  sortOrder: 'latest',
  limitFilter: '100',
  searchQuery: ''
}

const readFilters = () => {
  if (!canUseStorage) return { ...defaultFilters }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultFilters }
    const parsed = JSON.parse(raw)
    return { ...defaultFilters, ...parsed }
  } catch (error) {
    console.warn('读取系统警报筛选配置失败', error)
    return { ...defaultFilters }
  }
}

const initialFilters = readFilters()
const levelFilter = ref(initialFilters.levelFilter ?? defaultFilters.levelFilter)
const timeFilter = ref(initialFilters.timeFilter ?? defaultFilters.timeFilter)
const statusFilter = ref(initialFilters.statusFilter ?? defaultFilters.statusFilter)
const sortOrder = ref(initialFilters.sortOrder ?? defaultFilters.sortOrder)
const limitFilter = ref(initialFilters.limitFilter ?? defaultFilters.limitFilter)
const searchQuery = ref(initialFilters.searchQuery ?? defaultFilters.searchQuery)

const alerts = computed(() => store.alerts || [])
const totalCount = computed(() => alerts.value.length)
const activeCount = computed(() => alerts.value.filter(alert => !alert.archived).length)
const criticalCount = computed(() => alerts.value.filter(alert => alert.level === 'critical').length)
const acknowledgedCount = computed(() => alerts.value.filter(alert => alert.acknowledged).length)
const archivedCount = computed(() => alerts.value.filter(alert => alert.archived).length)
const mutedCount = computed(() => alerts.value.filter(alert => alert.muted).length)

const severityStats = computed(() => {
  const total = totalCount.value || 1
  const critical = alerts.value.filter(alert => alert.level === 'critical').length
  const error = alerts.value.filter(alert => alert.level === 'error').length
  const warning = alerts.value.filter(alert => alert.level === 'warning').length
  const info = alerts.value.filter(alert => alert.level === 'info').length
  return {
    total,
    critical,
    error,
    warning,
    info,
    criticalPct: Math.round((critical / total) * 100),
    errorPct: Math.round((error / total) * 100),
    warningPct: Math.round((warning / total) * 100),
    infoPct: Math.round((info / total) * 100)
  }
})

const ackThreshold = 15 * 60 * 1000
const ackWithin = computed(() =>
  alerts.value.filter(alert =>
    alert.acknowledged &&
    alert.acknowledgedAt &&
    (alert.acknowledgedAt - new Date(alert.timestamp).getTime()) <= ackThreshold
  ).length
)
const slaRate = computed(() => {
  if (!totalCount.value) return 0
  return Math.round((ackWithin.value / totalCount.value) * 100)
})

const averageDuration = (items) => {
  if (!items.length) return null
  const total = items.reduce((sum, item) => sum + item, 0)
  return total / items.length
}

const mttaValue = computed(() => {
  const values = alerts.value
    .filter(alert => alert.acknowledged && alert.acknowledgedAt)
    .map(alert => alert.acknowledgedAt - new Date(alert.timestamp).getTime())
  return averageDuration(values)
})

const mttrValue = computed(() => {
  const values = alerts.value
    .filter(alert => alert.resolvedAt)
    .map(alert => alert.resolvedAt - new Date(alert.timestamp).getTime())
  return averageDuration(values)
})

const formatDuration = (ms) => {
  if (!ms || ms <= 0) return '--'
  const minutes = Math.round(ms / 60000)
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.round(minutes / 60)
  return `${hours} 小时`
}

const mttaLabel = computed(() => formatDuration(mttaValue.value))
const mttrLabel = computed(() => formatDuration(mttrValue.value))
const ackWithinLabel = computed(() => `≤ 15 分钟 ${ackWithin.value} 条`)

const lastUpdatedLabel = computed(() => {
  const latest = getLatestDate(alerts.value ?? [], (alert) => alert.timestamp)
  return latest ? formatDateTime(latest) : '暂无数据'
})

const timeRangeLabel = computed(() => {
  const map = {
    all: '全部',
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

const severityRank = {
  critical: 4,
  error: 3,
  warning: 2,
  info: 1
}

const TIME_FILTERS = {
  all: Number.POSITIVE_INFINITY,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000
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
      const haystack = `${alert.title || ''} ${alert.message || ''} ${alert.source || ''}`.toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })

  if (sortOrder.value === 'severity') {
    data = [...data].sort((a, b) => {
      const severityDiff = (severityRank[b.level] || 0) - (severityRank[a.level] || 0)
      if (severityDiff !== 0) return severityDiff
      const timeSorted = sortByTimestamp([a, b], 'desc', (item) => item.timestamp)
      return timeSorted[0]?.id === a.id ? -1 : 1
    })
  } else if (sortOrder.value === 'oldest') {
    data = sortByTimestamp(data, 'asc', (alert) => alert.timestamp)
  } else {
    data = sortByTimestamp(data, 'desc', (alert) => alert.timestamp)
  }

  const limit = limitFilter.value === 'all' ? Number.POSITIVE_INFINITY : Number(limitFilter.value) || 100
  return Number.isFinite(limit) ? data.slice(0, limit) : data
})

const exportSummary = () => {
  const rows = [
    { metric: '总警报', value: totalCount.value },
    { metric: '未归档', value: activeCount.value },
    { metric: '严重告警', value: criticalCount.value },
    { metric: '已确认', value: acknowledgedCount.value },
    { metric: '已归档', value: archivedCount.value },
    { metric: '静音中', value: mutedCount.value },
    { metric: 'SLA 确认率', value: `${slaRate.value}%` },
    { metric: 'MTTA', value: mttaLabel.value },
    { metric: 'MTTR', value: mttrLabel.value }
  ]
  const columns = [
    { key: 'metric', label: '指标' },
    { key: 'value', label: '数值' }
  ]
  exportCsv(rows, columns, 'alert-summary')
  notify.success('摘要已导出')
}

const levelLabel = (level) => {
  if (level === 'critical') return '严重'
  if (level === 'error') return '错误'
  if (level === 'warning') return '警告'
  return '信息'
}

const alertColumns = [
  { key: 'id', label: 'ID' },
  { key: 'level', label: '等级', format: (value) => levelLabel(value) },
  { key: 'title', label: '标题', format: (value, row) => value || row.message || '' },
  { key: 'message', label: '内容' },
  { key: 'source', label: '来源' },
  { key: 'timestamp', label: '时间', format: (value) => formatDateTime(value) },
  { key: 'acknowledged', label: '确认状态', format: (value) => (value ? '已确认' : '未确认') },
  { key: 'archived', label: '归档状态', format: (value) => (value ? '已归档' : '未归档') },
  { key: 'muted', label: '静音状态', format: (value) => (value ? '已静音' : '未静音') }
]

const exportCsvAlerts = () => {
  if (!alerts.value.length) {
    notify.info('暂无可导出的警报')
    return
  }
  exportCsv(alerts.value, alertColumns, 'alerts')
  notify.success('警报 CSV 已导出')
}

const exportJsonAlerts = () => {
  if (!alerts.value.length) {
    notify.info('暂无可导出的警报')
    return
  }
  exportJson(alerts.value, 'alerts')
  notify.success('警报 JSON 已导出')
}

const exportFilteredCsv = () => {
  if (!filteredAlerts.value.length) {
    notify.info('暂无可导出的筛选结果')
    return
  }
  exportCsv(filteredAlerts.value, alertColumns, 'filtered-alerts')
  notify.success('筛选结果 CSV 已导出')
}

const exportFilteredJson = () => {
  if (!filteredAlerts.value.length) {
    notify.info('暂无可导出的筛选结果')
    return
  }
  exportJson(filteredAlerts.value, 'filtered-alerts')
  notify.success('筛选结果 JSON 已导出')
}

const resetFilters = () => {
  levelFilter.value = defaultFilters.levelFilter
  timeFilter.value = defaultFilters.timeFilter
  statusFilter.value = defaultFilters.statusFilter
  sortOrder.value = defaultFilters.sortOrder
  limitFilter.value = defaultFilters.limitFilter
  searchQuery.value = defaultFilters.searchQuery
}

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
      console.warn('写入系统警报筛选配置失败', error)
    }
  }
)
</script>

<style scoped>
.system-alerts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alert-insights {
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

.insight-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.insight-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.insight-value {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text-0);
}

.insight-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}

.export-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.export-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.export-header p {
  color: var(--text-2);
  margin-top: 0.35rem;
}

.export-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

.export-card {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-1);
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

.filter-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: flex-end;
  border-top: 1px dashed var(--border);
  padding-top: 0.75rem;
}

.alerts-list {
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  color: var(--text-3);
  padding: 1.5rem 0;
}

.alert {
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(148, 163, 184, 0.08);
}

.alert.archived {
  opacity: 0.7;
}

.alert-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.alert-level {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid transparent;
  text-transform: uppercase;
}

.alert-body {
  font-size: 0.95rem;
  color: var(--text-0);
}

.alert-description {
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-2);
}

.alert-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-3);
}

.alert-tags {
  display: inline-flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid var(--border);
  color: var(--text-2);
}

.tag.success {
  border-color: rgba(34, 197, 94, 0.4);
  color: #bbf7d0;
}

.tag.warning {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fde68a;
}

.tag.ghost {
  border-color: rgba(148, 163, 184, 0.4);
  color: var(--text-3);
}

.alert.level-warning {
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.12);
  color: #fde68a;
}

.alert.level-error,
.alert.level-critical {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
}

.alert.level-info {
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.12);
  color: #bae6fd;
}

.timestamp {
  font-size: 0.75rem;
  color: var(--text-3);
}

@media (max-width: 900px) {
  .export-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
