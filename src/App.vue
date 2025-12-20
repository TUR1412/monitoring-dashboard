<!-- src/App.vue -->
<template>
  <router-view />
  <ToastStack />
  <ConfirmDialog />
</template>

<script>
import ToastStack from '@/components/common/ToastStack.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

export default {
  name: 'App',
  components: {
    ToastStack,
    ConfirmDialog
  }
}
</script>

<style>
/* src/App.vue 的样式已经在全局 style.css 中定义，此处无需额外样式 */
</style>
