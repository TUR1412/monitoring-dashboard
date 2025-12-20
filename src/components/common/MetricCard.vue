<!-- src/components/common/MetricCard.vue -->
<template>
  <div class="metric-card card">
    <div class="metric-header">
      <h3 class="metric-title">{{ title }}</h3>
      <span class="metric-trend" :class="trendClass">{{ trendLabel }}</span>
    </div>
    <p class="metric-value">{{ value }} {{ unit }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: ''
  },
  trend: {
    type: String, // 从 Number 改为 String
    default: 'stable'
  }
})

const trendClass = computed(() => {
  switch (props.trend) {
    case 'up':
      return 'text-green-500'
    case 'down':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
})

const trendLabel = computed(() => {
  switch (props.trend) {
    case 'up':
      return '上升'
    case 'down':
      return '下降'
    default:
      return '稳定'
  }
})
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.metric-title {
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: 600;
}

.metric-value {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-strong);
}

.metric-trend {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.text-green-500 {
  color: var(--neon-green);
}
.text-red-500 {
  color: var(--neon-red);
}
.text-gray-500 {
  color: var(--text-muted);
}
</style>
