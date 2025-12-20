<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <Header />
    <TabBar />
    <div class="layout-body">
      <Sidebar />
      <main class="layout-main">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
import TabBar from '@/components/TabBar.vue'; // 导入 TabBar 组件

export default {
  name: 'MainLayout',
  components: {
    Header,
    Sidebar,
    Footer,
    TabBar // 注册 TabBar 组件
  }
};
</script>

<style scoped>
.main-layout {
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  min-height: 100vh;
}

.layout-body {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 0;
}

.layout-main {
  padding: calc(var(--container-padding) + 8px) var(--container-padding) calc(var(--container-padding) + 12px);
  background-color: transparent;
  color: var(--text-color);
  overflow-y: auto;
  min-width: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-body {
    grid-template-columns: 1fr;
  }

  .layout-main {
    padding: var(--container-padding);
  }
}
</style>
