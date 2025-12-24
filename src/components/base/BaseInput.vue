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
    type: {
      type: String,
      default: 'text'
    },
    invalid: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const updateValue = (event) => {
    emit('update:modelValue', event.target.value)
  }
  </script>
  
<style scoped>
.base-input-wrapper {
  width: 100%;
  position: relative;
}

.base-input {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.28);
  color: var(--text-color);
  font-family: var(--font-sans);
  line-height: var(--lh-normal);
  transition: border-color var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out), background-color var(--dur-normal) var(--ease-out);
}

.base-input:focus {
  border-color: rgba(46, 196, 182, 0.7);
  box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.15);
  outline: none;
}

.input-invalid {
  border-color: rgba(231, 111, 81, 0.7);
  box-shadow: 0 0 0 3px rgba(231, 111, 81, 0.18);
}

.base-input::placeholder {
  color: var(--text-muted);
}

.input-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-input:disabled::placeholder {
  color: var(--text-muted);
}
</style>
