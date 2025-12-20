<template>
  <div class="base-input-wrapper">
    <input
      :value="modelValue"
      @input="updateValue"
      class="base-input"
      :class="{
        'input-disabled': disabled,
        'input-invalid': invalid
      }"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :type="type"
      :aria-invalid="invalid || undefined"
      v-bind="$attrs"
    />
  </div>
</template>
  
  <script setup>
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
  invalid: {
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
  background-color: var(--surface-1);
  color: var(--text-1);
  border-color: var(--border);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 24px rgba(2, 6, 23, 0.18);
}

.base-input:focus {
  border-color: var(--accent-0);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.18);
}

.base-input::placeholder {
  color: var(--text-3);
}

.input-disabled {
  @apply cursor-not-allowed;
  background-color: rgba(148, 163, 184, 0.08);
}

.input-invalid {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
}

.base-input:disabled::placeholder {
  color: var(--text-3);
}
</style>
