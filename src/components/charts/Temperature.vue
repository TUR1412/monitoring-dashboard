<!-- src/components/charts/Temperature.vue -->
<template>
  <div class="temperature-monitor">
    <h4>Temperature Monitor</h4>
    <div class="chart-wrapper">
      <ChartComponent
        type="line"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
    <div class="status-indicators">
      <StatusIndicator :status="temperatureStatus" label="Temperature Status" />
      <StatusIndicator :status="coolingStatus" label="Cooling Status" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import StatusIndicator from '../StatusIndicator.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'Temperature',
  components: {
    StatusIndicator,
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()

    // 使用 computed 计算 temperatureStatus 和 coolingStatus
    const temperatureStatus = computed(() => {
      const latestCpuTemp = store.cpuTemperatureHistory[store.cpuTemperatureHistory.length - 1]?.value
      const latestSystemTemp = store.systemTemperatureHistory[store.systemTemperatureHistory.length - 1]?.value
      if (latestCpuTemp > 65 || latestSystemTemp > 60) {
        return 'warning'
      } else if (latestCpuTemp > 55 || latestSystemTemp > 50) {
        return 'increased'
      }
      return 'normal'
    })

    const coolingStatus = computed(() => {
      const latestCpuTemp = store.cpuTemperatureHistory[store.cpuTemperatureHistory.length - 1]?.value
      const latestSystemTemp = store.systemTemperatureHistory[store.systemTemperatureHistory.length - 1]?.value
      if (latestCpuTemp > 65 || latestSystemTemp > 60) {
        return 'critical'
      } else if (latestCpuTemp > 55 || latestSystemTemp > 50) {
        return 'increased'
      }
      return 'optimal'
    })

    // 使用 computed 生成 chartData
    const chartData = computed(() => ({
      labels: store.cpuTemperatureHistory.map(entry => entry.time),
      datasets: [
        {
          label: 'CPU Temperature',
          data: store.cpuTemperatureHistory.map(entry => entry.value),
          borderColor: '#EF4444',
          tension: 0.4
        },
        {
          label: 'System Temperature',
          data: store.systemTemperatureHistory.map(entry => entry.value),
          borderColor: '#8B5CF6',
          tension: 0.4
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
        y: {
          beginAtZero: true,
          max: 100, // 根据温度范围调整
          title: {
            display: true,
            text: 'Temperature (°C)'
          },
          grid: {
            display: true
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw}°C`
          }
        }
      }
    }

    let updateInterval

    const startFetching = () => {
      store.fetchTemperatureData()
      updateInterval = setInterval(() => {
        store.fetchTemperatureData()
      }, 5000)
    }

    onMounted(() => {
      startFetching()
    })

    onUnmounted(() => {
      clearInterval(updateInterval)
    })

    return {
      temperatureStatus,
      coolingStatus,
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.temperature-monitor {
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
