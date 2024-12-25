<!-- src/components/analytics/TrafficAnalysis.vue -->
<template>
  <div class="traffic-analysis">
    <h2 class="text-2xl font-bold mb-4">流量分析</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="stat-card bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">总访客数</h3>
        <p class="text-3xl">{{ totalVisitors.toLocaleString() }}</p>
        <p class="text-sm text-gray-500">
          {{ visitorTrend > 0 ? '+' : '' }}{{ visitorTrend }}% 较上期
        </p>
      </div>
      <div class="stat-card bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">平均停留时间</h3>
        <p class="text-3xl">{{ averageTimeOnSite }}</p>
        <p class="text-sm text-gray-500">
          {{ timeTrend > 0 ? '+' : '' }}{{ timeTrend }}% 较上期
        </p>
      </div>
    </div>
    <div class="traffic-chart bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">流量趋势</h3>
      <!-- 传递 type 属性，例如 'line' -->
      <ChartComponent type="line" :data="chartData" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ChartComponent from '@/components/charts/ChartComponent.vue'

export default {
  name: 'TrafficAnalysis',
  components: {
    ChartComponent
  },
  setup() {
    const totalVisitors = ref(125000) // 总访客数
    const visitorTrend = ref(12.5) // 访客增长趋势
    const averageTimeOnSite = ref('8分45秒') // 平均停留时间
    const timeTrend = ref(-2.3) // 停留时间趋势

    // 模拟图表数据
    const chartData = computed(() => ({
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [
        {
          label: '每日访客数',
          data: [15000, 18000, 22000, 20000, 25000, 30000, 35000],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    }))

    onMounted(() => {
      // 这里可以添加实际的数据获取逻辑
    })

    return {
      totalVisitors,
      visitorTrend,
      averageTimeOnSite,
      timeTrend,
      chartData
    }
  }
}
</script>

<style scoped>
.traffic-analysis {
  padding: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.traffic-chart {
  margin-top: 20px;
}
</style>
