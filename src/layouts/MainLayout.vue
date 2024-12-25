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
import { computed, onMounted } from 'vue'

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

    // 已在 main.js 中初始化主题，无需在此再次调用
    // onMounted(() => {
    //   store.initializeTheme()
    // })

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
}
</style>
