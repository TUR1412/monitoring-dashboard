<!-- src/components/analytics/TrafficAnalysis.vue -->
<template>
  <section class="traffic-analysis">
    <header class="analysis-header">
      <div>
        <h2 class="section-title">流量分析</h2>
        <p class="text-muted">多渠道动线洞察、旅程质量与转化信号统一视图。</p>
      </div>
      <div class="header-actions">
        <BaseButton size="small" type="info" @click="exportTableCsv">导出 CSV</BaseButton>
        <BaseButton size="small" type="default" @click="exportTableJson">导出 JSON</BaseButton>
      </div>
    </header>

    <div class="card filter-panel">
      <div class="filter-grid">
        <div class="filter-item">
          <label>时间范围</label>
          <select v-model="filters.range">
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
        <div class="filter-item">
          <label>地区聚焦</label>
          <select v-model="filters.region">
            <option value="global">全球</option>
            <option value="apac">亚太</option>
            <option value="emea">欧洲中东非</option>
            <option value="americas">美洲</option>
          </select>
        </div>
        <div class="filter-item">
          <label>渠道分组</label>
          <select v-model="filters.channel">
            <option value="all">全部渠道</option>
            <option value="organic">自然流量</option>
            <option value="paid">付费推广</option>
            <option value="partner">合作伙伴</option>
          </select>
        </div>
        <div class="filter-item">
          <label>设备分层</label>
          <select v-model="filters.device">
            <option value="all">全设备</option>
            <option value="mobile">移动端</option>
            <option value="desktop">桌面端</option>
            <option value="tablet">平板</option>
          </select>
        </div>
        <div class="filter-item span-2">
          <label>页面搜索</label>
          <BaseInput v-model="filters.query" placeholder="搜索页面或路径..." />
        </div>
        <div class="filter-item">
          <label>排序维度</label>
          <select v-model="filters.sortBy">
            <option value="sessions">会话数</option>
            <option value="conversion">转化率</option>
            <option value="bounce">跳出率</option>
          </select>
        </div>
      </div>
    </div>

    <section class="bento-grid">
      <div class="bento-item span-4 card">
        <p class="card-label">活跃访客</p>
        <p class="card-value">{{ totalSessions.toLocaleString() }}</p>
        <p class="card-meta">独立访客 {{ uniqueVisitors.toLocaleString() }}</p>
        <span class="pill up">+{{ growthRate }}%</span>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">平均停留</p>
        <p class="card-value">{{ avgDuration }}</p>
        <p class="card-meta">页面深度 {{ avgDepth }} 页</p>
        <span class="pill">稳定</span>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">转化驱动</p>
        <p class="card-value">{{ conversionRate }}%</p>
        <p class="card-meta">高意向占比 {{ highIntent }}%</p>
        <span class="pill up">+{{ conversionLift }}%</span>
      </div>

      <div class="bento-item span-8 card traffic-chart">
        <div class="chart-header">
          <h3 class="section-subtitle">流量趋势</h3>
          <span class="chart-meta">区间: {{ rangeLabel }}</span>
        </div>
        <ChartComponent type="line" :data="chartData" />
      </div>

      <div class="bento-item span-4 card channel-card">
        <h3 class="section-subtitle">渠道结构</h3>
        <div class="channel-list">
          <div v-for="channel in channelMix" :key="channel.name" class="channel-row">
            <div class="channel-info">
              <span class="channel-name">{{ channel.name }}</span>
              <span class="channel-meta">{{ channel.delta }}</span>
            </div>
            <div class="channel-bar">
              <span :style="{ width: channel.share + '%' }"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="bento-item span-6 card">
        <h3 class="section-subtitle">高价值页面</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>页面</th>
                <th>会话数</th>
                <th>跳出率</th>
                <th>转化</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="page in filteredPages" :key="page.page">
                <td>{{ page.page }}</td>
                <td>{{ page.sessions.toLocaleString() }}</td>
                <td>{{ page.bounce }}%</td>
                <td>
                  <span class="pill small" :class="page.trend">{{ page.conversion }}%</span>
                </td>
              </tr>
              <tr v-if="filteredPages.length === 0">
                <td colspan="4" class="empty-state">暂无匹配页面</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bento-item span-6 card">
        <h3 class="section-subtitle">旅程信号</h3>
        <ul class="signal-list">
          <li v-for="signal in journeySignals" :key="signal.title" class="signal-item">
            <div>
              <p class="signal-title">{{ signal.title }}</p>
              <p class="signal-meta">{{ signal.detail }}</p>
            </div>
            <span class="pill" :class="signal.status">{{ signal.statusLabel }}</span>
          </li>
        </ul>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from "vue"
import BaseButton from "@/components/base/BaseButton.vue"
import BaseInput from "@/components/base/BaseInput.vue"
import ChartComponent from "@/components/charts/ChartComponent.vue"
import { exportCsv, exportJson } from "@/utils/logs"

const STORAGE_KEY = "monitoring-dashboard:analytics:traffic-filters"
const isBrowser = typeof window !== "undefined"

