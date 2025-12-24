<!-- src/components/charts/NetworkTraffic.vue -->
<template>
  <div class="network-traffic">
    <h4>网络流量</h4>
    <ChartComponent :type="'line'" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import ChartComponent from './ChartComponent.vue'

export default {
  name: 'NetworkTraffic',
  components: {
    ChartComponent
  },
  setup() {
    const store = useTelemetryStore()

    const chartData = computed(() => ({
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      datasets: [
        {
          label: '入站 (Mbps)',
          data: store.networkTraffic.inbound,
          fill: false,
          borderColor: 'rgba(46, 196, 182, 0.9)',
          tension: 0.3
        },
        {
          label: '出站 (Mbps)',
          data: store.networkTraffic.outbound,
          fill: false,
          borderColor: 'rgba(231, 111, 81, 0.9)',
          tension: 0.3
        },
        {
          label: '总流量 (Mbps)',
          data: store.networkTraffic.total,
          fill: false,
          borderColor: 'rgba(244, 162, 97, 0.9)',
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
          title: {
            display: true,
            text: '流量 (Mbps)'
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

