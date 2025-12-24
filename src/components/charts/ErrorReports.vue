<!-- src/components/charts/ErrorReports.vue -->
<template>
  <div class="error-reports">
    <h4>错误报告</h4>
    <ul>
      <li v-for="(report, index) in store.errorReports" :key="index">
        {{ report }}
      </li>
    </ul>
    <div v-if="store.error" class="error">{{ store.error }}</div>
  </div>
</template>

<script>
import { useTelemetryStore } from '@/stores/telemetry'
import { onMounted } from 'vue'

export default {
  name: 'ErrorReports',
  setup() {
    const store = useTelemetryStore()

    onMounted(() => {
      store.fetchErrorReports()
    })

    return {
      store
    }
  }
}
</script>

<style scoped>
.error-reports {
  background-color: var(--surface-1);
  padding: 15px;
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-top: 20px;
}

.error-reports ul {
  list-style-type: disc;
  padding-left: 20px;
}

.error {
  color: #fecaca;
  margin-top: 10px;
}
</style>
