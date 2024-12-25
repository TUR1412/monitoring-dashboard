<template>
  <div class="performance-analysis p-6">
    <h2 class="text-2xl font-bold mb-4">性能分析</h2>

    <ErrorDisplay 
      v-if="error" 
      :message="error" 
      @retry="loadData"
    />

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.id"
          :title="metric.title"
          :value="metric.value"
          :unit="metric.unit"
          :trend="metric.trend"
        />
      </div>

      <div class="performance-chart bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">性能指标趋势</h3>
        <PerformanceChart type="line" :data="chartData" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePerformanceStore } from '@/stores/performance'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import ErrorDisplay from '@/components/common/ErrorDisplay.vue'

const store = usePerformanceStore()
const error = ref(null)

// 直接使用 storeToRefs 来解构数据
const { 
  currentMetrics,
  chartLabels,
  responseTimeData,
  errorRateData,
  resourceUsageData 
} = storeToRefs(store)

// 性能指标卡片数据
const metrics = computed(() => {
  const current = currentMetrics.value || {}  // 防止 currentMetrics 为 undefined
  return [
    {
      id: 'response',
      title: '响应时间',
      value: current.responseTime ?? 0,
      unit: 'ms',
      trend: current.responseTrend ?? 0
    },
    {
      id: 'error',
      title: '错误率',
      value: current.errorRate ?? 0,
      unit: '%',
      trend: current.errorTrend ?? 0
    },
    {
      id: 'resource',
      title: '资源使用率',
      value: current.resourceUsage ?? 0,
      unit: '%',
      trend: current.resourceTrend ?? 0
    }
  ]
})

// 图表数据
const chartData = computed(() => {
  const labels = chartLabels.value || []
  const responseData = responseTimeData.value || []
  const errorRate = errorRateData.value || []
  const resourceUsage = resourceUsageData.value || []

  return {
    labels,
    datasets: [
      {
        label: '响应时间 (ms)',
        data: responseData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
      {
        label: '错误率 (%)',
        data: errorRate,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: '资源使用率 (%)',
        data: resourceUsage,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  }
})

// 加载数据
const loadData = async () => {
  try {
    await store.fetchPerformanceData()
  } catch (e) {
    error.value = '加载性能数据失败，请重试'
    console.error('Performance data loading error:', e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.performance-analysis {
  @apply p-6;
}
</style>
