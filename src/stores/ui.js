import { defineStore } from 'pinia'

let confirmResolver = null

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [],
    confirmOpen: false,
    confirmTitle: '确认',
    confirmMessage: ''
  }),
  actions: {
    pushToast({ type = 'info', message, duration = 2400 }) {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const toast = { id, type, message }
      this.toasts = [...this.toasts, toast]
      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id)
        }, duration)
      }
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id)
    },
    requestConfirm(message, title = '确认') {
      this.confirmTitle = title
      this.confirmMessage = message
      this.confirmOpen = true
      return new Promise((resolve) => {
        confirmResolver = resolve
      })
    },
    resolveConfirm(result) {
      if (confirmResolver) {
        confirmResolver(result)
        confirmResolver = null
      }
      this.confirmOpen = false
    }
  }
})



