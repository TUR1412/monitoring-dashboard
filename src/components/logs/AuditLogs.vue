<!-- src/components/logs/AuditLogs.vue -->
<template>
  <section class="log-panel">
    <header class="panel-header">
      <div>
        <h2 class="section-title">审计日志</h2>
        <span class="text-muted">关键操作、权限链路与合规追踪</span>
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
          <BaseInput v-model="filters.query" placeholder="搜索动作或描述..." />
        </div>
        <div class="filter-item">
          <label>操作类型</label>
          <select v-model="filters.action">
            <option value="all">全部</option>
            <option value="login">登录</option>
            <option value="create">新增</option>
            <option value="update">更新</option>
            <option value="delete">删除</option>
            <option value="logout">登出</option>
          </select>
        </div>
        <div class="filter-item">
          <label>操作者</label>
          <select v-model="filters.actor">
            <option value="all">全部</option>
            <option value="admin">管理员</option>
            <option value="user1">user1</option>
            <option value="user2">user2</option>
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
        <p class="card-label">审计总量</p>
        <p class="card-value">{{ filteredLogs.length }}</p>
        <p class="card-meta">关键动作 {{ privilegedCount }}</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">权限变更</p>
        <p class="card-value">{{ roleChangeCount }}</p>
        <p class="card-meta">策略已记录</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">安全态势</p>
        <p class="card-value">99.2%</p>
        <p class="card-meta">审计完整率</p>
      </div>
    </section>

    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>用户</th>
            <th>动作</th>
            <th>描述</th>
            <th>详情</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td>{{ formatDateTime(log.timestamp) }}</td>
            <td>{{ log.username }}</td>
            <td>
              <span class="log-tag">{{ log.action }}</span>
            </td>
            <td>{{ log.message }}</td>
            <td>{{ formatDetails(log.details) }}</td>
          </tr>
          <tr v-if="filteredLogs.length === 0">
            <td colspan="5" class="empty-state">暂无审计记录</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from "vue"
import { useMonitorStore } from "@/stores/monitorStore"
import BaseInput from "@/components/base/BaseInput.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { exportCsv, exportJson, formatDateTime, sortByTimestamp } from "@/utils/logs"

const store = useMonitorStore()
const isBrowser = typeof window !== "undefined"
const STORAGE_KEY = "monitoring-dashboard:logs:audit-filters"

const filters = reactive({
  query: "",
  action: "all",
  actor: "all",
  sort: "desc"
})

const restoreFilters = () => {
  if (!isBrowser) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    Object.assign(filters, JSON.parse(raw))
  } catch (error) {
    // ignore restore error
  }
}

const persistFilters = () => {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
}

restoreFilters()

watch(
  () => ({ ...filters }),
  () => {
    persistFilters()
  },
  { deep: true }
)

const logs = computed(() => store.auditLogs || [])

const filteredLogs = computed(() => {
  const query = filters.query.trim().toLowerCase()
  let items = logs.value.map((log) => ({ ...log }))

  if (filters.action !== "all") {
    items = items.filter((log) => log.action === filters.action)
  }
  if (filters.actor !== "all") {
    items = items.filter((log) => log.username === filters.actor)
  }
  if (query) {
    items = items.filter((log) => log.message.toLowerCase().includes(query))
  }
  return sortByTimestamp(items, filters.sort, (item) => item.timestamp)
})

const privilegedCount = computed(
  () => filteredLogs.value.filter((log) => ["delete", "update"].includes(log.action)).length
)
const roleChangeCount = computed(
  () => filteredLogs.value.filter((log) => log.message.includes("权限") || log.message.includes("角色")).length
)

const formatDetails = (details) => {
  if (!details) return "—"
  return Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" · ")
}

const exportColumns = [
  { key: "timestamp", label: "时间", format: (value) => formatDateTime(value) },
  { key: "username", label: "用户" },
  { key: "action", label: "动作" },
  { key: "message", label: "描述" },
  { key: "details", label: "详情", format: (_, row) => formatDetails(row.details) }
]

const exportLogCsv = () => {
  exportCsv(filteredLogs.value, exportColumns, "audit-logs")
}

const exportLogJson = () => {
  exportJson(filteredLogs.value, "audit-logs")
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

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem 0;
}
</style>
