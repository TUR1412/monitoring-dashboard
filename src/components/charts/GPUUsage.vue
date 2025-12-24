<!-- src/components/charts/GPUUsage.vue -->
<template>
  <div class="gpu-usage-monitor">
    <h4>GPU Usage Monitor</h4>
    <div class="chart-wrapper">
      <ChartComponent
        type="line"
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
  name: 'GPUUsage',
  components: {
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

    // 如果需要动态更新数据，可以通过 Store 的 Actions 来进行
    let updateInterval

    const startFetching = () => {
      // 假设有一个 action 来更新 I/O 统计数据
      updateInterval = setInterval(() => {
        store.updateIOStatistics()
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
.gpu-usage-monitor {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-wrapper {
  flex: 1;
  position: relative;
}
</style>
