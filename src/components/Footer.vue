<!-- src/components/Footer.vue -->
<template>
  <footer class="footer surface-glass">
    <p>© 2025 监控仪表盘 · 高可用态势感知平台</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  margin-top: 2rem;
  text-align: center;
  padding: 1rem 0;
  color: var(--text-2);
  border-top: 1px solid var(--border);
}

.footer p {
  margin: 0;
  font-size: 0.85rem;
}
</style>
