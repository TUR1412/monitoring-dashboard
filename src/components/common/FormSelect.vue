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
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .form-control {
    width: 100%;
  }
  </style>
  
