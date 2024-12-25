<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'ChartComponent',
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        const validTypes = ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter']
        if (!validTypes.includes(value)) {
          console.warn(`Invalid chart type: "${value}". Supported types are: ${validTypes.join(', ')}`)
          return false
        }
        return true
      }
    },
    data: {
      type: Object,
      required: true,
      validator(value) {
        // 验证数据结构是否符合 Chart.js 的要求
        return value && Array.isArray(value.labels) && Array.isArray(value.datasets);
      }
    },
    options: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: true
      })
    }
  },
  setup(props) {
    const canvas = ref(null)
    let chartInstance = null

    const renderChart = () => {
      console.log('Rendering chart with type:', props.type)
      console.log('Chart data:', props.data)

      if (!props.data || !props.data.labels || !props.data.datasets) {
        console.error('Invalid chart data:', props.data)
        return
      }

      if (!props.type) {
        console.error('Chart type is undefined')
        return
      }

      if (chartInstance) {
        chartInstance.destroy()
      }

      try {
        chartInstance = new Chart(canvas.value, {
          type: props.type,
          data: props.data,
          options: props.options
        })
      } catch (error) {
        console.error('Error rendering chart:', error)
      }
    }

    onMounted(() => {
      renderChart()
    })

    watch(
      () => props.data,
      () => {
        renderChart()
      },
      { deep: true }
    )

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    })

    return {
      canvas
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
