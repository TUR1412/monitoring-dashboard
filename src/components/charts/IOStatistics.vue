<!-- src/components/charts/IOStatistics.vue -->
<template>
  <div class="io-statistics">
    <h4>I/O 统计监控</h4>
    <div class="chart-wrapper">
      <ChartComponent
        type="line"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
    <div class="status-indicators">
      <StatusIndicator :status="ioStatus" label="I/O 状态" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import StatusIndicator from '../StatusIndicator.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'IOStatistics',
  components: {
    StatusIndicator,
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()

    // 使用 computed 计算 ioStatus
    const ioStatus = computed(() => {
      const latestRead = store.ioStatistics.readOps[store.ioStatistics.readOps.length - 1]
      const latestWrite = store.ioStatistics.writeOps[store.ioStatistics.writeOps.length - 1]
      if (latestRead && latestWrite) {
        return (latestRead.value > 4500 || latestWrite.value > 2700) ? 'warning' : 'normal'
      }
      return 'normal'
    })

    // 使用 computed 生成 chartData
    const chartData = computed(() => ({
      labels: store.ioStatistics.readOps.map(entry => entry.time),
      datasets: [
        {
          label: '读操作 (IOPS)',
          data: store.ioStatistics.readOps.map(entry => entry.value),
          borderColor: '#4F46E5',
          tension: 0.4,
          yAxisID: 'y1'
        },
        {
          label: '写操作 (IOPS)',
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
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          type: 'category',
          display: true,
          title: {
            display: true,
            text: '时间'
          },
          grid: {
            display: true
          }
        },
        y1: { // 读操作的 Y 轴
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          max: 5000, // 根据实际数据调整
          title: {
            display: true,
            text: '读操作 (IOPS)'
          },
          grid: {
            display: true
          }
        },
        y2: { // 写操作的 Y 轴
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          max: 3000, // 根据实际数据调整
          title: {
            display: true,
            text: '写操作 (IOPS)'
          },
          grid: {
            display: false
          }
        }
      }
    }

    let updateInterval

    const startFetching = () => {
      store.fetchIOStatistics()
      updateInterval = setInterval(() => {
        store.fetchIOStatistics()
      }, 5000)
    }

    onMounted(() => {
      startFetching()
    })

    onUnmounted(() => {
      clearInterval(updateInterval)
    })

    return {
      ioStatus,
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.io-statistics {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-wrapper {
  flex: 1;
  position: relative;
}
.status-indicators {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
