<template>
  <button
    :class="[
      'base-button',
      `button-${type}`,
      `size-${size}`,
      { 'is-loading': loading, 'is-disabled': disabled }
    ]"
    :disabled="loading || disabled"
    :type="nativeType"
    v-bind="$attrs"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else-if="iconComponent" class="button-icon">
      <component :is="iconComponent" class="icon" />
    </span>
    <span :class="{ 'has-icon': iconComponent && $slots.default }">
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
    return Icons[props.icon] || null
  })
  </script>
  
  <style scoped>
 .base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  font-weight: 600;
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

/* 尺寸变体 */
.size-small {
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
}

.size-default {
  padding: 0.55rem 1.2rem;
  font-size: 0.9rem;
}

.size-large {
  padding: 0.7rem 1.6rem;
  font-size: 1rem;
}

/* 类型变体 */
.button-default {
  color: var(--text-strong);
  background: rgba(46, 196, 182, 0.12);
  border-color: rgba(46, 196, 182, 0.4);
}

.button-primary {
  color: var(--text-strong);
  background: linear-gradient(120deg, rgba(46, 196, 182, 0.9), rgba(244, 162, 97, 0.95));
  box-shadow: var(--shadow-glow);
}

.button-success {
  color: var(--text-strong);
  background: rgba(6, 214, 160, 0.18);
  border-color: rgba(6, 214, 160, 0.45);
}

.button-warning {
  color: var(--text-strong);
  background: rgba(246, 189, 96, 0.18);
  border-color: rgba(246, 189, 96, 0.45);
}

.button-danger {
  color: var(--text-strong);
  background: rgba(231, 111, 81, 0.2);
  border-color: rgba(231, 111, 81, 0.55);
}

.button-info {
  color: var(--text-strong);
  background: rgba(46, 196, 182, 0.15);
  border-color: rgba(46, 196, 182, 0.4);
}

.base-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(46, 196, 182, 0.25);
}

.base-button:active:not(:disabled) {
  transform: scale(0.98);
}

.is-loading {
  cursor: wait;
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--text-strong);
  animation: spin 0.9s linear infinite;
}

.button-icon {
  display: inline-flex;
  align-items: center;
}

.icon {
  width: 16px;
  height: 16px;
}

.has-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
 </style>
