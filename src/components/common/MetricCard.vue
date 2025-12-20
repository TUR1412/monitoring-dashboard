<!-- src/components/common/MetricCard.vue -->
<template>
  <div class="metric-card surface-card">
    <h3>{{ title }}</h3>
    <p class="metric-value">{{ value }} {{ unit }}</p>
    <p :class="trendClass">{{ trend }}</p>
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
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 1rem;
}
.text-green-500 {
  color: #bbf7d0;
}
.text-red-500 {
  color: #fecaca;
}
.text-gray-500 {
  color: var(--text-3);
}

.metric-value {
  font-size: 1.6rem;
  color: var(--text-0);
}
</style>
