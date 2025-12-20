<template>
  <div class="error-display card">
    <p>{{ message }}</p>
    <BaseButton type="primary" @click="$emit('retry')">
      重试
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '@/components/base/BaseButton.vue'
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
  
