<!-- src/components/charts/ChartComponent.vue -->
<template>
  <div class="chart-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

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
    let themeObserver = null

    const toRgba = (color, alpha = 0.18) => {
      if (!color) return color
      if (color.startsWith('#')) {
        const hex = color.replace('#', '')
        const value = hex.length === 3
          ? hex.split('').map(char => char + char).join('')
          : hex
        const intVal = parseInt(value, 16)
        const r = (intVal >> 16) & 255
        const g = (intVal >> 8) & 255
        const b = intVal & 255
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
      if (color.startsWith('rgb(')) {
        return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
      }
      return color
    }

    const getThemeTokens = () => {
      const styles = getComputedStyle(document.documentElement)
      const accent = styles.getPropertyValue('--accent-0').trim() || '#22d3ee'
      const accentAlt = styles.getPropertyValue('--accent-3').trim() || '#fb7185'
      const accentWarm = styles.getPropertyValue('--accent-2').trim() || '#f59e0b'
      const accentCool = styles.getPropertyValue('--info').trim() || '#38bdf8'
      const textColor = styles.getPropertyValue('--text-2').trim() || '#94a3b8'
      const headingColor = styles.getPropertyValue('--text-1').trim() || '#cbd5e1'
      const gridColor = styles.getPropertyValue('--border').trim() || 'rgba(148, 163, 184, 0.2)'
      const borderStrong = styles.getPropertyValue('--border-strong').trim() || 'rgba(148, 163, 184, 0.35)'
      const tooltipBg = styles.getPropertyValue('--surface-2').trim() || 'rgba(15, 23, 42, 0.9)'
      return {
        palette: [accent, accentAlt, accentWarm, accentCool],
        textColor,
        headingColor,
        gridColor,
        borderStrong,
        tooltipBg
      }
    }

    const normalizeDatasets = (datasets) => {
      const { palette } = getThemeTokens()
      return datasets.map((dataset, index) => {
        const fallbackColor = palette[index % palette.length]
        const baseColor = dataset.borderColor || fallbackColor
        return {
          borderColor: dataset.borderColor ?? baseColor,
          backgroundColor: dataset.backgroundColor ?? toRgba(baseColor, 0.18),
          pointBackgroundColor: dataset.pointBackgroundColor ?? baseColor,
          pointBorderColor: dataset.pointBorderColor ?? baseColor,
          borderWidth: dataset.borderWidth ?? 2,
          pointRadius: dataset.pointRadius ?? 3,
          pointHoverRadius: dataset.pointHoverRadius ?? 5,
          tension: dataset.tension ?? 0.3,
          ...dataset
        }
      })
    }

    const initializeChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
      }

      if (!canvas.value) return

      const ctx = canvas.value.getContext('2d')

      const { textColor, gridColor, headingColor, borderStrong, tooltipBg } = getThemeTokens()
      const reducedMotion = typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // 定义默认选项
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        color: textColor,
        animation: {
          duration: reducedMotion ? 0 : 800
        },
        plugins: {
          legend: {
            labels: {
              color: headingColor,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: tooltipBg,
            borderColor: borderStrong,
            borderWidth: 1,
            titleColor: headingColor,
            bodyColor: textColor,
            displayColors: false,
            padding: 10
          }
        },
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
          datasets: normalizeDatasets(props.data.datasets)
        },
        options: mergedOptions
      })
    }

    onMounted(() => {
      nextTick(() => {
        initializeChart()
        if (typeof MutationObserver !== 'undefined') {
          themeObserver = new MutationObserver(() => initializeChart())
          themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
          })
        }
      })
    })

    watch(
      () => props.data,
      (newData) => {
        if (chartInstance) {
          // 仅更新图表实例的数据，不修改 props.data
          chartInstance.data.labels = [...newData.labels]
          chartInstance.data.datasets = normalizeDatasets(newData.datasets)
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
      if (chartInstance) {
        chartInstance.destroy()
      }
      if (themeObserver) {
        themeObserver.disconnect()
        themeObserver = null
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
