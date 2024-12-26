<!-- src/components/StatusIndicator.vue -->
<template>
  <div class="status-indicator">
    <span :class="statusClass"></span>
    <span class="label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
  props: {
    status: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    statusClass() {
      return {
        'status-badge running': ['running', 'normal', 'optimal', 'stable', 'up'].includes(this.status),
        'status-badge warning': ['warning', 'increased'].includes(this.status),
        'status-badge critical': ['critical'].includes(this.status),
        'status-badge stopped': ['stopped'].includes(this.status)
      }
    }
  }
}
</script>

<style scoped>
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-badge.running {
  background-color: #d1fae5;
}

.status-badge.warning {
  background-color: #fef3c7;
}

.status-badge.critical {
  background-color: #fee2e2;
}

.status-badge.stopped {
  background-color: #fca5a5;
}

.label {
  font-size: 0.875rem;
  color: #4b5563;
}
</style>
