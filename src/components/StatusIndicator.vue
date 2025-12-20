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
  background-color: var(--neon-green);
  box-shadow: 0 0 8px rgba(6, 214, 160, 0.5);
}

.status-badge.warning {
  background-color: var(--neon-yellow);
  box-shadow: 0 0 8px rgba(246, 189, 96, 0.5);
}

.status-badge.critical {
  background-color: var(--neon-red);
  box-shadow: 0 0 8px rgba(231, 111, 81, 0.5);
}

.status-badge.stopped {
  background-color: var(--gray-600);
}

.label {
  font-size: 0.875rem;
  color: var(--text-muted);
}
</style>
