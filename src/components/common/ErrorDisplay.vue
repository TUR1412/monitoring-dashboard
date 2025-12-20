<template>
  <div class="error-display surface-card">
    <p>{{ message }}</p>
    <BaseButton type="danger" size="small" @click="$emit('retry')">
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
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.12);
  color: #fecaca;
}
</style>
  
