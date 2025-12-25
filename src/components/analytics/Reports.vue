<!-- src/components/analytics/Reports.vue -->
<template>
  <section class="reports-container">
    <header class="reports-header">
      <div class="header-copy">
        <h2 class="section-title">分析报告</h2>
        <p class="text-muted">智能生成、自动归档与跨团队同步。</p>
      </div>
      <div class="header-actions">
        <BaseButton size="small" type="info" @click="exportListCsv">导出列表</BaseButton>
        <BaseButton size="small" type="default" @click="exportListJson">导出 JSON</BaseButton>
      </div>
    </header>

    <section class="bento-grid reports-bento">
      <div class="bento-item span-4 card">
        <p class="card-label">累计报告</p>
        <p class="card-value">{{ totalReports }}</p>
        <p class="card-meta">本月新增 {{ monthlyReports }}</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">自动化覆盖</p>
        <p class="card-value">{{ automationRate }}%</p>
        <p class="card-meta">自动调度 {{ autoSchedule ? "已开启" : "已关闭" }}</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">报告产出效率</p>
        <p class="card-value">{{ avgGeneration }}min</p>
        <p class="card-meta">最近成功 {{ readyReports }} 份</p>
      </div>
    </section>

    <div class="controls-panel card">
      <div class="controls-grid">
        <FormSelect v-model="dateRange" label="日期范围" :options="dateRangeOptions" />
        <FormSelect v-model="reportType" label="报告类型" :options="reportTypeOptions" />
        <FormSelect v-model="delivery" label="交付渠道" :options="deliveryOptions" />
        <FormSelect v-model="sortKey" label="排序方式" :options="sortOptions" />
        <div class="control-item span-2">
          <label>搜索报告</label>
          <BaseInput v-model="searchQuery" placeholder="输入报告名称或关键字" />
        </div>
        <div class="control-item toggle">
          <label>自动调度</label>
          <input type="checkbox" v-model="autoSchedule" />
        </div>
        <div class="control-item action">
          <BaseButton size="small" type="primary" :loading="isGenerating" @click="generateReport">
            {{ isGenerating ? "生成中..." : "生成报告" }}
          </BaseButton>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p class="mt-4 text-muted">加载数据中...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <div class="flex items-center">
        <span class="material-icons mr-2">error_outline</span>
        {{ error }}
      </div>
      <button @click="loadReports" class="retry-button">重试</button>
    </div>

    <div v-else class="reports-table-container">
      <table>
        <thead>
          <tr>
            <th>报告名称</th>
            <th>类型</th>
            <th>交付</th>
            <th>生成时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in filteredReports" :key="report.id">
            <td>{{ report.name }}</td>
            <td>{{ getReportTypeLabel(report.type) }}</td>
            <td>{{ report.delivery }}</td>
            <td>{{ formatDate(report.generated) }}</td>
            <td>
              <span class="pill" :class="report.status">{{ report.statusLabel }}</span>
            </td>
            <td>
              <BaseButton
                size="small"
                type="default"
                :loading="isDownloading[report.id]"
                @click="downloadReport(report)"
              >
                {{ isDownloading[report.id] ? "下载中..." : "下载" }}
              </BaseButton>
            </td>
          </tr>
          <tr v-if="filteredReports.length === 0">
            <td colspan="6" class="empty-state">暂无匹配报告</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import FormSelect from "../common/FormSelect.vue"
import BaseInput from "@/components/base/BaseInput.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { useReportStore } from "@/stores/reports"
import { formatDate } from "@/utils/date"
import { exportCsv, exportJson } from "@/utils/logs"
import { safeStorage } from "@/utils/storage"
import { useUiStore } from "@/stores/ui"

const store = useReportStore()
const uiStore = useUiStore()
const loading = ref(true)
const error = ref(null)
const isGenerating = ref(false)
const isDownloading = ref({})

const STORAGE_KEY = "monitoring-dashboard:analytics:report-controls"
const DELIVERY_KEY = "monitoring-dashboard:analytics:report-delivery"

const dateRange = ref("7d")
const reportType = ref("summary")
const delivery = ref("email")
const sortKey = ref("recent")
const searchQuery = ref("")
const autoSchedule = ref(true)

const deliveryMap = ref({})

const dateRangeOptions = [
  { value: "7d", label: "最近7天" },
  { value: "30d", label: "最近30天" },
  { value: "90d", label: "最近90天" }
]

const reportTypeOptions = [
  { value: "summary", label: "概要报告" },
  { value: "detailed", label: "详细报告" },
  { value: "custom", label: "自定义报告" }
]

const deliveryOptions = [
  { value: "email", label: "邮件推送" },
  { value: "slack", label: "Slack 频道" },
  { value: "notion", label: "Notion 归档" }
]

const sortOptions = [
  { value: "recent", label: "最近生成" },
  { value: "name", label: "名称排序" },
  { value: "type", label: "类型排序" }
]

const restoreControls = () => {
  const saved = safeStorage.get(STORAGE_KEY, null)
  if (saved && typeof saved === "object" && !Array.isArray(saved)) {
    dateRange.value = saved.dateRange || dateRange.value
    reportType.value = saved.reportType || reportType.value
    delivery.value = saved.delivery || delivery.value
    sortKey.value = saved.sortKey || sortKey.value
    searchQuery.value = saved.searchQuery || ""
    autoSchedule.value = saved.autoSchedule ?? autoSchedule.value
  }

  const deliverySaved = safeStorage.get(DELIVERY_KEY, null)
  if (deliverySaved && typeof deliverySaved === "object" && !Array.isArray(deliverySaved)) {
    deliveryMap.value = deliverySaved
  }
}

