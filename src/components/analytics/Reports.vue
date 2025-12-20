<!-- src/components/analytics/Reports.vue -->
<template>
  <div class="reports-view">
    <div class="section-header">
      <div>
        <div class="section-title">分析报告</div>
        <div class="section-subtitle">关键洞察、策略回溯与业务复盘</div>
      </div>
      <span class="pill">分析管线运行中</span>
    </div>

    <div class="bento-grid reports-grid">
      <div
        v-for="card in summaryCards"
        :key="card.title"
        class="surface-card bento-card bento-span-4 report-card"
      >
        <div class="report-card-title">{{ card.title }}</div>
        <div class="report-card-value">{{ card.value }}</div>
        <div class="report-card-meta">{{ card.meta }}</div>
      </div>

      <div class="surface-card bento-card bento-span-12 controls-panel">
        <div class="controls-header">
          <div>
            <h3>生成设置</h3>
            <p>按需生成日报、周报与专项分析</p>
          </div>
          <div class="controls-actions">
            <button class="btn btn-ghost" @click="exportReports('json')">
              导出 JSON
            </button>
            <button class="btn btn-ghost" @click="exportReports('csv')">
              导出 CSV
            </button>
          </div>
        </div>
        <div class="controls-grid">
          <FormSelect v-model="dateRange" label="日期范围" :options="dateRangeOptions" />
          <FormSelect v-model="reportType" label="报告类型" :options="reportTypeOptions" />
          <button
            class="btn btn-primary generate-button"
            :disabled="isGenerating"
            @click="generateReport"
          >
            <span v-if="isGenerating" class="loading-spinner"></span>
            {{ isGenerating ? '生成中...' : '生成报告' }}
          </button>
        </div>
      </div>

      <div class="surface-card bento-card bento-span-12 reports-table">
        <div class="table-header">
          <div>
            <h3>报告列表</h3>
            <p>最近生成与可下载的分析报告</p>
          </div>
          <div class="table-actions">
            <button class="btn btn-ghost" @click="loadReports">刷新列表</button>
          </div>
        </div>

        <div v-if="loading" class="state-block">
          <div class="loading-spinner"></div>
          <p>加载报告数据中...</p>
        </div>

        <div v-else-if="error" class="state-block error-block">
          <p>{{ error }}</p>
          <button class="btn btn-danger" @click="loadReports">重试</button>
        </div>

        <div v-else-if="!reports.length" class="state-block empty-block">
          <p>还没有生成任何报告</p>
          <button class="btn btn-primary" @click="generateReport">生成第一份报告</button>
        </div>

        <div v-else class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>报告名称</th>
                <th>类型</th>
                <th>日期范围</th>
                <th>生成时间</th>
                <th>大小</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>{{ report.name }}</td>
                <td>
                  <span :class="['type-pill', `type-${report.type}`]">
                    {{ getReportTypeLabel(report.type) }}
                  </span>
                </td>
                <td>{{ report.dateRange }}</td>
                <td>{{ formatDate(report.generated) }}</td>
                <td>{{ report.size || '--' }}</td>
                <td>
                  <span :class="['status-pill', `status-${report.status || 'ready'}`]">
                    {{ getStatusLabel(report.status) }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-ghost"
                    :disabled="isDownloading[report.id]"
                    @click="downloadReport(report)"
                  >
                    <span v-if="isDownloading[report.id]" class="loading-spinner small"></span>
                    {{ isDownloading[report.id] ? '下载中' : '下载' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { saveAs } from 'file-saver'
import FormSelect from '../common/FormSelect.vue'
import { useReportStore } from '@/stores/reports'
import { formatDate } from '@/utils/date'

const store = useReportStore()
const loading = ref(true)
const error = ref(null)
const isGenerating = ref(false)
const isDownloading = ref({})

const dateRange = ref('7d')
const reportType = ref('summary')

const dateRangeOptions = [
  { value: '7d', label: '最近7天' },
  { value: '30d', label: '最近30天' },
  { value: '90d', label: '最近90天' }
]

const reportTypeOptions = [
  { value: 'summary', label: '概要报告' },
  { value: 'detailed', label: '详细报告' },
  { value: 'custom', label: '自定义报告' }
]

const reports = computed(() => store.reports)

const latestReport = computed(() => {
  if (!reports.value.length) return null
  return [...reports.value].sort((a, b) => new Date(b.generated) - new Date(a.generated))[0]
})

const averageSize = computed(() => {
  const sizes = reports.value
    .map(report => parseFloat(report.size))
    .filter(value => Number.isFinite(value))
  if (!sizes.length) return '--'
  const avg = sizes.reduce((sum, value) => sum + value, 0) / sizes.length
  return `${avg.toFixed(1)}MB`
})

const summaryCards = computed(() => [
  {
    title: '报告总数',
    value: reports.value.length || 0,
    meta: '已生成'
  },
  {
    title: '最新报告',
    value: latestReport.value?.name || '暂无',
    meta: latestReport.value ? formatDate(latestReport.value.generated) : '等待生成'
  },
  {
    title: '平均体积',
    value: averageSize.value,
    meta: '压缩已开启'
  }
])

const getReportTypeLabel = (type) => {
  const option = reportTypeOptions.find(opt => opt.value === type)
  return option ? option.label : type
}

const getStatusLabel = (status) => {
  if (status === 'processing') return '生成中'
  if (status === 'failed') return '失败'
  return '已生成'
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
  } catch (e) {
    error.value = '生成报告失败，请稍后重试'
    console.error('Report generation error:', e)
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
  } catch (e) {
    error.value = '下载报告失败，请稍后重试'
    console.error('Report download error:', e)
  } finally {
    isDownloading.value = { ...isDownloading.value, [report.id]: false }
  }
}

const escapeCsv = (value) => {
  const stringValue = String(value ?? '')
  const escaped = stringValue.replace(/\"/g, '\"\"')
  return `"${escaped}"`
}

const exportReports = (format) => {
  if (!reports.value.length) {
    error.value = '暂无可导出的报告数据'
    return
  }
  const payload = reports.value.map(report => ({
    name: report.name,
    type: getReportTypeLabel(report.type),
    range: report.dateRange,
    generated: report.generated,
    size: report.size,
    status: getStatusLabel(report.status)
  }))

  if (format === 'csv') {
    const header = ['报告名称', '类型', '日期范围', '生成时间', '大小', '状态']
    const rows = payload.map(item => [
      item.name,
      item.type,
      item.range,
      item.generated,
      item.size,
      item.status
    ])
    const csv = [header, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `reports-${Date.now()}.csv`)
  } else {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    saveAs(blob, `reports-${Date.now()}.json`)
  }
}

const loadReports = async () => {
  try {
    loading.value = true
    error.value = null
    await store.fetchReports()
  } catch (e) {
    error.value = '加载报告列表失败，请稍后重试'
    console.error('Reports loading error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.reports-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reports-grid {
  align-items: start;
}

.report-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.report-card-title {
  color: var(--text-2);
  font-size: 0.85rem;
}

.report-card-value {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--text-0);
}

.report-card-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.controls-header p {
  color: var(--text-2);
  margin-top: 0.4rem;
}

.controls-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: end;
}

.generate-button {
  width: 100%;
}

.reports-table {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.table-header p {
  color: var(--text-2);
  margin-top: 0.35rem;
}

.table-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.table-wrapper {
  overflow-x: auto;
}

.type-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid transparent;
}

.type-summary {
  background: rgba(34, 211, 238, 0.18);
  color: #bae6fd;
  border-color: rgba(34, 211, 238, 0.35);
}

.type-detailed {
  background: rgba(245, 158, 11, 0.18);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.35);
}

.type-custom {
  background: rgba(251, 113, 133, 0.18);
  color: #fecaca;
  border-color: rgba(251, 113, 133, 0.35);
}

.status-ready {
  background: rgba(34, 197, 94, 0.18);
  color: #bbf7d0;
  border-color: rgba(34, 197, 94, 0.35);
}

.status-processing {
  background: rgba(56, 189, 248, 0.18);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.35);
}

.status-failed {
  background: rgba(239, 68, 68, 0.18);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.35);
}

.state-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  padding: 2rem 1rem;
  color: var(--text-2);
}

.error-block {
  color: #fecaca;
}

.empty-block {
  color: var(--text-2);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(34, 211, 238, 0.4);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 14px;
  height: 14px;
  border-width: 2px;
  margin-right: 0.4rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1000px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }

  .controls-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 900px) {
  .report-card {
    min-height: 150px;
  }
}
</style>
