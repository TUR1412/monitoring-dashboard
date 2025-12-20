<template>
  <section class="performance-analysis">
    <header class="analysis-header">
      <div>
        <h2 class="section-title">性能分析</h2>
        <p class="text-muted">延迟、稳定性与容量一体化把控。</p>
      </div>
      <div class="header-actions">
        <BaseButton size="small" type="info" @click="exportSnapshot">导出快照</BaseButton>
        <BaseButton size="small" type="primary" @click="acknowledgeBaseline">同步基线</BaseButton>
      </div>
    </header>

    <ErrorDisplay v-if="error" :message="error" @retry="loadData" />

    <template v-else>
      <div class="card filter-panel">
        <div class="filter-grid">
          <div class="filter-item">
            <label>环境</label>
            <select v-model="controls.environment">
              <option value="production">生产环境</option>
              <option value="staging">预发环境</option>
              <option value="testing">测试环境</option>
            </select>
          </div>
          <div class="filter-item">
            <label>服务等级</label>
            <select v-model="controls.tier">
              <option value="critical">核心服务</option>
              <option value="standard">标准服务</option>
              <option value="support">支持服务</option>
            </select>
          </div>
          <div class="filter-item">
            <label>分析窗口</label>
            <select v-model="controls.window">
              <option value="24h">24 小时</option>
              <option value="7d">7 天</option>
              <option value="30d">30 天</option>
            </select>
          </div>
          <div class="filter-item">
            <label>SLO 目标(%)</label>
            <input v-model.number="controls.slo" type="number" min="95" max="100" step="0.1" />
          </div>
          <div class="filter-item">
            <label>Apdex 目标</label>
            <input v-model.number="controls.apdex" type="number" min="0.7" max="1" step="0.01" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.id"
          :title="metric.title"
          :value="metric.value"
          :unit="metric.unit"
          :trend="metric.trend"
        />
      </div>

      <section class="bento-grid">
        <div class="bento-item span-4 card">
          <p class="card-label">SLO 达成率</p>
          <p class="card-value">{{ sloScore }}%</p>
          <p class="card-meta">误差预算剩余 {{ errorBudget }}%</p>
          <div class="progress-track">
            <span :style="{ width: sloScore + '%' }"></span>
          </div>
          <span class="pill" :class="sloStatus">{{ sloStatusLabel }}</span>
        </div>
        <div class="bento-item span-8 card">
          <div class="chart-header">
            <h3 class="section-subtitle">性能指标趋势</h3>
            <span class="chart-meta">窗口: {{ windowLabel }}</span>
          </div>
          <PerformanceChart type="line" :data="chartData" />
        </div>
        <div class="bento-item span-4 card">
          <h3 class="section-subtitle">风险预警</h3>
          <ul class="signal-list">
            <li v-for="signal in insights" :key="signal.title" class="signal-item">
              <div>
                <p class="signal-title">{{ signal.title }}</p>
                <p class="signal-meta">{{ signal.detail }}</p>
              </div>
              <span class="pill" :class="signal.status">{{ signal.statusLabel }}</span>
            </li>
          </ul>
        </div>
        <div class="bento-item span-4 card">
          <h3 class="section-subtitle">容量余量</h3>
          <div class="capacity-grid">
            <div class="capacity-item">
              <p>CPU</p>
              <span>{{ capacity.cpu }}%</span>
            </div>
            <div class="capacity-item">
              <p>内存</p>
              <span>{{ capacity.memory }}%</span>
            </div>
            <div class="capacity-item">
              <p>带宽</p>
              <span>{{ capacity.network }}%</span>
            </div>
          </div>
        </div>
        <div class="bento-item span-4 card">
          <h3 class="section-subtitle">基线追踪</h3>
          <p class="card-meta">最后同步时间</p>
          <p class="card-value">{{ baselineLabel }}</p>
          <p class="card-meta">追踪 {{ controls.window }} 窗口指标</p>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue"
import { storeToRefs } from "pinia"
import { usePerformanceStore } from "@/stores/performance"
import PerformanceChart from "@/components/charts/PerformanceChart.vue"
import MetricCard from "@/components/common/MetricCard.vue"
import ErrorDisplay from "@/components/common/ErrorDisplay.vue"
import BaseButton from "@/components/base/BaseButton.vue"
import { exportCsv, exportJson } from "@/utils/logs"

const store = usePerformanceStore()
const error = ref(null)

const { currentMetrics, chartLabels, responseTimeData, errorRateData, resourceUsageData } =
  storeToRefs(store)

const STORAGE_KEY = "monitoring-dashboard:analytics:performance-controls"
const isBrowser = typeof window !== "undefined"

const controls = reactive({
  environment: "production",
  tier: "critical",
  window: "30d",
  slo: 99.9,
  apdex: 0.92
})

const baseline = ref(new Date())

const restoreControls = () => {
  if (!isBrowser) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    Object.assign(controls, saved)
    if (saved?.baseline) baseline.value = new Date(saved.baseline)
  } catch (error) {
    // ignore restore error
  }
}

