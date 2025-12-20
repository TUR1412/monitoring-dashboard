<!-- src/components/SystemResources.vue -->
<template>
  <div class="system-resources card">
    <div class="header-row">
      <h3 class="section-title">系统资源</h3>
      <span class="text-muted">实时刷新</span>
    </div>
    <router-view />
    <div v-if="store.error" class="error">{{ store.error }}</div>
  </div>
</template>

<script>
import { useMonitorStore } from '@/stores/monitorStore'
import { onMounted } from 'vue'

export default {
  name: 'SystemResources',
  setup() {
    const store = useMonitorStore()

    onMounted(() => {
      store.fetchCpuUsage()
      store.fetchMemoryUsage()
      store.fetchDiskUsage()
    })

    return {
      store
    }
  }
}
</script>

<style scoped>
.system-resources {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  margin: 0;
}

.text-muted {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.error {
  color: var(--neon-red);
  background: rgba(231, 111, 81, 0.12);
  border: 1px solid rgba(231, 111, 81, 0.35);
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
}
</style>
