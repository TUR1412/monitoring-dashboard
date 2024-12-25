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
    @apply bg-white dark:bg-gray-700;
    @apply text-gray-900 dark:text-white;
    border-color: var(--border-color);
  }
  
  .base-input:focus {
    @apply ring-2 ring-opacity-50;
    border-color: var(--neon-blue);
    ring-color: var(--neon-blue);
  }
  
  .base-input::placeholder {
    @apply text-gray-500 dark:text-gray-400;
  }
  
  .input-disabled {
    @apply bg-gray-100 dark:bg-gray-800 cursor-not-allowed;
  }
  
  .base-input:disabled::placeholder {
    @apply text-gray-400 dark:text-gray-500;
  }
  </style>