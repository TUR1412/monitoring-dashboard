<!-- src/components/charts/PerformanceChart.vue -->
<template>
  <ChartCard title="性能分析">
    <ChartComponent type="bar" :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script>
import { computed } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import { usePolling } from '@/composables/usePolling'
import ChartCard from './ChartCard.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'PerformanceChart',
  components: {
    ChartCard,
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

    const chartData = computed(() => ({
      labels: store.frontendPerformanceData.map(entry => entry.time),
      datasets: [
        {
          label: '加载时间 (秒)',
          data: store.frontendPerformanceData.map(entry => entry.loadTime),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        },
        {
          label: '响应时间 (秒)',
          data: store.frontendPerformanceData.map(entry => entry.responseTime),
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '时间 (秒)'
          }
        },
        x: {
          type: 'category',
          title: {
            display: true,
            text: '时间'
          }
        }
      }
    }

    usePolling(() => store.fetchFrontendPerformance(), 5000)

    return {
      chartData,
      chartOptions
    }
  }
}
</script>
