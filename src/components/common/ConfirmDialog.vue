<!-- src/components/common/ConfirmDialog.vue -->
<template>
  <BaseModal
    :model-value="store.confirmOpen"
    :title="store.confirmTitle"
    width="420px"
    @update:modelValue="handleClose"
  >
    <p class="confirm-message">{{ store.confirmMessage }}</p>
    <template #footer>
      <div class="confirm-actions">
        <button class="btn btn-ghost" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleConfirm">确定</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { useUiStore } from '@/stores/ui'

const store = useUiStore()

const handleConfirm = () => {
  store.resolveConfirm(true)
}

const handleClose = () => {
  store.resolveConfirm(false)
}
</script>

<style scoped>
.confirm-message {
  color: var(--text-1);
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
