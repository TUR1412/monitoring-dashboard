<!-- src/components/charts/UserBehaviorAnalysis.vue -->
<template>
    <div class="user-behavior-analysis">
      <h3>用户行为分析</h3>
      <div v-if="store.loading">加载中...</div>
      <ChartComponent v-else :type="'pie'" :data="chartData" />
      <div v-if="store.error" class="error">{{ store.error }}</div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useTelemetryStore } from '@/stores/telemetry'
  import ChartComponent from './ChartComponent.vue'
  
  export default {
    name: 'UserBehaviorAnalysis',
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
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }
        ]
      }))
  
      return {
        chartData,
        store
      }
    }
  }
  </script>
  
  <style scoped>
  .user-behavior-analysis {
    background-color: var(--surface-1);
    padding: 15px;
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  
  .error {
    color: #fecaca;
    margin-top: 10px;
  }
  </style>
  
