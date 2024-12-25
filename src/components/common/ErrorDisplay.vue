<template>
    <div class="error-display p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p>{{ message }}</p>
      <button @click="$emit('retry')" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        重试
      </button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    message: {
      type: String,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .error-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  