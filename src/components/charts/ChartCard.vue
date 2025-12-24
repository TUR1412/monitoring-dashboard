<template>
  <div class="chart-card">
    <h4 class="chart-title">{{ title }}</h4>
    <div class="chart-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="chart-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-strong);
}

.chart-body {
  flex: 1;
  position: relative;
}

.chart-footer {
  margin-top: 1rem;
}
</style>

