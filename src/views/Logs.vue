<!-- src/views/Logs.vue -->
<template>
  <div class="logs">
    <header class="logs-header card glow-background">
      <div>
        <h1 class="page-title">日志中心</h1>
        <p class="subtitle">全域运行事件、威胁轨迹与审计链路的一体化视图。</p>
      </div>
      <div class="header-meta">
        <span class="chip">最近事件: {{ latestLabel }}</span>
        <span class="chip">日志总量: {{ totalCount }}</span>
      </div>
    </header>

    <section class="bento-grid logs-bento">
      <div class="bento-item span-4 card">
        <p class="card-label">系统日志</p>
        <p class="card-value">{{ systemCount }}</p>
        <p class="card-meta">错误占比 {{ systemErrorRate }}%</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">安全日志</p>
        <p class="card-value">{{ securityCount }}</p>
        <p class="card-meta">高危事件 {{ criticalCount }}</p>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">审计日志</p>
        <p class="card-value">{{ auditCount }}</p>
        <p class="card-meta">高权限动作 {{ privilegedCount }}</p>
      </div>
    </section>

    <nav class="subnav logs-nav">
      <router-link to="/dashboard/logs/system" class="subnav-link">
        <span class="link-title">系统日志</span>
        <span class="link-meta">运行状态与基础事件</span>
      </router-link>
      <router-link to="/dashboard/logs/security" class="subnav-link">
        <span class="link-title">安全日志</span>
        <span class="link-meta">威胁检测与防护轨迹</span>
      </router-link>
      <router-link to="/dashboard/logs/audit" class="subnav-link">
        <span class="link-title">审计日志</span>
        <span class="link-meta">关键操作与合规留痕</span>
      </router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useTelemetryStore } from "@/stores/telemetry"
import { formatDateTime, getLatestDate } from "@/utils/logs"
import { safeStorage } from "@/utils/storage"

const store = useTelemetryStore()
const route = useRoute()
const router = useRouter()
const NAV_KEY = "monitoring-dashboard:logs:last-route"

const systemCount = computed(() => store.logs?.length || 0)
const securityCount = computed(() => store.securityLogs?.length || 0)
const auditCount = computed(() => store.auditLogs?.length || 0)
const totalCount = computed(() => systemCount.value + securityCount.value + auditCount.value)

const criticalCount = computed(
  () => store.securityLogs?.filter((log) => ["high", "critical"].includes(log.level)).length || 0
)
const privilegedCount = computed(
  () => store.auditLogs?.filter((log) => ["delete", "update"].includes(log.action)).length || 0
)
const systemErrorRate = computed(() => {
  if (!systemCount.value) return 0
  const errorCount = store.logs.filter((log) => log.level === "error").length
  return Number(((errorCount / systemCount.value) * 100).toFixed(1))
})

const latestLabel = computed(() => {
  const allLogs = [...(store.logs || []), ...(store.securityLogs || []), ...(store.auditLogs || [])]
  const latest = getLatestDate(allLogs, (item) => item.timestamp)
  return latest ? formatDateTime(latest) : "暂无记录"
})

watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/dashboard/logs/")) {
      safeStorage.set(NAV_KEY, path)
    }
  }
)

onMounted(() => {
  if (route.path === "/dashboard/logs") {
    const saved = safeStorage.get(NAV_KEY, null)
    router.replace(saved || "/dashboard/logs/system")
  }
})
</script>

<style scoped>
.logs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logs-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.chip {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: var(--text-strong);
  background: rgba(46, 196, 182, 0.18);
  border: 1px solid rgba(46, 196, 182, 0.35);
}

.logs-bento .card {
  min-height: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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
  color: var(--text-muted);
  font-size: 0.85rem;
}

.logs-nav .subnav-link {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.link-title {
  font-weight: 600;
}

.link-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
