<!-- src/views/Analytics.vue -->
<template>
  <div class="analytics">
    <header class="analytics-header card glow-background">
      <div class="header-copy">
        <p class="eyebrow">Quantum Analytics</p>
        <h1 class="page-title title-gradient">数据分析</h1>
        <p class="subtitle">实时洞察、趋势推演与业务脉搏同频对齐。</p>
        <div class="meta-row">
          <span class="chip">当前视角: {{ activeLabel }}</span>
          <span class="chip">最近同步: {{ lastSyncLabel }}</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="control-group">
          <label>分析范围</label>
          <select v-model="timeRange">
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
        <div class="control-group">
          <label>分析分层</label>
          <select v-model="segment">
            <option value="all">全量视角</option>
            <option value="enterprise">企业客户</option>
            <option value="growth">增长实验</option>
            <option value="retention">留存追踪</option>
          </select>
        </div>
        <BaseButton size="small" type="primary" @click="refreshSnapshot">
          刷新快照
        </BaseButton>
      </div>
    </header>

    <section class="bento-grid analytics-bento">
      <div class="bento-item span-4 card">
        <p class="card-label">实时会话</p>
        <p class="card-value">128,240</p>
        <p class="card-meta">峰值集中在 10:00 - 13:00</p>
        <span class="pill up">+12.4%</span>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">留存健康度</p>
        <p class="card-value">93.8%</p>
        <p class="card-meta">核心功能回访率持续走高</p>
        <span class="pill up">+4.1%</span>
      </div>
      <div class="bento-item span-4 card">
        <p class="card-label">增长引擎</p>
        <p class="card-value">+28,900</p>
        <p class="card-meta">新增转化集中于移动端</p>
        <span class="pill">稳定</span>
      </div>
    </section>

    <nav class="subnav analytics-subnav">
      <router-link
        v-for="route in navRoutes"
        :key="route.path"
        :to="route.path"
        v-slot="{ isActive }"
        custom
      >
        <a class="subnav-link" :class="{ active: isActive }">
          <span class="link-title">{{ route.name }}</span>
          <span class="link-meta">{{ route.description }}</span>
        </a>
      </router-link>
    </nav>

    <div class="analytics-content">
      <Suspense>
        <template #default>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </template>
        <template #fallback>
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import BaseButton from "@/components/base/BaseButton.vue"

const isBrowser = typeof window !== "undefined"
const route = useRoute()
const router = useRouter()

const STORAGE_KEY = "monitoring-dashboard:analytics:preferences"
const NAV_KEY = "monitoring-dashboard:analytics:last-route"

const timeRange = ref("30d")
const segment = ref("all")
const lastSync = ref(new Date())

const restorePrefs = () => {
  if (!isBrowser) return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const prefs = JSON.parse(raw)
    if (prefs?.timeRange) timeRange.value = prefs.timeRange
    if (prefs?.segment) segment.value = prefs.segment
    if (prefs?.lastSync) lastSync.value = new Date(prefs.lastSync)
  } catch (error) {
    // ignore restore errors
  }
}

const persistPrefs = () => {
  if (!isBrowser) return
  const payload = {
    timeRange: timeRange.value,
    segment: segment.value,
    lastSync: lastSync.value.toISOString()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const navRoutes = [
  {
    path: "/dashboard/analytics/traffic",
    name: "流量分析",
    description: "渠道动线与用户旅程"
  },
  {
    path: "/dashboard/analytics/performance",
    name: "性能分析",
    description: "延迟、稳定性与资源健康"
  },
  {
    path: "/dashboard/analytics/reports",
    name: "报告生成",
    description: "自动化汇报与归档"
  }
]

const activeLabel = computed(() => {
  const match = navRoutes.find((item) => route.path.startsWith(item.path))
  return match?.name || "总览"
})

const lastSyncLabel = computed(() => {
  return lastSync.value.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  })
})

const refreshSnapshot = () => {
  lastSync.value = new Date()
  persistPrefs()
}

watch([timeRange, segment], () => {
  persistPrefs()
})

watch(
  () => route.path,
  (path) => {
    if (!isBrowser) return
    if (path.startsWith("/dashboard/analytics/")) {
      localStorage.setItem(NAV_KEY, path)
    }
  }
)

onMounted(() => {
  restorePrefs()
  if (!isBrowser) return
  if (route.path === "/dashboard/analytics") {
    const saved = localStorage.getItem(NAV_KEY)
    router.replace(saved || "/dashboard/analytics/traffic")
  }
})
</script>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analytics-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
}

.header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.meta-row {
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

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 160px;
}

.control-group label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.analytics-bento .card {
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

.analytics-subnav {
  align-items: stretch;
}

.analytics-subnav .subnav-link {
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
