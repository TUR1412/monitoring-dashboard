<!-- src/components/charts/Temperature.vue -->
<template>
  <ChartCard title="温度监控">
    <ChartComponent type="line" :data="chartData" :options="chartOptions" />
    <template #footer>
      <div class="status-indicators">
        <StatusIndicator :status="temperatureStatus" label="温度状态" />
        <StatusIndicator :status="coolingStatus" label="散热状态" />
      </div>
    </template>
  </ChartCard>
</template>

<script>
import { computed } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import { usePolling } from '@/composables/usePolling'
import StatusIndicator from '../StatusIndicator.vue'
import ChartCard from './ChartCard.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'Temperature',
  components: {
    StatusIndicator,
    ChartCard,
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

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
          label: 'CPU 温度',
          data: store.cpuTemperatureHistory.map(entry => entry.value),
          borderColor: 'rgba(231, 111, 81, 0.9)',
          tension: 0.4
        },
        {
          label: '系统温度',
          data: store.systemTemperatureHistory.map(entry => entry.value),
          borderColor: 'rgba(46, 196, 182, 0.9)',
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
            text: '时间'
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
            text: '温度 (°C)'
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

    usePolling(() => store.fetchTemperatureData(), 5000)

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
.status-indicators {
  display: flex;
  gap: 1rem;
}
</style>
