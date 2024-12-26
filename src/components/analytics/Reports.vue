<!-- src/components/analytics/Reports.vue -->
<template>
  <div class="reports-container">
    <header class="reports-header">
      <h2 class="text-3xl font-bold mb-6 glow-text">分析报告</h2>
      
      <div class="controls-panel glassmorphism">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormSelect
            v-model="dateRange"
            label="日期范围"
            :options="dateRangeOptions"
            class="form-select-custom"
          />
          <FormSelect
            v-model="reportType"
            label="报告类型"
            :options="reportTypeOptions"
            class="form-select-custom"
          />
          <div class="flex items-end">
            <button 
              @click="generateReport"
              :disabled="isGenerating"
              class="action-button"
              :class="{ 'button-loading': isGenerating }"
            >
              <span v-if="isGenerating" class="loading-spinner"></span>
              {{ isGenerating ? '生成中...' : '生成报告' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner-large"></div>
      <p class="mt-4 text-gray-400">加载数据中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <div class="flex items-center">
        <span class="material-icons mr-2">error_outline</span>
        {{ error }}
      </div>
      <button @click="loadReports" class="retry-button">
        重试
      </button>
    </div>

    <!-- Reports Table -->
    <div v-else class="reports-table-container">
      <table class="reports-table">
        <thead>
          <tr>
            <th v-for="header in tableHeaders" 
                :key="header.key"
                class="table-header">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" 
              :key="report.id" 
              class="table-row">
            <td>{{ report.name }}</td>
            <td>{{ getReportTypeLabel(report.type) }}</td>
            <td>{{ report.dateRange }}</td>
            <td>{{ formatDate(report.generated) }}</td>
            <td>
              <button 
                @click="downloadReport(report)"
                :disabled="isDownloading[report.id]"
                class="download-button"
                :class="{ 'button-loading': isDownloading[report.id] }"
              >
                <span v-if="isDownloading[report.id]" class="loading-spinner-small"></span>
                {{ isDownloading[report.id] ? '下载中...' : '下载' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const tableHeaders = [
  { key: 'name', label: '报告名称' },
  { key: 'type', label: '类型' },
  { key: 'dateRange', label: '日期范围' },
  { key: 'generated', label: '生成时间' },
  { key: 'actions', label: '操作' }
]

const reports = computed(() => store.reports)

const getReportTypeLabel = (type) => {
  const option = reportTypeOptions.find(opt => opt.value === type)
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
  } catch (e) {
    error.value = '生成报告失败，请重试'
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
    error.value = '下载报告失败，请重试'
    console.error('Report download error:', e)
  } finally {
    isDownloading.value = { ...isDownloading.value, [report.id]: false }
  }
}

const loadReports = async () => {
  try {
    loading.value = true
    error.value = null
    await store.fetchReports()
  } catch (e) {
    error.value = '加载报告列表失败，请重试'
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
.reports-container {
  @apply p-6 space-y-6;
}

.reports-header {
  @apply space-y-6;
}

.glow-text {
  @apply text-white;
  text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-blue);
}

.controls-panel {
  @apply p-6 rounded-lg bg-opacity-10 bg-white backdrop-blur-lg border border-gray-600;
}

.form-select-custom :deep(select) {
  @apply w-full bg-gray-800 border-gray-600 text-gray-200 rounded-md;
}

.action-button {
  @apply w-full px-4 py-2 bg-blue-600 text-white rounded-md
         hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed
         transition-all duration-300 relative overflow-hidden;
}

.action-button::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0
         transition-opacity duration-300;
}

.action-button:hover::before {
  @apply opacity-100;
}

.loading-container {
  @apply flex flex-col items-center justify-center h-64;
}

.loading-spinner-large {
  @apply w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin;
}

.loading-spinner {
  @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2;
}

.loading-spinner-small {
  @apply w-3 h-3 border-2 border-gray-200 border-t-transparent rounded-full animate-spin mr-2;
}

.error-message {
  @apply bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-6 py-4 rounded-lg
         flex items-center justify-between;
}

.retry-button {
  @apply px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors duration-300;
}

.reports-table-container {
  @apply bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-xl;
}

.reports-table {
  @apply w-full border-collapse;
}

.table-header {
  @apply p-4 text-left text-sm font-medium text-gray-300 bg-gray-700 border-b border-gray-600;
}

.table-row {
  @apply border-b border-gray-700 transition-colors duration-200;
}

.table-row:hover {
  @apply bg-gray-700 bg-opacity-50;
}

.table-row > td {
  @apply p-4 text-gray-300;
}

.download-button {
  @apply px-3 py-1 bg-gray-700 text-gray-200 rounded-md
         hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500
         transition-all duration-300 flex items-center justify-center min-w-[80px];
}

.button-loading {
  @apply cursor-not-allowed;
}

/* 确保这些样式不会被全局样式覆盖 */
:deep(.form-select),
:deep(.form-input) {
  @apply bg-gray-800 border-gray-600 text-gray-200;
}

:deep(.form-label) {
  @apply text-gray-300 mb-2 block;
}
</style>