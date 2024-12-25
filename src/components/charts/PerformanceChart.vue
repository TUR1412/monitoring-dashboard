<template>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import { Chart } from 'chart.js'
  
  const props = defineProps({
    data: Object
  })
  
  const chartCanvas = ref(null)
  let chart = null
  
  const initializeChart = (data) => {
    if (chart) {
      chart.destroy() // 销毁旧的图表实例
    }
  
    try {
      chart = new Chart(chartCanvas.value, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Performance Chart',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '时间',
              }
            },
            y: {
              title: {
                display: true,
                text: '数值',
              },
              ticks: {
                beginAtZero: true
              }
            }
          }
        }
      })
    } catch (error) {
      console.error('Chart.js initialization failed:', error)
    }
  }
  
  watch(() => props.data, (newData) => {
    if (newData) {
      initializeChart(newData)
    }
  }, { immediate: true })
  
  onBeforeUnmount(() => {
    if (chart) {
      chart.destroy() // 销毁图表实例，避免内存泄漏
    }
  })
  
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px;
  }
  </style>
  