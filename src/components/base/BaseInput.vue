<template>
    <div class="base-input-wrapper">
      <input
        :value="modelValue"
        @input="updateValue"
        class="base-input"
        :class="{ 'input-disabled': disabled }"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :type="type"
        v-bind="$attrs"
      />
    </div>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted } from 'vue'
  
  defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const updateValue = (event) => {
    emit('update:modelValue', event.target.value)
  }
  </script>
  
  <style scoped>
  
  .base-input-wrapper {
    @apply relative w-full;
  }
  
  .base-input {
    @apply w-full px-4 py-2 rounded-lg border outline-none transition-colors;
    background-color: var(--surface-1);
    color: var(--text-1);
    border-color: var(--border);
  }
  
  .base-input:focus {
    @apply ring-2 ring-opacity-50;
    border-color: var(--accent-0);
    ring-color: var(--accent-0);
  }
  
  .base-input::placeholder {
    color: var(--text-3);
  }
  
  .input-disabled {
    @apply cursor-not-allowed;
    background-color: rgba(148, 163, 184, 0.08);
  }
  
  .base-input:disabled::placeholder {
    color: var(--text-3);
  }
  </style>
