<!-- src/components/charts/DiskUsage.vue -->
<template>
  <ChartCard title="磁盘使用情况">
    <ChartComponent type="pie" :data="chartData" :options="chartOptions" />
  </ChartCard>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import ChartCard from './ChartCard.vue'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'DiskUsage',
  components: {
    ChartCard,
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

    const chartData = computed(() => ({
      labels: ['磁盘1 已用', '磁盘2 已用', '磁盘3 已用'],
      datasets: [
        {
          label: '磁盘使用 (GB)',
          data: [store.diskUsage.usedDisk1, store.diskUsage.usedDisk2, store.diskUsage.usedDisk3],
          backgroundColor: [
            'rgba(231, 111, 81, 0.5)',
            'rgba(46, 196, 182, 0.5)',
            'rgba(244, 162, 97, 0.5)'
          ],
          borderColor: [
            'rgba(231, 111, 81, 0.9)',
            'rgba(46, 196, 182, 0.9)',
            'rgba(244, 162, 97, 0.9)'
          ],
          borderWidth: 1
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }

    onMounted(() => {
      store.fetchDiskUsage()
    })

    return {
      chartData,
      chartOptions
    }
  }
}
</script>
