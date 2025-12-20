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
  padding: 1.5rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.4);
  padding: 0.75rem 1rem;
  border-radius: 12px;
}
</style>
