<!-- src/components/charts/FrontendPerformance.vue -->
<template>
  <div class="frontend-performance">
    <h4>前端性能</h4>
    <ChartComponent :type="'bar'" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'FrontendPerformance',
  components: {
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

    const chartData = computed(() => ({
      labels: ['加载时间', '交互时间', '响应时间', '渲染时间'],
      datasets: [
        {
          label: '时间 (秒)',
          data: [
            store.frontendPerformance.loadTime,
            store.frontendPerformance.interactionTime,
            store.frontendPerformance.responseTime,
            store.frontendPerformance.renderTime
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)'
          ],
          borderWidth: 1
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '时间 (秒)'
          }
        },
        x: {
          title: {
            display: true,
            text: '性能指标'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false
        }
      }
    }

    onMounted(() => {
      store.fetchFrontendPerformance()
    })

    return {
      chartData,
      chartOptions,
      store
    }
  }
}
</script>

<style scoped>
.frontend-performance {
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保图表填满容器 */
}
</style>