const defaultFilters = {
  range: "7d",
  region: "global",
  channel: "all",
  device: "all",
  sortBy: "sessions",
  query: ""
}

const filters = reactive({ ...defaultFilters })

const restoreFilters = () => {
  if (!isBrowser) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    Object.assign(filters, { ...defaultFilters, ...saved })
  } catch (error) {
    // ignore restore error
  }
}

const persistFilters = () => {
  if (!isBrowser) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
}

restoreFilters()

watch(
  () => ({ ...filters }),
  () => {
    persistFilters()
  },
  { deep: true }
)

const pageRows = [
  { page: "/overview", sessions: 24500, bounce: 22.4, avgTime: "6m 42s", conversion: 5.8, trend: "up" },
  { page: "/security/response", sessions: 19800, bounce: 18.1, avgTime: "7m 12s", conversion: 4.9, trend: "up" },
  { page: "/analytics/flow", sessions: 17200, bounce: 24.6, avgTime: "5m 03s", conversion: 3.7, trend: "stable" },
  { page: "/alerts/playbooks", sessions: 15800, bounce: 20.9, avgTime: "6m 18s", conversion: 4.1, trend: "up" },
  { page: "/status/health", sessions: 12400, bounce: 28.4, avgTime: "4m 22s", conversion: 2.9, trend: "down" }
]

const totalSessions = computed(() => pageRows.reduce((sum, row) => sum + row.sessions, 0))
const uniqueVisitors = computed(() => Math.round(totalSessions.value * 0.72))
const growthRate = computed(() => 12.4)
const avgDuration = computed(() => "6分12秒")
const avgDepth = computed(() => 5.6)
const conversionRate = computed(() => 4.3)
const highIntent = computed(() => 38)
const conversionLift = computed(() => 6.1)

const channelMix = [
  { name: "自然搜索", share: 38, delta: "+4.2%" },
  { name: "产品推荐", share: 24, delta: "+2.1%" },
  { name: "伙伴引流", share: 19, delta: "+1.4%" },
  { name: "付费投放", share: 12, delta: "-0.6%" },
  { name: "私域社群", share: 7, delta: "+0.9%" }
]

const journeySignals = [
  { title: "高意向路径", detail: "安全中心 → 合规评分 → 报告下载", status: "up", statusLabel: "增长" },
  { title: "流失风险", detail: "性能分析页面停留下降 8%", status: "down", statusLabel: "关注" },
  { title: "实验流量", detail: "新引导路径转化提升 5%", status: "stable", statusLabel: "稳定" }
]

const rangeLabel = computed(() => {
  const map = { "7d": "7 天", "30d": "30 天", "90d": "90 天" }
  return map[filters.range] || "7 天"
})

const chartData = computed(() => {
  const rangeMap = {
    "7d": {
      labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      data: [15000, 18000, 22000, 20000, 25000, 30000, 35000]
    },
    "30d": {
      labels: ["第1周", "第2周", "第3周", "第4周"],
      data: [82000, 86000, 91000, 96000]
    },
    "90d": {
      labels: ["第1月", "第2月", "第3月"],
      data: [260000, 288000, 312000]
    }
  }
  const range = rangeMap[filters.range] || rangeMap["7d"]
  return {
    labels: range.labels,
    datasets: [
      {
        label: "访问量",
        data: range.data,
        backgroundColor: "rgba(46, 196, 182, 0.35)",
        borderColor: "rgba(46, 196, 182, 0.9)",
        borderWidth: 1,
        tension: 0.35
      }
    ]
  }
})

const filteredPages = computed(() => {
  const query = filters.query.trim().toLowerCase()
  const sorted = [...pageRows].filter((row) => {
    if (!query) return true
    return row.page.toLowerCase().includes(query)
  })
  if (filters.sortBy === "conversion") {
    sorted.sort((a, b) => b.conversion - a.conversion)
  } else if (filters.sortBy === "bounce") {
    sorted.sort((a, b) => a.bounce - b.bounce)
  } else {
    sorted.sort((a, b) => b.sessions - a.sessions)
  }
  return sorted
})

const exportColumns = [
  { key: "page", label: "页面" },
  { key: "sessions", label: "会话数" },
  { key: "bounce", label: "跳出率" },
  { key: "avgTime", label: "平均停留" },
  { key: "conversion", label: "转化率" },
  { key: "trend", label: "趋势" }
]

const exportTableCsv = () => {
  exportCsv(filteredPages.value, exportColumns, "traffic-pages")
}

const exportTableJson = () => {
  exportJson(filteredPages.value, "traffic-pages")
}
</script>

<style scoped>
.traffic-analysis {
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.filter-item.span-2 {
  grid-column: span 2;
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

.pill.small {
  font-size: 0.65rem;
}

.traffic-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.channel-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.channel-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.channel-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.channel-name {
  color: var(--text-strong);
}

.channel-meta {
  color: var(--text-muted);
}

.channel-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.channel-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, rgba(46, 196, 182, 0.8), rgba(244, 162, 97, 0.8));
}

.table-wrap {
  overflow-x: auto;
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

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 1rem 0;
}
</style>
