<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="flex flex-col h-screen main-layout">
    <Header />
    <TabBar /> <!-- 移至 Header 下方 -->
    <div class="flex flex-1 content">
      <Sidebar />
      <main class="flex-1 p-4 overflow-auto">
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
import { useMonitorStore } from '@/stores/monitorStore';
import { computed, watch } from 'vue';

export default {
  name: 'MainLayout',
  components: {
    Header,
    Sidebar,
    Footer,
    TabBar // 注册 TabBar 组件
  },
  setup() {
    const store = useMonitorStore();
    const theme = computed(() => store.theme);

    // 监控主题变化，并确保主题类应用到根元素
    watch(theme, (newTheme) => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    });

    return {
      theme
    };
  }
};
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  display: flex;
  flex: 1;
}

main {
  flex: 1;
  padding: 60px 20px 20px 20px; /* 确保与 TabBar 的高度一致 */
  background-color: var(--background-color);
  color: var(--text-color);
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  main {
    padding: 60px 10px 10px 10px; /* 同样调整 */
  }
}
</style>
