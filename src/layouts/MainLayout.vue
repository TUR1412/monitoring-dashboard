<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <Header />
    <div class="content">
      <Sidebar />
      <main>
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { computed, onMounted, watch } from 'vue'

export default {
  name: 'MainLayout',
  components: {
    Header,
    Sidebar,
    Footer
  },
  setup() {
    const store = useMonitorStore()
    const theme = computed(() => store.theme)

    // 监控主题变化，并确保主题类应用到根元素
    watch(theme, (newTheme) => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    })

    return {
      theme
    }
  }
}
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
  padding: 20px;
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
    padding: 10px;
  }
}
</style>
