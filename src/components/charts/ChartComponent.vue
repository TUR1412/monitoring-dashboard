<!-- src/components/charts/ChartComponent.vue -->
<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'ChartComponent',
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter'].includes(value)
      }
    },
    data: {
      type: Object,
      required: true,
      validator(value) {
        return value && Array.isArray(value.labels) && Array.isArray(value.datasets)
      }
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const canvas = ref(null)
    let chartInstance = null
    let observer = null

    const getCssVar = (name, fallback) => {
      if (typeof window === 'undefined') return fallback
      const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      return value || fallback
    }

    const initializeChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      if (!canvas.value) return

      const ctx = canvas.value.getContext('2d')

      // 定义默认选项
      const textColor = getCssVar('--text-muted', '#9fb0c2')
      const gridColor = getCssVar('--border-color', 'rgba(255,255,255,0.08)')

      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'category',
            display: true,
            grid: {
              display: true,
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          y: {
            type: 'linear',
            display: true,
            beginAtZero: true,
            grid: {
              display: true,
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        }
      }

      // 合并用户选项与默认选项
      const mergedOptions = {
        ...defaultOptions,
        ...props.options,
        scales: {
          x: {
            ...defaultOptions.scales.x,
            ...(props.options?.scales?.x || {})
          },
          y: {
            ...defaultOptions.scales.y,
            ...(props.options?.scales?.y || {})
          }
        }
      }

      chartInstance = new Chart(ctx, {
        type: props.type,
        data: {
          labels: [...props.data.labels],
          datasets: props.data.datasets.map(dataset => ({ ...dataset }))
        },
        options: mergedOptions
      })
    }

    onMounted(() => {
      nextTick(() => {
        initializeChart()
      })

      if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(() => {
          initializeChart()
        })
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class']
        })
      }
    })

    watch(
      () => props.data,
      (newData) => {
        if (chartInstance) {
          // 仅更新图表实例的数据，不修改 props.data
          chartInstance.data.labels = [...newData.labels]
          chartInstance.data.datasets = newData.datasets.map(dataset => ({ ...dataset }))
          chartInstance.update()
        }
      },
      { deep: true }
    )

    watch(
      () => props.options,
      () => {
        initializeChart()
      },
      { deep: true }
    )

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect()
      }
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
  min-height: 300px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
