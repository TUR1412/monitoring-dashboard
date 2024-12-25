<!-- src/components/Footer.vue -->
<template>
  <footer class="footer">
    <p>&copy; 2024 监控仪表盘. 保留所有权利。</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: var(--dark-purple); /* 使用 CSS 变量 */
  color: var(--text-color); /* 使用 CSS 变量 */
  text-align: center;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  bottom: 0;
  border-top: 2px solid var(--neon-pink); /* 添加霓虹边框 */
  box-shadow: 0 -2px 8px rgba(255, 110, 199, 0.3), 0 0 20px rgba(31, 142, 241, 0.3); /* 添加阴影 */
}

.footer p {
  margin: 0;
  font-size: 0.9em;
  text-shadow: 0 0 5px var(--neon-blue);
}
</style>
