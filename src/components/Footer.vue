<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <p>&copy; {{ year }} Quantum Ops · 监控仪表盘. 保留所有权利。</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: rgba(15, 23, 42, 0.65); /* 使用 CSS 变量 */
  color: var(--text-color); /* 使用 CSS 变量 */
  text-align: center;
  padding: 12px 0;
  position: relative;
  width: 100%;
  border-top: 1px solid rgba(46, 196, 182, 0.2); /* 添加柔光边框 */
  box-shadow: 0 -6px 20px rgba(9, 16, 28, 0.25); /* 添加阴影 */
}

.footer p {
  margin: 0;
  font-size: 0.9em;
  text-shadow: 0 0 6px rgba(46, 196, 182, 0.35);
}
</style>
