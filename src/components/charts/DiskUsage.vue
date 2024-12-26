<!-- src/components/charts/DiskUsage.vue -->
<template>
  <div class="disk-usage">
    <h4>磁盘使用情况</h4>
    <div class="chart-wrapper">
      <ChartComponent :type="'pie'" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'DiskUsage',
  components: {
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()

    const chartData = computed(() => ({
      labels: ['磁盘1 已用', '磁盘2 已用', '磁盘3 已用'],
      datasets: [
        {
          label: '磁盘使用 (GB)',
          data: [store.diskUsage.usedDisk1, store.diskUsage.usedDisk2, store.diskUsage.usedDisk3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)'
          ],
          borderWidth: 1
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
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

<style scoped>
.disk-usage {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chart-wrapper {
  flex: 1;
  position: relative;
}
</style>
