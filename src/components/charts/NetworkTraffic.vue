<template>
  <div class="network-traffic">
    <h4>网络流量</h4>
    <ChartComponent :type="'line'" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'NetworkTraffic',
  components: {
    ChartComponent
  },
  setup() {
    const store = useMonitorStore()

    const chartData = computed(() => ({
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      datasets: [
        {
          label: '入站 (Mbps)',
          data: store.networkTraffic.inbound,
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: '出站 (Mbps)',
          data: store.networkTraffic.outbound,
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: '总流量 (Mbps)',
          data: store.networkTraffic.total,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '流量 (Mbps)'
          }
        },
        x: {
          title: {
            display: true,
            text: '时间'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false
        }
      }
    }

    onMounted(() => {
      store.fetchNetworkTraffic()
    })

    return {
      chartData,
      chartOptions,
      store
    }
  }
}
</script>

<style scoped>
.network-traffic {
  display: flex;
  flex-direction: column;
  height: 100%; /* 确保图表填满容器 */
}
</style>
