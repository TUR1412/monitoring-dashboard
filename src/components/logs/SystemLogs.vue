<!-- src/components/logs/SystemLogs.vue -->
<template>
  <section class="log-panel">
    <header class="panel-header">
      <div>
        <h2 class="section-title">系统日志</h2>
        <span class="text-muted">运行事件与系统状态追踪</span>
      </div>
      <div class="header-actions">
        <BaseButton size="small" type="info" @click="exportLogCsv">导出 CSV</BaseButton>
        <BaseButton size="small" type="default" @click="exportLogJson">导出 JSON</BaseButton>
      </div>
    </header>

    <div class="card filter-panel">
      <div class="filter-grid">
        <div class="filter-item">
          <label>关键字</label>
          <BaseInput v-model="filters.query" placeholder="搜索事件描述..." />
        </div>
        <div class="filter-item">
          <label>级别</label>
          <select v-model="filters.level">
            <option value="all">全部</option>
            <option value="info">信息</option>
            <option value="warning">警告</option>
            <option value="error">错误</option>
          </select>
        </div>
        <div class="filter-item">
          <label>时间窗口</label>
          <select v-model="filters.range">
            <option value="24h">24 小时</option>
            <option value="7d">7 天</option>
            <option value="30d">30 天</option>
          </select>
        </div>
        <div class="filter-item">
          <label>排序</label>
          <select v-model="filters.sort">
            <option value="desc">最新优先</option>
            <option value="asc">最早优先</option>
          </select>
        </div>
      </div>
    </div>

    <section class="bento-grid log-bento">
      <div class="bento-item span-4 card">
        <p class="card-label">日志总量</p>
        <p class="card-value">{{ filteredLogs.length }}</p>
        <p class="card-meta">覆盖窗口 {{ rangeLabel }}</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">警告数量</p>
        <p class="card-value">{{ warningCount }}</p>
        <p class="card-meta">关注资源波动</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">错误数量</p>
        <p class="card-value">{{ errorCount }}</p>
        <p class="card-meta">优先处理高危事件</p>
      </div>
    </section>

    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>级别</th>
            <th>来源</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td>{{ formatDateTime(log.timestamp) }}</td>
            <td>
              <span class="log-tag" :class="log.level">{{ log.level }}</span>
            </td>
            <td>{{ log.source }}</td>
            <td>{{ log.message }}</td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="4" class="empty-state">暂无日志记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from "vue"
import { useTelemetryStore } from "@/stores/telemetry"
import BaseInput from "@/components/base/BaseInput.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { exportCsv, exportJson, formatDateTime, getLatestDate, parseTimestamp, sortByTimestamp } from "@/utils/logs"
import { safeStorage } from "@/utils/storage"

const store = useTelemetryStore()
const STORAGE_KEY = "monitoring-dashboard:logs:system-filters"

const filters = reactive({
  query: "",
  level: "all",
  range: "7d",
  sort: "desc"
})

const restoreFilters = () => {
  const saved = safeStorage.get(STORAGE_KEY, null)
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return
  Object.assign(filters, saved)
}

const persistFilters = () => {
  safeStorage.set(STORAGE_KEY, filters)
}

restoreFilters()

watch(
  () => ({ ...filters }),
  () => {
    persistFilters()
  },
  { deep: true }
)

const sourceHints = ["监控核心", "事件总线", "节点守护", "系统代理", "任务调度"]
const logs = computed(() => store.logs || [])
const latestLog = computed(() => getLatestDate(logs.value, (item) => item.timestamp))

const rangeLabel = computed(() => {
  const map = { "24h": "24 小时", "7d": "7 天", "30d": "30 天" }
  return map[filters.range] || "7 天"
})

const filteredLogs = computed(() => {
  const query = filters.query.trim().toLowerCase()
  const reference = latestLog.value || new Date()
  const windowMs = filters.range === "24h" ? 24 * 3600 * 1000 : filters.range === "30d" ? 30 * 24 * 3600 * 1000 : 7 * 24 * 3600 * 1000

  let items = logs.value.map((log, index) => ({
    ...log,
    source: log.source || sourceHints[index % sourceHints.length]
  }))

  if (filters.level !== "all") {
    items = items.filter((log) => log.level === filters.level)
  }

  if (query) {
    items = items.filter((log) => log.message.toLowerCase().includes(query))
  }

  items = items.filter((log) => {
    const date = parseTimestamp(log.timestamp)
    if (!date) return false
    return reference.getTime() - date.getTime() <= windowMs
  })

  return sortByTimestamp(items, filters.sort, (item) => item.timestamp)
})

const warningCount = computed(() => filteredLogs.value.filter((log) => log.level === "warning").length)
const errorCount = computed(() => filteredLogs.value.filter((log) => log.level === "error").length)

const exportColumns = [
  { key: "timestamp", label: "时间", format: (value) => formatDateTime(value) },
  { key: "level", label: "级别" },
  { key: "source", label: "来源" },
  { key: "message", label: "描述" }
]

const exportLogCsv = () => {
  exportCsv(filteredLogs.value, exportColumns, "system-logs")
}

const exportLogJson = () => {
  exportJson(filteredLogs.value, "system-logs")
}
</script>

<style scoped>
.log-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.text-muted {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.header-actions {
  display: flex;
  gap: 0.6rem;
}

.filter-panel {
  padding: 1.25rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 1rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-item label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.log-bento .card {
  min-height: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.card-label {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.card-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-strong);
}

.card-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.table-card {
  padding: 0;
}

.log-tag {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid rgba(46, 196, 182, 0.4);
  color: var(--text-strong);
}

.log-tag.info {
  border-color: rgba(46, 196, 182, 0.5);
}

.log-tag.warning {
  border-color: rgba(246, 189, 96, 0.6);
}

.log-tag.error {
  border-color: rgba(231, 111, 81, 0.6);
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem 0;
}
</style>