const persistControls = () => {
  if (!isBrowser) return
  const payload = { ...controls, baseline: baseline.value.toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

restoreControls()

watch(
  () => ({ ...controls }),
  () => {
    persistControls()
  },
  { deep: true }
)

const resolveTrend = (value = 0) => {
  if (value > 0) return "up"
  if (value < 0) return "down"
  return "stable"
}

const metrics = computed(() => {
  const current = currentMetrics.value || {}
  return [
    {
      id: "response",
      title: "响应时间",
      value: current.responseTime ?? 0,
      unit: "ms",
      trend: resolveTrend(current.responseTrend ?? 0)
    },
    {
      id: "error",
      title: "错误率",
      value: current.errorRate ?? 0,
      unit: "%",
      trend: resolveTrend(current.errorTrend ?? 0)
    },
    {
      id: "resource",
      title: "资源使用率",
      value: current.resourceUsage ?? 0,
      unit: "%",
      trend: resolveTrend(current.resourceTrend ?? 0)
    }
  ]
})

const chartData = computed(() => {
  const labels = chartLabels.value || []
  const responseData = responseTimeData.value || []
  const errorRate = errorRateData.value || []
  const resourceUsage = resourceUsageData.value || []

  return {
    labels,
    datasets: [
      {
        label: "响应时间 (ms)",
        data: responseData,
        backgroundColor: "rgba(231, 111, 81, 0.3)",
        borderColor: "rgba(231, 111, 81, 0.9)",
        borderWidth: 1,
        tension: 0.35
      },
      {
        label: "错误率 (%)",
        data: errorRate,
        backgroundColor: "rgba(46, 196, 182, 0.35)",
        borderColor: "rgba(46, 196, 182, 0.9)",
        borderWidth: 1,
        tension: 0.35
      },
      {
        label: "资源使用率 (%)",
        data: resourceUsage,
        backgroundColor: "rgba(244, 162, 97, 0.3)",
        borderColor: "rgba(244, 162, 97, 0.9)",
        borderWidth: 1,
        tension: 0.35
      }
    ]
  }
})

const sloScore = computed(() => {
  const errorRate = currentMetrics.value?.errorRate ?? 0
  const score = Math.max(0, Math.min(100, 100 - errorRate))
  return Number(score.toFixed(2))
})

const errorBudget = computed(() => Math.max(0, Number((100 - sloScore.value).toFixed(2))))

const sloStatus = computed(() => {
  if (sloScore.value >= controls.slo) return "up"
  if (sloScore.value >= controls.slo - 1) return "stable"
  return "down"
})

const sloStatusLabel = computed(() => {
  if (sloStatus.value === "up") return "健康"
  if (sloStatus.value === "stable") return "观察"
  return "风险"
})

const windowLabel = computed(() => {
  const map = { "24h": "24 小时", "7d": "7 天", "30d": "30 天" }
  return map[controls.window] || "30 天"
})

const insights = computed(() => [
  {
    title: "错误率趋势",
    detail: "近 6 小时波动 +0.4%",
    status: errorRateData.value?.slice(-1)[0] > 2 ? "down" : "stable",
    statusLabel: errorRateData.value?.slice(-1)[0] > 2 ? "关注" : "稳定"
  },
  {
    title: "高延迟节点",
    detail: "API-Gateway 超过 140ms",
    status: "down",
    statusLabel: "告警"
  },
  {
    title: "资源余量",
    detail: "CPU/内存维持安全阈值",
    status: "up",
    statusLabel: "良好"
  }
])

const capacity = computed(() => ({
  cpu: 38,
  memory: 42,
  network: 28
}))

const baselineLabel = computed(() =>
  baseline.value.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
)

const exportSnapshot = () => {
  const rows = metrics.value.map((metric) => ({
    metric: metric.title,
    value: metric.value,
    unit: metric.unit,
    trend: metric.trend
  }))
  exportCsv(rows, [
    { key: "metric", label: "指标" },
    { key: "value", label: "数值" },
    { key: "unit", label: "单位" },
    { key: "trend", label: "趋势" }
  ], "performance-metrics")
  exportJson(
    {
      controls,
      metrics: rows,
      updatedAt: new Date().toISOString()
    },
    "performance-snapshot"
  )
}

const acknowledgeBaseline = () => {
  baseline.value = new Date()
  persistControls()
}

const loadData = async () => {
  try {
    await store.fetchPerformanceData()
  } catch (e) {
    error.value = "加载性能数据失败，请重试"
    console.error("Performance data loading error:", e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.performance-analysis {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analysis-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.text-muted {
  color: var(--text-muted);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.filter-panel {
  padding: 1.5rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-item label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.card-label {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.card-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-strong);
}

.card-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.progress-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin: 0.75rem 0;
}

.progress-track span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba(46, 196, 182, 0.9), rgba(6, 214, 160, 0.8));
}

.pill {
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-strong);
}

.pill.up {
  border-color: rgba(6, 214, 160, 0.5);
  background: rgba(6, 214, 160, 0.15);
}

.pill.down {
  border-color: rgba(231, 111, 81, 0.6);
  background: rgba(231, 111, 81, 0.15);
}

.pill.stable {
  border-color: rgba(255, 255, 255, 0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.chart-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.signal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.signal-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background: rgba(12, 17, 24, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.signal-title {
  font-weight: 600;
  color: var(--text-strong);
  margin: 0;
}

.signal-meta {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.capacity-grid {
  display: grid;
  gap: 0.75rem;
}

.capacity-item {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-md);
  background: rgba(12, 17, 24, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.capacity-item span {
  color: var(--text-strong);
}
</style>
