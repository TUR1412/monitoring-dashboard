<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" role="presentation">
        <div
          class="modal-content"
          :style="{ maxWidth: width }"
          @click.stop
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : '对话框'"
          tabindex="-1"
        >
          <header class="modal-header">
            <h3 :id="titleId" class="modal-title">{{ title }}</h3>
            <button
              class="modal-close"
              @click="closeModal"
              type="button"
              aria-label="关闭弹窗"
              ref="closeButtonRef"
            >
              <span class="close-icon">&times;</span>
            </button>
          </header>

          <div class="modal-body">
            <slot></slot>
          </div>

          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
  
  <script setup>
  import { onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500px'
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  const titleId = `modal-title-${Math.random().toString(36).slice(2, 10)}`
  const closeButtonRef = ref(null)
  const previousActiveElement = ref(null)
  
  const closeModal = () => {
    emit('update:modelValue', false)
  }
  
  // ESC 键关闭模态框
  const handleEscKey = (e) => {
    if (e.key === 'Escape' && props.modelValue) {
      closeModal()
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleEscKey)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey)
  })

  watch(
    () => props.modelValue,
    async (open) => {
      if (typeof document === 'undefined') return
      if (open) {
        previousActiveElement.value = document.activeElement
        await nextTick()
        closeButtonRef.value?.focus?.()
        return
      }
      const el = previousActiveElement.value
      previousActiveElement.value = null
      el?.focus?.()
    }
  )
  </script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  background: rgba(8, 12, 18, 0.65);
  backdrop-filter: blur(8px);
}

.modal-content {
  width: 100%;
  margin: 0 1rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-soft);
  will-change: transform, opacity;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--heading-color);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(46, 196, 182, 0.4);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out), background-color var(--dur-normal) var(--ease-out);
}

.modal-close:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(46, 196, 182, 0.2);
  background: rgba(46, 196, 182, 0.08);
}

.close-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.modal-body {
  padding: 1.2rem 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-slow) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform var(--dur-slower) var(--ease-spring), opacity var(--dur-slow) var(--ease-out);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  opacity: 0;
  transform: translateY(10px) scale(0.985);
}
</style>
