<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay">
        <div
          class="modal-content"
          :style="{ maxWidth: width }"
          @click.stop
        >
          <header class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button
              class="modal-close"
              @click="closeModal"
              type="button"
              aria-label="Close modal"
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
  import { onMounted, onUnmounted } from 'vue'
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modal-close:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(46, 196, 182, 0.2);
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>
