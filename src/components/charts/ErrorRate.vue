<!-- src/components/charts/ErrorRate.vue -->
<template>
    <div class="error-rate">
      <h3>错误率</h3>
      <ChartComponent :type="'bar'" :data="chartData" />
    </div>
  </template>
  
  <script>
  import ChartComponent from './ChartComponent.vue'
  
  export default {
    name: 'ErrorRate',
    components: {
      ChartComponent
    },
    data() {
      return {
        chartData: {
          labels: ['类型 A', '类型 B', '类型 C', '类型 D'],
          datasets: [
            {
              label: '错误率',
              data: [12, 19, 3, 5],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .error-rate {
    background-color: var(--surface-1);
    padding: 15px;
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  </style>
  
