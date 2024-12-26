// src/components/charts/BaseCharts.ts
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// 注册必要的 Chart.js 模块
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// 其他 Chart 配置或辅助函数
export const createBaseChart = (ctx: CanvasRenderingContext2D, config: any) => {
  return new Chart(ctx, config)
}
