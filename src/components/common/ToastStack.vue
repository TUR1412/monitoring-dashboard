<!-- src/components/common/ToastStack.vue -->
<template>
  <div class="toast-stack" aria-live="polite">
    <div
      v-for="toast in store.toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
    >
      <span class="toast-icon">
        <i :class="iconMap[toast.type] || iconMap.info" aria-hidden="true"></i>
      </span>
      <div class="toast-content">
        <div class="toast-title">{{ titleMap[toast.type] || '提示' }}</div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
      <button class="toast-close" @click="store.removeToast(toast.id)" aria-label="关闭通知">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const store = useUiStore()

const iconMap = {
  success: 'fas fa-check-circle',
  error: 'fas fa-times-circle',
  warning: 'fas fa-exclamation-triangle',
  info: 'fas fa-info-circle'
}

const titleMap = {
  success: '已完成',
  error: '发生错误',
  warning: '注意',
  info: '提示'
}
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 3000;
  width: min(360px, 90vw);
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--border-strong);
  background: var(--surface-1);
  box-shadow: var(--shadow-md);
  color: var(--text-1);
  animation: toastIn 0.3s ease;
}

.toast-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-0);
}

.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.toast-title {
  font-size: 0.85rem;
  color: var(--text-0);
  font-weight: 600;
}

.toast-message {
  font-size: 0.8rem;
  color: var(--text-2);
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-3);
  font-size: 1.1rem;
  cursor: pointer;
}

.toast-success {
  border-color: rgba(34, 197, 94, 0.4);
}

.toast-success .toast-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
}

.toast-error {
  border-color: rgba(239, 68, 68, 0.4);
}

.toast-error .toast-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #fecaca;
}

.toast-warning {
  border-color: rgba(245, 158, 11, 0.4);
}

.toast-warning .toast-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #fde68a;
}

.toast-info {
  border-color: rgba(56, 189, 248, 0.4);
}

.toast-info .toast-icon {
  background: rgba(56, 189, 248, 0.2);
  color: #bae6fd;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .toast-stack {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>
