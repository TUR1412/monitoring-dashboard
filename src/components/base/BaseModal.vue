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
    @apply fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50;
  }
  
  .modal-content {
    @apply rounded-lg shadow-xl w-full mx-4 overflow-hidden;
    background-color: var(--surface-1);
    border: 1px solid var(--border);
  }
  
  .modal-header {
    @apply flex justify-between items-center px-6 py-4 border-b;
    border-color: var(--border);
  }
  
  .modal-title {
    @apply text-xl font-semibold;
    color: var(--heading-color);
  }
  
  .modal-close {
    @apply p-1 hover:opacity-75 transition-opacity;
  }
  
  .close-icon {
    @apply text-2xl leading-none;
    color: var(--text-color);
  }
  
  .modal-body {
    @apply px-6 py-4;
  }
  
  .modal-footer {
    @apply px-6 py-4 border-t;
    border-color: var(--border);
  }
  
  /* 过渡动画 */
  .modal-enter-active,
  .modal-leave-active {
    @apply transition-all duration-300 ease-out;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    @apply opacity-0;
  }
  
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    @apply transform scale-95;
  }
  
  .modal-enter-to .modal-content,
  .modal-leave-from .modal-content {
    @apply transform scale-100;
  }
  </style>
