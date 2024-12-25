<template>
    <button
      :class="[
        'base-button',
        `button-${type}`,
        `button-${size}`,
        { 'is-loading': loading }
      ]"
      :disabled="loading || disabled"
      :type="nativeType"
      v-bind="$attrs"
    >
      <!-- Loading Spinner -->
      <span v-if="loading" class="spinner"></span>
      
      <!-- Icon -->
      <span v-else-if="icon" class="button-icon">
        <component :is="icon" class="icon" />
      </span>
      
      <!-- Button Content -->
      <span :class="{ 'ml-2': icon && $slots.default }">
        <slot></slot>
      </span>
    </button>
  </template>
  
  <script setup>
  import * as Icons from '@element-plus/icons-vue'
  import { computed } from 'vue'
  const props = defineProps({
    type: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
      }
    },
    size: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['small', 'default', 'large'].includes(value)
      }
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    nativeType: {
      type: String,
      default: 'button',
      validator: (value) => {
        return ['button', 'submit', 'reset'].includes(value)
      }
    }
  })
  
  // 动态导入图标
  const iconComponent = computed(() => {
    if (!props.icon) return null
    return Icons[props.icon]
  })
  </script>
  
  <style scoped>
  .base-button {
    @apply inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none;
    @apply disabled:opacity-60 disabled:cursor-not-allowed;
  }
  
  /* 尺寸变体 */
  .button-small {
    @apply px-3 py-1 text-sm;
  }
  
  .button-default {
    @apply px-4 py-2;
  }
  
  .button-large {
    @apply px-6 py-3 text-lg;
  }
  
  /* 类型变体 */
  .button-default {
    @apply bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200;
  }
  
  .button-primary {
    background-color: var(--neon-blue);
    @apply text-white hover:opacity-90;
  }
  
  .button-success {
    @apply bg-green-500 text-white hover:bg-green-600;
  }
  
  .button-warning {
    @apply bg-yellow-500 text-white hover:bg-yellow-600;
  }
  
  .button-danger {
    @apply bg-red-500 text-white hover:bg-red-600;
  }
  
  .button-info {
    @apply bg-blue-500 text-white hover:bg-blue-600;
  }
  
  /* Loading 状态 */
  .is-loading {
    @apply relative cursor-wait;
  }
  
  .spinner {
    @apply inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin;
  }
  
  /* Icon */
  .button-icon {
    @apply inline-flex items-center;
  }
  
  .icon {
    @apply w-4 h-4;
  }
  
  /* Dark mode adjustments */
  @media (prefers-color-scheme: dark) {
    .button-default {
      @apply bg-gray-700 hover:bg-gray-600 text-gray-200;
    }
  }
  </style>