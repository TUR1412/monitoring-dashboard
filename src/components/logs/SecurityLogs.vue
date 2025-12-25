<!-- src/components/logs/SecurityLogs.vue -->
<template>
  <section class="log-panel">
    <header class="panel-header">
      <div>
        <h2 class="section-title">安全日志</h2>
        <span class="text-muted">威胁检测、异常行为与防护动作追踪</span>
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
          <BaseInput v-model="filters.query" placeholder="搜索威胁描述..." />
        </div>
        <div class="filter-item">
          <label>严重等级</label>
          <select v-model="filters.level">
            <option value="all">全部</option>
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
            <option value="critical">严重</option>
          </select>
        </div>
        <div class="filter-item">
          <label>事件来源</label>
          <select v-model="filters.source">
            <option value="all">全部</option>
            <option value="firewall">防火墙</option>
            <option value="ids">入侵检测</option>
            <option value="audit">安全审计</option>
            <option value="antivirus">反病毒</option>
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
        <p class="card-label">事件总量</p>
        <p class="card-value">{{ filteredLogs.length }}</p>
        <p class="card-meta">高危事件 {{ highRiskCount }}</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">关键威胁</p>
        <p class="card-value">{{ criticalCount }}</p>
        <p class="card-meta">需立即响应</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">防护覆盖</p>
        <p class="card-value">98.6%</p>
        <p class="card-meta">策略与规则已同步</p>
      </div>
    </section>

    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>来源</th>
            <th>等级</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td>{{ formatDateTime(log.timestamp) }}</td>
            <td>{{ log.source }}</td>
            <td>
              <span class="log-tag" :class="log.level">{{ log.level }}</span>
            </td>
            <td>{{ log.message }}</td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="4" class="empty-state">暂无安全事件</td>
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
import { exportCsv, exportJson, formatDateTime, sortByTimestamp } from "@/utils/logs"
import { safeStorage } from "@/utils/storage"

const store = useTelemetryStore()
const STORAGE_KEY = "monitoring-dashboard:logs:security-filters"

const filters = reactive({
  query: "",
  level: "all",
  source: "all",
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

const logs = computed(() => store.securityLogs || [])

const filteredLogs = computed(() => {
  const query = filters.query.trim().toLowerCase()
  let items = logs.value.map((log) => ({ ...log }))

  if (filters.level !== "all") {
    items = items.filter((log) => log.level === filters.level)
  }
  if (filters.source !== "all") {
    const sourceMap = {
      firewall: "防火墙",
      ids: "入侵检测系统",
      audit: "安全审计",
      antivirus: "防病毒软件"
    }
    items = items.filter((log) => log.source === sourceMap[filters.source])
  }
  if (query) {
    items = items.filter((log) => log.message.toLowerCase().includes(query))
  }

  return sortByTimestamp(items, filters.sort, (item) => item.timestamp)
})

const highRiskCount = computed(
  () => filteredLogs.value.filter((log) => ["high", "critical"].includes(log.level)).length
)
const criticalCount = computed(() => filteredLogs.value.filter((log) => log.level === "critical").length)

const exportColumns = [
  { key: "timestamp", label: "时间", format: (value) => formatDateTime(value) },
  { key: "source", label: "来源" },
  { key: "level", label: "等级" },
  { key: "message", label: "描述" }
]

const exportLogCsv = () => {
  exportCsv(filteredLogs.value, exportColumns, "security-logs")
}

const exportLogJson = () => {
  exportJson(filteredLogs.value, "security-logs")
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

.log-tag.low {
  border-color: rgba(46, 196, 182, 0.5);
}

.log-tag.medium {
  border-color: rgba(246, 189, 96, 0.6);
}

.log-tag.high,
.log-tag.critical {
  border-color: rgba(231, 111, 81, 0.6);
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem 0;
}
</style>
