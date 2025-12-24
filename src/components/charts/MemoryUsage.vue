<!-- src/components/charts/MemoryUsage.vue -->
<template>
  <ChartCard title="内存使用率">
    <ChartComponent type="bar" :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import ChartCard from './ChartCard.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'MemoryUsage',
  components: {
    ChartCard,
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

    const chartData = computed(() => ({
      labels: ['已用', '空闲'],
      datasets: [
        {
          label: '内存使用 (MB)',
          data: [store.memoryUsage.used, store.memoryUsage.free],
          backgroundColor: ['rgba(46, 196, 182, 0.45)', 'rgba(244, 162, 97, 0.45)'],
          borderColor: ['rgba(46, 196, 182, 0.9)', 'rgba(244, 162, 97, 0.9)'],
          borderWidth: 1
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
