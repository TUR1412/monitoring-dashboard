<template>
    <div class="metric-card p-4 bg-white rounded shadow">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-2xl">{{ value }} {{ unit }}</p>
      <p :class="trendClass">{{ trend }}%</p>
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
      type: Number,
      default: 0
    }
  })
  
  const trendClass = computed(() => ({
    'text-green-500': props.trend >= 0,
    'text-red-500': props.trend < 0
  }))
  </script>
  
  <style scoped>
  .metric-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  </style>
  