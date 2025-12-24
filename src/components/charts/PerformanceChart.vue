<!-- src/components/charts/PerformanceChart.vue -->
<template>
  <div class="performance-chart">
    <h4>性能分析</h4>
    <div class="chart-wrapper">
      <ChartComponent
        type="bar"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'PerformanceChart',
  components: {
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

    let updateInterval

    const startFetching = () => {
      store.fetchFrontendPerformance()
      updateInterval = setInterval(() => {
        store.fetchFrontendPerformance()
      }, 5000)
    }

    onMounted(() => {
      startFetching()
    })

    onUnmounted(() => {
      clearInterval(updateInterval)
    })

    return {
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.performance-chart {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-wrapper {
  flex: 1;
  position: relative;
}
</style>
