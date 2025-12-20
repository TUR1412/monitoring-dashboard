<!-- src/components/common/FormSelect.vue -->
<template>
  <div class="form-select">
    <label :for="id" class="form-label">{{ label }}</label>
    <select :id="id" v-model="internalValue" class="form-control">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

watch(() => props.modelValue, (val) => {
  internalValue.value = val
})
</script>

<style scoped>
.form-select {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.form-control {
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface-1);
  color: var(--text-0);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent-0);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.18);
}
</style>
