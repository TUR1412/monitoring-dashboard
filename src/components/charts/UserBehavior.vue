<!-- src/components/charts/UserBehavior.vue -->
<template>
    <div class="user-behavior">
      <h4>用户行为</h4>
      <ChartComponent :type="'doughnut'" :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue'
  import { useTelemetryStore } from '@/stores/telemetry'
  import ChartComponent from './ChartComponent.vue'
  
  export default {
    name: 'UserBehavior',
    components: {
      ChartComponent
    },
    setup() {
      const store = useTelemetryStore()
  
      const chartData = computed(() => ({
        labels: store.userBehavior.labels,
        datasets: [
          {
            label: '用户行为',
            data: store.userBehavior.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 206, 86)',
              'rgb(75, 192, 192)'
            ],
            borderWidth: 1
          }
        ]
      }))
  
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
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
        store.fetchUserBehavior()
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
  .user-behavior {
    display: flex;
    flex-direction: column;
    height: 100%; /* 确保图表填满容器 */
  }
  </style>
  
