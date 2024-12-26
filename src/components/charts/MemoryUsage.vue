<!-- src/components/charts/MemoryUsage.vue -->
<template>
  <div class="memory-usage">
    <h4>内存使用率</h4>
    <div class="chart-wrapper">
      <ChartComponent :type="'bar'" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'MemoryUsage',
  components: {
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()

    const chartData = computed(() => ({
      labels: ['已用', '空闲'],
      datasets: [
        {
          label: '内存使用 (MB)',
          data: [store.memoryUsage.used, store.memoryUsage.free],
          backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
          borderColor: ['rgb(54, 162, 235)', 'rgb(255, 206, 86)'],
          borderWidth: 1
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      scales: {
        y: {
          type: 'linear', // 添加类型声明
          beginAtZero: true,
          title: {
            display: true,
            text: '内存 (MB)'
          }
        },
        x: {
          type: 'category', // 添加类型声明
          title: {
            display: true,
            text: '状态'
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
      store.fetchMemoryUsage()
    })

    return {
      chartData,
      chartOptions
    }
  }
}
</script>

<style scoped>
.memory-usage {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-wrapper {
  flex: 1;
  position: relative;
}
</style>
