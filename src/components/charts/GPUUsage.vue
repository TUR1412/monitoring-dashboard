<!-- src/components/charts/GPUUsage.vue -->
<template>
  <ChartCard title="GPU Usage Monitor">
    <ChartComponent type="line" :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script>
import { computed } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import { usePolling } from '@/composables/usePolling'
import ChartCard from './ChartCard.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'GPUUsage',
  components: {
    ChartCard,
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

    // 使用 computed 属性仅用于读取 Store 中的数据
    const chartData = computed(() => ({
      labels: store.ioStatistics.readOps.map(entry => entry.time),
      datasets: [
        {
          label: 'Read Operations (IOPS)',
          data: store.ioStatistics.readOps.map(entry => entry.value),
          borderColor: '#4F46E5',
          tension: 0.4,
          yAxisID: 'y1'
        },
        {
          label: 'Write Operations (IOPS)',
          data: store.ioStatistics.writeOps.map(entry => entry.value),
          borderColor: '#10B981',
          tension: 0.4,
          yAxisID: 'y2'
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Time'
          },
          grid: {
            display: true
          }
        },
        y1: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Read Operations (IOPS)'
          },
          grid: {
            display: true
          }
        },
        y2: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Write Operations (IOPS)'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw} IOPS`
          }
        }
      }
    }

    usePolling(() => store.updateIOStatistics(), 5000)

    return {
      chartData,
      chartOptions
    }
  }
}
</script>
