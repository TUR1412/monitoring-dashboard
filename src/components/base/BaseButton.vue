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
    background: rgba(148, 163, 184, 0.12);
    color: var(--text-1);
  }
  
  .button-primary {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(251, 113, 133, 0.9));
    color: var(--text-0);
  }
  
  .button-success {
    background: rgba(34, 197, 94, 0.2);
    color: #bbf7d0;
  }
  
  .button-warning {
    background: rgba(245, 158, 11, 0.2);
    color: #fde68a;
  }
  
  .button-danger {
    background: rgba(239, 68, 68, 0.2);
    color: #fecaca;
  }
  
  .button-info {
    background: rgba(56, 189, 248, 0.2);
    color: #bae6fd;
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
  
  </style>