const persistControls = () => {
  safeStorage.set(STORAGE_KEY, {
    dateRange: dateRange.value,
    reportType: reportType.value,
    delivery: delivery.value,
    sortKey: sortKey.value,
    searchQuery: searchQuery.value,
    autoSchedule: autoSchedule.value
  })
  safeStorage.set(DELIVERY_KEY, deliveryMap.value)
}

restoreControls()

watch([dateRange, reportType, delivery, sortKey, searchQuery, autoSchedule], () => {
  persistControls()
})

const reports = computed(() => store.reports)

watch(
  reports,
  (next, prev) => {
    if (!next?.length) return
    const prevIds = new Set((prev || []).map((report) => report.id))
    next.forEach((report) => {
      if (!prevIds.has(report.id)) {
        deliveryMap.value[report.id] = delivery.value
      }
    })
    persistControls()
  },
  { deep: true }
)

const normalizedReports = computed(() =>
  reports.value.map((report) => {
    const status = report.id % 3 === 0 ? "processing" : "ready"
    return {
      ...report,
      delivery: deliveryMap.value[report.id] || delivery.value,
      status,
      statusLabel: status === "ready" ? "已就绪" : "生成中"
    }
  })
)

const filteredReports = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  let list = normalizedReports.value
  if (reportType.value) {
    list = list.filter((item) => item.type === reportType.value)
  }
  if (query) {
    list = list.filter((item) => item.name.toLowerCase().includes(query))
  }
  if (sortKey.value === "name") {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortKey.value === "type") {
    list = [...list].sort((a, b) => a.type.localeCompare(b.type))
  } else {
    list = [...list].sort((a, b) => new Date(b.generated) - new Date(a.generated))
  }
  return list
})

const totalReports = computed(() => normalizedReports.value.length)
const readyReports = computed(() => normalizedReports.value.filter((item) => item.status === "ready").length)
const monthlyReports = computed(() => Math.max(2, Math.round(totalReports.value * 0.4)))
const automationRate = computed(() => (autoSchedule.value ? 86 : 62))
const avgGeneration = computed(() => 6.8)

const getReportTypeLabel = (type) => {
  const option = reportTypeOptions.find((opt) => opt.value === type)
  return option ? option.label : type
}

const generateReport = async () => {
  if (isGenerating.value) return

  try {
    isGenerating.value = true
    error.value = null
    await store.generateReport({
      type: reportType.value,
      dateRange: dateRange.value
    })
    uiStore.pushToast({ type: "success", message: "报告已生成" })
  } catch (e) {
    error.value = "生成报告失败，请重试"
    uiStore.pushToast({ type: "error", message: error.value })
  } finally {
    isGenerating.value = false
  }
}

const downloadReport = async (report) => {
  if (isDownloading.value[report.id]) return

  try {
    isDownloading.value = { ...isDownloading.value, [report.id]: true }
    error.value = null
    await store.downloadReport(report.id)
    uiStore.pushToast({ type: "success", message: "下载已开始" })
  } catch (e) {
    error.value = "下载报告失败，请重试"
    uiStore.pushToast({ type: "error", message: error.value })
  } finally {
    isDownloading.value = { ...isDownloading.value, [report.id]: false }
  }
}

const exportListCsv = () => {
  exportCsv(
    filteredReports.value,
    [
      { key: "name", label: "报告名称" },
      { key: "type", label: "类型" },
      { key: "delivery", label: "交付" },
      { key: "generated", label: "生成时间" },
      { key: "statusLabel", label: "状态" }
    ],
    "analytics-reports"
  )
}

const exportListJson = () => {
  exportJson(filteredReports.value, "analytics-reports")
}

const loadReports = async () => {
  try {
    loading.value = true
    error.value = null
    await store.fetchReports()
  } catch (e) {
    error.value = "加载报告列表失败，请重试"
    uiStore.pushToast({ type: "error", message: error.value })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.reports-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reports-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.text-muted {
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.reports-bento .card {
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
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-strong);
}

.card-meta {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.controls-panel {
  padding: 1.5rem;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  align-items: end;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.control-item label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.control-item.span-2 {
  grid-column: span 2;
}

.control-item.toggle {
  align-items: flex-start;
}

.control-item.action {
  align-items: flex-start;
  justify-content: flex-end;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 16rem;
}

.loading-spinner-large {
  width: 4rem;
  height: 4rem;
  border: 4px solid rgba(46, 196, 182, 0.35);
  border-top-color: transparent;
  border-radius: 999px;
  animation: spin 1s linear infinite;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(231, 111, 81, 0.15);
  border: 1px solid rgba(231, 111, 81, 0.45);
  color: var(--text-strong);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
}

.retry-button {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(231, 111, 81, 0.45);
  background: rgba(231, 111, 81, 0.2);
  color: var(--text-strong);
  transition: filter 0.2s ease;
}

.retry-button:hover {
  filter: brightness(1.05);
}

.reports-table-container {
  background: rgba(12, 17, 24, 0.55);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.pill {
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-strong);
}

.pill.ready {
  border-color: rgba(6, 214, 160, 0.5);
  background: rgba(6, 214, 160, 0.15);
}

.pill.processing {
  border-color: rgba(244, 162, 97, 0.5);
  background: rgba(244, 162, 97, 0.15);
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
