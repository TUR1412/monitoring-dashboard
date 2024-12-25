<!-- src/components/analytics/Reports.vue -->
<template>
  <div class="reports">
    <h2 class="text-2xl font-bold mb-4">分析报告</h2>
    
    <!-- Controls -->
    <div class="reports-controls mb-6 bg-gray-50 p-6 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect
          v-model="dateRange"
          label="日期范围"
          :options="dateRangeOptions"
        />
        <FormSelect
          v-model="reportType"
          label="报告类型"
          :options="reportTypeOptions"
        />
        <div class="flex items-end">
          <button 
            @click="generateReport"
            :disabled="isGenerating"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {{ isGenerating ? '生成中...' : '生成报告' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Reports List -->
    <div v-else class="reports-list bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b">
            <th v-for="header in tableHeaders" 
                :key="header.key"
                class="p-4 text-left text-sm font-medium text-gray-600">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" 
              :key="report.id" 
              class="border-b hover:bg-gray-50">
            <td class="p-4">{{ report.name }}</td>
            <td class="p-4">{{ getReportTypeLabel(report.type) }}</td>
            <td class="p-4">{{ report.dateRange }}</td>
            <td class="p-4">{{ formatDate(report.generated) }}</td>
            <td class="p-4">
              <button 
                @click="downloadReport(report)"
                :disabled="isDownloading[report.id]"
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
              >
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

// 选项数据
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

// 计算属性
const reports = computed(() => store.reports)

// Methods
const getReportTypeLabel = (type) => {
  const option = reportTypeOptions.find(opt => opt.value === type)
  return option ? option.label : type
}

const generateReport = async () => {
  try {
    isGenerating.value = true
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
  try {
    isDownloading.value = { ...isDownloading.value, [report.id]: true }
    await store.downloadReport(report.id)
  } catch (e) {
    error.value = '下载报告失败，请重试'
    console.error('Report download error:', e)
  } finally {
    isDownloading.value = { ...isDownloading.value, [report.id]: false }
  }
}

// 初始化数据
const loadReports = async () => {
  try {
    loading.value = true
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
.reports {
  @apply p-6;
}
</style>
