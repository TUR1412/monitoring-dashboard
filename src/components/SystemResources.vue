<!-- src/components/SystemResources.vue -->
<template>
  <div class="system-resources surface-card">
    <div class="section-header">
      <div>
        <div class="section-title">系统资源</div>
        <div class="section-subtitle">核心节点与资源健康度</div>
      </div>
      <span class="pill">实时更新</span>
    </div>

    <div v-if="isOverview" class="overview-grid">
      <router-link
        v-for="card in overviewCards"
        :key="card.title"
        :to="card.to"
        class="overview-card surface-glass"
      >
        <div class="overview-title">{{ card.title }}</div>
        <div class="overview-value">{{ card.value }}</div>
        <div class="overview-meta">{{ card.meta }}</div>
      </router-link>
    </div>

    <router-view />
    <div v-if="store.error" class="error">{{ store.error }}</div>
  </div>
</template>

<script>
import { useMonitorStore } from '@/stores/monitorStore'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'SystemResources',
  setup() {
    const store = useMonitorStore()
    const route = useRoute()

    const latestCpu = computed(() => store.cpuUsage?.[store.cpuUsage.length - 1]?.usage ?? 0)
    const memoryTotal = computed(() => (store.memoryUsage.used || 0) + (store.memoryUsage.free || 0))
    const memoryPercent = computed(() =>
      memoryTotal.value ? Math.round((store.memoryUsage.used / memoryTotal.value) * 100) : 0
    )
    const diskTotal = computed(() =>
      (store.diskUsage.usedDisk1 || 0) + (store.diskUsage.usedDisk2 || 0) + (store.diskUsage.usedDisk3 || 0) + (store.diskUsage.free || 0)
    )
    const diskPercent = computed(() =>
      diskTotal.value ? Math.round(((diskTotal.value - store.diskUsage.free) / diskTotal.value) * 100) : 0
    )

    const isOverview = computed(() => route.name === 'SystemResourcesParent')
    const overviewCards = computed(() => ([
      {
        title: 'CPU 实时峰值',
        value: `${latestCpu.value}%`,
        meta: '近 1 小时负载',
        to: '/dashboard/system-resources/cpu-usage'
      },
      {
        title: '内存占用',
        value: `${memoryPercent.value}%`,
        meta: `${store.memoryUsage.used} MB 已用`,
        to: '/dashboard/system-resources/memory-usage'
      },
      {
        title: '磁盘使用',
        value: `${diskPercent.value}%`,
        meta: `剩余 ${store.diskUsage.free} GB`,
        to: '/dashboard/system-resources/disk-usage'
      },
      {
        title: '网络流量',
        value: `${store.networkTraffic.total?.slice(-1)[0] ?? 0} Mbps`,
        meta: '入站/出站总量',
        to: '/dashboard/system-resources/network'
      }
    ]))

    onMounted(() => {
      store.fetchCpuUsage()
      store.fetchMemoryUsage()
      store.fetchDiskUsage()
    })

    return {
      store,
      isOverview,
      overviewCards
    }
  }
}
</script>

<style scoped>
.system-resources {
  padding: 1.5rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.overview-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--text-1);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 211, 238, 0.45);
}

.overview-title {
  font-size: 0.85rem;
  color: var(--text-2);
}

.overview-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-0);
}

.overview-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}

.error {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 0.75rem 1rem;
  border-radius: 12px;
}
</style>
