<!-- src/components/charts/CpuUsage.vue -->
<template>
  <div class="cpu-usage">
    <h4>CPU 使用率</h4>
    <div class="chart-wrapper">
      <ChartComponent :type="'line'" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'CpuUsage',
  components: {
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()

    const chartData = computed(() => ({
      labels: store.cpuUsage.map(entry => entry.time),
      datasets: [
        {
          label: 'CPU 使用率 (%)',
          data: store.cpuUsage.map(entry => entry.usage),
          fill: false,
          borderColor: 'rgba(46, 196, 182, 0.9)',
          backgroundColor: 'rgba(46, 196, 182, 0.15)',
          tension: 0.3
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear', // 添加类型声明
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: '使用率 (%)'
          }
        },
        x: {
          type: 'category', // 添加类型声明
          title: {
            display: true,
            text: '时间'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }

    onMounted(() => {
      store.fetchCpuUsage()
    })

    return {
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.cpu-usage {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-wrapper {
  flex: 1;
  position: relative;
}
</style>
