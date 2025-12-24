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
    <span>
      <slot></slot>
    </span>
  </button>
</template>
  
  <script setup>
  const props = defineProps({
    type: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['default', 'primary', 'success', 'warning', 'danger', 'info', 'ghost'].includes(value)
      }
    },
    size: {
      type: String,
      default: 'default',
      validator: (value) => {
        return ['small', 'default', 'large'].includes(value)
      }
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
  </script>
  
  <style scoped>
 .base-button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  font-weight: 600;
  font-family: var(--font-sans);
  line-height: var(--lh-normal);
  transition:
    transform var(--dur-normal) var(--ease-out),
    box-shadow var(--dur-normal) var(--ease-out),
    filter var(--dur-normal) var(--ease-out),
    background-color var(--dur-normal) var(--ease-out),
    border-color var(--dur-normal) var(--ease-out);
  border: 1px solid transparent;
  overflow: hidden;
  cursor: pointer;
}

.base-button::before {
  content: '';
  position: absolute;
  inset: -120% -40%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.22), transparent 55%);
  opacity: 0;
  transform: translateY(6%) scale(0.98);
  transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-out);
  pointer-events: none;
  z-index: 0;
}

.base-button > * {
  position: relative;
  z-index: 1;
}

/* 尺寸变体 */
.size-small {
  padding: 0.35rem 0.9rem;
  font-size: var(--fs-1);
}

.size-default {
  padding: 0.55rem 1.2rem;
  font-size: var(--fs-2);
}

.size-large {
  padding: 0.7rem 1.6rem;
  font-size: var(--fs-3);
}

/* 类型变体 */
.button-default {
  color: var(--text-strong);
  background: rgba(46, 196, 182, 0.12);
  border-color: rgba(46, 196, 182, 0.4);
}

.button-ghost {
  color: var(--text-0);
  background: rgba(148, 163, 184, 0.08);
  border-color: var(--border-weak);
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
  box-shadow: 0 0 0 1px rgba(46, 196, 182, 0.2), 0 10px 24px rgba(9, 16, 28, 0.28);
  filter: saturate(1.05);
}

.base-button:hover:not(:disabled)::before {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.base-button:active:not(:disabled) {
  transform: translateY(0) scale(0.985);
  transition-duration: var(--dur-quick);
  filter: saturate(1.08);
}

.is-loading {
  cursor: wait;
}

.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.base-button:disabled::before {
  opacity: 0;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--text-strong);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
 </style>
