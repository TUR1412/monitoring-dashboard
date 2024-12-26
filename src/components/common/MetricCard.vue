<!-- src/components/common/MetricCard.vue -->
<template>
  <div class="metric-card p-4 bg-white rounded shadow">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-2xl">{{ value }} {{ unit }}</p>
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
}
.text-green-500 {
  color: #10B981;
}
.text-red-500 {
  color: #EF4444;
}
.text-gray-500 {
  color: #6B7280;
}
</style>
