<template>
  <button
    :class="[
      'btn',
      'base-button',
      `btn-${type}`,
      `btn-size-${size}`,
      { 'is-loading': loading }
    ]"
    :disabled="loading || disabled"
    :type="nativeType"
    :aria-busy="loading || undefined"
    v-bind="$attrs"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else-if="iconComponent" class="button-icon">
      <component :is="iconComponent" class="icon" />
    </span>
    <span :class="{ 'ml-2': iconComponent && $slots.default }">
      <slot></slot>
    </span>
  </button>
</template>
  
  <script setup>
  import { computed } from 'vue'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-vue-next'
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

const iconMap = {
  Plus,
  Edit: Pencil,
  Delete: Trash2,
  Check,
  Close: X,
  X
}

const iconComponent = computed(() => {
  if (!props.icon) return null
  return iconMap[props.icon] || null
})
</script>

<style scoped>
.base-button {
  @apply relative inline-flex items-center justify-center;
}

.is-loading {
  @apply cursor-wait;
}

.spinner {
  @apply inline-block w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin;
}

.button-icon {
  @apply inline-flex items-center;
}

.icon {
  @apply w-4 h-4;
}
</style>
